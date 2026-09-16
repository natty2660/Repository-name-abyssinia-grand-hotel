import React, { useState } from 'react';
import { PageId, ContactFormData } from '../types';
import { HOTEL_INFO, NEARBY_LANDMARKS } from '../data/hotelData';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  Car,
  Compass,
  Building,
  Plane,
  AlertCircle,
} from 'lucide-react';

interface ContactViewProps {
  onNavigate: (page: PageId) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [selectedMapPin, setSelectedMapPin] = useState<string>('hotel');

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address.';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone or WhatsApp number is required.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Please provide a message with at least 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  const mapLandmarks = [
    { id: 'hotel', name: 'Abyssinia Grand Hotel', type: 'hotel', coords: 'Kazanchis Business Core', distance: 'Our Location' },
    { id: 'airport', name: 'Bole Int’l Airport (ADD)', type: 'airport', coords: 'Bole Subcity', distance: '6.2 km (12 min)' },
    { id: 'uneca', name: 'UN Economic Commission (UNECA)', type: 'un', coords: 'Menelik II Ave', distance: '1.4 km (4 min)' },
    { id: 'au', name: 'African Union Headquarters', type: 'au', coords: 'Roosevelt St', distance: '4.8 km (10 min)' },
    { id: 'museum', name: 'National Museum of Ethiopia', type: 'culture', coords: 'King George VI St', distance: '3.9 km (8 min)' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#222222] pt-24 sm:pt-32 pb-24 sm:pb-32">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold mb-3">
            <span className="w-6 h-[1px] bg-[#C59648]" />
            <span>Connect With Us</span>
            <span className="w-6 h-[1px] bg-[#C59648]" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#171615] font-normal mb-4 sm:mb-6 leading-tight">
            We Await Your Arrival
          </h1>
          <p className="text-sm sm:text-lg text-[#5D564A] leading-relaxed font-light">
            Our concierge, reservations, and guest relations team in Addis Ababa are at your complete service around the clock.
          </p>
        </div>
      </div>

      {/* Main Grid: Contact Info Cards & Contact Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Contact Cards & Hours */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Address Card */}
            <div className="bg-white p-5 sm:p-8 lg:p-10 rounded-[2px] border border-[#E5E0D6] shadow-sm space-y-5">
              <h2 className="font-serif text-xl sm:text-3xl text-[#171615] font-normal">Hotel Headquarters</h2>

              <div className="space-y-4 text-xs sm:text-sm text-[#555047]">
                <div className="flex items-start gap-3 sm:gap-3.5">
                  <MapPin className="w-4 h-4 text-[#C59648] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#171615] text-xs uppercase tracking-wider mb-0.5">Physical Address:</strong>
                    <span className="font-light">{HOTEL_INFO.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-3.5">
                  <Phone className="w-4 h-4 text-[#C59648] shrink-0" />
                  <div>
                    <strong className="block text-[#171615] text-xs uppercase tracking-wider mb-0.5">Front Desk &amp; Switchboard:</strong>
                    <a href={`tel:${HOTEL_INFO.phone}`} className="hover:text-[#C59648] transition-colors font-light break-all">
                      {HOTEL_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-3.5">
                  <Mail className="w-4 h-4 text-[#C59648] shrink-0" />
                  <div>
                    <strong className="block text-[#171615] text-xs uppercase tracking-wider mb-0.5">Reservations Desk:</strong>
                    <a href={`mailto:${HOTEL_INFO.email}`} className="hover:text-[#C59648] transition-colors font-light break-all">
                      {HOTEL_INFO.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Button */}
              <div className="pt-2 sm:pt-3">
                <a
                  href={`https://wa.me/${HOTEL_INFO.whatsappNumber}?text=Hello%20Abyssinia%20Grand%20Hotel,%20I%20would%20like%20to%20connect%20with%20your%20front%20desk.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 min-h-[44px] bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs uppercase font-bold tracking-widest rounded-[2px] flex items-center justify-center gap-2 shadow-sm transition-colors active:scale-95 text-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Operating & Service Hours Card */}
            <div className="bg-[#FAF6EE] p-5 sm:p-8 lg:p-10 rounded-[2px] border border-[#E8E1D3] space-y-4">
              <h3 className="font-serif text-xl sm:text-2xl text-[#171615] font-normal">Service Hours</h3>
              <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-[#6B6458]">
                <div className="flex justify-between py-2 border-b border-[#EAE3D5]">
                  <span className="font-medium text-[#171615]">Front Desk Reception</span>
                  <span className="font-light">24 Hours / 7 Days</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#EAE3D5]">
                  <span className="font-medium text-[#171615]">Concierge Desk</span>
                  <span className="font-light">6:00 AM – 11:00 PM</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#EAE3D5]">
                  <span className="font-medium text-[#171615]">In-Room Private Dining</span>
                  <span className="font-light">24 Hours / 7 Days</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#EAE3D5]">
                  <span className="font-medium text-[#171615]">Airport Chauffeur Desk</span>
                  <span className="font-light">24 Hours (On Request)</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium text-[#171615]">Abyssinia Spa &amp; Pool</span>
                  <span className="font-light">7:00 AM – 9:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-8 lg:p-12 rounded-[2px] border border-[#E5E0D6] shadow-sm">
            {submitted ? (
              <div className="py-8 sm:py-12 text-center space-y-4 sm:space-y-5 animate-fadeIn">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <h3 className="font-serif text-2xl sm:text-4xl text-[#171615] font-normal">Message Delivered</h3>
                <p className="text-xs sm:text-base text-[#6B6458] max-w-md mx-auto leading-relaxed font-light">
                  Thank you, <strong className="text-[#171615] font-semibold">{formData.name}</strong>. Our guest services desk has received your inquiry regarding <em>{formData.subject}</em>. An associate will respond to <strong className="text-[#171615] font-semibold break-all">{formData.email}</strong> shortly.
                </p>
                <div className="p-3 sm:p-4 bg-[#FAF6EE] text-[11px] sm:text-xs text-[#7E6324] rounded-[2px] border border-[#E5DAC0] max-w-sm mx-auto">
                  Demonstration notice: Form validated successfully. In live production, this connects to the hotel concierge inbox.
                </div>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      subject: 'General Inquiry',
                      message: '',
                    });
                  }}
                  className="px-6 sm:px-7 py-3 sm:py-3.5 min-h-[44px] bg-[#171615] hover:bg-[#C59648] hover:text-[#121110] text-white text-xs uppercase font-bold tracking-[0.2em] rounded-[2px] mt-4 transition-colors active:scale-95"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#C59648] font-bold block mb-2">
                  Online Inquiry
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl text-[#171615] font-normal mb-2 sm:mb-3">
                  Send a Direct Message
                </h2>
                <p className="text-xs sm:text-sm text-[#736B5F] mb-6 sm:mb-8 font-light">
                  For private events, corporate delegate rates, airport limousine transfers, or general inquiries.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-[#4A453D] font-medium mb-1.5 text-xs uppercase tracking-wider">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        placeholder="e.g. Marcus Vance"
                        className={`w-full px-3.5 py-3 min-h-[44px] border rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648] ${
                          errors.name ? 'border-red-500 bg-red-50/20' : 'border-[#D1CAC0]'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.name}</span>
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
                        placeholder="marcus@example.com"
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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-[#4A453D] font-medium mb-1.5 text-xs uppercase tracking-wider">
                        Phone / WhatsApp <span className="text-red-500">*</span>
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

                    <div>
                      <label className="block text-[#4A453D] font-medium mb-1.5 text-xs uppercase tracking-wider">Subject</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-3 min-h-[44px] border border-[#D1CAC0] rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648]"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Room Reservations">Room Reservations</option>
                        <option value="Airport Transfer Request">Airport Limousine Transfer</option>
                        <option value="Corporate / Diplomatic Delegation">Corporate / Diplomatic Delegation</option>
                        <option value="Conference & Banquet Booking">Conference &amp; Banquet Booking</option>
                        <option value="Private Dining">Private Dining at Enat</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#4A453D] font-medium mb-1.5 text-xs uppercase tracking-wider">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: undefined });
                      }}
                      placeholder="Please let us know your planned travel dates, room preferences, or special requirements..."
                      className={`w-full px-3.5 py-3 border rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648] ${
                        errors.message ? 'border-red-500 bg-red-50/20' : 'border-[#D1CAC0]'
                      }`}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-9 py-4 min-h-[48px] bg-[#171615] hover:bg-[#C59648] hover:text-[#121110] text-white text-xs uppercase font-bold tracking-[0.2em] rounded-[2px] transition-colors shadow-md flex items-center justify-center gap-2 active:scale-95 text-center"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Message</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Embedded-style Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2px] border border-[#E5E0D6] shadow-sm overflow-hidden p-4 sm:p-6 lg:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 sm:pb-6 mb-6 sm:mb-8 border-b border-[#EAE5DC] gap-2 sm:gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#C59648] font-bold block mb-1">
                Addis Ababa Landmark Locator
              </span>
              <h3 className="font-serif text-xl sm:text-3xl text-[#171615]">
                Kazanchis Diplomatic Quarter
              </h3>
            </div>
            <div className="text-xs text-[#736B5F] font-light">
              Click landmark pins below to view driving routes and transfer times
            </div>
          </div>

          {/* Interactive Stylized Map Interface */}
          <div className="relative h-72 sm:h-96 lg:h-[420px] rounded-[2px] bg-[#1F1E1B] overflow-hidden border border-[#33302B] flex items-center justify-center">
            {/* Stylized vector map grid background */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(#C59648 1px, transparent 1px), radial-gradient(#ffffff 1px, #1F1E1B 1px)',
                backgroundSize: '40px 40px',
                backgroundPosition: '0 0, 20px 20px',
              }}
            />

            {/* Stylized Arterial Roads */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <line x1="10%" y1="90%" x2="50%" y2="50%" stroke="#C59648" strokeWidth="3" strokeDasharray="6 4" />
              <line x1="50%" y1="50%" x2="85%" y2="20%" stroke="#E0DACF" strokeWidth="2" />
              <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#E0DACF" strokeWidth="2" />
              <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="#E0DACF" strokeWidth="2" />
              <circle cx="50%" cy="50%" r="28" fill="#C59648" fillOpacity="0.15" />
            </svg>

            {/* Central Hotel Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#C59648] text-[#121110] flex items-center justify-center shadow-2xl animate-bounce border-2 border-white">
                <Building className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="bg-[#171615] text-white px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-[2px] border border-[#C59648] text-[10px] sm:text-xs font-serif font-bold mt-1 sm:mt-2 shadow-xl whitespace-nowrap">
                Abyssinia Grand Hotel
              </div>
            </div>

            {/* Airport Pin */}
            <button
              onClick={() => setSelectedMapPin('airport')}
              aria-label="View route to Bole International Airport"
              className="absolute bottom-6 sm:bottom-12 left-4 sm:left-12 z-20 flex items-center gap-1.5 sm:gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C59648]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2A2824] group-hover:bg-[#C59648] text-white group-hover:text-black flex items-center justify-center shadow-lg transition-colors border border-[#4A453D]">
                <Plane className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="hidden sm:inline-block bg-[#171615]/90 text-neutral-200 group-hover:text-white px-2.5 py-1 text-[11px] rounded-[2px] border border-[#3A3631]">
                Bole Airport (12 min)
              </span>
            </button>

            {/* UNECA Pin */}
            <button
              onClick={() => setSelectedMapPin('uneca')}
              aria-label="View route to United Nations Economic Commission"
              className="absolute top-8 sm:top-16 left-6 sm:left-20 z-20 flex items-center gap-1.5 sm:gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C59648]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2A2824] group-hover:bg-[#C59648] text-white group-hover:text-black flex items-center justify-center shadow-lg transition-colors border border-[#4A453D]">
                <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="hidden sm:inline-block bg-[#171615]/90 text-neutral-200 group-hover:text-white px-2.5 py-1 text-[11px] rounded-[2px] border border-[#3A3631]">
                UNECA (4 min)
              </span>
            </button>

            {/* AU HQ Pin */}
            <button
              onClick={() => setSelectedMapPin('au')}
              aria-label="View route to African Union Headquarters"
              className="absolute bottom-6 sm:bottom-14 right-4 sm:right-16 z-20 flex items-center gap-1.5 sm:gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C59648]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2A2824] group-hover:bg-[#C59648] text-white group-hover:text-black flex items-center justify-center shadow-lg transition-colors border border-[#4A453D]">
                <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="hidden sm:inline-block bg-[#171615]/90 text-neutral-200 group-hover:text-white px-2.5 py-1 text-[11px] rounded-[2px] border border-[#3A3631]">
                African Union HQ (10 min)
              </span>
            </button>

            {/* National Museum Pin */}
            <button
              onClick={() => setSelectedMapPin('museum')}
              aria-label="View route to National Museum of Ethiopia"
              className="absolute top-8 sm:top-12 right-6 sm:right-24 z-20 flex items-center gap-1.5 sm:gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C59648]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2A2824] group-hover:bg-[#C59648] text-white group-hover:text-black flex items-center justify-center shadow-lg transition-colors border border-[#4A453D]">
                <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="hidden sm:inline-block bg-[#171615]/90 text-neutral-200 group-hover:text-white px-2.5 py-1 text-[11px] rounded-[2px] border border-[#3A3631]">
                National Museum (8 min)
              </span>
            </button>
          </div>

          {/* Quick Landmark Legend Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 mt-4 sm:mt-6 text-xs">
            {mapLandmarks.map((lm) => (
              <button
                type="button"
                key={lm.id}
                onClick={() => setSelectedMapPin(lm.id)}
                aria-pressed={selectedMapPin === lm.id}
                className={`p-2.5 sm:p-3.5 rounded-[2px] border cursor-pointer transition-colors text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C59648] ${
                  selectedMapPin === lm.id
                    ? 'bg-[#171615] text-white border-[#C59648]'
                    : 'bg-[#FAF8F5] text-[#555047] border-[#E0DACF] hover:bg-[#F2EFE9]'
                }`}
              >
                <span className="font-semibold block truncate">{lm.name}</span>
                <span className="text-[10px] sm:text-[11px] text-[#C59648] block mt-0.5">{lm.distance}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
