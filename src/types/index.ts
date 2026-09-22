export type CraftCategory =
  | 'pottery'
  | 'textiles'
  | 'jewelry'
  | 'woodwork'
  | 'candles'
  | 'leather';

export interface Artisan {
  id: string;
  name: string;
  brandName: string;
  craftSpecialty: string;
  category: CraftCategory;
  avatarUrl: string;
  coverUrl: string;
  bio: string;
  story: string;
  location: {
    city: string;
    state: string;
    country: string;
    workshopAddress: string;
    neighborhood: string;
    acceptsStudioVisits: boolean;
    lat: number;
    lng: number;
  };
  rating: number;
  reviewsCount: number;
  followerCount: number;
  yearsPracticing: number;
  heritageTechnique: string;
  sustainabilityTags: string[];
  socialLinks: {
    instagram?: string;
    website?: string;
    phone?: string;
    email?: string;
  };
  featured: boolean;
  isApproved: boolean;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  location?: string;
}

export interface Product {
  id: string;
  title: string;
  artisanId: string;
  artisanName: string;
  artisanLocation: string;
  category: CraftCategory;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  fullStory: string;
  materials: string[];
  sustainabilityTags: string[];
  inStock: boolean;
  inventory: number;
  rating: number;
  reviewsCount: number;
  dimensions?: string;
  weight?: string;
  careInstructions?: string;
  shippingInfo: {
    leadTime: string;
    shipsFrom: string;
    shippingCost: number;
    freeShippingThreshold: number;
    packaging: string;
  };
  reviews: Review[];
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
}

export type OrderStatus =
  | 'confirmed'
  | 'artisan_crafting'
  | 'packed'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  label: string;
  date: string;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: 'card' | 'upi' | 'razorpay' | 'paypal' | 'cod';
  paymentStatus: 'paid' | 'pending';
  trackingStatus: OrderStatus;
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  statusHistory: OrderStatusHistoryItem[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  category: string;
  date: string;
  coverImage: string;
  tags: string[];
}

export interface WorkshopEvent {
  id: string;
  title: string;
  artisanId: string;
  artisanName: string;
  artisanAvatar: string;
  date: string;
  time: string;
  locationType: 'in-person' | 'online';
  locationName: string;
  price: number;
  totalSeats: number;
  bookedSeats: number;
  description: string;
  materialsIncluded: string[];
  skillLevel: 'Beginner' | 'Intermediate' | 'All Levels';
  category: CraftCategory;
}

export interface SupportTicket {
  id: string;
  customerName: string;
  email: string;
  subject: string;
  category: 'Order Status' | 'Custom Commission' | 'Artisan Support' | 'Returns & Care';
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  date: string;
  replies: {
    sender: 'customer' | 'artisan_support';
    message: string;
    timestamp: string;
  }[];
}

export type MessageInquiryType =
  | 'custom_commission'
  | 'custom_sizing'
  | 'custom_finish'
  | 'bulk_order'
  | 'care_materials'
  | 'studio_visit'
  | 'general_question';

export interface ChatMessage {
  id: string;
  sender: 'patron' | 'artisan';
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  attachment?: {
    type: 'product_reference' | 'custom_spec' | 'photo_sketch';
    title: string;
    image?: string;
    details?: string;
  };
}

export interface ArtisanConversation {
  id: string;
  artisanId: string;
  artisanName: string;
  artisanAvatar: string;
  artisanBrand: string;
  artisanCity: string;
  productId?: string;
  productTitle?: string;
  productImage?: string;
  productPrice?: number;
  inquiryType: MessageInquiryType;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: 'active' | 'in_discussion' | 'quote_sent' | 'commission_confirmed' | 'closed';
  unreadCount: number;
  lastUpdated: string;
  messages: ChatMessage[];
  customSpecs?: {
    dimensions?: string;
    materialPreference?: string;
    budget?: string;
    targetDate?: string;
    quantity?: number;
    notes?: string;
  };
}
