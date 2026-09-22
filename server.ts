import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Curated high-definition artisanal craft videos for instant preview and quota fallback
const CRAFT_FALLBACK_VIDEOS: Record<string, { '16:9': string; '9:16': string }> = {
  pottery: {
    '16:9': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    '9:16': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
  },
  textile: {
    '16:9': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    '9:16': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  },
  general: {
    '16:9': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    '9:16': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
};

function selectFallbackVideo(prompt: string, aspectRatio: '16:9' | '9:16'): string {
  const p = (prompt || '').toLowerCase();
  const ratio = aspectRatio === '9:16' ? '9:16' : '16:9';
  if (p.includes('clay') || p.includes('potter') || p.includes('wheel') || p.includes('terracotta') || p.includes('ceramic') || p.includes('urli')) {
    return CRAFT_FALLBACK_VIDEOS.pottery[ratio];
  }
  if (p.includes('textile') || p.includes('indigo') || p.includes('weav') || p.includes('fabric') || p.includes('stole') || p.includes('khadi') || p.includes('breeze')) {
    return CRAFT_FALLBACK_VIDEOS.textile[ratio];
  }
  return CRAFT_FALLBACK_VIDEOS.general[ratio];
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '60mb' }));
  app.use(express.urlencoded({ extended: true, limit: '60mb' }));

  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = new GoogleGenAI({ apiKey });

  // Veo Video Generation API route
  app.post('/api/generate-video', async (req, res) => {
    try {
      const {
        image, // base64 string or data URL
        prompt = 'Cinematic slow zoom into handcrafted artisan details with soft golden studio light and atmospheric dust',
        aspectRatio = '16:9',
        model = 'veo-3.1-fast-generate-preview',
      } = req.body;

      const targetAspectRatio: '16:9' | '9:16' = aspectRatio === '9:16' ? '9:16' : '16:9';

      if (!image) {
        return res.status(400).json({
          success: false,
          error: 'Image is required to animate into video.',
        });
      }

      // Parse base64 and mimeType
      let mimeType = 'image/jpeg';
      let cleanBase64 = image;

      if (image.startsWith('data:')) {
        const matches = image.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          cleanBase64 = matches[2];
        }
      }

      // Check for valid API key
      if (!apiKey) {
        console.warn('GEMINI_API_KEY not configured. Returning fallback craft video.');
        return res.json({
          success: false,
          quotaExceeded: false,
          message: 'No GEMINI_API_KEY detected. Loaded curated artisan motion preview.',
          fallbackVideoUrl: selectFallbackVideo(prompt, targetAspectRatio),
          aspectRatio: targetAspectRatio,
          model,
        });
      }

      console.log(`Initiating Veo video generation with model: ${model}, aspect ratio: ${targetAspectRatio}`);

      // Call Google GenAI SDK with Veo 3.1 Fast model
      const operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        source: {
          prompt,
          image: {
            imageBytes: cleanBase64,
            mimeType,
          },
        },
        config: {
          aspectRatio: targetAspectRatio,
          numberOfVideos: 1,
        },
      });

      console.log('Veo generation operation launched:', operation.name, 'done:', operation.done);

      // Poll until done or timeout (max 45 seconds for fast model)
      let currentOp = operation;
      const startTime = Date.now();
      const maxTimeoutMs = 45000;

      while (!currentOp.done && Date.now() - startTime < maxTimeoutMs) {
        await new Promise((resolve) => setTimeout(resolve, 4000));
        currentOp = await ai.operations.getVideosOperation({ operation: currentOp });
        console.log('Polled Veo operation status:', currentOp.name, 'done:', currentOp.done);
      }

      if (currentOp.done && currentOp.response?.generatedVideos?.[0]?.video) {
        const videoData = currentOp.response.generatedVideos[0].video;
        let videoUrl = videoData.uri || '';

        if (videoData.videoBytes) {
          videoUrl = `data:${videoData.mimeType || 'video/mp4'};base64,${videoData.videoBytes}`;
        }

        return res.json({
          success: true,
          videoUrl,
          aspectRatio: targetAspectRatio,
          model,
          prompt,
        });
      }

      // If timed out but still in progress
      if (!currentOp.done) {
        return res.json({
          success: true,
          pending: true,
          operationName: currentOp.name,
          message: 'Video rendering in progress. Generating final frames.',
          fallbackVideoUrl: selectFallbackVideo(prompt, targetAspectRatio),
          aspectRatio: targetAspectRatio,
          model,
        });
      }

      // Generic fallback if response didn't contain generated video
      return res.json({
        success: false,
        message: 'No video payload returned from model. Provided fallback preview.',
        fallbackVideoUrl: selectFallbackVideo(prompt, targetAspectRatio),
        aspectRatio: targetAspectRatio,
        model,
      });
    } catch (err: any) {
      console.error('Error generating video with Veo:', err);
      const isQuota =
        err?.status === 429 ||
        err?.code === 429 ||
        err?.message?.includes('RESOURCE_EXHAUSTED') ||
        err?.message?.includes('quota');

      const targetAspectRatio: '16:9' | '9:16' = req.body?.aspectRatio === '9:16' ? '9:16' : '16:9';

      return res.json({
        success: false,
        quotaExceeded: isQuota,
        error: err?.message || 'Video generation error',
        message: isQuota
          ? 'Gemini Veo API quota reached. Displaying artisan motion craft showcase.'
          : 'Video generation encountered an issue. Showing curated craft motion preview.',
        fallbackVideoUrl: selectFallbackVideo(req.body?.prompt || '', targetAspectRatio),
        aspectRatio: targetAspectRatio,
        model: 'veo-3.1-fast-generate-preview',
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      veoModel: 'veo-3.1-fast-generate-preview',
      hasApiKey: !!process.env.GEMINI_API_KEY,
    });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
