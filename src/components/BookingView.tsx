import React, { useState, useEffect } from 'react';
import { PageId, BookingFormData, BookingConfirmation } from '../types';
import { ROOMS_DATA, HOTEL_INFO } from '../data/hotelData';
import {
  Calendar,
  Users,
  BedDouble,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Printer,
  ArrowRight,
  ShieldCheck,
  Building,
  Info,
} from 'lucide-react';

interface BookingViewProps {
  initialRoomId?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  onNavigate: (page: PageId) => void;
}

export const BookingView: React.FC<BookingViewProps> = ({
  initialRoomId = 'executive-room',
  initialCheckIn,
  initialCheckOut,
  initialGuests = 2,
  onNavigate,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultOutDate = new Date();
  defaultOutDate.setDate(defaultOutDate.getDate() + 2);
  const defaultOutStr = defaultOutDate.toISOString().split('T')[0];

  const [formData, setFormData] = useState<BookingFormData>({
    checkIn: initialCheckIn || todayStr,
    checkOut: initialCheckOut || defaultOutStr,
    adults: initialGuests || 2,
    children: 0,
    roomType: initialRoomId || 'executive-room',
    guestName: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

  // Sync if initialRoomId changes
  useEffect(() => {
    if (initialRoomId) {
      setFormData((prev) => ({ ...prev, roomType: initialRoomId }));
    }
  }, [initialRoomId]);

  const currentRoom = ROOMS_DATA.find((r) => r.id === formData.roomType) || ROOMS_DATA[0];

  // Calculate nights
  const calcNights = (): number => {
    try {
      const d1 = new Date(formData.checkIn);
      const d2 = new Date(formData.checkOut);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  const nights = calcNights();
  const subtotal = currentRoom.pricePerNight * nights;
  const taxesAndService = Math.round(subtotal * 0.15); // 15% estimated Ethiopian VAT & municipal tax
  const grandTotal = subtotal + taxesAndService;

  const quickRequestTags = [
    'Early Check-in (subject to availability)',
    'High Floor Quiet Room',
    'Bole Airport Chauffeur Pickup',
    'Special Celebration / Anniversary Setup',
    'Feather-Free Hypoallergenic Bedding',
    'Traditional Coffee in Room Upon Arrival',
  ];

  const toggleAddon = (tag: string) => {
    if (selectedAddons.includes(tag)) {
      setSelectedAddons(selectedAddons.filter((t) => t !== tag));
    } else {
      setSelectedAddons([...selectedAddons, tag]);
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};

    if (!formData.checkIn) newErrors.checkIn = 'Please select a check-in date.';
    if (!formData.checkOut) newErrors.checkOut = 'Please select a check-out date.';
    if (formData.checkIn && formData.checkOut) {
      const d1 = new Date(formData.checkIn);
      const d2 = new Date(formData.checkOut);
      if (d2 <= d1) {
        newErrors.checkOut = 'Check-out date must be after check-in date.';
      }
    }

    if (!formData.guestName.trim()) {
      newErrors.guestName = 'Primary guest full name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required for booking confirmation.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Build confirmation
    const combinedRequests = [
      ...selectedAddons,
      formData.specialRequests ? `Notes: ${formData.specialRequests}` : '',
    ]
      .filter(Boolean)
      .join('; ');

    const randomRefNumber = `AGH-${Math.floor(10000 + Math.random() * 90000)}`;

    const confirmed: BookingConfirmation = {
      referenceNumber: randomRefNumber,
      formData: {
        ...formData,
        specialRequests: combinedRequests,
      },
      roomName: currentRoom.name,
      totalNights: nights,
      totalPrice: grandTotal,
      timestamp: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };

    setConfirmation(confirmed);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#222222] pt-24 sm:pt-32 pb-24 sm:pb-32">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold mb-3">
            <span className="w-6 h-[1px] bg-[#C59648]" />
            <span>Direct Reservations</span>
            <span className="w-6 h-[1px] bg-[#C59648]" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#171615] font-normal mb-4 sm:mb-6 leading-tight">
            Book Your Stay at Abyssinia Grand
          </h1>
          <p className="text-sm sm:text-lg text-[#5D564A] leading-relaxed font-light">
            Reserve directly for best rate guarantee, complimentary traditional coffee service, and personalized concierge arrival assistance.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {confirmation ? (
          /* Confirmation Voucher Screen */
          <div className="max-w-3xl mx-auto bg-white rounded-[2px] border border-[#E0DACF] shadow-2xl overflow-hidden animate-fadeIn">
            {/* Top Gold Header */}
            <div className="bg-[#171615] text-[#FAF8F5] p-6 sm:p-12 border-b border-[#33302B] text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#C59648]/20 text-[#D3AA67] mx-auto flex items-center justify-center mb-3 sm:mb-4">
                <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
              </div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold block mb-1.5">
                Reservation Request Acknowledged
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal mb-2 sm:mb-3">
                We Look Forward to Welcoming You
              </h2>
              <div className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 bg-[#252320] rounded-[2px] border border-[#423E37] text-[11px] sm:text-xs font-mono tracking-widest text-[#E0DACF] mt-2">
                BOOKING REF: {confirmation.referenceNumber}
              </div>
            </div>

            {/* Voucher Details */}
            <div className="p-5 sm:p-12 space-y-5 sm:space-y-6">
              {/* Notice Banner */}
              <div className="p-3.5 sm:p-4 bg-[#FAF6EE] border border-[#E8E1D3] rounded-[2px] text-xs text-[#7E6324] leading-relaxed flex items-start gap-2.5">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-[#C59648] mt-0.5" />
                <div>
                  <strong>Demonstration Reservation Voucher:</strong> This is a portfolio demonstration website. No payment was collected, and no live room inventory was charged. Your request was validated front-end.
                </div>
              </div>

              {/* Guest & Stay Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 pt-5 sm:pt-6 border-t border-[#F0ECE4] text-xs sm:text-sm text-[#555047]">
                <div className="space-y-1.5">
                  <h4 className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#8C8375] font-semibold mb-2">
                    Stay Summary
                  </h4>
                  <p className="text-base font-semibold text-[#171615] mb-2 font-serif">
                    {confirmation.roomName}
                  </p>
                  <p>Check-in: <strong className="text-[#171615]">{confirmation.formData.checkIn}</strong> (From 2:00 PM)</p>
                  <p>Check-out: <strong className="text-[#171615]">{confirmation.formData.checkOut}</strong> (By 12:00 PM)</p>
                  <p>Total Duration: <strong className="text-[#171615]">{confirmation.totalNights} Night(s)</strong></p>
                  <p>Guests: <strong className="text-[#171615]">{confirmation.formData.adults} Adults, {confirmation.formData.children} Children</strong></p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#8C8375] font-semibold mb-2">
                    Guest Information
                  </h4>
                  <p className="text-base font-semibold text-[#171615] mb-2 font-serif">
                    {confirmation.formData.guestName}
                  </p>
                  <p className="break-all">Email: <strong className="text-[#171615]">{confirmation.formData.email}</strong></p>
                  <p>Phone: <strong className="text-[#171615]">{confirmation.formData.phone}</strong></p>
                  <p>Booking Date: {confirmation.timestamp}</p>
                </div>
              </div>

              {/* Requests */}
              {confirmation.formData.specialRequests && (
                <div className="p-3.5 sm:p-4 bg-[#FAF8F5] rounded-[2px] border border-[#EAE5DC] text-xs sm:text-sm text-[#555047]">
                  <strong className="block text-[#171615] mb-1">Special Preferences &amp; Requests:</strong>
                  <span>{confirmation.formData.specialRequests}</span>
                </div>
              )}

              {/* Pricing breakdown */}
              <div className="pt-5 sm:pt-6 border-t border-[#F0ECE4] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#8C8375] uppercase tracking-wider block">Estimated Total</span>
                  <span className="text-[11px] sm:text-xs text-[#736B5F] font-light">Inclusive of Ethiopian taxes &amp; service</span>
                </div>
                <span className="font-serif text-2xl sm:text-4xl font-bold text-[#171615]">
                  ${confirmation.totalPrice} USD
                </span>
              </div>

              {/* Actions */}
              <div className="pt-6 sm:pt-8 border-t border-[#F0ECE4] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                <button
                  onClick={handlePrint}
                  className="w-full sm:w-auto px-6 py-3.5 min-h-[44px] border border-[#171615] text-[#171615] hover:bg-[#171615] hover:text-white text-xs uppercase font-bold tracking-wider rounded-[2px] flex items-center justify-center gap-2 transition-colors active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Voucher</span>
                </button>

                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                  <button
                    onClick={() => setConfirmation(null)}
                    className="w-full sm:w-auto px-5 py-3.5 min-h-[44px] bg-[#FAF6EE] text-[#555047] hover:bg-[#F2EFE9] text-xs uppercase font-semibold tracking-wider rounded-[2px] transition-colors text-center"
                  >
                    Modify Request
                  </button>
                  <button
                    onClick={() => onNavigate('home')}
                    className="w-full sm:w-auto px-7 py-3.5 min-h-[44px] bg-[#171615] hover:bg-[#C59648] hover:text-[#121110] text-white text-xs uppercase font-bold tracking-[0.2em] rounded-[2px] transition-colors active:scale-95 text-center"
                  >
                    Return to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Main Booking Form Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left Side: Booking Form Fields */}
            <div className="lg:col-span-8 bg-white p-5 sm:p-8 lg:p-12 rounded-[2px] border border-[#E5E0D6] shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
                {/* Step 1: Stay Dates & Guests */}
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C59648] font-bold mb-4 sm:mb-5">
                    <span>1. Stay Schedule &amp; Party Size</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 text-xs sm:text-sm">
                    <div>
                      <label className="block text-[#4A453D] font-medium mb-1.5 text-xs uppercase tracking-wider">
                        Check-in Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        min={todayStr}
                        value={formData.checkIn}
                        onChange={(e) => {
                          setFormData({ ...formData, checkIn: e.target.value });
                          if (errors.checkIn) setErrors({ ...errors, checkIn: undefined });
                        }}
                        className={`w-full px-3.5 py-3 min-h-[44px] border rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648] ${
                          errors.checkIn ? 'border-red-500 bg-red-50/20' : 'border-[#D1CAC0]'
                        }`}
                      />
                      {errors.checkIn && (
                        <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.checkIn}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#4A453D] font-medium mb-1.5 text-xs uppercase tracking-wider">
                        Check-out Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        min={formData.checkIn || todayStr}
                        value={formData.checkOut}
                        onChange={(e) => {
                          setFormData({ ...formData, checkOut: e.target.value });
                          if (errors.checkOut) setErrors({ ...errors, checkOut: undefined });
                        }}
                        className={`w-full px-3.5 py-3 min-h-[44px] border rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648] ${
                          errors.checkOut ? 'border-red-500 bg-red-50/20' : 'border-[#D1CAC0]'
                        }`}
                      />
                      {errors.checkOut && (
                        <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.checkOut}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#4A453D] font-medium mb-1.5 text-xs uppercase tracking-wider">Adults (18+)</label>
                      <select
                        value={formData.adults}
                        onChange={(e) => setFormData({ ...formData, adults: Number(e.target.value) })}
                        className="w-full px-3.5 py-3 min-h-[44px] border border-[#D1CAC0] rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648]"
                      >
                        <option value={1}>1 Adult</option>
                        <option value={2}>2 Adults</option>
                        <option value={3}>3 Adults</option>
                        <option value={4}>4 Adults</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#4A453D] font-medium mb-1.5 text-xs uppercase tracking-wider">Children (0–17)</label>
                      <select
                        value={formData.children}
                        onChange={(e) => setFormData({ ...formData, children: Number(e.target.value) })}
                        className="w-full px-3.5 py-3 min-h-[44px] border border-[#D1CAC0] rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648]"
                      >
                        <option value={0}>0 Children</option>
                        <option value={1}>1 Child</option>
                        <option value={2}>2 Children</option>
                        <option value={3}>3+ Children</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Step 2: Choose Room Type */}
                <div className="pt-6 sm:pt-8 border-t border-[#F0ECE4]">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C59648] font-bold mb-4 sm:mb-5">
                    <span>2. Select Room Class</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {ROOMS_DATA.map((room) => {
                      const isSelected = formData.roomType === room.id;
                      return (
                        <button
                          type="button"
                          key={room.id}
                          onClick={() => setFormData({ ...formData, roomType: room.id })}
                          aria-pressed={isSelected}
                          className={`p-3.5 sm:p-4 rounded-[2px] border cursor-pointer transition-all text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C59648] ${
                            isSelected
                              ? 'border-[#C59648] bg-[#FAF6EE] shadow-md ring-1 ring-[#C59648]'
                              : 'border-[#E0DACF] bg-white hover:border-[#C59648]/60 hover:shadow-sm'
                          }`}
                        >
                          <img
                            src={room.image}
                            alt={room.name}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            className="w-full h-28 sm:h-32 object-cover rounded-[2px] mb-2.5 sm:mb-3"
                          />
                          <h4 className="font-serif text-sm sm:text-base font-medium text-[#171615]">
                            {room.name}
                          </h4>
                          <span className="text-[11px] sm:text-xs text-[#736B5F] block mb-2 font-light">
                            {room.view} &bull; {room.bedType}
                          </span>
                          <div className="flex items-baseline justify-between pt-2 border-t border-[#EAE3D5]">
                            <span className="font-serif text-lg sm:text-xl font-bold text-[#171615]">
                              ${room.pricePerNight}
                            </span>
                            <span className="text-[10px] sm:text-[11px] text-[#8C8375]">/ night</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Guest Contact Details */}
                <div className="pt-6 sm:pt-8 border-t border-[#F0ECE4]">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C59648] font-bold mb-4 sm:mb-5">
                    <span>3. Primary Guest Information</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 text-xs sm:text-sm">
                    <div className="sm:col-span-2">
                      <label className="block text-[#4A453D] font-medium mb-1.5 text-xs uppercase tracking-wider">
                        Full Name (as on Passport / ID) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.guestName}
                        onChange={(e) => {
                          setFormData({ ...formData, guestName: e.target.value });
                          if (errors.guestName) setErrors({ ...errors, guestName: undefined });
                        }}
                        placeholder="e.g. Dr. Sarah Jenkins"
                        className={`w-full px-3.5 py-3 min-h-[44px] border rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648] ${
                          errors.guestName ? 'border-red-500 bg-red-50/20' : 'border-[#D1CAC0]'
                        }`}
                      />
                      {errors.guestName && (
                        <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.guestName}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#4A453D] font-medium mb-1.5 text-xs uppercase tracking-wider">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        placeholder="sarah@example.com"
                        className={`w-full px-3.5 py-3 min-h-[44px] border rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648] ${
                          errors.email ? 'border-red-500 bg-red-50/20' : 'border-[#D1CAC0]'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#4A453D] font-medium mb-1.5 text-xs uppercase tracking-wider">
                        Phone / WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: undefined });
                        }}
                        placeholder="+251 ..."
                        className={`w-full px-3.5 py-3 min-h-[44px] border rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648] ${
                          errors.phone ? 'border-red-500 bg-red-50/20' : 'border-[#D1CAC0]'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 4: Special Preferences */}
                <div className="pt-6 sm:pt-8 border-t border-[#F0ECE4]">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C59648] font-bold mb-3 sm:mb-4">
                    <span>4. Special Requests &amp; Arrival Preferences</span>
                  </div>

                  <div className="mb-4 sm:mb-5">
                    <span className="block text-xs text-[#6B6458] mb-2.5 font-light">
                      Select any complimentary preferences:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {quickRequestTags.map((tag, i) => {
                        const isChecked = selectedAddons.includes(tag);
                        return (
                          <button
                            type="button"
                            key={i}
                            onClick={() => toggleAddon(tag)}
                            className={`px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs rounded-[2px] border transition-colors ${
                              isChecked
                                ? 'bg-[#171615] text-[#D3AA67] border-[#171615] shadow-sm'
                                : 'bg-[#FAF8F5] text-[#555047] border-[#D1CAC0] hover:bg-[#F2EFE9]'
                            }`}
                          >
                            {isChecked ? '✓ ' : '+ '}
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm">
                    <label className="block text-[#4A453D] font-medium mb-1.5 text-xs uppercase tracking-wider">
                      Additional Dietary, Flight or Room Requests
                    </label>
                    <textarea
                      rows={3}
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      placeholder="Please note any flight arrival numbers for airport pickup or specific dietary guidelines..."
                      className="w-full px-3.5 py-2.5 sm:py-3 border border-[#D1CAC0] rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648]"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-6 sm:pt-8 border-t border-[#F0ECE4]">
                  <button
                    type="submit"
                    className="w-full py-4 min-h-[50px] bg-gradient-to-r from-[#B8973A] to-[#D3AA67] hover:from-[#C59648] hover:to-[#E0C07F] text-[#121110] text-xs uppercase font-bold tracking-[0.22em] rounded-[2px] shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Submit Reservation Request</span>
                  </button>
                  <p className="text-center text-[11px] text-[#8C8375] mt-3 font-light">
                    Demo booking preview. No credit card charge or payment details required.
                  </p>
                </div>
              </form>
            </div>

            {/* Right Side: Real-time Live Price Summary Card */}
            <div className="lg:col-span-4">
              <div className="bg-[#171615] text-[#FAF8F5] rounded-[2px] border border-[#33302B] p-5 sm:p-8 shadow-2xl sticky top-28">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#C59648] font-semibold block mb-1.5 sm:mb-2">
                  Stay Overview
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-white font-normal mb-3 sm:mb-4">
                  {currentRoom.name}
                </h3>

                <div className="rounded-[2px] overflow-hidden mb-5 sm:mb-6 h-36 sm:h-40 bg-neutral-900 shadow-md">
                  <img
                    src={currentRoom.image}
                    alt={currentRoom.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-[#B8AFA2] pb-5 sm:pb-6 border-b border-[#2C2925]">
                  <div className="flex justify-between">
                    <span>Dates:</span>
                    <span className="text-white font-medium text-right">
                      {formData.checkIn} &rarr; {formData.checkOut}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="text-white font-medium">{nights} Night(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Occupancy:</span>
                    <span className="text-white font-medium">
                      {formData.adults} Adults, {formData.children} Children
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Breakfast:</span>
                    <span className="text-[#D3AA67] font-medium">
                      {currentRoom.breakfastIncluded ? 'Included in rate' : 'Available on request'}
                    </span>
                  </div>
                </div>

                <div className="py-5 sm:py-6 space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-[#B8AFA2] border-b border-[#2C2925]">
                  <div className="flex justify-between">
                    <span>${currentRoom.pricePerNight} &times; {nights} nights</span>
                    <span className="text-white font-medium">${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes &amp; Service Charge (15%)</span>
                    <span className="text-white font-medium">${taxesAndService}</span>
                  </div>
                </div>

                <div className="pt-5 sm:pt-6 flex items-baseline justify-between mb-5 sm:mb-6">
                  <span className="text-xs uppercase tracking-wider text-[#C59648] font-semibold">
                    Estimated Total
                  </span>
                  <div className="text-right">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-white">
                      ${grandTotal}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#8C8375] block">USD</span>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 bg-[#1F1E1B] rounded-[2px] border border-[#33302B] space-y-1.5 sm:space-y-2 text-[11px] text-[#A69D8F]">
                  <div className="flex items-center gap-2 text-[#E0DACF]">
                    <ShieldCheck className="w-4 h-4 text-[#C59648]" />
                    <span className="font-semibold">Best Rate Direct Assurance</span>
                  </div>
                  <p className="font-light leading-relaxed">
                    Complimentary high-speed fiber Wi-Fi, luggage transfer, and 24-hour concierge assistance included with every reservation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
