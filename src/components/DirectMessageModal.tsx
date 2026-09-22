import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  Paperclip,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  Package,
  Calendar,
  DollarSign,
  Maximize2,
  Layers,
  MessageSquare,
  ArrowLeft,
  Info,
  ShieldCheck,
} from 'lucide-react';
import {
  Artisan,
  Product,
  ArtisanConversation,
  ChatMessage,
  MessageInquiryType,
} from '../types';

interface DirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  artisan: Artisan;
  product?: Product | null;
  initialInquiryType?: MessageInquiryType;
  conversations: ArtisanConversation[];
  onSendMessage: (
    conversationId: string,
    message: string,
    sender?: 'patron' | 'artisan',
    inquiryType?: MessageInquiryType,
    customSpecs?: any
  ) => void;
  onCreateConversation: (
    newConv: Omit<ArtisanConversation, 'id' | 'unreadCount' | 'lastUpdated'>,
    firstMessageText: string
  ) => string; // returns created ID
}

const INQUIRY_TYPES: { id: MessageInquiryType; label: string; icon: string; description: string }[] = [
  {
    id: 'custom_sizing',
    label: 'Custom Sizing',
    icon: '📐',
    description: 'Request custom dimensions or proportions to fit your home space',
  },
  {
    id: 'custom_finish',
    label: 'Custom Color / Glaze',
    icon: '🎨',
    description: 'Ask for specific natural earth pigments, finishes, or shade variations',
  },
  {
    id: 'custom_commission',
    label: 'Bespoke Commission',
    icon: '🛠️',
    description: 'Collaborate with the master craftsperson on an entirely new custom piece',
  },
  {
    id: 'bulk_order',
    label: 'Bulk / Event Registry',
    icon: '📦',
    description: 'Inquire for wedding favors, corporate gifting, or restaurant tableware sets',
  },
  {
    id: 'studio_visit',
    label: 'Studio Visit / Pickup',
    icon: '🏛️',
    description: 'Schedule a visit to see the artisan studio or arrange direct local pickup',
  },
  {
    id: 'care_materials',
    label: 'Materials & Care',
    icon: '🌿',
    description: 'Questions regarding clay safety, natural dye wash, or wood maintenance',
  },
  {
    id: 'general_question',
    label: 'General Inquiry',
    icon: '💬',
    description: 'Any other question regarding the heritage technique or maker lineage',
  },
];

const SUGGESTED_QUESTIONS: Record<MessageInquiryType, string[]> = {
  custom_sizing: [
    'Can this piece be crafted in a larger dimension (approx 14"-16")?',
    'Could you share the maximum size that your kiln / loom can accommodate?',
    'What would the price difference be for custom height specifications?',
  ],
  custom_finish: [
    'Is it possible to request a deep smoked matte black finish?',
    'Can you dye this with an extra-deep dark indigo dip?',
    'Do you offer an unglazed raw natural riverbed clay option?',
  ],
  custom_commission: [
    'Namaste! I would love to commission a bespoke heirloom piece for our home.',
    'Could we discuss a one-of-a-kind creation inspired by your traditional techniques?',
    'What is your typical turnaround timeline for a bespoke commission?',
  ],
  bulk_order: [
    'We are planning wedding gifts for 25 guests. Do you offer personalized packaging?',
    'What is the lead time for crafting a batch of 12 matching pieces?',
    'Do you provide custom hand-stamped guild certificates for corporate gifting?',
  ],
  studio_visit: [
    'Namaste! Can I visit your studio workshop this weekend to observe the craft?',
    'Is direct studio pickup available for this order to avoid shipping?',
    'Do you host private pottery wheel / handloom demonstrations?',
  ],
  care_materials: [
    'Is this terracotta piece safe for hot liquids and daily food serving?',
    'How should I care for this natural indigo dyed textile to prevent crocking?',
    'Is the reclaimed haveli timber treated with food-grade organic oils?',
  ],
  general_question: [
    'How long does the firing and curing process take for each batch?',
    'Can you share more about the generational lineage behind this design?',
    'When will the next small-batch release be ready?',
  ],
};

export const DirectMessageModal: React.FC<DirectMessageModalProps> = ({
  isOpen,
  onClose,
  artisan,
  product,
  initialInquiryType = 'custom_sizing',
  conversations,
  onSendMessage,
  onCreateConversation,
}) => {
  if (!isOpen) return null;

  // Find existing conversation for this artisan and (optionally) product
  const existingConv = conversations.find(
    (c) => c.artisanId === artisan.id && (!product || c.productId === product.id)
  ) || conversations.find((c) => c.artisanId === artisan.id);

  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    existingConv ? existingConv.id : null
  );

  // Form states for creating or configuring inquiry
  const [selectedInquiryType, setSelectedInquiryType] = useState<MessageInquiryType>(
    initialInquiryType || 'custom_sizing'
  );
  const [patronName, setPatronName] = useState(() => {
    return localStorage.getItem('kc_patron_name') || 'Ananya Sharma';
  });
  const [patronEmail, setPatronEmail] = useState(() => {
    return localStorage.getItem('kc_patron_email') || 'ananya.s@example.com';
  });
  const [patronPhone, setPatronPhone] = useState(() => {
    return localStorage.getItem('kc_patron_phone') || '+91 98101 23456';
  });

  // Custom Specs Accordion
  const [showSpecsForm, setShowSpecsForm] = useState(
    selectedInquiryType === 'custom_sizing' || selectedInquiryType === 'custom_commission'
  );
  const [customDimensions, setCustomDimensions] = useState('');
  const [customMaterial, setCustomMaterial] = useState('');
  const [customBudget, setCustomBudget] = useState('');
  const [customTargetDate, setCustomTargetDate] = useState('');
  const [customQuantity, setCustomQuantity] = useState(1);

  // Message compose
  const [messageText, setMessageText] = useState('');
  const [isTypingArtisan, setIsTypingArtisan] = useState(false);
  const [attachedRefPhoto, setAttachedRefPhoto] = useState<string | null>(null);
  const [showConvSwitcher, setShowConvSwitcher] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Current active conversation object
  const activeConv = conversations.find((c) => c.id === activeConversationId);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, isTypingArtisan]);

  // Keep patron info saved in localStorage
  useEffect(() => {
    if (patronName) localStorage.setItem('kc_patron_name', patronName);
    if (patronEmail) localStorage.setItem('kc_patron_email', patronEmail);
    if (patronPhone) localStorage.setItem('kc_patron_phone', patronPhone);
  }, [patronName, patronEmail, patronPhone]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const textToSend = messageText.trim();
    if (!textToSend && !attachedRefPhoto) return;

    if (!activeConversationId || !activeConv) {
      // Create new conversation
      const newConvData: Omit<ArtisanConversation, 'id' | 'unreadCount' | 'lastUpdated'> = {
        artisanId: artisan.id,
        artisanName: artisan.name,
        artisanAvatar: artisan.avatarUrl,
        artisanBrand: artisan.brandName,
        artisanCity: artisan.location.city,
        productId: product?.id,
        productTitle: product?.title,
        productImage: product?.images[0],
        productPrice: product?.price,
        inquiryType: selectedInquiryType,
        customerName: patronName || 'Patron',
        customerEmail: patronEmail || 'patron@example.com',
        customerPhone: patronPhone,
        status: 'active',
        customSpecs: {
          dimensions: customDimensions || undefined,
          materialPreference: customMaterial || undefined,
          budget: customBudget || undefined,
          targetDate: customTargetDate || undefined,
          quantity: customQuantity || 1,
        },
        messages: [],
      };

      const createdId = onCreateConversation(newConvData, textToSend);
      setActiveConversationId(createdId);
      setMessageText('');
      setAttachedRefPhoto(null);

      // Simulate realistic artisan acknowledgment
      triggerArtisanResponse(createdId, textToSend, artisan, product);
    } else {
      // Append to existing conversation
      onSendMessage(activeConversationId, textToSend, 'patron', selectedInquiryType, {
        dimensions: customDimensions,
        budget: customBudget,
        quantity: customQuantity,
      });
      setMessageText('');
      setAttachedRefPhoto(null);

      // Simulate realistic artisan follow-up
      triggerArtisanResponse(activeConversationId, textToSend, artisan, product);
    }
  };

  const triggerArtisanResponse = (
    convId: string,
    customerMsg: string,
    targetArtisan: Artisan,
    targetProd?: Product | null
  ) => {
    setIsTypingArtisan(true);
    setTimeout(() => {
      setIsTypingArtisan(false);

      // Generate contextually authentic artisan response
      let artisanReply = '';
      const lower = customerMsg.toLowerCase();

      if (lower.includes('size') || lower.includes('dimension') || lower.includes('inch')) {
        artisanReply = `Namaste ${patronName.split(' ')[0]} ji! Thank you for inquiring with ${targetArtisan.brandName}. Modifying sizes is well within our craft traditions. Because each piece is hand-shaped, custom sizing requires approximately 8–12 days to shape, burnish, and thoroughly cure before firing. I would be glad to draft exact specs for you.`;
      } else if (lower.includes('visit') || lower.includes('studio') || lower.includes('pickup')) {
        artisanReply = `Pranam! You are most welcome at our workshop in ${targetArtisan.location.neighborhood}, ${targetArtisan.location.city}. We welcome visitors Tuesday through Saturday from 11:00 AM to 4:00 PM. Please bring a copy of this message or quote and we will show you our live crafting processes!`;
      } else if (lower.includes('bulk') || lower.includes('wedding') || lower.includes('corporate') || lower.includes('gift')) {
        artisanReply = `Namaste! We cherish crafting bulk sets for auspicious occasions and special gatherings. We can provide personalized hand-stamped terracotta seals and cotton packaging. Let us know the final date so we can schedule our kiln and loom runs accordingly!`;
      } else if (lower.includes('color') || lower.includes('glaze') || lower.includes('finish') || lower.includes('dye')) {
        artisanReply = `Thank you for asking about our finishes! All our colors are naturally derived—using wild wood-ash, iron-sand slip, and botanical extracts. We can tailor the glaze tone from deep smoked charcoal to warm sun-baked terracotta.`;
      } else {
        artisanReply = `Namaste ${patronName.split(' ')[0]} ji! Master ${targetArtisan.name.split(' ')[0]} has received your message regarding ${targetProd ? targetProd.title : targetArtisan.craftSpecialty}. Our studio team is reviewing your inquiry and will send over detailed estimates and sketches shortly!`;
      }

      onSendMessage(convId, artisanReply, 'artisan');
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 text-stone-900 overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="px-5 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={artisan.avatarUrl}
                alt={artisan.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-amber-400"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-stone-900" title="Active in studio" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-white">{artisan.name}</h3>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-800 text-amber-300 font-medium">
                  {artisan.brandName}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-400 mt-0.5">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Studio Active</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-400" />
                  <span>Replies in ~2h</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{artisan.location.city}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {conversations.length > 1 && (
              <button
                onClick={() => setShowConvSwitcher(!showConvSwitcher)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="View other conversations"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Conversations ({conversations.length})</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close direct messaging"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONVERSATION SWITCHER DROPDOWN */}
        {showConvSwitcher && (
          <div className="p-3 bg-stone-100 border-b border-stone-200 text-xs">
            <span className="font-semibold text-stone-700 block mb-2">Switch Conversation Thread:</span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveConversationId(c.id);
                    setShowConvSwitcher(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg border transition-colors flex items-center justify-between cursor-pointer ${
                    activeConversationId === c.id
                      ? 'bg-amber-100 border-amber-300 font-semibold text-amber-950'
                      : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-800'
                  }`}
                >
                  <div className="truncate">
                    <span className="font-bold">{c.artisanName}</span>
                    {c.productTitle && <span className="text-stone-500 ml-1.5 truncate">({c.productTitle})</span>}
                  </div>
                  <span className="text-[11px] text-stone-500 shrink-0 ml-2 font-mono capitalize">
                    {c.inquiryType.replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ATTACHED PRODUCT OR ARTISAN CONTEXT BANNER */}
        <div className="bg-[#F8F7F2] px-5 py-3 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {product ? (
            <div className="flex items-center gap-3">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-10 h-10 rounded-md object-cover border border-stone-200 shrink-0"
              />
              <div>
                <div className="text-[10px] uppercase font-semibold text-amber-800 tracking-wider">
                  Referenced Craft Piece
                </div>
                <div className="font-serif font-bold text-stone-900 truncate max-w-xs sm:max-w-md">
                  {product.title}
                </div>
              </div>
              <div className="font-mono font-bold text-stone-900 ml-auto sm:ml-2">
                ${product.price}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-stone-700">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>
                Direct craft commission &amp; studio inquiries for{' '}
                <strong className="text-stone-900">{artisan.craftSpecialty}</strong>
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-[11px] text-stone-500 ml-auto">
            <span className="capitalize font-medium text-amber-900">
              Type: {selectedInquiryType.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* MAIN BODY: SPLIT OR ACTIVE CHAT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* If no conversation is active yet, or user is configuring inquiry */}
          {(!activeConv || activeConv.messages.length === 0) && (
            <div className="space-y-4">
              {/* Inquiry Type Pills */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  What would you like to inquire about?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {INQUIRY_TYPES.map((type) => {
                    const isSelected = selectedInquiryType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => {
                          setSelectedInquiryType(type.id);
                          if (type.id === 'custom_sizing' || type.id === 'custom_commission' || type.id === 'bulk_order') {
                            setShowSpecsForm(true);
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-900 text-white border-amber-900 shadow-xs ring-2 ring-amber-800/20'
                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <div className="text-base mb-1">{type.icon}</div>
                        <div className="text-xs font-bold leading-snug">{type.label}</div>
                        <div className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? 'text-amber-200' : 'text-stone-500'}`}>
                          {type.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Order Specifications (Collapsible) */}
              <div className="border border-amber-200/80 bg-amber-50/40 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowSpecsForm(!showSpecsForm)}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold text-amber-950 hover:bg-amber-100/50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-700" />
                    <span>Custom Specifications (Dimensions, Budget &amp; Timeline)</span>
                  </span>
                  {showSpecsForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showSpecsForm && (
                  <div className="p-4 pt-1 space-y-3 text-xs border-t border-amber-200/50">
                    <p className="text-[11px] text-stone-600">
                      Provide details to help {artisan.name} estimate raw materials, clay shrinkage, and loom scheduling.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-600 font-medium mb-1">Desired Dimensions / Sizing</label>
                        <input
                          type="text"
                          value={customDimensions}
                          onChange={(e) => setCustomDimensions(e.target.value)}
                          placeholder="e.g. 14-inch diameter, 5-inch depth"
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-800 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-600 font-medium mb-1">Target Budget Range</label>
                        <input
                          type="text"
                          value={customBudget}
                          onChange={(e) => setCustomBudget(e.target.value)}
                          placeholder="e.g. $75 – $110"
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-800 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-600 font-medium mb-1">Target Delivery / Needed By</label>
                        <input
                          type="text"
                          value={customTargetDate}
                          onChange={(e) => setCustomTargetDate(e.target.value)}
                          placeholder="e.g. Within 3 weeks / Before festival"
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-800 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-600 font-medium mb-1">Quantity Needed</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            max={500}
                            value={customQuantity}
                            onChange={(e) => setCustomQuantity(Number(e.target.value))}
                            className="w-24 p-2 bg-white border border-stone-300 rounded-lg text-xs font-mono font-bold focus:ring-1 focus:ring-amber-800 focus:outline-none"
                          />
                          <span className="text-[11px] text-stone-500">units handcrafted</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Patron Contact details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={patronName}
                    onChange={(e) => setPatronName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Email / Phone for Guild Updates</label>
                  <input
                    type="email"
                    required
                    value={patronEmail}
                    onChange={(e) => setPatronEmail(e.target.value)}
                    placeholder="e.g. ananya@example.com"
                    className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-800 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE CHAT THREAD (if conversation exists) */}
          {activeConv && activeConv.messages.length > 0 && (
            <div className="space-y-4">
              {/* Conversation summary header badge */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-900">Inquiry Thread:</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-medium capitalize text-[11px]">
                    {activeConv.inquiryType.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-stone-500 text-[11px]">
                  <span>Status:</span>
                  <span className="font-semibold text-emerald-700 capitalize">
                    {activeConv.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Custom specs note if attached */}
              {activeConv.customSpecs?.dimensions && (
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs space-y-1">
                  <span className="font-bold text-amber-950 flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Custom Specifications Recorded:</span>
                  </span>
                  <div className="text-stone-700 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                    {activeConv.customSpecs.dimensions && (
                      <span><strong>Dimensions:</strong> {activeConv.customSpecs.dimensions}</span>
                    )}
                    {activeConv.customSpecs.budget && (
                      <span><strong>Budget:</strong> {activeConv.customSpecs.budget}</span>
                    )}
                    {activeConv.customSpecs.quantity && (
                      <span><strong>Qty:</strong> {activeConv.customSpecs.quantity}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Messages list */}
              <div className="space-y-3 pt-2">
                {activeConv.messages.map((msg) => {
                  const isPatron = msg.sender === 'patron';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${isPatron ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isPatron && (
                        <img
                          src={artisan.avatarUrl}
                          alt={artisan.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 border border-amber-300 mt-1"
                        />
                      )}

                      <div
                        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-2xs ${
                          isPatron
                            ? 'bg-amber-900 text-white rounded-tr-xs'
                            : 'bg-stone-100 text-stone-900 rounded-tl-xs border border-stone-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 text-[10px] mb-1 opacity-75">
                          <span className="font-semibold">{msg.senderName}</span>
                          <span>{msg.timestamp}</span>
                        </div>

                        {/* Message Attachment Preview if any */}
                        {msg.attachment && (
                          <div className={`mb-2.5 p-2 rounded-lg border text-[11px] ${
                            isPatron
                              ? 'bg-amber-950/40 border-amber-700/50 text-amber-100'
                              : 'bg-white border-stone-300 text-stone-800'
                          }`}>
                            <div className="flex items-center gap-2">
                              {msg.attachment.image && (
                                <img
                                  src={msg.attachment.image}
                                  alt=""
                                  className="w-9 h-9 rounded object-cover"
                                />
                              )}
                              <div>
                                <div className="font-bold">{msg.attachment.title}</div>
                                {msg.attachment.details && (
                                  <div className="text-[10px] opacity-80">{msg.attachment.details}</div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}

                {/* Artisan Typing Indicator */}
                {isTypingArtisan && (
                  <div className="flex gap-3 items-center text-xs text-stone-500 italic animate-pulse">
                    <img
                      src={artisan.avatarUrl}
                      alt={artisan.name}
                      className="w-7 h-7 rounded-full object-cover border border-amber-300"
                    />
                    <span>{artisan.name} is drafting a response from the studio wheel...</span>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>
            </div>
          )}
        </div>

        {/* QUICK QUESTION STARTER PROMPTS */}
        <div className="px-5 py-2 bg-stone-50/80 border-t border-stone-200 overflow-x-auto flex items-center gap-2 scrollbar-none">
          <span className="text-[10px] uppercase font-bold text-stone-400 shrink-0">Quick prompts:</span>
          {(SUGGESTED_QUESTIONS[selectedInquiryType] || SUGGESTED_QUESTIONS.custom_sizing).map(
            (q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setMessageText(q)}
                className="px-2.5 py-1 bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-300 rounded-full text-[11px] text-stone-700 hover:text-amber-900 whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {q}
              </button>
            )
          )}
        </div>

        {/* MESSAGE COMPOSER FOOTER */}
        <div className="p-4 bg-white border-t border-stone-200">
          <form onSubmit={handleSend} className="space-y-2">
            <div className="relative flex items-center gap-2">
              <textarea
                rows={2}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={`Write your inquiry or custom order notes for ${artisan.name}...`}
                className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none bg-stone-50/50 resize-none"
              />

              <button
                type="submit"
                disabled={!messageText.trim() && !attachedRefPhoto}
                className={`p-3 rounded-xl transition-all cursor-pointer shrink-0 flex items-center justify-center ${
                  messageText.trim() || attachedRefPhoto
                    ? 'bg-amber-900 hover:bg-amber-800 text-white shadow-md'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
                title="Send Message to Artisan"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Direct artisan transmission · Handcrafted response guaranteed</span>
              </div>
              <span className="font-mono text-[10px] hidden sm:inline">Press Enter to send</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
