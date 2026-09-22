import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle2, Ticket, Sparkles, X } from 'lucide-react';
import { WorkshopEvent } from '../types';

interface WorkshopsSectionProps {
  workshops: WorkshopEvent[];
  onSelectArtisan: (artisanId: string) => void;
}

export const WorkshopsSection: React.FC<WorkshopsSectionProps> = ({ workshops, onSelectArtisan }) => {
  const [selectedWorkshop, setSelectedWorkshop] = useState<WorkshopEvent | null>(null);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendeeName.trim() || !attendeeEmail.trim()) return;

    if (selectedWorkshop) {
      selectedWorkshop.bookedSeats += seatsToBook;
    }
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
      setSelectedWorkshop(null);
      setAttendeeName('');
      setAttendeeEmail('');
      setSeatsToBook(1);
    }, 2800);
  };

  return (
    <section className="py-16 bg-[#F5F4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider text-amber-800 font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Learning &amp; Maker Gatherings</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            Workshops &amp; Masterclasses Near You
          </h2>
          <p className="text-stone-600 text-sm mt-2">
            Sit beside master potters and weavers. Shape clay on manual wheels, ferment your own botanical indigo vats, or explore regional craft fairs.
          </p>
        </div>

        {/* Workshop Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {workshops.map((ws) => {
            const seatsLeft = ws.totalSeats - ws.bookedSeats;
            const isSoldOut = seatsLeft <= 0;

            return (
              <div
                key={ws.id}
                className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="p-6">
                  {/* Category & Mode Badge */}
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="uppercase tracking-wider font-semibold text-amber-800">
                      {ws.category} · {ws.skillLevel}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                      ws.locationType === 'in-person'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-indigo-50 text-indigo-900'
                    }`}>
                      {ws.locationType === 'in-person' ? 'In-Studio (Local)' : 'Live Interactive Kit'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif font-bold text-lg text-stone-900 mb-2 leading-snug">
                    {ws.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {ws.description}
                  </p>

                  {/* Schedule Details */}
                  <div className="space-y-2 py-3 border-t border-b border-stone-100 text-xs text-stone-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{ws.date} · {ws.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{ws.locationName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="font-mono tabular-nums">
                        {isSoldOut ? 'Sold out' : `${seatsLeft} spots remaining`}
                      </span>
                    </div>
                  </div>

                  {/* Materials Included */}
                  <div className="mt-4">
                    <span className="text-[11px] font-semibold text-stone-700 block mb-1.5">
                      Included with registration:
                    </span>
                    <ul className="text-[11px] text-stone-500 space-y-1">
                      {ws.materialsIncluded.map((mat, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{mat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-400 block">Registration</span>
                    <span className="font-mono text-lg font-bold text-stone-900 tabular-nums">
                      {ws.price === 0 ? 'FREE' : `$${ws.price}`}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedWorkshop(ws)}
                    disabled={isSoldOut}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    {isSoldOut ? 'Sold Out' : 'Reserve Seat'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seat Booking Modal */}
      {selectedWorkshop && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900">
            <button
              onClick={() => setSelectedWorkshop(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingConfirmed ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Seat Confirmed!
                </h3>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  We have reserved your pass for <span className="font-semibold text-stone-900">{selectedWorkshop.title}</span>. Calendar invite and preparation notes have been dispatched to <span className="font-semibold text-stone-900">{attendeeEmail}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-amber-800">
                  <Ticket className="w-4 h-4" />
                  <span>Reserve Studio Pass</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-stone-900">
                  {selectedWorkshop.title}
                </h3>

                <p className="text-xs text-stone-600">
                  Led by {selectedWorkshop.artisanName} · {selectedWorkshop.date}
                </p>

                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                      placeholder="e.g. Meera Nair"
                      className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Email for Pass &amp; Directions</label>
                    <input
                      type="email"
                      required
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      placeholder="meera.nair@example.com"
                      className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Number of Seats</label>
                    <select
                      value={seatsToBook}
                      onChange={(e) => setSeatsToBook(Number(e.target.value))}
                      className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    >
                      <option value={1}>1 Seat (${selectedWorkshop.price * 1})</option>
                      <option value={2}>2 Seats (${selectedWorkshop.price * 2})</option>
                      <option value={3}>3 Seats (${selectedWorkshop.price * 3})</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-stone-500">Total:</span>{' '}
                    <span className="font-mono font-bold text-stone-900 text-sm">
                      {selectedWorkshop.price === 0 ? 'FREE' : `$${selectedWorkshop.price * seatsToBook}`}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-800 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Confirm Registration
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
