import React from 'react';
import { Search, MapPin, Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Film } from 'lucide-react';
import { CraftCategory } from '../types';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  selectedCategory: CraftCategory | 'all';
  onSelectCategory: (cat: CraftCategory | 'all') => void;
  onShopNow: () => void;
  onJoinArtisan: () => void;
  artisanCount: number;
  onOpenAnimateCraft?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedCity,
  onSelectCity,
  selectedCategory,
  onSelectCategory,
  onShopNow,
  onJoinArtisan,
  artisanCount,
  onOpenAnimateCraft,
}) => {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-stone-100 min-h-[580px] flex items-center">
      {/* Background Image with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_artisan_studio_1790108084579.jpg"
          alt="Artisan studio workshop with pottery, textiles and woodworking"
          className="w-full h-full object-cover object-center opacity-45 transform scale-102 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Measured Contrast Scrim */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/75 to-stone-900/60" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-stone-950/60" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 w-full">
        <div className="max-w-3xl">
          {/* Quiet Category Lead-in */}
          <div className="flex items-center gap-2 text-xs font-medium text-amber-300 mb-4 tracking-wider uppercase">
            <span>Direct from Village Kilns &amp; Heritage Looms</span>
            <span aria-hidden="true">·</span>
            <span>100% Ethical &amp; Non-Industrial</span>
          </div>

          {/* Primary Tagline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.12] mb-6 text-balance">
            Discover Handmade Treasures Near You.
          </h1>

          <p className="text-base sm:text-lg text-stone-300 font-normal leading-relaxed mb-8 max-w-2xl">
            Connect directly with verified independent potters, weavers, and smiths.
            Every piece is shaped by human hands, sustainably sourced, and packed in plastic-free materials.
          </p>

          {/* Search Bar: Products, Artisans, Location */}
          <div className="bg-white/95 backdrop-blur-md p-2 rounded-xl shadow-xl border border-stone-200 text-stone-900 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-stone-200">
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search terracotta, silk throws, brass talisman..."
                className="w-full bg-transparent text-sm text-stone-900 placeholder-stone-400 focus:outline-none"
              />
            </div>

            {/* Location Selector */}
            <div className="flex items-center gap-2 px-3 py-2 shrink-0">
              <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => onSelectCity(e.target.value)}
                aria-label="Filter crafts by location"
                className="bg-transparent text-xs font-semibold text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="All">All Regions</option>
                <option value="Delhi">Delhi NCR (Within 25km)</option>
                <option value="Jaipur">Jaipur Crafts Hub</option>
                <option value="Saharanpur">Saharanpur Wood Quarter</option>
              </select>
            </div>

            <button
              onClick={onShopNow}
              className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-5 py-3 rounded-lg transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Call-to-action buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={onShopNow}
              className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium text-sm rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpenAnimateCraft && (
              <button
                onClick={onOpenAnimateCraft}
                className="px-5 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 font-medium text-sm rounded-lg backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-103"
                title="Animate still craft photos into video with Veo 3.1"
              >
                <Film className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>Animate with Veo</span>
              </button>
            )}

            <button
              onClick={onJoinArtisan}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-stone-100 border border-white/20 font-medium text-sm rounded-lg backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-amber-300" />
              <span>Join as an Artisan</span>
            </button>
          </div>

          {/* Proof Adjacency */}
          <div className="mt-8 pt-6 border-t border-stone-800/80 flex flex-wrap items-center gap-6 text-xs text-stone-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>100% Verified Master Guilds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-stone-200 tabular-nums">48h</span>
              <span>Direct Studio Dispatch</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-stone-200 tabular-nums">0%</span>
              <span>Industrial Landfill Waste</span>
            </div>
          </div>
        </div>

        {/* Floating Animated Craft Motion Badges */}
        <div className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-4 pointer-events-none">
          <div className="p-3 bg-stone-900/90 backdrop-blur-md rounded-xl border border-stone-700/80 text-xs shadow-2xl animate-float-gentle flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-900/60 border border-amber-600/40 text-amber-300 flex items-center justify-center font-bold text-base shadow-xs">
              🏺
            </div>
            <div>
              <div className="font-semibold text-white flex items-center gap-1.5">
                <span>Potter’s Wheel</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">16:9</span>
              </div>
              <div className="text-[10px] text-amber-200/80">Veo 3.1 Fast Motion Ready</div>
            </div>
          </div>

          <div className="p-3 bg-stone-900/90 backdrop-blur-md rounded-xl border border-stone-700/80 text-xs shadow-2xl animate-float-gentle [animation-delay:2s] flex items-center gap-3 ml-6">
            <div className="w-9 h-9 rounded-lg bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-base shadow-xs">
              🧣
            </div>
            <div>
              <div className="font-semibold text-white flex items-center gap-1.5">
                <span>Indigo Pit Looms</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">9:16</span>
              </div>
              <div className="text-[10px] text-indigo-200/80">Courtyard Breeze Simulation</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
