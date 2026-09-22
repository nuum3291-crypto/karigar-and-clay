import React, { useState } from 'react';
import { X, MapPin, Award, Users, Clock, Send, Instagram, Globe, Phone, Mail, CheckCircle2, Sparkles, Navigation, MessageSquare, Film } from 'lucide-react';
import { Artisan, Product, MessageInquiryType } from '../types';
import { ProductCard } from './ProductCard';

interface ArtisanProfileModalProps {
  artisan: Artisan;
  products: Product[];
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onOpenDirectMessage?: (artisanId: string, product?: Product | null, inquiryType?: MessageInquiryType) => void;
  hasActiveConversation?: boolean;
  onOpenAnimateCraft?: (product?: Product | null) => void;
}

export const ArtisanProfileModal: React.FC<ArtisanProfileModalProps> = ({
  artisan,
  products,
  onClose,
  onSelectProduct,
  onAddToCart,
  wishlistIds,
  onToggleWishlist,
  onOpenDirectMessage,
  hasActiveConversation,
  onOpenAnimateCraft,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(artisan.followerCount);
  const [commissionMessage, setCommissionMessage] = useState('');
  const [commissionSent, setCommissionSent] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  const artisanProducts = products.filter((p) => p.artisanId === artisan.id);

  const handleFollowToggle = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowerCount((prev) => prev - 1);
    } else {
      setIsFollowing(true);
      setFollowerCount((prev) => prev + 1);
    }
  };

  const handleSendCommission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commissionMessage.trim()) return;
    setCommissionSent(true);
    setTimeout(() => {
      setCommissionSent(false);
      setShowInquiryForm(false);
      setCommissionMessage('');
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 text-stone-900">
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 shadow-md border border-stone-200 transition-colors cursor-pointer"
          aria-label="Close artisan profile"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover Banner */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-900">
          <img
            src={artisan.coverUrl}
            alt={artisan.name}
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

          {/* Profile Header on Cover */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-amber-400/80 shadow-xl shrink-0 bg-stone-800">
                <img
                  src={artisan.avatarUrl}
                  alt={artisan.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">{artisan.brandName}</span>
                  <span aria-hidden="true" className="text-stone-400">·</span>
                  <span className="text-xs text-stone-300 capitalize">{artisan.category}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                  {artisan.name}
                </h1>
                <p className="text-xs sm:text-sm text-stone-300 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{artisan.location.neighborhood}, {artisan.location.city}</span>
                </p>
              </div>
            </div>

            {/* Follow & Commission CTAs */}
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <button
                onClick={handleFollowToggle}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                  isFollowing
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white text-stone-900 border-white hover:bg-stone-100'
                }`}
              >
                {isFollowing ? 'Following Guild' : 'Follow Artisan'}
              </button>

              <button
                onClick={() => onOpenDirectMessage?.(artisan.id, null, 'custom_commission')}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{hasActiveConversation ? 'Open Message Thread' : 'Message Artisan'}</span>
              </button>

              {onOpenAnimateCraft && (
                <button
                  onClick={() => onOpenAnimateCraft(artisanProducts[0] || null)}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  title="Animate artisan workshop photos into video with Veo 3.1"
                >
                  <Film className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Animate Workshop</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Key Stats Bar (Tabular figures) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200 text-center">
            <div>
              <div className="font-mono text-xl font-bold text-stone-900 tabular-nums">
                {artisan.yearsPracticing}+ Years
              </div>
              <div className="text-xs text-stone-500 mt-0.5">Heritage Experience</div>
            </div>
            <div>
              <div className="font-mono text-xl font-bold text-stone-900 tabular-nums">
                {artisan.rating} ★
              </div>
              <div className="text-xs text-stone-500 mt-0.5">Patron Rating ({artisan.reviewsCount})</div>
            </div>
            <div>
              <div className="font-mono text-xl font-bold text-stone-900 tabular-nums">
                {followerCount.toLocaleString()}
              </div>
              <div className="text-xs text-stone-500 mt-0.5">Guild Followers</div>
            </div>
            <div>
              <div className="font-mono text-xl font-bold text-stone-900 tabular-nums">
                {artisanProducts.length}
              </div>
              <div className="text-xs text-stone-500 mt-0.5">Handcrafted Creations</div>
            </div>
          </div>

          {/* Story & Heritage Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                The Artisan’s Craft Journey
              </h2>
              <p className="text-sm text-stone-700 leading-relaxed font-normal">
                {artisan.story}
              </p>

              <div className="pt-2">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-2">
                  Heritage Technique &amp; Sustainable Commitments
                </h3>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-stone-900">Preserved Tradition: </span>
                      <span className="text-stone-600">{artisan.heritageTechnique}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-stone-900">Eco-Pledges: </span>
                      <span className="text-stone-600">{artisan.sustainabilityTags.join(' · ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Studio Location Map & Contact */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Studio &amp; Workshop Map
              </h3>

              {/* Interactive Stylized Location Map Display */}
              <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-[#EFECE6] p-4 text-xs">
                {/* Stylized SVG Map Graphic */}
                <div className="relative h-44 w-full bg-[#E8E4DC] rounded-lg overflow-hidden flex items-center justify-center border border-stone-300">
                  <svg className="w-full h-full opacity-40" viewBox="0 0 400 200">
                    <path d="M 0 50 Q 100 80 200 40 T 400 60" fill="none" stroke="#C5BDB2" strokeWidth="6" />
                    <path d="M 50 0 Q 70 120 180 200" fill="none" stroke="#C5BDB2" strokeWidth="4" />
                    <path d="M 220 0 Q 250 100 350 200" fill="none" stroke="#D1C8BC" strokeWidth="5" />
                    <circle cx="210" cy="95" r="28" fill="#FBF9F5" stroke="#B8AEA0" strokeWidth="2" />
                  </svg>

                  {/* Marker Pin */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="relative flex flex-col items-center group">
                      <div className="w-8 h-8 rounded-full bg-amber-800 text-white flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="bg-stone-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md mt-1 whitespace-nowrap">
                        {artisan.brandName}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 text-stone-600 text-xs">
                  <div className="font-semibold text-stone-900">{artisan.location.workshopAddress}</div>
                  <div className="text-stone-500">{artisan.location.city}, {artisan.location.country}</div>
                  <div className="pt-1 flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 font-medium ${
                      artisan.location.acceptsStudioVisits ? 'text-emerald-700' : 'text-stone-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${artisan.location.acceptsStudioVisits ? 'bg-emerald-600' : 'bg-stone-400'}`} />
                      {artisan.location.acceptsStudioVisits ? 'Studio Visits Welcome' : 'Private Studio Only'}
                    </span>
                    <span className="font-mono text-[11px] text-stone-400">{artisan.location.lat.toFixed(2)}°N, {artisan.location.lng.toFixed(2)}°E</span>
                  </div>
                </div>
              </div>

              {/* Social / Contact Links */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                <span className="font-semibold text-stone-800 block mb-1">Direct Channels</span>
                {artisan.socialLinks.instagram && (
                  <div className="flex items-center gap-2 text-stone-600">
                    <Instagram className="w-3.5 h-3.5 text-stone-500" />
                    <span>{artisan.socialLinks.instagram}</span>
                  </div>
                )}
                {artisan.socialLinks.phone && (
                  <div className="flex items-center gap-2 text-stone-600">
                    <Phone className="w-3.5 h-3.5 text-stone-500" />
                    <span>{artisan.socialLinks.phone}</span>
                  </div>
                )}
                {artisan.socialLinks.email && (
                  <div className="flex items-center gap-2 text-stone-600">
                    <Mail className="w-3.5 h-3.5 text-stone-500" />
                    <span>{artisan.socialLinks.email}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onOpenDirectMessage?.(artisan.id, null, 'custom_commission')}
                  className="w-full mt-2 py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>Direct Message &amp; Custom Inquiry</span>
                </button>
              </div>
            </div>
          </div>

          {/* Direct Inquiry Modal / Form */}
          {showInquiryForm && (
            <div className="p-5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>Request Custom Commission or Studio Appointment</span>
                </h3>
                <button
                  onClick={() => setShowInquiryForm(false)}
                  className="text-stone-400 hover:text-stone-700 text-xs"
                >
                  Cancel
                </button>
              </div>

              {commissionSent ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 font-medium">
                  Inquiry sent directly to {artisan.name}! The artisan will respond via email/phone within 24 hours.
                </div>
              ) : (
                <form onSubmit={handleSendCommission} className="space-y-3">
                  <p className="text-xs text-stone-600">
                    Inquire about custom dimensions, wedding registry gifts, bulk orders, or scheduling a visit to the studio.
                  </p>
                  <textarea
                    required
                    rows={3}
                    value={commissionMessage}
                    onChange={(e) => setCommissionMessage(e.target.value)}
                    placeholder={`Namaste ${artisan.name}, I would love to commission a piece...`}
                    className="w-full text-xs p-3 rounded-lg border border-amber-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-800"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-800 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Send to Artisan
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Gallery of Products by this Artisan */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Crafts from {artisan.name}’s Kiln &amp; Loom
              </h3>
              <span className="text-xs text-stone-500 font-mono">
                {artisanProducts.length} pieces available
              </span>
            </div>

            {artisanProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {artisanProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelectProduct={onSelectProduct}
                    onSelectArtisan={() => {}}
                    onAddToCart={onAddToCart}
                    isWishlisted={wishlistIds.includes(p.id)}
                    onToggleWishlist={onToggleWishlist}
                    onAnimateProduct={onOpenAnimateCraft}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-stone-500">
                Currently crafting the next seasonal batch. Check back shortly!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
