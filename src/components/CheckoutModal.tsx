import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, QrCode, Truck, ArrowRight, Lock, Building, Smartphone } from 'lucide-react';
import { CartItem, Order, OrderStatus } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderPlaced: (order: Order) => void;
  onOpenTracking: (orderNumber: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderPlaced,
  onOpenTracking,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Customer & Shipping state
  const [customerName, setCustomerName] = useState('Ananya Sen');
  const [customerEmail, setCustomerEmail] = useState('ananya.sen@example.com');
  const [customerPhone, setCustomerPhone] = useState('+91 98101 23456');
  const [customerStreet, setCustomerStreet] = useState('B-42, Gulmohar Park');
  const [customerCity, setCustomerCity] = useState('Delhi');
  const [customerPostalCode, setCustomerPostalCode] = useState('110049');
  const [customerCountry, setCustomerCountry] = useState('India');

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'studio_pickup'>('standard');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'razorpay' | 'paypal' | 'cod'>('upi');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('892');
  const [upiId, setUpiId] = useState('ananya@okhdfcbank');

  // Generated Order reference
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shippingCost =
    shippingMethod === 'express' ? 12 : shippingMethod === 'studio_pickup' ? 0 : subtotal >= 50 ? 0 : 5;
  const total = subtotal + shippingCost;

  const handleProcessOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const orderNumber = `KC-${Math.floor(10000 + Math.random() * 90000)}`;
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        date: new Date().toISOString().split('T')[0],
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          street: customerStreet,
          city: customerCity,
          postalCode: customerPostalCode,
          country: customerCountry,
        },
        items: [...cartItems],
        subtotal,
        shipping: shippingCost,
        discount: 0,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        trackingStatus: 'confirmed',
        carrier:
          shippingMethod === 'studio_pickup'
            ? 'Local Artisan Studio Pickup'
            : shippingMethod === 'express'
            ? 'Delhivery Air Artisan Express'
            : 'BlueDart Green Ground',
        trackingNumber: `BD-${Math.floor(100000 + Math.random() * 900000)}`,
        estimatedDelivery: 'Sep 25, 2026',
        statusHistory: [
          {
            status: 'confirmed',
            label: 'Order Confirmed',
            date: 'Just now',
            note: 'Order captured securely and routed directly to the artisan studio.',
          },
        ],
      };

      setCompletedOrder(newOrder);
      onOrderPlaced(newOrder);
      setIsProcessing(false);
      setStep(4);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 text-stone-900">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-800">
              Direct-to-Artisan Checkout
            </span>
            <h2 className="font-serif text-xl font-bold text-stone-900">
              {step === 4 ? 'Order Confirmation' : 'Secure Craft Purchase'}
            </h2>
          </div>

          {step !== 4 && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Stepper Progress */}
        {step < 4 && (
          <div className="px-6 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs text-stone-500">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-amber-900 font-semibold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step >= 1 ? 'bg-amber-900 text-white' : 'bg-stone-200 text-stone-600'
              }`}>1</span>
              <span>Delivery Address</span>
            </div>
            <span className="text-stone-300">&rarr;</span>
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-amber-900 font-semibold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step >= 2 ? 'bg-amber-900 text-white' : 'bg-stone-200 text-stone-600'
              }`}>2</span>
              <span>Shipping Speed</span>
            </div>
            <span className="text-stone-300">&rarr;</span>
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-amber-900 font-semibold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step >= 3 ? 'bg-amber-900 text-white' : 'bg-stone-200 text-stone-600'
              }`}>3</span>
              <span>Payment</span>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* STEP 1: Delivery Address */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-serif text-base font-bold text-stone-900">
                Where should the artisan ship your handcrafted treasures?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Email Address (for order tracking)</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">City</label>
                  <input
                    type="text"
                    required
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-stone-600 mb-1 font-medium">Street Address, Apt, Floor</label>
                  <input
                    type="text"
                    required
                    value={customerStreet}
                    onChange={(e) => setCustomerStreet(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">PIN / Postal Code</label>
                  <input
                    type="text"
                    required
                    value={customerPostalCode}
                    onChange={(e) => setCustomerPostalCode(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Country</label>
                  <input
                    type="text"
                    required
                    value={customerCountry}
                    onChange={(e) => setCustomerCountry(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Continue to Shipping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Shipping Method */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-serif text-base font-bold text-stone-900">
                Choose Delivery Method
              </h3>

              <div className="space-y-3">
                <label
                  onClick={() => setShippingMethod('standard')}
                  className={`flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    shippingMethod === 'standard'
                      ? 'border-amber-800 bg-amber-50/40 ring-1 ring-amber-800'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="mt-1 text-amber-800"
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-900">Standard Carbon-Neutral Artisan Ground</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        Delivers in 3–5 business days via BlueDart in 100% recycled packaging
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-stone-900 tabular-nums">
                    {subtotal >= 50 ? 'FREE' : '$5.00'}
                  </span>
                </label>

                <label
                  onClick={() => setShippingMethod('express')}
                  className={`flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    shippingMethod === 'express'
                      ? 'border-amber-800 bg-amber-50/40 ring-1 ring-amber-800'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="mt-1 text-amber-800"
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-900">Express Priority Air Craft Delivery</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        Delivers in 24–48 hours with fragile craft insurance &amp; live SMS updates
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-stone-900 tabular-nums">
                    $12.00
                  </span>
                </label>

                <label
                  onClick={() => setShippingMethod('studio_pickup')}
                  className={`flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    shippingMethod === 'studio_pickup'
                      ? 'border-amber-800 bg-amber-50/40 ring-1 ring-amber-800'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'studio_pickup'}
                      onChange={() => setShippingMethod('studio_pickup')}
                      className="mt-1 text-amber-800"
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-900">Local Workshop &amp; Studio Pickup (Near You)</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        Meet the maker in Delhi/Jaipur studio, collect your piece &amp; enjoy artisan chai
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-emerald-700">
                    FREE
                  </span>
                </label>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-medium rounded-lg hover:bg-stone-50 cursor-pointer"
                >
                  &larr; Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Options (Stripe, UPI, Razorpay, COD) */}
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="font-serif text-base font-bold text-stone-900">
                Select Secure Payment Method
              </h3>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'border-amber-800 bg-amber-50/50 text-amber-950 font-bold'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mx-auto mb-1 text-amber-800" />
                  <span className="text-xs block">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-amber-800 bg-amber-50/50 text-amber-950 font-bold'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-amber-800" />
                  <span className="text-xs block">Cards / Stripe</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'razorpay'
                      ? 'border-amber-800 bg-amber-50/50 text-amber-950 font-bold'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Building className="w-4 h-4 mx-auto mb-1 text-amber-800" />
                  <span className="text-xs block">NetBanking / Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-amber-800 bg-amber-50/50 text-amber-950 font-bold'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Truck className="w-4 h-4 mx-auto mb-1 text-amber-800" />
                  <span className="text-xs block">Cash on Delivery</span>
                </button>
              </div>

              {/* Payment Specific Sub-form */}
              {paymentMethod === 'upi' && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Simulated QR Code */}
                    <div className="w-28 h-28 bg-white p-2 rounded-lg border border-stone-300 flex flex-col items-center justify-center shrink-0">
                      <QrCode className="w-18 h-18 text-stone-800" />
                      <span className="text-[9px] text-stone-400 font-mono mt-0.5">Scan with GPay/PhonePe</span>
                    </div>

                    <div className="flex-1 space-y-2 text-xs">
                      <label className="block text-stone-700 font-medium">Or enter your UPI ID</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@okhdfcbank"
                        className="w-full p-2.5 bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono text-xs"
                      />
                      <span className="text-[11px] text-stone-500 block">
                        Supported: Google Pay, PhonePe, Paytm, BHIM, Cred
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Card Number (Visa / Mastercard / RuPay)</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2.5 bg-white rounded-lg border border-stone-300 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full p-2.5 bg-white rounded-lg border border-stone-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">CVC / CVV</label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full p-2.5 bg-white rounded-lg border border-stone-300 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'razorpay' && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                  <p className="mb-2 font-medium text-stone-900">Razorpay / NetBanking Gateway</p>
                  <p>You will be securely routed through all major Indian banks including HDFC, ICICI, SBI, Axis, and Kotak.</p>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                  <p className="font-semibold text-stone-900 mb-1">Cash on Delivery Terms</p>
                  <p>Pay cash or scan mobile QR upon delivery at your doorstep in Delhi NCR, Jaipur, or major urban centers. Exact amount is appreciated to support delivery partners.</p>
                </div>
              )}

              {/* Order Summary & Final Pay Button */}
              <div className="pt-3 border-t border-stone-200 space-y-3">
                <div className="flex justify-between text-xs text-stone-600">
                  <span>Items ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
                  <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-stone-600">
                  <span>Shipping</span>
                  <span className="font-mono tabular-nums">
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-950">
                  <span>Total Due</span>
                  <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-medium rounded-lg hover:bg-stone-50 cursor-pointer"
                  >
                    &larr; Back
                  </button>

                  <button
                    onClick={handleProcessOrder}
                    disabled={isProcessing}
                    className="px-7 py-3 bg-amber-800 hover:bg-amber-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-60"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>
                      {isProcessing
                        ? 'Connecting to Artisan Gateway...'
                        : `Pay $${total.toFixed(2)} & Place Order`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Order Confirmation & Receipt */}
          {step === 4 && completedOrder && (
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
                  Order Successfully Placed
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                  Thank You, {customerName.split(' ')[0]}!
                </h3>
                <p className="text-xs text-stone-600 mt-1 max-w-md mx-auto">
                  Your order has been transmitted directly to the artisans. A confirmation receipt has been sent to <span className="font-medium text-stone-900">{customerEmail}</span>.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 text-left text-xs space-y-3 max-w-md mx-auto">
                <div className="flex justify-between pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Order Number</span>
                  <span className="font-mono font-bold text-amber-900">{completedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Carrier / Dispatch</span>
                  <span className="font-medium text-stone-800">{completedOrder.carrier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Tracking Code</span>
                  <span className="font-mono text-stone-800">{completedOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Destination</span>
                  <span className="font-medium text-stone-800">{customerStreet}, {customerCity}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-200 font-bold text-stone-950">
                  <span>Paid Total</span>
                  <span className="font-mono tabular-nums">${completedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenTracking(completedOrder.orderNumber);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>Track Handcrafting &amp; Delivery</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 border border-stone-300 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
