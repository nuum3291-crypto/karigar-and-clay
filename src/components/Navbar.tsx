import React from 'react';
import { ShoppingBag, Heart, Search, ShieldCheck, MapPin, MessageSquare, Film, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'shop' | 'artisans' | 'workshops' | 'blog' | 'track';
  setActiveTab: (tab: 'shop' | 'artisans' | 'workshops' | 'blog' | 'track') => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  isAdminView: boolean;
  onToggleAdminView: () => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onOpenJoinArtisan: () => void;
  onOpenMessages?: () => void;
  unreadMessagesCount?: number;
  onOpenAnimateCraft?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  isAdminView,
  onToggleAdminView,
  selectedCity,
  onSelectCity,
  onOpenJoinArtisan,
  onOpenMessages,
  unreadMessagesCount = 0,
  onOpenAnimateCraft,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Top micro announcement bar */}
      <div className="bg-stone-900 text-stone-200 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>Free carbon-neutral shipping on all artisanal treasures above $50</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px] text-stone-400">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>Browsing crafts near:</span>
              <select
                value={selectedCity}
                onChange={(e) => onSelectCity(e.target.value)}
                aria-label="Filter crafts by city"
                className="bg-transparent text-amber-300 font-medium cursor-pointer border-b border-stone-700 hover:border-amber-400 focus:outline-none"
              >
                <option value="All" className="bg-stone-900 text-stone-200">All Craft Clusters</option>
                <option value="Delhi" className="bg-stone-900 text-stone-200">Delhi NCR</option>
                <option value="Jaipur" className="bg-stone-900 text-stone-200">Jaipur, Rajasthan</option>
                <option value="Saharanpur" className="bg-stone-900 text-stone-200">Saharanpur, UP</option>
              </select>
            </div>
            <span>·</span>
            <button
              onClick={onOpenJoinArtisan}
              className="text-stone-300 hover:text-white transition-colors cursor-pointer"
            >
              Sell Your Craft
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: Zone 1 (Single Text Wordmark) - Zone 2 (4-6 Nav Links) - Zone 3 (1-2 Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark with animated potter mark */}
        <button
          onClick={() => {
            setActiveTab('shop');
            if (isAdminView) onToggleAdminView();
          }}
          className="text-2xl font-serif font-bold tracking-tight text-stone-900 hover:text-amber-900 transition-colors whitespace-nowrap text-left flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-full bg-amber-900 text-amber-200 flex items-center justify-center text-xs animate-potter-spin shadow-xs">
            🏺
          </div>
          <span>Karigar &amp; Clay</span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => {
              setActiveTab('shop');
              if (isAdminView) onToggleAdminView();
            }}
            className={`transition-colors hover:text-stone-900 pb-1 cursor-pointer ${
              !isAdminView && activeTab === 'shop'
                ? 'text-stone-950 border-b-2 border-amber-800 font-semibold'
                : ''
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => {
              setActiveTab('artisans');
              if (isAdminView) onToggleAdminView();
            }}
            className={`transition-colors hover:text-stone-900 pb-1 cursor-pointer ${
              !isAdminView && activeTab === 'artisans'
                ? 'text-stone-950 border-b-2 border-amber-800 font-semibold'
                : ''
            }`}
          >
            Artisans
          </button>
          <button
            onClick={() => {
              setActiveTab('workshops');
              if (isAdminView) onToggleAdminView();
            }}
            className={`transition-colors hover:text-stone-900 pb-1 cursor-pointer ${
              !isAdminView && activeTab === 'workshops'
                ? 'text-stone-950 border-b-2 border-amber-800 font-semibold'
                : ''
            }`}
          >
            Workshops
          </button>
          <button
            onClick={() => {
              setActiveTab('blog');
              if (isAdminView) onToggleAdminView();
            }}
            className={`transition-colors hover:text-stone-900 pb-1 cursor-pointer ${
              !isAdminView && activeTab === 'blog'
                ? 'text-stone-950 border-b-2 border-amber-800 font-semibold'
                : ''
            }`}
          >
            Craft Stories
          </button>
          <button
            onClick={() => {
              setActiveTab('track');
              if (isAdminView) onToggleAdminView();
            }}
            className={`transition-colors hover:text-stone-900 pb-1 cursor-pointer ${
              !isAdminView && activeTab === 'track'
                ? 'text-stone-950 border-b-2 border-amber-800 font-semibold'
                : ''
            }`}
          >
            Track Order
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Animate Video with Veo 3.1 Button */}
          {onOpenAnimateCraft && (
            <button
              onClick={onOpenAnimateCraft}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 transition-all hover:scale-105 cursor-pointer shadow-xs"
              title="Animate Craft Photos into Video with Veo 3.1"
            >
              <Film className="w-3.5 h-3.5 text-amber-800 animate-pulse" />
              <span className="hidden sm:inline">Animate Video</span>
              <span className="sm:hidden">Animate</span>
            </button>
          )}

          {/* Messages button */}
          {onOpenMessages && (
            <button
              onClick={onOpenMessages}
              className="relative p-2 text-stone-600 hover:text-stone-900 transition-colors rounded-full hover:bg-stone-100 cursor-pointer"
              title="Artisan Direct Inquiries & Messages"
              aria-label="Artisan Messages"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadMessagesCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                  {unreadMessagesCount}
                </span>
              )}
            </button>
          )}

          {/* Wishlist button */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 text-stone-600 hover:text-stone-900 transition-colors rounded-full hover:bg-stone-100"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-stone-600 hover:text-stone-900 transition-colors rounded-full hover:bg-stone-100"
            title="Shopping Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-stone-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin / Artisan Studio Toggle */}
          <button
            onClick={onToggleAdminView}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 border ${
              isAdminView
                ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200 hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAdminView ? 'Exit Studio' : 'Artisan Studio'}</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar for small viewports */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-stone-200 bg-[#FAF9F5] text-xs font-medium text-stone-600 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('shop');
            if (isAdminView) onToggleAdminView();
          }}
          className={`px-2 py-1 ${!isAdminView && activeTab === 'shop' ? 'text-amber-900 font-bold' : ''}`}
        >
          Marketplace
        </button>
        <button
          onClick={() => {
            setActiveTab('artisans');
            if (isAdminView) onToggleAdminView();
          }}
          className={`px-2 py-1 ${!isAdminView && activeTab === 'artisans' ? 'text-amber-900 font-bold' : ''}`}
        >
          Artisans
        </button>
        <button
          onClick={() => {
            setActiveTab('workshops');
            if (isAdminView) onToggleAdminView();
          }}
          className={`px-2 py-1 ${!isAdminView && activeTab === 'workshops' ? 'text-amber-900 font-bold' : ''}`}
        >
          Workshops
        </button>
        <button
          onClick={() => {
            setActiveTab('blog');
            if (isAdminView) onToggleAdminView();
          }}
          className={`px-2 py-1 ${!isAdminView && activeTab === 'blog' ? 'text-amber-900 font-bold' : ''}`}
        >
          Stories
        </button>
        <button
          onClick={() => {
            setActiveTab('track');
            if (isAdminView) onToggleAdminView();
          }}
          className={`px-2 py-1 ${!isAdminView && activeTab === 'track' ? 'text-amber-900 font-bold' : ''}`}
        >
          Track
        </button>
      </div>
    </header>
  );
};
