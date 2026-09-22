import React, { useState } from 'react';
import {
  Package,
  Users,
  ShoppingBag,
  TrendingUp,
  MessageSquare,
  Plus,
  CheckCircle2,
  AlertCircle,
  Truck,
  Edit2,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Send,
  Trash2
} from 'lucide-react';
import { Product, Artisan, Order, SupportTicket, CraftCategory, OrderStatus } from '../types';

interface AdminDashboardProps {
  products: Product[];
  artisans: Artisan[];
  orders: Order[];
  supportTickets: SupportTicket[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onApproveArtisan: (artisanId: string) => void;
  onToggleFeatureArtisan: (artisanId: string) => void;
  onReplyTicket: (ticketId: string, message: string) => void;
  onResolveTicket: (ticketId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  artisans,
  orders,
  supportTickets,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onApproveArtisan,
  onToggleFeatureArtisan,
  onReplyTicket,
  onResolveTicket,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'artisans' | 'support'>('analytics');
  
  // Product add modal
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState(65);
  const [newCategory, setNewCategory] = useState<CraftCategory>('pottery');
  const [newArtisanId, setNewArtisanId] = useState(artisans[0]?.id || '');
  const [newDescription, setNewDescription] = useState('');
  const [newMaterials, setNewMaterials] = useState('Terracotta, River Silt');
  const [newTags, setNewTags] = useState('Zero Waste, Plastic-Free');
  const [newInventory, setNewInventory] = useState(15);

  // Support Reply State
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(supportTickets[0]?.id || null);
  const [replyMessage, setReplyMessage] = useState('');

  // Editing Product Inline State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editInventory, setEditInventory] = useState<number>(0);

  // Analytics Math
  const totalSales = orders.reduce((sum, ord) => sum + ord.total, 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalSales / totalOrdersCount : 0;
  const totalArtisans = artisans.length;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const matchedArtisan = artisans.find((a) => a.id === newArtisanId) || artisans[0];

    const prod: Product = {
      id: `prod-${Date.now()}`,
      title: newTitle.trim(),
      artisanId: matchedArtisan.id,
      artisanName: matchedArtisan.name,
      artisanLocation: `${matchedArtisan.location.city}, India`,
      category: newCategory,
      price: Number(newPrice),
      images: [
        '/src/assets/images/hero_artisan_studio_1790108084579.jpg',
      ],
      description: newDescription.trim() || 'Handmade heirloom piece crafted with ethical techniques.',
      fullStory: 'Directly sourced from the maker studio in small micro-batches.',
      materials: newMaterials.split(',').map((s) => s.trim()),
      sustainabilityTags: newTags.split(',').map((s) => s.trim()),
      inStock: newInventory > 0,
      inventory: Number(newInventory),
      rating: 5.0,
      reviewsCount: 1,
      shippingInfo: {
        leadTime: 'Crafted & dispatched in 1–2 days',
        shipsFrom: `${matchedArtisan.location.neighborhood}, ${matchedArtisan.location.city}`,
        shippingCost: 0,
        freeShippingThreshold: 50,
        packaging: 'Plastic-free recyclable kraft container',
      },
      reviews: [],
    };

    onAddProduct(prod);
    setShowAddProductModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  const selectedTicket = supportTickets.find((t) => t.id === selectedTicketId);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !replyMessage.trim()) return;
    onReplyTicket(selectedTicketId, replyMessage.trim());
    setReplyMessage('');
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Studio / Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Artisan Guild Operations &amp; Admin Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              Guild Command Dashboard
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Fulfill live orders, manage inventory, review maker applications, and answer patron tickets.
            </p>
          </div>

          {/* Quick Segmented Tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-xl overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('artisans')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'artisans'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Artisans ({artisans.length})
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'support'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Support ({supportTickets.filter((t) => t.status !== 'resolved').length})
            </button>
          </div>
        </div>

        {/* TAB 1: ANALYTICS OVERVIEW */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Metric KPI Cards (Tabular figures) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
                <div className="flex items-center justify-between text-stone-400 mb-2">
                  <span className="text-xs uppercase tracking-wider font-medium">Gross Guild Volume</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="font-mono text-2xl font-bold text-stone-900 tabular-nums">
                  ${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+18.4% from regional urban buyers</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
                <div className="flex items-center justify-between text-stone-400 mb-2">
                  <span className="text-xs uppercase tracking-wider font-medium">Dispatched Orders</span>
                  <ShoppingBag className="w-4 h-4 text-amber-700" />
                </div>
                <div className="font-mono text-2xl font-bold text-stone-900 tabular-nums">
                  {totalOrdersCount}
                </div>
                <div className="text-[11px] text-stone-500 mt-1">
                  100% delivered with 0% plastic packaging
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
                <div className="flex items-center justify-between text-stone-400 mb-2">
                  <span className="text-xs uppercase tracking-wider font-medium">Average Basket Value</span>
                  <TrendingUp className="w-4 h-4 text-stone-600" />
                </div>
                <div className="font-mono text-2xl font-bold text-stone-900 tabular-nums">
                  ${avgOrderValue.toFixed(2)}
                </div>
                <div className="text-[11px] text-stone-500 mt-1">
                  Average items per order: 1.8
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
                <div className="flex items-center justify-between text-stone-400 mb-2">
                  <span className="text-xs uppercase tracking-wider font-medium">Verified Maker Guilds</span>
                  <Users className="w-4 h-4 text-amber-900" />
                </div>
                <div className="font-mono text-2xl font-bold text-stone-900 tabular-nums">
                  {totalArtisans}
                </div>
                <div className="text-[11px] text-amber-800 mt-1 font-medium">
                  Covering Delhi, Jaipur, &amp; Saharanpur
                </div>
              </div>
            </div>

            {/* Category Performance Breakdown & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <h3 className="font-serif text-lg font-bold text-stone-900 mb-4">
                  Craft Category Share &amp; Demand
                </h3>
                <div className="space-y-4">
                  {[
                    { cat: 'Pottery & High-Fire Ceramics', count: '42%', value: '$1,840', color: 'bg-amber-800' },
                    { cat: 'Heritage Indigo & Khadi Textiles', count: '31%', value: '$1,380', color: 'bg-indigo-700' },
                    { cat: 'Repoussé Hammered Brass & Jewelry', count: '18%', value: '$790', color: 'bg-amber-600' },
                    { cat: 'Salvaged Teak Woodcraft', count: '9%', value: '$410', color: 'bg-stone-700' },
                  ].map((row, i) => (
                    <div key={i} className="text-xs space-y-1">
                      <div className="flex justify-between font-medium text-stone-700">
                        <span>{row.cat}</span>
                        <span className="font-mono tabular-nums">{row.count} ({row.value})</span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div className={`h-full ${row.color}`} style={{ width: row.count }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local SEO & Marketing Highlights */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Local SEO &amp; Direct Patrons
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Top performing search terms driving direct studio purchases:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 flex justify-between">
                    <span className="font-medium text-stone-800">"Handmade crafts in Delhi"</span>
                    <span className="font-mono text-stone-500">1.2k hits</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 flex justify-between">
                    <span className="font-medium text-stone-800">"Kumhar Gram terracotta vase"</span>
                    <span className="font-mono text-stone-500">840 hits</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 flex justify-between">
                    <span className="font-medium text-stone-800">"Jaipur natural indigo throw"</span>
                    <span className="font-mono text-stone-500">620 hits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Live Orders &amp; Studio Fulfillment
                </h3>
                <p className="text-xs text-stone-500">
                  Update shipping status to notify customers in real-time
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Patron</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4 text-right">Update Fulfillment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-900">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-900">{ord.customer.name}</div>
                        <div className="text-[11px] text-stone-500">{ord.customer.city}</div>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">
                        {ord.items.map((i) => `${i.quantity}x ${i.product.title.split(' ')[0]}`).join(', ')}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-stone-900 tabular-nums">
                        ${ord.total.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 uppercase text-[11px] font-mono text-stone-600">
                        {ord.paymentMethod} · {ord.paymentStatus}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-medium capitalize ${
                          ord.trackingStatus === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.trackingStatus === 'in_transit'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-stone-100 text-stone-700'
                        }`}>
                          {ord.trackingStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <select
                          value={ord.trackingStatus}
                          onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="bg-white border border-stone-300 rounded-md px-2 py-1 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="artisan_crafting">Artisan Crafting</option>
                          <option value="packed">Packed Eco-Safe</option>
                          <option value="in_transit">In Transit</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Artisan Catalog Inventory
                </h3>
                <p className="text-xs text-stone-500">
                  Manage product pricing, stock availability, and new crafts
                </p>
              </div>

              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Handcrafted Piece</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Craft</th>
                      <th className="py-3 px-4">Artisan Maker</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Inventory</th>
                      <th className="py-3 px-4">Stock Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-3.5 px-4 flex items-center gap-3">
                          <img
                            src={prod.images[0]}
                            alt={prod.title}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-stone-200"
                          />
                          <span className="font-medium text-stone-900 line-clamp-1 max-w-[220px]">
                            {prod.title}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-stone-600">
                          {prod.artisanName}
                        </td>
                        <td className="py-3.5 px-4 text-stone-500 capitalize">
                          {prod.category}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-stone-900 tabular-nums">
                          ${prod.price}
                        </td>
                        <td className="py-3.5 px-4 font-mono tabular-nums text-stone-700">
                          {prod.inventory} units
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() =>
                              onUpdateProduct({
                                ...prod,
                                inStock: !prod.inStock,
                                inventory: prod.inStock ? 0 : 10,
                              })
                            }
                            className={`px-2 py-0.5 rounded-md text-[11px] font-medium cursor-pointer ${
                              prod.inStock
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-200 text-stone-600'
                            }`}
                          >
                            {prod.inStock ? 'In Stock' : 'Sold Out'}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => onDeleteProduct(prod.id)}
                            className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Remove product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ARTISANS MANAGEMENT */}
        {activeTab === 'artisans' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Independent Artisan Directory &amp; Applications
              </h3>
              <p className="text-xs text-stone-500">
                Review workshop credentials and spotlight master guild members
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {artisans.map((art) => (
                <div key={art.id} className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={art.avatarUrl}
                          alt={art.name}
                          className="w-12 h-12 rounded-full object-cover border border-stone-200"
                        />
                        <div>
                          <div className="font-serif font-bold text-base text-stone-900">{art.name}</div>
                          <div className="text-xs text-stone-500">{art.brandName} · {art.location.city}</div>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                        art.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {art.isApproved ? 'Verified Guild' : 'Pending Review'}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                      {art.bio}
                    </p>

                    <div className="text-[11px] text-stone-500 space-y-1 mb-4">
                      <div><strong className="text-stone-700">Specialty:</strong> {art.craftSpecialty}</div>
                      <div><strong className="text-stone-700">Studio:</strong> {art.location.workshopAddress}</div>
                      <div><strong className="text-stone-700">Technique:</strong> {art.heritageTechnique}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onToggleFeatureArtisan(art.id)}
                      className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        art.featured
                          ? 'bg-amber-800 text-white border-amber-800'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      {art.featured ? 'Featured on Homepage ★' : 'Feature Maker'}
                    </button>

                    {!art.isApproved && (
                      <button
                        onClick={() => onApproveArtisan(art.id)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Approve Application
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMER SUPPORT TOOLS */}
        {activeTab === 'support' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tickets list */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-stone-200">
                <h3 className="font-serif text-base font-bold text-stone-900">
                  Customer Tickets ({supportTickets.length})
                </h3>
              </div>

              <div className="divide-y divide-stone-100 max-h-[500px] overflow-y-auto">
                {supportTickets.map((tkt) => (
                  <button
                    key={tkt.id}
                    onClick={() => setSelectedTicketId(tkt.id)}
                    className={`w-full text-left p-3.5 hover:bg-stone-50 transition-colors cursor-pointer block ${
                      selectedTicketId === tkt.id ? 'bg-amber-50/70 border-l-4 border-amber-800' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                      <span className="font-semibold text-stone-700">{tkt.customerName}</span>
                      <span>{tkt.date}</span>
                    </div>
                    <div className="text-xs font-bold text-stone-900 line-clamp-1 mb-1">
                      {tkt.subject}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-stone-500 uppercase">{tkt.category}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        tkt.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {tkt.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket Conversation Detail */}
            <div className="md:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between p-6">
              {selectedTicket ? (
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-amber-800 font-semibold">
                          {selectedTicket.category}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-stone-900">
                          {selectedTicket.subject}
                        </h3>
                        <p className="text-xs text-stone-500">
                          From: {selectedTicket.customerName} ({selectedTicket.email})
                        </p>
                      </div>

                      {selectedTicket.status !== 'resolved' && (
                        <button
                          onClick={() => onResolveTicket(selectedTicket.id)}
                          className="px-3 py-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          Mark as Resolved ✓
                        </button>
                      )}
                    </div>

                    {/* Replies feed */}
                    <div className="py-4 space-y-3 max-h-[300px] overflow-y-auto">
                      {selectedTicket.replies.map((rep, idx) => (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-xl text-xs max-w-lg ${
                            rep.sender === 'artisan_support'
                              ? 'ml-auto bg-stone-900 text-white'
                              : 'mr-auto bg-stone-100 text-stone-800'
                          }`}
                        >
                          <div className="text-[10px] opacity-70 mb-1">
                            {rep.sender === 'artisan_support' ? 'Guild Support Officer' : selectedTicket.customerName} · {rep.timestamp}
                          </div>
                          <p className="leading-relaxed">{rep.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reply Input */}
                  <form onSubmit={handleSendReply} className="pt-4 border-t border-stone-200 flex gap-2">
                    <input
                      type="text"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type response to customer..."
                      className="flex-1 text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-800 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-16 text-stone-400 text-xs">
                  Select a support inquiry to read and respond
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-4">
              Add New Handcrafted Item
            </h3>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Craft Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Hand-Carved Sheesham Spice Box"
                  className="w-full p-2.5 rounded-lg border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-stone-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Inventory Qty</label>
                  <input
                    type="number"
                    required
                    value={newInventory}
                    onChange={(e) => setNewInventory(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-stone-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CraftCategory)}
                    className="w-full p-2.5 rounded-lg border border-stone-300"
                  >
                    <option value="pottery">Pottery</option>
                    <option value="textiles">Textiles</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="woodwork">Woodwork</option>
                    <option value="candles">Candles</option>
                    <option value="leather">Leather</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Assign Maker</label>
                  <select
                    value={newArtisanId}
                    onChange={(e) => setNewArtisanId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300"
                  >
                    {artisans.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Details on the wood origin, glaze, or weaving technique..."
                  className="w-full p-2.5 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Materials (comma separated)</label>
                <input
                  type="text"
                  value={newMaterials}
                  onChange={(e) => setNewMaterials(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Add Craft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
