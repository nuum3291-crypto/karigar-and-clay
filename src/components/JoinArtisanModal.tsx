import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles, Upload, MapPin, Award, HeartHandshake } from 'lucide-react';
import { Artisan, CraftCategory } from '../types';

interface JoinArtisanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitApplication: (artisanData: Omit<Artisan, 'id' | 'rating' | 'reviewsCount' | 'followerCount' | 'featured' | 'isApproved'>) => void;
}

export const JoinArtisanModal: React.FC<JoinArtisanModalProps> = ({
  isOpen,
  onClose,
  onSubmitApplication,
}) => {
  const [name, setName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [craftSpecialty, setCraftSpecialty] = useState('');
  const [category, setCategory] = useState<CraftCategory>('pottery');
  const [city, setCity] = useState('Delhi');
  const [neighborhood, setNeighborhood] = useState('');
  const [address, setAddress] = useState('');
  const [acceptsStudioVisits, setAcceptsStudioVisits] = useState(true);
  const [bio, setBio] = useState('');
  const [story, setStory] = useState('');
  const [heritageTechnique, setHeritageTechnique] = useState('');
  const [sustainabilityPledges, setSustainabilityPledges] = useState('Zero Waste, Plastic-Free');
  const [yearsPracticing, setYearsPracticing] = useState(10);
  const [instagram, setInstagram] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brandName.trim() || !bio.trim()) return;

    onSubmitApplication({
      name: name.trim(),
      brandName: brandName.trim(),
      craftSpecialty: craftSpecialty.trim() || 'Handmade Studio Craft',
      category,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      coverUrl: '/src/assets/images/hero_artisan_studio_1790108084579.jpg',
      bio: bio.trim(),
      story: story.trim() || bio.trim(),
      location: {
        city: city.trim(),
        state: 'Local Region',
        country: 'India',
        workshopAddress: address.trim() || `${neighborhood}, ${city}`,
        neighborhood: neighborhood.trim() || city,
        acceptsStudioVisits,
        lat: 28.6139,
        lng: 77.2090,
      },
      yearsPracticing: Number(yearsPracticing),
      heritageTechnique: heritageTechnique.trim() || 'Traditional Guild Techniques',
      sustainabilityTags: sustainabilityPledges.split(',').map((s) => s.trim()).filter(Boolean),
      socialLinks: {
        instagram: instagram.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
      },
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 text-stone-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Application Received!
            </h2>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              Namaste {name}. Your studio profile for <span className="font-semibold text-stone-900">{brandName}</span> has been submitted to the Karigar &amp; Clay Artisan Guild. Our curator team will review your workshop details and verify your craft within 48 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            <div>
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-amber-800 mb-1">
                <HeartHandshake className="w-4 h-4" />
                <span>Join the Guild as an Independent Artisan</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Share Your Craft with Urban Patrons
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                We empower independent potters, weavers, carvers, and smiths with 0% listing fees, fair payouts, and direct studio pickup logistics.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Artisan / Maker Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Harish Chandra"
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Studio / Brand Name</label>
                  <input
                    type="text"
                    required
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Chandra Kilns"
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Craft Discipline</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CraftCategory)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  >
                    <option value="pottery">Pottery &amp; Ceramics</option>
                    <option value="textiles">Handloom &amp; Textiles</option>
                    <option value="jewelry">Handmade Jewelry &amp; Metal</option>
                    <option value="woodwork">Reclaimed Woodcraft</option>
                    <option value="candles">Botanical Scents &amp; Candles</option>
                    <option value="leather">Vegetable-Tanned Leather</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Years Practicing Craft</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={yearsPracticing}
                    onChange={(e) => setYearsPracticing(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Craft Specialty Tagline</label>
                <input
                  type="text"
                  required
                  value={craftSpecialty}
                  onChange={(e) => setCraftSpecialty(e.target.value)}
                  placeholder="e.g. Wood-fired high-iron stoneware and tea ceremony vessels"
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">City / Region</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Delhi NCR, Jaipur, Pune"
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Workshop Neighborhood</label>
                  <input
                    type="text"
                    required
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="e.g. Shahpur Jat or Kumhar Gram"
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Full Studio / Workshop Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Studio 7, Haveli Lane, Old Heritage Quarter"
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="visits"
                  checked={acceptsStudioVisits}
                  onChange={(e) => setAcceptsStudioVisits(e.target.checked)}
                  className="rounded text-amber-800"
                />
                <label htmlFor="visits" className="text-stone-700 font-medium cursor-pointer">
                  My studio welcomes patron visits and local order pickups
                </label>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Short Bio</label>
                <textarea
                  required
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="One or two sentences about your journey and lineage..."
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">The Craft Story &amp; Heritage Technique</label>
                <textarea
                  required
                  rows={3}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Explain how you source clay/cotton/wood, tools used, and what makes your technique unique..."
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Sustainability Commitments (Comma separated)</label>
                <input
                  type="text"
                  value={sustainabilityPledges}
                  onChange={(e) => setSustainabilityPledges(e.target.value)}
                  placeholder="Zero Waste, Lead-Free Glazes, Natural Dyes, Plastic-Free Packaging"
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Instagram Handle / Website</label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@my_craft_studio"
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Contact Email / Phone</label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="maker@craftstudio.in"
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <span className="text-[11px] text-stone-500">Free to join. 100% verified artisan pledge.</span>
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-800 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Submit Guild Application
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
