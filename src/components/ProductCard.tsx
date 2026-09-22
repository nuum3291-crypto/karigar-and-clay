import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, MapPin, Film } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onSelectArtisan: (artisanId: string) => void;
  onAddToCart: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAnimateProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onSelectArtisan,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  onAnimateProduct,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative flex flex-col bg-white rounded-xl border border-stone-200/90 overflow-hidden hover:shadow-md transition-all duration-200 text-left"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Lead with Imagery (65-75% height) */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden cursor-pointer" onClick={() => onSelectProduct(product)}>
        {!imageError && product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-stone-100 text-stone-400">
            <span className="font-serif text-sm text-stone-600 text-center">{product.title}</span>
            <span className="text-[11px] text-stone-400 mt-1">Handmade by {product.artisanName}</span>
          </div>
        )}

        {/* Animate with Veo trigger */}
        {onAnimateProduct && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAnimateProduct(product);
            }}
            className="absolute top-3 left-3 px-2 py-1 rounded-md bg-stone-900/80 hover:bg-stone-900 text-amber-300 text-[11px] font-semibold backdrop-blur-xs flex items-center gap-1 shadow-xs transition-all hover:scale-105 cursor-pointer opacity-80 group-hover:opacity-100 z-10"
            title="Animate this craft photo into a video with Veo 3.1"
          >
            <Film className="w-3 h-3 text-amber-400" />
            <span>Animate</span>
          </button>
        )}

        {/* Wishlist toggle button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-150 backdrop-blur-xs cursor-pointer ${
            isWishlisted
              ? 'bg-amber-700 text-white shadow-sm'
              : 'bg-white/80 hover:bg-white text-stone-700 hover:text-amber-800'
          }`}
          title={isWishlisted ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View trigger on hover */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="flex-1 py-2 px-3 bg-stone-900/90 hover:bg-stone-900 text-white text-xs font-medium rounded-lg backdrop-blur-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Craft</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="py-2 px-3 bg-amber-800 hover:bg-amber-700 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            title="Quick Add to Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>

      {/* Clean Unboxed Metadata and Title */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Artisan & Location Line */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <button
              onClick={() => onSelectArtisan(product.artisanId)}
              className="hover:text-amber-900 font-medium transition-colors cursor-pointer truncate max-w-[170px]"
            >
              {product.artisanName}
            </button>
            <span className="flex items-center gap-0.5 text-stone-400 shrink-0">
              <MapPin className="w-3 h-3 text-stone-400" />
              <span>{product.artisanLocation.split(',')[0]}</span>
            </span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="font-serif font-semibold text-stone-900 text-base leading-snug hover:text-amber-900 transition-colors line-clamp-2 cursor-pointer mb-2"
          >
            {product.title}
          </h3>

          {/* Materials & Sustainability (Zero Pill Text Separator) */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-3 truncate">
            <span>{product.materials[0]}</span>
            <span aria-hidden="true">·</span>
            <span>{product.sustainabilityTags[0]}</span>
          </div>
        </div>

        {/* Pricing & Rating Baseline */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-base font-semibold text-stone-950 tabular-nums">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="font-mono text-xs text-stone-400 line-through tabular-nums">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-stone-600">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="font-mono font-medium tabular-nums">{product.rating}</span>
            <span className="text-stone-400">({product.reviewsCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
