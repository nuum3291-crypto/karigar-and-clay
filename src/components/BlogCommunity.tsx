import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, ArrowRight, X, Mail, CheckCircle2, Sparkles, Feather } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogCommunityProps {
  posts: BlogPost[];
  onOpenWorkshopTab: () => void;
}

export const BlogCommunity: React.FC<BlogCommunityProps> = ({ posts, onOpenWorkshopTab }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 4000);
  };

  return (
    <section className="py-16 bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">
              <Feather className="w-3.5 h-3.5" />
              <span>Craft Journals &amp; Cultural Heritage</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Stories from the Kiln &amp; Loom
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-xl">
              Deep dives into 500-year-old natural dye fermentation, sacred terracotta geometries, and regenerative materials.
            </p>
          </div>

          <button
            onClick={onOpenWorkshopTab}
            className="self-start md:self-auto px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Upcoming Guild Workshops</span>
          </button>
        </div>

        {/* Featured Story Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {posts.map((post) => (
            <article
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group bg-white rounded-xl border border-stone-200/90 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-stone-100 text-[11px] font-medium px-2.5 py-1 rounded-md">
                    {post.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-stone-400 mb-2">
                    <span>{post.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-2 leading-snug mb-3">
                    {post.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Author & Read Link */}
              <div className="px-5 py-4 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-7 h-7 rounded-full object-cover border border-stone-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-xs">
                    <div className="font-semibold text-stone-800">{post.author.name}</div>
                    <div className="text-[10px] text-stone-400">{post.author.role}</div>
                  </div>
                </div>

                <span className="text-xs font-semibold text-amber-800 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Read &rarr;
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter & Local Fair Announcement Box */}
        <div className="bg-stone-900 rounded-2xl p-8 sm:p-10 text-stone-100 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-2 block">
              The Karigar Chronicle
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">
              Stories of Handcraft, Delivered to Your Inbox
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Bi-weekly dispatches featuring studio visits with remote Himalayan woodcarvers, Rajasthan indigo dyers, and invitations to intimate secret craft pop-ups near you.
            </p>
          </div>

          <div className="w-full lg:w-auto min-w-[320px]">
            {newsletterSubscribed ? (
              <div className="p-4 bg-stone-800 text-amber-300 text-xs rounded-xl border border-stone-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Welcome to the Craft Guild! Check your inbox for your first artisan journal.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="px-4 py-3 bg-stone-800 border border-stone-700 text-white placeholder-stone-400 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 flex-1"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-amber-700 hover:bg-amber-600 text-white font-semibold text-xs rounded-lg transition-colors shrink-0 cursor-pointer"
                >
                  Join Circle
                </button>
              </form>
            )}
            <p className="text-[11px] text-stone-400 mt-2">Zero spam. Pure heritage stories and private studio open-days.</p>
          </div>
        </div>
      </div>

      {/* Article Reading Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 text-stone-900">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 shadow-md border border-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-21/9 w-full bg-stone-900 overflow-hidden">
              <img
                src={selectedPost.coverImage}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
                  {selectedPost.category} · {selectedPost.readTime}
                </span>
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                  {selectedPost.title}
                </h1>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Author info */}
              <div className="flex items-center gap-3 pb-4 border-b border-stone-200 text-xs">
                <img
                  src={selectedPost.author.avatar}
                  alt={selectedPost.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-stone-200"
                />
                <div>
                  <div className="font-bold text-stone-900">{selectedPost.author.name}</div>
                  <div className="text-stone-500">{selectedPost.author.role} · Published {selectedPost.date}</div>
                </div>
              </div>

              {/* Body Content */}
              <div className="prose prose-stone text-sm leading-relaxed space-y-4 text-stone-700">
                {selectedPost.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                <span className="font-medium text-stone-700">Craft Tags:</span>
                {selectedPost.tags.map((tag) => (
                  <span key={tag} className="font-medium text-amber-900 bg-amber-50 px-2 py-0.5 rounded-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
