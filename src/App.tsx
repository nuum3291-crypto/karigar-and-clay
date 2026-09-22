import React, { useState, useMemo, useEffect } from 'react';
import {
  INITIAL_PRODUCTS,
  INITIAL_ARTISANS,
  INITIAL_ORDERS,
  INITIAL_BLOG_POSTS,
  INITIAL_WORKSHOPS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_CONVERSATIONS,
} from './data/mockData';
import { Product, Artisan, Order, BlogPost, WorkshopEvent, SupportTicket, CraftCategory, OrderStatus, ArtisanConversation, MessageInquiryType } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ArtisanProfileModal } from './components/ArtisanProfileModal';
import { DirectMessageModal } from './components/DirectMessageModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { BlogCommunity } from './components/BlogCommunity';
import { WorkshopsSection } from './components/WorkshopsSection';
import { JoinArtisanModal } from './components/JoinArtisanModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AnimateCraftModal } from './components/AnimateCraftModal';
import { Footer } from './components/Footer';
import {
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
  Check,
  Heart,
  MapPin,
  ChevronLeft,
  Film
} from 'lucide-react';

const CATEGORIES: { id: CraftCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Crafts' },
  { id: 'pottery', label: 'Terracotta & Ceramics' },
  { id: 'textiles', label: 'Indigo & Khadi Textiles' },
  { id: 'jewelry', label: 'Hammered Brass Jewelry' },
  { id: 'woodwork', label: 'Reclaimed Woodwork' },
  { id: 'candles', label: 'Himalayan Candles' },
  { id: 'leather', label: 'Veg-Tanned Leather' },
];

const SUSTAINABILITY_FILTERS = [
  'Zero Waste',
  'Natural Dyes',
  'Plastic-Free',
  '100% Recycled Metal',
  'Fair Trade',
  'Reclaimed Architectural Timber',
];

export default function App() {
  // Primary datasets
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kc_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [artisans, setArtisans] = useState<Artisan[]>(() => {
    const saved = localStorage.getItem('kc_artisans');
    return saved ? JSON.parse(saved) : INITIAL_ARTISANS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('kc_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('kc_tickets');
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT_TICKETS;
  });

  // Direct Messaging Conversations
  const [conversations, setConversations] = useState<ArtisanConversation[]>(() => {
    const saved = localStorage.getItem('kc_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  // User state
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>(() => {
    const saved = localStorage.getItem('kc_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('kc_wishlist');
    return saved ? JSON.parse(saved) : ['prod-1', 'prod-3'];
  });

  // Persistent storage effects
  useEffect(() => {
    localStorage.setItem('kc_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kc_artisans', JSON.stringify(artisans));
  }, [artisans]);

  useEffect(() => {
    localStorage.setItem('kc_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('kc_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  useEffect(() => {
    localStorage.setItem('kc_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('kc_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('kc_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'shop' | 'artisans' | 'workshops' | 'blog' | 'track'>('shop');
  const [isAdminView, setIsAdminView] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState<CraftCategory | 'all'>('all');
  const [priceRange, setPriceRange] = useState<number>(150);
  const [selectedSustainability, setSelectedSustainability] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'price-low' | 'price-high'>('featured');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [onlyWishlist, setOnlyWishlist] = useState(false);

  // Active Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedArtisanId, setSelectedArtisanId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingLookupNumber, setTrackingLookupNumber] = useState<string | undefined>(undefined);
  const [isJoinArtisanOpen, setIsJoinArtisanOpen] = useState(false);

  // Direct Messaging Modal State
  const [isDirectMessageOpen, setIsDirectMessageOpen] = useState(false);
  const [directMessageArtisan, setDirectMessageArtisan] = useState<Artisan | null>(null);
  const [directMessageProduct, setDirectMessageProduct] = useState<Product | null>(null);
  const [directMessageInquiryType, setDirectMessageInquiryType] = useState<MessageInquiryType>('custom_sizing');

  // Veo Video Animation Studio Modal State
  const [isAnimateCraftOpen, setIsAnimateCraftOpen] = useState(false);
  const [animateCraftProduct, setAnimateCraftProduct] = useState<Product | null>(null);

  const handleOpenAnimateCraft = (product?: Product | null) => {
    setAnimateCraftProduct(product || products[0] || null);
    setIsAnimateCraftOpen(true);
  };

  const totalUnreadMessages = useMemo(() => {
    return conversations.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);
  }, [conversations]);

  const handleOpenDirectMessage = (
    artisanId: string,
    product?: Product | null,
    inquiryType: MessageInquiryType = 'custom_sizing'
  ) => {
    const artisan = artisans.find((a) => a.id === artisanId) || artisans[0];
    setDirectMessageArtisan(artisan);
    setDirectMessageProduct(product || null);
    setDirectMessageInquiryType(inquiryType);
    setIsDirectMessageOpen(true);
  };

  const handleSendMessage = (
    conversationId: string,
    messageText: string,
    sender: 'patron' | 'artisan' = 'patron',
    inquiryType?: MessageInquiryType,
    customSpecs?: any
  ) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const newMsg = {
            id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            sender,
            senderName: sender === 'patron' ? c.customerName || 'Patron' : c.artisanName,
            senderAvatar: sender === 'artisan' ? c.artisanAvatar : undefined,
            text: messageText,
            timestamp: 'Just now',
          };
          return {
            ...c,
            inquiryType: inquiryType || c.inquiryType,
            lastUpdated: 'Just now',
            messages: [...c.messages, newMsg],
            customSpecs: customSpecs ? { ...c.customSpecs, ...customSpecs } : c.customSpecs,
          };
        }
        return c;
      })
    );
  };

  const handleCreateConversation = (
    newConvData: Omit<ArtisanConversation, 'id' | 'unreadCount' | 'lastUpdated'>,
    firstMessageText: string
  ): string => {
    const newId = 'conv-' + Date.now();
    const initialMsg = {
      id: 'msg-' + Date.now(),
      sender: 'patron' as const,
      senderName: newConvData.customerName || 'Patron',
      text: firstMessageText,
      timestamp: 'Just now',
      attachment: newConvData.productTitle
        ? {
            type: 'product_reference' as const,
            title: `${newConvData.productTitle} ($${newConvData.productPrice || ''})`,
            image: newConvData.productImage,
            details: newConvData.customSpecs?.dimensions
              ? `Custom dimensions requested: ${newConvData.customSpecs.dimensions}`
              : undefined,
          }
        : undefined,
    };

    const completeConv: ArtisanConversation = {
      ...newConvData,
      id: newId,
      unreadCount: 0,
      lastUpdated: 'Just now',
      messages: [initialMsg],
    };

    setConversations((prev) => [completeConv, ...prev]);
    return newId;
  };

  // Carousel index for Featured Artisans
  const [artisanCarouselIdx, setArtisanCarouselIdx] = useState(0);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Filtered Products Logic
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Wishlist tab filter
      if (onlyWishlist && !wishlistIds.includes(prod.id)) return false;

      // Category filter
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) return false;

      // City filter
      if (selectedCity !== 'All') {
        const artisan = artisans.find((a) => a.id === prod.artisanId);
        if (!artisan || artisan.location.city.toLowerCase() !== selectedCity.toLowerCase()) {
          return false;
        }
      }

      // Price filter
      if (prod.price > priceRange) return false;

      // Sustainability tags filter
      if (selectedSustainability.length > 0) {
        const hasTag = selectedSustainability.some((tag) =>
          prod.sustainabilityTags.some((pt) => pt.toLowerCase().includes(tag.toLowerCase()))
        );
        if (!hasTag) return false;
      }

      // Keyword search (products, artisans, materials)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = prod.title.toLowerCase().includes(q);
        const matchesArtisan = prod.artisanName.toLowerCase().includes(q);
        const matchesLocation = prod.artisanLocation.toLowerCase().includes(q);
        const matchesMaterials = prod.materials.some((m) => m.toLowerCase().includes(q));
        const matchesDesc = prod.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesArtisan && !matchesLocation && !matchesMaterials && !matchesDesc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [
    products,
    artisans,
    selectedCategory,
    selectedCity,
    priceRange,
    selectedSustainability,
    searchQuery,
    sortBy,
    onlyWishlist,
    wishlistIds,
  ]);

  // Active Artisan for profile modal
  const activeArtisan = useMemo(() => {
    return artisans.find((a) => a.id === selectedArtisanId) || null;
  }, [artisans, selectedArtisanId]);

  // Featured Artisans List
  const featuredArtisans = useMemo(() => {
    return artisans.filter((a) => a.featured && a.isApproved);
  }, [artisans]);

  const handleNextArtisan = () => {
    setArtisanCarouselIdx((prev) => (prev + 1) % Math.max(1, featuredArtisans.length));
  };

  const handlePrevArtisan = () => {
    setArtisanCarouselIdx((prev) => (prev - 1 + featuredArtisans.length) % Math.max(1, featuredArtisans.length));
  };

  // Add review handler
  const handleAddReview = (productId: string, reviewData: any) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newReview = {
            id: `rev-${Date.now()}`,
            ...reviewData,
            date: 'Today',
          };
          const updatedReviews = [newReview, ...p.reviews];
          const newAvgRating =
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
          return {
            ...p,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: Number(newAvgRating.toFixed(1)),
          };
        }
        return p;
      })
    );

    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) => {
        if (!prev) return null;
        const newReview = {
          id: `rev-${Date.now()}`,
          ...reviewData,
          date: 'Today',
        };
        const updatedReviews = [newReview, ...prev.reviews];
        return {
          ...prev,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
        };
      });
    }
  };

  // Admin Operations Handlers
  const handleAddProductAdmin = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProductAdmin = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const handleDeleteProductAdmin = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleUpdateOrderStatusAdmin = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const newHist = [
            ...ord.statusHistory,
            {
              status,
              label: status.replace('_', ' ').toUpperCase(),
              date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              note: `Status updated to ${status.replace('_', ' ')} by guild administration.`,
            },
          ];
          return {
            ...ord,
            trackingStatus: status,
            statusHistory: newHist,
          };
        }
        return ord;
      })
    );
  };

  const handleApproveArtisanAdmin = (artisanId: string) => {
    setArtisans((prev) =>
      prev.map((a) => (a.id === artisanId ? { ...a, isApproved: true } : a))
    );
  };

  const handleToggleFeatureArtisanAdmin = (artisanId: string) => {
    setArtisans((prev) =>
      prev.map((a) => (a.id === artisanId ? { ...a, featured: !a.featured } : a))
    );
  };

  const handleReplyTicketAdmin = (ticketId: string, message: string) => {
    setSupportTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'in_progress',
            replies: [
              ...t.replies,
              {
                sender: 'artisan_support',
                message,
                timestamp: 'Just now',
              },
            ],
          };
        }
        return t;
      })
    );
  };

  const handleResolveTicketAdmin = (ticketId: string) => {
    setSupportTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'resolved' } : t))
    );
  };

  // Join as an Artisan submission
  const handleJoinArtisanApplication = (data: any) => {
    const newArtisan: Artisan = {
      ...data,
      id: `artisan-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      followerCount: 1,
      featured: false,
      isApproved: false,
    };
    setArtisans((prev) => [newArtisan, ...prev]);
  };

  const handleOpenTrackingDirect = (code: string) => {
    setTrackingLookupNumber(code);
    setIsTrackingOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setOnlyWishlist(false);
        }}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => {
          setOnlyWishlist(true);
          setActiveTab('shop');
        }}
        isAdminView={isAdminView}
        onToggleAdminView={() => setIsAdminView(!isAdminView)}
        selectedCity={selectedCity}
        onSelectCity={(city) => {
          setSelectedCity(city);
          setActiveTab('shop');
        }}
        onOpenJoinArtisan={() => setIsJoinArtisanOpen(true)}
        onOpenMessages={() => handleOpenDirectMessage(artisans[0]?.id || 'artisan-1', null, 'general_question')}
        unreadMessagesCount={totalUnreadMessages}
        onOpenAnimateCraft={() => handleOpenAnimateCraft()}
      />

      {/* ADMIN STUDIO VIEW */}
      {isAdminView ? (
        <main className="flex-1">
          <AdminDashboard
            products={products}
            artisans={artisans}
            orders={orders}
            supportTickets={supportTickets}
            onAddProduct={handleAddProductAdmin}
            onUpdateProduct={handleUpdateProductAdmin}
            onDeleteProduct={handleDeleteProductAdmin}
            onUpdateOrderStatus={handleUpdateOrderStatusAdmin}
            onApproveArtisan={handleApproveArtisanAdmin}
            onToggleFeatureArtisan={handleToggleFeatureArtisanAdmin}
            onReplyTicket={handleReplyTicketAdmin}
            onResolveTicket={handleResolveTicketAdmin}
          />
        </main>
      ) : (
        /* BUYER STOREFRONT VIEWS */
        <main className="flex-1">
          {/* TRACK ORDER DEDICATED TAB */}
          {activeTab === 'track' && (
            <div className="py-12 max-w-4xl mx-auto px-4">
              <OrderTrackingModal
                isOpen={true}
                onClose={() => setActiveTab('shop')}
                orders={orders}
                initialOrderNumber={trackingLookupNumber}
              />
            </div>
          )}

          {/* ARTISANS DEDICATED TAB */}
          {activeTab === 'artisans' && (
            <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
              <div className="mb-10 text-center max-w-2xl mx-auto">
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-800">
                  Living Lineage &amp; Master Guilds
                </span>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-1">
                  Meet the Artisans Near You
                </h1>
                <p className="text-stone-600 text-sm mt-2">
                  Visit workshops in West Delhi, Jaipur craft colonies, and Saharanpur timber guilds. Direct patronage supports rural livelihood.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {artisans.map((artisan) => (
                  <div
                    key={artisan.id}
                    onClick={() => setSelectedArtisanId(artisan.id)}
                    className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 w-full bg-stone-900 overflow-hidden">
                        <img
                          src={artisan.coverUrl}
                          alt={artisan.name}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 to-transparent" />
                        <div className="absolute bottom-3 left-4 flex items-center gap-3">
                          <img
                            src={artisan.avatarUrl}
                            alt={artisan.name}
                            className="w-12 h-12 rounded-full border-2 border-white object-cover"
                          />
                          <div className="text-white">
                            <h3 className="font-serif font-bold text-base">{artisan.name}</h3>
                            <div className="text-xs text-amber-300">{artisan.brandName}</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs text-stone-500">
                          <span className="flex items-center gap-1 text-stone-700 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-amber-700" />
                            <span>{artisan.location.neighborhood}, {artisan.location.city}</span>
                          </span>
                          <span className="font-mono text-stone-600">{artisan.yearsPracticing} yrs craft</span>
                        </div>

                        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                          {artisan.bio}
                        </p>

                        <div className="pt-2 flex items-center gap-2 text-xs text-stone-500 truncate">
                          <span className="text-stone-700 font-medium">Specialty:</span>
                          <span className="truncate">{artisan.craftSpecialty}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-amber-900">
                        <span>View Studio Map &amp; Works</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WORKSHOPS DEDICATED TAB */}
          {activeTab === 'workshops' && (
            <WorkshopsSection
              workshops={INITIAL_WORKSHOPS}
              onSelectArtisan={(id) => setSelectedArtisanId(id)}
            />
          )}

          {/* BLOG & CRAFT STORIES TAB */}
          {activeTab === 'blog' && (
            <BlogCommunity
              posts={INITIAL_BLOG_POSTS}
              onOpenWorkshopTab={() => setActiveTab('workshops')}
            />
          )}

          {/* MAIN HOMEPAGE & MARKETPLACE TAB */}
          {activeTab === 'shop' && (
            <>
              {/* Feature 1: Hero Banner */}
              <HeroSection
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCity={selectedCity}
                onSelectCity={setSelectedCity}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onShopNow={() => {
                  const el = document.getElementById('marketplace-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                onJoinArtisan={() => setIsJoinArtisanOpen(true)}
                artisanCount={artisans.length}
                onOpenAnimateCraft={() => handleOpenAnimateCraft()}
              />

              {/* Feature 1 & 3: Featured Artisans Carousel / Spotlight */}
              {featuredArtisans.length > 0 && !onlyWishlist && (
                <section className="py-14 bg-[#F5F4EE] border-b border-stone-200">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-800 font-semibold mb-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Heritage Master Spotlight</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                          Featured Artisans of the Season
                        </h2>
                      </div>

                      {/* Carousel controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handlePrevArtisan}
                          className="p-2 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
                          aria-label="Previous maker"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleNextArtisan}
                          className="p-2 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
                          aria-label="Next maker"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Spotlight Card */}
                    {featuredArtisans[artisanCarouselIdx] && (
                      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
                        {/* Artisan Media Left */}
                        <div className="lg:col-span-5 relative min-h-[300px] bg-stone-900">
                          <img
                            src={featuredArtisans[artisanCarouselIdx].avatarUrl}
                            alt={featuredArtisans[artisanCarouselIdx].name}
                            className="w-full h-full object-cover object-center"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <span className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold">
                              {featuredArtisans[artisanCarouselIdx].brandName}
                            </span>
                            <div className="text-lg font-serif font-bold">{featuredArtisans[artisanCarouselIdx].name}</div>
                            <div className="text-xs text-stone-300 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-amber-400" />
                              <span>{featuredArtisans[artisanCarouselIdx].location.neighborhood}, {featuredArtisans[artisanCarouselIdx].location.city}</span>
                            </div>
                          </div>
                        </div>

                        {/* Artisan Story Right */}
                        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-xs text-stone-500">
                              <span className="font-semibold text-amber-800 capitalize">
                                {featuredArtisans[artisanCarouselIdx].category}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono">{featuredArtisans[artisanCarouselIdx].yearsPracticing} Years Practicing</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono">{featuredArtisans[artisanCarouselIdx].rating} ★ ({featuredArtisans[artisanCarouselIdx].reviewsCount} reviews)</span>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 leading-snug">
                              "{featuredArtisans[artisanCarouselIdx].craftSpecialty}"
                            </h3>

                            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                              {featuredArtisans[artisanCarouselIdx].bio}
                            </p>

                            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs text-stone-700">
                              <span className="font-semibold text-stone-900">Lineage Technique: </span>
                              {featuredArtisans[artisanCarouselIdx].heritageTechnique}
                            </div>
                          </div>

                          <div className="pt-6 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
                              <span className="w-2 h-2 rounded-full bg-emerald-600" />
                              <span>{featuredArtisans[artisanCarouselIdx].location.acceptsStudioVisits ? 'Studio Visits Welcome by Appointment' : 'Verified Direct Shipping Guild'}</span>
                            </div>

                            <button
                              onClick={() => setSelectedArtisanId(featuredArtisans[artisanCarouselIdx].id)}
                              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <span>Explore Artisan Profile &amp; Map</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Studio Motion Showcase Banner */}
              <section className="bg-stone-900 text-stone-100 py-8 border-b border-stone-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-800/40 border border-amber-600/40 text-amber-300 flex items-center justify-center shrink-0 shadow-inner">
                      <Film className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-lg text-white">Studio Motion · Watch Crafts Come Alive</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                          Veo 3.1 Fast
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5 max-w-xl">
                        Animate still craft photos into fluid motion — spinning potter's wheels, indigo courtyard breezes, and kiln embers. Export in 16:9 or 9:16.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenAnimateCraft()}
                    className="px-5 py-2.5 bg-amber-700 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl transition-all hover:scale-105 cursor-pointer flex items-center gap-2 shrink-0 shadow-md"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Launch Motion Studio</span>
                  </button>
                </div>
              </section>

              {/* Feature 4: Marketplace Features (Categories, Filters, Grid, Wishlist) */}
              <section id="marketplace-grid" className="py-14 max-w-7xl mx-auto px-4 sm:px-6">
                {/* Category Segmented Tabs (Functional Buttons) */}
                <div className="mb-8">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-stone-900">
                        {onlyWishlist ? 'Your Curated Wishlist' : 'Browse Treasures by Craft Discipline'}
                      </h2>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {onlyWishlist
                          ? 'Pieces you have bookmarked directly from artisan studios'
                          : `Showing ${filteredProducts.length} authentic pieces shaped by verified makers`}
                      </p>
                    </div>

                    {onlyWishlist && (
                      <button
                        onClick={() => setOnlyWishlist(false)}
                        className="text-xs text-amber-800 font-semibold hover:underline cursor-pointer"
                      >
                        Show All Marketplace Items
                      </button>
                    )}
                  </div>

                  {/* Category Buttons Carousel/List */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setOnlyWishlist(false);
                        }}
                        className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer border ${
                          !onlyWishlist && selectedCategory === cat.id
                            ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter and Sort Control Bar */}
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs mb-8 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowFilterDrawer(!showFilterDrawer)}
                      className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                        showFilterDrawer || selectedSustainability.length > 0
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Filters</span>
                      {selectedSustainability.length > 0 && (
                        <span className="w-4 h-4 bg-amber-600 text-white rounded-full text-[10px] flex items-center justify-center font-mono">
                          {selectedSustainability.length}
                        </span>
                      )}
                    </button>

                    {/* Active Filter Clear */}
                    {(selectedCategory !== 'all' || selectedCity !== 'All' || selectedSustainability.length > 0 || searchQuery) && (
                      <button
                        onClick={() => {
                          setSelectedCategory('all');
                          setSelectedCity('All');
                          setSelectedSustainability([]);
                          setSearchQuery('');
                          setPriceRange(150);
                          setOnlyWishlist(false);
                        }}
                        className="text-stone-500 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset All</span>
                      </button>
                    )}
                  </div>

                  {/* Sort by dropdown */}
                  <div className="flex items-center gap-2 text-stone-600">
                    <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                    <span>Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent font-medium text-stone-900 focus:outline-none cursor-pointer"
                    >
                      <option value="featured">Featured Artisans</option>
                      <option value="rating">Top Patron Rating</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                </div>

                {/* Collapsible Filter Drawer */}
                {showFilterDrawer && (
                  <div className="p-5 mb-8 bg-white rounded-xl border border-stone-200 space-y-4 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                      {/* Price Range Slider */}
                      <div>
                        <div className="flex justify-between font-medium text-stone-700 mb-2">
                          <span>Max Price Threshold:</span>
                          <span className="font-mono font-bold text-stone-900">${priceRange}</span>
                        </div>
                        <input
                          type="range"
                          min={20}
                          max={200}
                          step={5}
                          value={priceRange}
                          onChange={(e) => setPriceRange(Number(e.target.value))}
                          className="w-full accent-amber-800"
                        />
                        <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                          <span>$20</span>
                          <span>$200+</span>
                        </div>
                      </div>

                      {/* City / Location Filter */}
                      <div>
                        <span className="block font-medium text-stone-700 mb-2">Artisan Region Near You</span>
                        <div className="flex flex-wrap gap-2">
                          {['All', 'Delhi', 'Jaipur', 'Saharanpur'].map((city) => (
                            <button
                              key={city}
                              onClick={() => setSelectedCity(city)}
                              className={`px-3 py-1 rounded-md text-xs transition-colors cursor-pointer border ${
                                selectedCity === city
                                  ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                              }`}
                            >
                              {city}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sustainability Tags */}
                      <div>
                        <span className="block font-medium text-stone-700 mb-2">Eco &amp; Ethical Pledges</span>
                        <div className="flex flex-wrap gap-1.5">
                          {SUSTAINABILITY_FILTERS.map((tag) => {
                            const isSelected = selectedSustainability.includes(tag);
                            return (
                              <button
                                key={tag}
                                onClick={() => {
                                  setSelectedSustainability((prev) =>
                                    isSelected ? prev.filter((t) => t !== tag) : [...prev, tag]
                                  );
                                }}
                                className={`px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer border ${
                                  isSelected
                                    ? 'bg-amber-900 text-white border-amber-900 font-medium'
                                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                                }`}
                              >
                                {tag}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3-Column / 2-Column Product Grid */}
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelectProduct={(p) => setSelectedProduct(p)}
                        onSelectArtisan={(id) => setSelectedArtisanId(id)}
                        onAddToCart={(p) => handleAddToCart(p, 1)}
                        isWishlisted={wishlistIds.includes(product.id)}
                        onToggleWishlist={handleToggleWishlist}
                        onAnimateProduct={handleOpenAnimateCraft}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 p-8 text-stone-500">
                    <Heart className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                    <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
                      No matching handmade treasures found
                    </h3>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
                      Try clearing filters or switching regions to discover pieces from other village clusters.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedCity('All');
                        setSelectedSustainability([]);
                        setSearchQuery('');
                        setOnlyWishlist(false);
                      }}
                      className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </section>

              {/* Workshops Highlight on Home */}
              <WorkshopsSection
                workshops={INITIAL_WORKSHOPS.slice(0, 3)}
                onSelectArtisan={(id) => setSelectedArtisanId(id)}
              />

              {/* Blog Community on Home */}
              <BlogCommunity
                posts={INITIAL_BLOG_POSTS}
                onOpenWorkshopTab={() => setActiveTab('workshops')}
              />
            </>
          )}
        </main>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderPlaced={(newOrder) => {
          setOrders((prev) => [newOrder, ...prev]);
          setCartItems([]);
        }}
        onOpenTracking={handleOpenTrackingDirect}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => {
          setIsTrackingOpen(false);
          setTrackingLookupNumber(undefined);
        }}
        orders={orders}
        initialOrderNumber={trackingLookupNumber}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          isWishlisted={wishlistIds.includes(selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
          onSelectArtisan={(artisanId) => {
            setSelectedProduct(null);
            setSelectedArtisanId(artisanId);
          }}
          onAddReview={handleAddReview}
          onOpenDirectMessage={handleOpenDirectMessage}
          onOpenAnimateCraft={handleOpenAnimateCraft}
        />
      )}

      {/* Artisan Profile Modal */}
      {activeArtisan && (
        <ArtisanProfileModal
          artisan={activeArtisan}
          products={products}
          onClose={() => setSelectedArtisanId(null)}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToCart={(p) => handleAddToCart(p, 1)}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onOpenDirectMessage={handleOpenDirectMessage}
          hasActiveConversation={conversations.some((c) => c.artisanId === activeArtisan.id)}
          onOpenAnimateCraft={handleOpenAnimateCraft}
        />
      )}

      {/* Veo Video Animation Studio Modal */}
      <AnimateCraftModal
        isOpen={isAnimateCraftOpen}
        onClose={() => setIsAnimateCraftOpen(false)}
        initialProduct={animateCraftProduct}
        catalogProducts={products}
      />

      {/* Direct Messaging Modal */}
      {isDirectMessageOpen && directMessageArtisan && (
        <DirectMessageModal
          isOpen={isDirectMessageOpen}
          onClose={() => {
            setIsDirectMessageOpen(false);
            setDirectMessageProduct(null);
          }}
          artisan={directMessageArtisan}
          product={directMessageProduct}
          initialInquiryType={directMessageInquiryType}
          conversations={conversations}
          onSendMessage={handleSendMessage}
          onCreateConversation={handleCreateConversation}
        />
      )}

      {/* Join as an Artisan Modal */}
      <JoinArtisanModal
        isOpen={isJoinArtisanOpen}
        onClose={() => setIsJoinArtisanOpen(false)}
        onSubmitApplication={handleJoinArtisanApplication}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveTab('shop');
          window.scrollTo({ top: 500, behavior: 'smooth' });
        }}
        onSelectCity={(city) => {
          setSelectedCity(city);
          setActiveTab('shop');
          window.scrollTo({ top: 500, behavior: 'smooth' });
        }}
        onOpenJoinArtisan={() => setIsJoinArtisanOpen(true)}
        onOpenTrackOrder={() => setIsTrackingOpen(true)}
        onOpenWorkshops={() => {
          setActiveTab('workshops');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
