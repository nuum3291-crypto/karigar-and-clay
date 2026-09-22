import React from 'react';
import { Heart, Sparkles, MapPin } from 'lucide-react';
import { CraftCategory } from '../types';

interface FooterProps {
  onSelectCategory: (cat: CraftCategory | 'all') => void;
  onSelectCity: (city: string) => void;
  onOpenJoinArtisan: () => void;
  onOpenTrackOrder: () => void;
  onOpenWorkshops: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onSelectCity,
  onOpenJoinArtisan,
  onOpenTrackOrder,
  onOpenWorkshops,
}) => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand & Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-2xl font-serif font-bold text-white tracking-tight">
              Karigar &amp; Clay
            </span>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              A decentralized guild connecting mindful urban collectors with master rural potters, weavers, and smiths.
              Every purchase preserves generational heritage techniques and guarantees direct, equitable pay.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Plastic-Free &amp; Carbon-Neutral Shipping</span>
            </div>
          </div>

          {/* Craft Collections */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm">Handmade Disciplines</h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button onClick={() => onSelectCategory('pottery')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Terracotta &amp; Stoneware
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('textiles')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Natural Indigo &amp; Khadi
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('jewelry')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Repoussé Hammered Brass
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('woodwork')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Salvaged Haveli Teak
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('candles')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Himalayan Botanical Wax
                </button>
              </li>
            </ul>
          </div>

          {/* Regional Hubs Near You */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm">Maker Clusters</h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button onClick={() => onSelectCity('Delhi')} className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>Delhi NCR (Kumhar Gram &amp; Shahpur Jat)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCity('Jaipur')} className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>Jaipur (Sanganer Dabu &amp; Weaving)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCity('Saharanpur')} className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>Saharanpur (Heritage Woodcarving)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onOpenWorkshops()} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Local Craft Fairs &amp; Pop-Ups
                </button>
              </li>
            </ul>
          </div>

          {/* Patron Care & Guild Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm">Guild Support</h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button onClick={onOpenTrackOrder} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Track Dispatched Order
                </button>
              </li>
              <li>
                <button onClick={onOpenJoinArtisan} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Apply as a Maker Guild
                </button>
              </li>
              <li>
                <button onClick={onOpenWorkshops} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Masterclass Workshops
                </button>
              </li>
              <li>
                <span className="text-stone-500">Zero Commission Policy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Quiet Copyright Row */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <div>
            &copy; 2026 Karigar &amp; Clay Marketplace. Honoring living ancestral crafts.
          </div>
          <div className="flex items-center gap-4">
            <span>Handmade with care</span>
            <span>·</span>
            <span>Ethical Trade</span>
            <span>·</span>
            <span>No Factory Sweatshops</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
