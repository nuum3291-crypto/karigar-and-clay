import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, ShieldCheck, Truck, RotateCcw, MapPin, UserCheck, MessageSquare, Send, Film } from 'lucide-react';
import { Product, Review, MessageInquiryType } from '../types';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onSelectArtisan: (artisanId: string) => void;
  onAddReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
  onOpenDirectMessage?: (artisanId: string, product: Product, inquiryType?: MessageInquiryType) => void;
  onOpenAnimateCraft?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  onSelectArtisan,
  onAddReview,
  onOpenDirectMessage,
  onOpenAnimateCraft,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewLocation, setNewReviewLocation] = useState('');

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2200);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    onAddReview(product.id, {
      authorName: newReviewAuthor.trim(),
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      verifiedPurchase: true,
      location: newReviewLocation.trim() || 'Verified Buyer',
    });

    setNewReviewAuthor('');
    setNewReviewComment('');
    setNewReviewLocation('');
    setShowReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 text-stone-900">
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-stone-950 shadow-xs border border-stone-200 transition-colors cursor-pointer"
          aria-label="Close product details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          {/* Left Column: Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx ? 'border-amber-800 ring-2 ring-amber-700/20' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            {/* Artisan Mini Preview Card */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Crafted By</span>
                <span className="flex items-center gap-1 text-xs text-stone-500">
                  <MapPin className="w-3 h-3 text-amber-700" />
                  <span>{product.artisanLocation}</span>
                </span>
              </div>

              <h4 className="font-serif font-bold text-base text-stone-900 mb-1">
                {product.artisanName}
              </h4>

              <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                {product.fullStory}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => onOpenDirectMessage?.(product.artisanId, product, 'general_question')}
                  className="text-xs font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-800" />
                  <span>Ask Maker a Question</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onSelectArtisan(product.artisanId);
                  }}
                  className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>Studio Map &amp; Works &rarr;</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Tags Line (Zero-Pill text discipline) */}
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                <span className="uppercase tracking-wider font-semibold text-amber-800">{product.category}</span>
                <span aria-hidden="true">·</span>
                <span>{product.sustainabilityTags.join(' · ')}</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight mb-3">
                {product.title}
              </h2>

              {/* Ratings and reviews link */}
              <div className="flex items-center gap-3 mb-4 text-xs text-stone-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="font-mono font-bold text-stone-900 tabular-nums">{product.rating}</span>
                </div>
                <span aria-hidden="true">·</span>
                <span>{product.reviews.length} Customer Reviews</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Direct Studio Origin</span>
                </span>
              </div>

              {/* Price Line */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-mono text-3xl font-bold text-stone-950 tabular-nums">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="font-mono text-base text-stone-400 line-through tabular-nums">
                    ${product.originalPrice}
                  </span>
                )}
                <span className="text-xs text-stone-500">Taxes &amp; Guild Contribution Included</span>
              </div>

              {/* Description */}
              <div className="prose prose-stone text-sm text-stone-600 leading-relaxed mb-6 space-y-2">
                <p>{product.description}</p>
              </div>

              {/* Specifications Table */}
              <div className="border-t border-b border-stone-200 py-3 mb-6 space-y-2 text-xs">
                {product.dimensions && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Dimensions</span>
                    <span className="font-medium text-stone-800">{product.dimensions}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Weight</span>
                    <span className="font-medium text-stone-800">{product.weight}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-500">Primary Materials</span>
                  <span className="font-medium text-stone-800">{product.materials.join(', ')}</span>
                </div>
                {product.careInstructions && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Care &amp; Cleaning</span>
                    <span className="font-medium text-stone-800 max-w-[240px] text-right">{product.careInstructions}</span>
                  </div>
                )}
              </div>

              {/* Shipping info */}
              <div className="bg-stone-50 rounded-xl p-3.5 space-y-2 text-xs text-stone-600 mb-6">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-stone-700 shrink-0" />
                  <span>{product.shippingInfo.leadTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-stone-700 shrink-0" />
                  <span>Ships plastic-free from {product.shippingInfo.shipsFrom}</span>
                </div>
              </div>
            </div>

            {/* Actions: Quantity + Add to Cart + Wishlist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity stepper */}
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-100 font-mono text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-mono font-bold text-stone-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-100 font-mono text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-6 bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addedNotice ? 'Added to Bag ✓' : `Add to Bag · $${product.price * quantity}`}</span>
                </button>

                {/* Wishlist toggle */}
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'bg-amber-50 border-amber-300 text-amber-800'
                      : 'border-stone-300 hover:bg-stone-50 text-stone-700'
                  }`}
                  title={isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-amber-700' : ''}`} />
                </button>
              </div>

              {/* Direct Messaging & Custom Order CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onOpenDirectMessage?.(product.artisanId, product, 'custom_sizing')}
                  className="w-full py-2.5 px-3 bg-amber-50/80 hover:bg-amber-100 text-amber-950 border border-amber-300/90 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer group"
                >
                  <MessageSquare className="w-4 h-4 text-amber-800 group-hover:scale-110 transition-transform" />
                  <span>Message {product.artisanName.split(' ')[0]}</span>
                </button>

                {onOpenAnimateCraft && (
                  <button
                    type="button"
                    onClick={() => onOpenAnimateCraft(product)}
                    className="w-full py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer group shadow-xs"
                  >
                    <Film className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Animate into Video (Veo)</span>
                  </button>
                )}
              </div>

              {addedNotice && (
                <div className="text-center text-xs text-emerald-800 font-medium bg-emerald-50 py-1.5 rounded-md border border-emerald-200">
                  Item added to your shopping bag!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews & Ratings Section */}
        <div className="border-t border-stone-200 p-6 sm:p-8 bg-stone-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Collector Reviews &amp; Experiences
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Authentic feedback from verified patrons who received this piece
              </p>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="text-xs font-semibold px-4 py-2 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 text-stone-800 cursor-pointer self-start sm:self-auto"
            >
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="mb-6 bg-white p-5 rounded-xl border border-stone-200 space-y-4">
              <h4 className="font-medium text-sm text-stone-900">Share your experience with this craft</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    placeholder="e.g. Radhika Roy"
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Your City / Location</label>
                  <input
                    type="text"
                    value={newReviewLocation}
                    onChange={(e) => setNewReviewLocation(e.target.value)}
                    placeholder="e.g. South Delhi, Delhi"
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReviewRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= newReviewRating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-stone-500 ml-2 font-mono">{newReviewRating} Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Your Review</label>
                <textarea
                  required
                  rows={3}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Describe the tactile texture, packaging, finish, and impression in your home..."
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Submit Review
              </button>
            </form>
          )}

          {/* Reviews List */}
          {product.reviews.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-white rounded-xl border border-stone-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-stone-900">{rev.authorName}</span>
                      {rev.location && (
                        <span className="text-[11px] text-stone-400">({rev.location})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      ))}
                      <span className="text-[11px] text-stone-400 ml-1">{rev.date}</span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-stone-500">
              No reviews yet for this craft. Be the first patron to share your impressions!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
