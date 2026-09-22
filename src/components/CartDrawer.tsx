import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const freeShippingThreshold = 50;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingCost = isFreeShipping || subtotal === 0 ? 0 : 5;
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    if (promoCode.trim().toUpperCase() === 'HANDMADE10') {
      setAppliedDiscount(10);
      setPromoSuccess('10% artisan patron discount applied!');
    } else if (promoCode.trim().toUpperCase() === 'FIRSTCRAFT') {
      setAppliedDiscount(15);
      setPromoSuccess('15% first order discount applied!');
    } else {
      setPromoError('Invalid coupon code. Try HANDMADE10');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200 text-stone-900">
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-stone-900" />
            <h2 className="font-serif text-lg font-bold text-stone-900">
              Shopping Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-amber-50/70 px-5 py-3 border-b border-amber-100 text-xs">
          {isFreeShipping ? (
            <div className="text-amber-900 font-semibold flex items-center gap-1.5">
              <span>✓ You’ve unlocked free carbon-neutral shipping!</span>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-stone-700 mb-1.5 font-medium">
                <span>Add <span className="font-mono font-bold">${amountToFreeShipping.toFixed(0)}</span> more for free craft shipping</span>
                <span className="font-mono text-[11px]">{Math.round((subtotal / freeShippingThreshold) * 100)}%</span>
              </div>
              <div className="w-full bg-amber-200/60 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-700 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Itemized Cart List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
              <ShoppingBag className="w-12 h-12 text-stone-300 mb-3 stroke-[1.5]" />
              <h3 className="font-serif text-base font-medium text-stone-800 mb-1">Your bag is empty</h3>
              <p className="text-xs text-stone-500 max-w-xs mb-4">
                Explore hand-thrown pottery, botanical handlooms, or hammered metals crafted by independent makers.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Start Exploring
              </button>
            </div>
          ) : (
            cartItems.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-4 p-3 rounded-xl border border-stone-200/80 bg-stone-50/50"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif font-semibold text-xs text-stone-900 line-clamp-1">
                        {product.title}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-stone-500 mt-0.5">
                      By {product.artisanName}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-stone-300 rounded-md bg-white">
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        className="px-2 py-0.5 text-stone-600 hover:bg-stone-100 text-xs font-mono cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-mono font-medium tabular-nums">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        className="px-2 py-0.5 text-stone-600 hover:bg-stone-100 text-xs font-mono cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-mono text-xs font-bold text-stone-900 tabular-nums">
                      ${product.price * quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Module */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50/70 space-y-4">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Coupon (try HANDMADE10)"
                  className="w-full text-xs pl-8 pr-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 uppercase font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-2 bg-stone-900 text-white text-xs font-medium rounded-lg hover:bg-stone-800 transition-colors shrink-0 cursor-pointer"
              >
                Apply
              </button>
            </form>

            {promoSuccess && <div className="text-[11px] text-emerald-700 font-medium">{promoSuccess}</div>}
            {promoError && <div className="text-[11px] text-rose-600 font-medium">{promoError}</div>}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Guild Discount ({appliedDiscount}%)</span>
                  <span className="font-mono tabular-nums">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>Eco Shipping</span>
                <span className="font-mono tabular-nums">
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>

              <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-950">
                <span>Total Amount</span>
                <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3 px-4 bg-amber-800 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Direct payouts to artisan bank accounts</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
