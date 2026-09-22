import React, { useState } from 'react';
import { X, Search, CheckCircle2, Circle, Truck, Clock, Package, MapPin, Sparkles } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  initialOrderNumber?: string;
}

const STAGES: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'confirmed', label: 'Order Confirmed', desc: 'Verified and routed to artisan' },
  { key: 'artisan_crafting', label: 'Artisan Crafting', desc: 'Shaping, firing, or weaving' },
  { key: 'packed', label: 'Plastic-Free Packing', desc: 'Sealed in recycled materials' },
  { key: 'in_transit', label: 'In Transit', desc: 'En route with carbon-neutral courier' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Local courier arrival today' },
  { key: 'delivered', label: 'Safely Delivered', desc: 'Received and placed in your home' },
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  initialOrderNumber,
}) => {
  const [searchCode, setSearchCode] = useState(initialOrderNumber || (orders[0]?.orderNumber ?? ''));
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    orders.find((o) => o.orderNumber === (initialOrderNumber || orders[0]?.orderNumber)) || orders[0] || null
  );
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const found = orders.find(
      (o) => o.orderNumber.trim().toUpperCase() === searchCode.trim().toUpperCase()
    );
    if (found) {
      setSelectedOrder(found);
    } else {
      setErrorMsg(`No order found matching "${searchCode}". Check your order confirmation email.`);
    }
  };

  const getStageIndex = (status: OrderStatus) => {
    return STAGES.findIndex((s) => s.key === status);
  };

  const currentStageIndex = selectedOrder ? getStageIndex(selectedOrder.trackingStatus) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 text-stone-900">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-800" />
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Artisan Craft Order Tracking
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Enter Order # (e.g. KC-89421 or KC-89390)"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Track Craft
            </button>
          </form>

          {/* Quick Order Selector */}
          {orders.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-stone-500 overflow-x-auto pb-1">
              <span className="shrink-0">Recent Orders:</span>
              {orders.map((ord) => (
                <button
                  key={ord.id}
                  onClick={() => {
                    setSelectedOrder(ord);
                    setSearchCode(ord.orderNumber);
                    setErrorMsg('');
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors shrink-0 cursor-pointer ${
                    selectedOrder?.id === ord.id
                      ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {ord.orderNumber} ({ord.customer.name.split(' ')[0]})
                </button>
              ))}
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
              {errorMsg}
            </div>
          )}

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status Hero Box */}
              <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-amber-800 font-semibold">
                    Order #{selectedOrder.orderNumber}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-stone-900 mt-0.5">
                    {STAGES[currentStageIndex]?.label}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Carrier: {selectedOrder.carrier} · Tracking Code: <span className="font-mono text-stone-700">{selectedOrder.trackingNumber}</span>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs text-stone-500">Estimated Arrival</div>
                  <div className="font-mono text-sm font-bold text-emerald-800 tabular-nums">
                    {selectedOrder.estimatedDelivery}
                  </div>
                </div>
              </div>

              {/* Visual Multi-Stage Progress Timeline */}
              <div className="py-4">
                <div className="relative flex flex-col sm:flex-row justify-between gap-4 sm:gap-2">
                  {STAGES.map((stg, idx) => {
                    const isCompleted = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div key={stg.key} className="flex-1 flex sm:flex-col items-center sm:items-center text-left sm:text-center gap-3 sm:gap-2 relative">
                        {/* Circle Indicator */}
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs transition-colors z-10 ${
                            isCurrent
                              ? 'bg-amber-800 text-white ring-4 ring-amber-700/20'
                              : isCompleted
                              ? 'bg-emerald-700 text-white'
                              : 'bg-stone-200 text-stone-400'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-3 h-3" />}
                        </div>

                        {/* Text */}
                        <div>
                          <div className={`text-xs font-semibold ${isCurrent ? 'text-amber-900' : isCompleted ? 'text-stone-900' : 'text-stone-400'}`}>
                            {stg.label}
                          </div>
                          <div className="text-[10px] text-stone-400 hidden sm:block max-w-[100px] mx-auto mt-0.5">
                            {stg.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Status History Log */}
              <div className="space-y-3">
                <h4 className="font-serif text-sm font-bold text-stone-900">
                  Detailed Studio &amp; Carrier Logs
                </h4>

                <div className="border border-stone-200 rounded-xl divide-y divide-stone-100 bg-white overflow-hidden text-xs">
                  {selectedOrder.statusHistory.map((hist, i) => (
                    <div key={i} className="p-3.5 flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-800 shrink-0 mt-1.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-semibold text-stone-900">{hist.label}</span>
                          <span className="text-[11px] text-stone-400 font-mono">{hist.date}</span>
                        </div>
                        <p className="text-stone-600 leading-relaxed">{hist.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ordered Items Preview */}
              <div className="border-t border-stone-200 pt-4">
                <h4 className="font-serif text-sm font-bold text-stone-900 mb-3">
                  Treasures in this Shipment
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs">
                      <img
                        src={it.product.images[0]}
                        alt={it.product.title}
                        className="w-14 h-14 rounded-md object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-stone-900 truncate">{it.product.title}</div>
                        <div className="text-stone-500 text-[11px]">By {it.product.artisanName}</div>
                        <div className="flex items-center justify-between mt-1 text-stone-700">
                          <span className="font-mono">Qty: {it.quantity}</span>
                          <span className="font-mono font-bold">${it.product.price * it.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
