import React, { useState, useEffect } from 'react';
import { PageId, DiningVenue } from '../types';
import { DINING_VENUES, HOTEL_INFO } from '../data/hotelData';
import {
  Utensils,
  Clock,
  Coffee,
  Check,
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Wine,
  X,
  CheckCircle2,
} from 'lucide-react';

interface DiningViewProps {
  onNavigate: (page: PageId) => void;
}

export const DiningView: React.FC<DiningViewProps> = ({ onNavigate }) => {
  const [selectedVenue, setSelectedVenue] = useState<DiningVenue | null>(null);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [reserveVenueName, setReserveVenueName] = useState('Duule Grand Restaurant');
  const [reserveDate, setReserveDate] = useState(new Date().toISOString().split('T')[0]);
  const [reserveTime, setReserveTime] = useState('19:30');
  const [reserveGuests, setReserveGuests] = useState('2');
  const [reserveName, setReserveName] = useState('');
  const [reserveEmail, setReserveEmail] = useState('');
  const [reservePhone, setReservePhone] = useState('');
  const [reserveNotes, setReserveNotes] = useState('');
  const [reserveSubmitted, setReserveSubmitted] = useState(false);

  useEffect(() => {
    if (!reservationModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setReservationModalOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [reservationModalOpen]);

  const handleOpenReserveModal = (venueName?: string) => {
    if (venueName) setReserveVenueName(venueName);
    setReserveSubmitted(false);
    setReservationModalOpen(true);
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReserveSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#222222] pt-24 sm:pt-32 pb-24 sm:pb-32">
      {/* 1. Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold mb-3">
            <span className="w-6 h-[1px] bg-[#C59648]" />
            <span>Gastronomic Excellence</span>
            <span className="w-6 h-[1px] bg-[#C59648]" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#171615] font-normal mb-4 sm:mb-6 leading-tight">
            The Art of Somali &amp; Ethiopian Dining
          </h1>
          <p className="text-sm sm:text-lg text-[#5D564A] leading-relaxed font-light">
            From authentic Somali camel delicacies, spiced goat suqaar, and aromatic basmati to traditional Ethiopian coffee and tea rituals, every culinary moment at Duule Luxury Hotel is an elevated journey.
          </p>
        </div>
      </div>

      {/* 2. Restaurant Venues Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-20">
        {DINING_VENUES.map((venue, index) => {
          const isReversed = index % 2 === 1;

          return (
            <div
              key={venue.id}
              id={venue.id}
              className="bg-white rounded-[2px] border border-[#E2DDD3] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 hover:shadow-2xl transition-all duration-300"
            >
              {/* Image Section */}
              <div
                className={`lg:col-span-6 relative h-64 sm:h-96 lg:h-auto min-h-[260px] sm:min-h-[440px] overflow-hidden bg-neutral-900 group ${
                  isReversed ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <img
                  src={venue.image}
                  alt={venue.name}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-[#0C1A27]/90 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-[2px] border border-[#1A3852] text-xs text-white shadow-lg">
                  <span className="text-[#D3AA67] uppercase tracking-[0.2em] font-bold text-[10px] sm:text-[11px]">
                    {venue.cuisine}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div
                className={`lg:col-span-6 p-6 sm:p-8 lg:p-12 flex flex-col justify-between ${
                  isReversed ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs text-[#736B5F] mb-3 sm:mb-4">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C59648]" />
                      <span>{venue.hours}</span>
                    </span>
                    <span className="text-[#D1CAC0]">&bull;</span>
                    <span className="flex items-center gap-1.5">
                      <Wine className="w-3.5 h-3.5 text-[#C59648]" />
                      <span>Dress: {venue.dressCode}</span>
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#171615] font-normal mb-3 sm:mb-4">
                    {venue.name}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#5D564A] leading-relaxed mb-5 sm:mb-6 font-light">
                    {venue.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2 mb-6 sm:mb-8 text-xs sm:text-sm text-[#423E37]">
                    {venue.highlights.map((hl, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#C59648] shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>

                  {/* Sample Dishes / Menu Highlights */}
                  <div className="pt-5 border-t border-[#F0ECE4] mb-6 sm:mb-8">
                    <h4 className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#171615] font-semibold mb-3.5">
                      Signature Selections
                    </h4>
                    <div className="space-y-3">
                      {venue.menuPreview.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex justify-between items-baseline gap-3 text-xs sm:text-sm pb-2 border-b border-[#F7F4EE] last:border-0">
                          <div>
                            <span className="font-medium text-[#171615]">{item.name}</span>
                            <p className="text-[#736B5F] text-[11px] sm:text-xs mt-0.5 font-light">{item.desc}</p>
                          </div>
                          <span className="font-serif font-bold text-[#C59648] shrink-0 text-xs sm:text-sm">
                            {item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-5 sm:pt-6 border-t border-[#F0ECE4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <button
                    onClick={() => handleOpenReserveModal(venue.name)}
                    className="w-full sm:w-auto px-7 py-3.5 sm:py-4 min-h-[48px] bg-[#0C1A27] hover:bg-[#C59648] hover:text-[#121110] text-white text-xs uppercase font-bold tracking-[0.2em] rounded-[2px] transition-all shadow-md flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95 text-center"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Reserve a Table</span>
                  </button>

                  <a
                    href={`tel:${HOTEL_INFO.phone}`}
                    className="text-xs text-[#736B5F] hover:text-[#171615] transition-colors py-1 text-center sm:text-left"
                  >
                    Direct Dining Line: <strong className="text-[#171615]">{HOTEL_INFO.phone}</strong>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Opening Hours & Practical Dining Details Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-28">
        <div className="bg-[#FAF6EE] p-5 sm:p-10 lg:p-14 rounded-[2px] border border-[#E8E1D3] shadow-sm">
          <div className="max-w-3xl mb-6 sm:mb-8">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold block mb-1 sm:mb-2">
              Visitor Information
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#171615]">
              Operating Hours &amp; Reservation Guidelines
            </h3>
            <p className="text-xs sm:text-sm text-[#6B6458] mt-2 font-light">
              Reservations are recommended for dinner at Duule Grand Restaurant and private banquets in the VIP salon.
            </p>
          </div>

          {/* Mobile-Specific Responsive Venue Cards (Under 640px) */}
          <div className="sm:hidden space-y-3.5">
            {[
              {
                venue: 'Sunrise Buffet & Bakery',
                service: 'Breakfast Buffet, Malawax & Fruit',
                hours: '6:00 AM – 11:00 AM Daily',
                dress: 'Casual',
                note: 'Walk-in Welcome',
              },
              {
                venue: 'Duule Grand Restaurant',
                service: 'Somali & Ethiopian Fine Dining',
                hours: '11:30 AM – 11:00 PM Daily',
                dress: 'Smart Casual',
                note: 'Reservations Advised',
              },
              {
                venue: 'Duule Skyline Lounge',
                service: 'Sunset Views & Artisan Mocktails',
                hours: '4:00 PM – Midnight Daily',
                dress: 'Smart Casual',
                note: 'Reservations Recommended',
              },
              {
                venue: 'Spiced Tea & Coffee Lounge',
                service: 'Traditional Shaah Cadays & Harar Coffee',
                hours: '7:00 AM – 10:00 PM Daily',
                dress: 'Casual',
                note: 'Walk-in Welcome',
              },
              {
                venue: 'In-Room Suite Dining',
                service: 'Full Private Chef Menu',
                hours: '24 Hours / 7 Days',
                dress: 'Private',
                note: 'Direct Suite Extension #8',
              },
            ].map((row, idx) => (
              <div key={idx} className="bg-white p-4 rounded-[2px] border border-[#E2DDD3] space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base text-[#171615] font-medium">{row.venue}</h4>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#FAF6EE] text-[#7E6324] font-semibold rounded-[2px] border border-[#E8E1D3]">
                    {row.dress}
                  </span>
                </div>
                <p className="text-xs text-[#6B6458]">{row.service}</p>
                <div className="pt-2 border-t border-[#F0ECE4] flex items-center justify-between text-xs text-[#171615]">
                  <span className="font-semibold text-[#C59648]">{row.hours}</span>
                  <span className="text-[#8C8375] text-[11px]">{row.note}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop/Tablet Table (640px and up) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#DCD5C6] text-[#171615] uppercase tracking-wider font-semibold text-xs">
                  <th className="py-3.5 px-4">Dining Venue</th>
                  <th className="py-3.5 px-4">Service Type</th>
                  <th className="py-3.5 px-4">Hours of Operation</th>
                  <th className="py-3.5 px-4">Dress Code</th>
                  <th className="py-3.5 px-4">Inquiries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D5] text-[#555047]">
                <tr>
                  <td className="py-4 px-4 font-medium text-[#171615]">Sunrise Buffet &amp; Bakery</td>
                  <td className="py-4 px-4">Breakfast Buffet, Malawax &amp; Fruit</td>
                  <td className="py-4 px-4">6:00 AM – 11:00 AM Daily</td>
                  <td className="py-4 px-4">Casual</td>
                  <td className="py-4 px-4">Walk-in Welcome</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-[#171615]">Duule Grand Restaurant</td>
                  <td className="py-4 px-4">Somali &amp; Ethiopian Fine Dining</td>
                  <td className="py-4 px-4">11:30 AM – 11:00 PM Daily</td>
                  <td className="py-4 px-4">Smart Casual</td>
                  <td className="py-4 px-4">Reservations Advised</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-[#171615]">Duule Skyline Lounge</td>
                  <td className="py-4 px-4">Sunset Views &amp; Artisan Mocktails</td>
                  <td className="py-4 px-4">4:00 PM – Midnight Daily</td>
                  <td className="py-4 px-4">Smart Casual</td>
                  <td className="py-4 px-4">Reservations Recommended</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-[#171615]">Spiced Tea &amp; Coffee Lounge</td>
                  <td className="py-4 px-4">Shaah Cadays &amp; Harar Coffee Ritual</td>
                  <td className="py-4 px-4">7:00 AM – 10:00 PM Daily</td>
                  <td className="py-4 px-4">Casual</td>
                  <td className="py-4 px-4">Walk-in Welcome</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-[#171615]">In-Room Suite Dining</td>
                  <td className="py-4 px-4">Full Private Chef Menu</td>
                  <td className="py-4 px-4">24 Hours / 7 Days</td>
                  <td className="py-4 px-4">Private</td>
                  <td className="py-4 px-4">Direct Suite Extension #8</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Table Reservation Request Modal */}
      {reservationModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dining-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setReservationModalOpen(false);
          }}
        >
          <div className="bg-white max-w-lg w-full max-h-[92vh] overflow-y-auto rounded-[2px] shadow-2xl border border-[#DCD6CA] p-5 sm:p-10 relative">
            <button
              onClick={() => setReservationModalOpen(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 text-[#736B5F] hover:text-[#171615] bg-[#F2EFE9] hover:bg-[#E5E0D6] rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close reservation modal"
            >
              <X className="w-5 h-5" />
            </button>

            {reserveSubmitted ? (
              <div className="py-6 sm:py-8 text-center space-y-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 id="dining-modal-title" className="font-serif text-2xl sm:text-3xl text-[#171615]">Table Request Confirmed</h3>
                <p className="text-xs sm:text-sm text-[#6B6458] leading-relaxed max-w-sm mx-auto font-light">
                  Thank you, <strong>{reserveName}</strong>. Your table request for{' '}
                  <strong>{reserveGuests} guests</strong> at <strong>{reserveVenueName}</strong> on{' '}
                  <strong>{reserveDate}</strong> at <strong>{reserveTime}</strong> has been received by our head maître d'.
                </p>
                <div className="p-3 bg-[#FAF6EE] text-[11px] text-[#7E6324] rounded-[2px] border border-[#E5DAC0]">
                  This is a live preview. Our culinary concierge has logged your table preferences.
                </div>
                <button
                  onClick={() => setReservationModalOpen(false)}
                  className="w-full sm:w-auto px-8 py-3.5 min-h-[44px] bg-[#171615] hover:bg-[#C59648] hover:text-[#121110] text-white text-xs uppercase font-bold tracking-[0.2em] rounded-[2px] mt-4 transition-colors"
                >
                  Return to Dining
                </button>
              </div>
            ) : (
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold block mb-1">
                  Table Reservation Request
                </span>
                <h3 id="dining-modal-title" className="font-serif text-2xl sm:text-3xl text-[#171615] font-normal mb-4 sm:mb-5 pr-8">
                  Reserve at {reserveVenueName}
                </h3>

                <form onSubmit={handleReservationSubmit} className="space-y-3.5 text-xs sm:text-sm">
                  <div>
                    <label className="block text-[#4A453D] font-medium mb-1 text-[11px] sm:text-xs uppercase tracking-wider">Select Restaurant</label>
                    <select
                      value={reserveVenueName}
                      onChange={(e) => setReserveVenueName(e.target.value)}
                      className="w-full px-3.5 py-3 border border-[#D1CAC0] rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648] min-h-[44px]"
                    >
                      <option value="Duule Grand Restaurant">Duule Grand Restaurant</option>
                      <option value="Sunrise Buffet & Bakery">Sunrise Buffet &amp; Bakery</option>
                      <option value="Duule Skyline Lounge">Duule Skyline Lounge</option>
                      <option value="Spiced Tea & Coffee Lounge">Spiced Tea &amp; Coffee Lounge</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#4A453D] font-medium mb-1 text-[11px] sm:text-xs uppercase tracking-wider">Date</label>
                      <input
                        type="date"
                        value={reserveDate}
                        onChange={(e) => setReserveDate(e.target.value)}
                        required
                        className="w-full px-3.5 py-3 border border-[#D1CAC0] rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648] min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#4A453D] font-medium mb-1 text-[11px] sm:text-xs uppercase tracking-wider">Time</label>
                      <select
                        value={reserveTime}
                        onChange={(e) => setReserveTime(e.target.value)}
                        className="w-full px-3.5 py-3 border border-[#D1CAC0] rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648] min-h-[44px]"
                      >
                        <option value="12:30">12:30 PM (Lunch)</option>
                        <option value="13:30">1:30 PM (Lunch)</option>
                        <option value="16:00">4:00 PM (Shaah &amp; Coffee Ritual)</option>
                        <option value="18:30">6:30 PM (Dinner)</option>
                        <option value="19:30">7:30 PM (Dinner)</option>
                        <option value="20:30">8:30 PM (Dinner)</option>
                        <option value="21:30">9:30 PM (Late Dining)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#4A453D] font-medium mb-1 text-[11px] sm:text-xs uppercase tracking-wider">Party Size</label>
                      <select
                        value={reserveGuests}
                        onChange={(e) => setReserveGuests(e.target.value)}
                        className="w-full px-3.5 py-3 border border-[#D1CAC0] rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648] min-h-[44px]"
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 People</option>
                        <option value="3">3 People</option>
                        <option value="4">4 People</option>
                        <option value="5">5 People</option>
                        <option value="6+">6+ (Private Dining)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#4A453D] font-medium mb-1 text-[11px] sm:text-xs uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        value={reserveName}
                        onChange={(e) => setReserveName(e.target.value)}
                        placeholder="e.g. Abdi Warsame"
                        required
                        className="w-full px-3.5 py-3 border border-[#D1CAC0] rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648] min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#4A453D] font-medium mb-1 text-[11px] sm:text-xs uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        value={reserveEmail}
                        onChange={(e) => setReserveEmail(e.target.value)}
                        placeholder="abdi@example.com"
                        required
                        className="w-full px-3.5 py-3 border border-[#D1CAC0] rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648] min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#4A453D] font-medium mb-1 text-[11px] sm:text-xs uppercase tracking-wider">Phone</label>
                      <input
                        type="tel"
                        value={reservePhone}
                        onChange={(e) => setReservePhone(e.target.value)}
                        placeholder="+251 ..."
                        required
                        className="w-full px-3.5 py-3 border border-[#D1CAC0] rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648] min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#4A453D] font-medium mb-1 text-[11px] sm:text-xs uppercase tracking-wider">Dietary &amp; Seating Notes</label>
                    <textarea
                      rows={2}
                      value={reserveNotes}
                      onChange={(e) => setReserveNotes(e.target.value)}
                      placeholder="Special occasion, VIP delegation table, Halal requests..."
                      className="w-full px-3.5 py-2.5 border border-[#D1CAC0] rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 min-h-[48px] bg-gradient-to-r from-[#B8973A] to-[#D3AA67] hover:from-[#C59648] hover:to-[#E0C07F] text-[#121110] text-xs uppercase font-bold tracking-[0.22em] rounded-[2px] shadow-lg transition-all mt-3 active:scale-95"
                  >
                    Confirm Table Request
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
