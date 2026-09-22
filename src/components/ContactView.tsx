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
  ExternalLink,
  Copy,
  Check,
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
  const [mapMode, setMapMode] = useState<'google' | 'landmarks'>('google');
  const [copiedGps, setCopiedGps] = useState(false);

  const handleCopyGps = () => {
    navigator.clipboard.writeText('9.3512, 42.7981');
    setCopiedGps(true);
    setTimeout(() => setCopiedGps(false), 3000);
  };

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
    { id: 'hotel', name: 'Duule Luxury Hotel', type: 'hotel', coords: 'Main Boulevard', distance: 'Our Location' },
    { id: 'sayidka', name: 'Sayidka Monument', type: 'culture', coords: 'Main Square', distance: '0.4 km (2 min)' },
    { id: 'admin', name: 'Regional Administration', type: 'gov', coords: 'Civic Center', distance: '1.8 km (4 min)' },
    { id: 'university', name: 'Jigjiga University', type: 'edu', coords: 'University Way', distance: '3.2 km (6 min)' },
    { id: 'airport', name: 'Wilwal Airport (JIJ)', type: 'airport', coords: 'Airport Expressway', distance: '11 km (15 min)' },
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
            We Await Your Arrival in Jijiga
          </h1>
          <p className="text-sm sm:text-lg text-[#5D564A] leading-relaxed font-light">
            Our 24-hour concierge, front office, and Wilwal Airport transfer teams are at your complete service.
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
              <h2 className="font-serif text-xl sm:text-3xl text-[#171615] font-normal">Hotel Location</h2>

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
                  href={`https://wa.me/${HOTEL_INFO.whatsappNumber}?text=Hello%20Duule%20Luxury%20Hotel,%20I%20would%20like%20to%20connect%20with%20your%20front%20desk.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 min-h-[44px] bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs uppercase font-bold tracking-widest rounded-[2px] flex items-center justify-center gap-2 shadow-sm transition-colors active:scale-95 text-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="bg-[#FAF6EE] p-5 sm:p-7 rounded-[2px] border border-[#E8DFC9] space-y-3.5">
              <div className="flex items-center gap-2 text-[#C59648]">
                <Clock className="w-4 h-4" />
                <h3 className="font-serif text-lg text-[#171615]">Service Hours</h3>
              </div>
              <ul className="space-y-2 text-xs text-[#5C5548]">
                <li className="flex justify-between border-b border-[#E8DFC9]/70 pb-1.5">
                  <span>Front Desk &amp; Concierge:</span>
                  <strong className="text-[#171615]">24 Hours / 7 Days</strong>
                </li>
                <li className="flex justify-between border-b border-[#E8DFC9]/70 pb-1.5">
                  <span>Duule Grand Restaurant:</span>
                  <strong className="text-[#171615]">06:00 &ndash; 23:00</strong>
                </li>
                <li className="flex justify-between border-b border-[#E8DFC9]/70 pb-1.5">
                  <span>Heated Pool &amp; Sauna:</span>
                  <strong className="text-[#171615]">06:30 &ndash; 21:30</strong>
                </li>
                <li className="flex justify-between">
                  <span>Wilwal Airport Transfers:</span>
                  <strong className="text-[#171615]">24 Hours on Request</strong>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 lg:p-12 rounded-[2px] border border-[#E5E0D6] shadow-sm">
            {submitted ? (
              <div className="py-12 sm:py-16 text-center space-y-4">
                <div className="w-16 h-16 bg-[#F4F9F2] text-green-700 rounded-full flex items-center justify-center mx-auto border-2 border-green-600/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#171615]">Inquiry Received</h3>
                <p className="text-xs sm:text-sm text-[#665F52] max-w-md mx-auto leading-relaxed font-light">
                  Thank you, <strong>{formData.name}</strong>. Our guest relations team at Duule Luxury Hotel will review your request and reply to <strong>{formData.email}</strong> within 2 hours.
                </p>
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
                  className="mt-4 px-6 py-3 min-h-[44px] bg-[#171615] text-white text-xs uppercase font-bold tracking-wider rounded-[2px] hover:bg-[#C59648] hover:text-[#121110] transition-colors"
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
                  For private events, corporate delegate rates, Wilwal airport transfers, or suite inquiries.
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
                        placeholder="e.g. Abdi Warsame"
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
                        placeholder="abdi@example.com"
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
                        <option value="Airport Transfer Request">Wilwal Airport VIP Transfer</option>
                        <option value="Corporate / Diplomatic Delegation">Diplomatic Delegation / Summit</option>
                        <option value="Conference & Banquet Booking">Banquet Hall &amp; Wedding Event</option>
                        <option value="Private Dining">Private Dining at Duule Grand</option>
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
                      placeholder="Please let us know your planned arrival dates, room preferences, or special requirements..."
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
                    className="w-full sm:w-auto px-9 py-4 min-h-[48px] bg-[#0C1A27] hover:bg-[#C59648] hover:text-[#121110] text-white text-xs uppercase font-bold tracking-[0.2em] rounded-[2px] transition-colors shadow-md flex items-center justify-center gap-2 active:scale-95 text-center"
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
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 sm:pb-6 mb-6 sm:mb-8 border-b border-[#EAE5DC] gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#C59648] font-bold block mb-1">
                Jijiga Landmark Locator &amp; GPS Navigation
              </span>
              <h3 className="font-serif text-xl sm:text-3xl text-[#171615]">
                Prime Central Boulevard, Jijiga
              </h3>
            </div>

            {/* Map Mode Selector Tabs */}
            <div className="flex items-center gap-2 bg-[#FAF8F5] p-1 border border-[#E0DACF] rounded-[2px]">
              <button
                type="button"
                onClick={() => setMapMode('google')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] transition-colors ${
                  mapMode === 'google'
                    ? 'bg-[#171615] text-[#D3AA67] shadow-xs'
                    : 'text-[#555047] hover:text-[#171615]'
                }`}
              >
                Live Google Maps
              </button>
              <button
                type="button"
                onClick={() => setMapMode('landmarks')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] transition-colors ${
                  mapMode === 'landmarks'
                    ? 'bg-[#171615] text-[#D3AA67] shadow-xs'
                    : 'text-[#555047] hover:text-[#171615]'
                }`}
              >
                Landmark Radar
              </button>
            </div>
          </div>

          {/* Action Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs">
            <div className="flex items-center gap-2 text-[#555047]">
              <MapPin className="w-4 h-4 text-[#C59648]" />
              <span>GPS Coordinates: <strong className="font-mono text-[#171615]">9.3512° N, 42.7981° E</strong></span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleCopyGps}
                className="px-3 py-1.5 rounded-[2px] border border-[#D1CAC0] bg-[#FAF8F5] hover:bg-[#F2EFE9] text-[#171615] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedGps ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#C59648]" />}
                <span>{copiedGps ? 'Copied to Clipboard!' : 'Copy GPS'}</span>
              </button>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Duule+Luxury+Hotel+Jijiga"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-[2px] bg-[#0C1A27] hover:bg-[#C59648] hover:text-[#121110] text-white flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {mapMode === 'google' ? (
            /* Live Embedded Google Map */
            <div className="relative h-72 sm:h-96 lg:h-[420px] rounded-[2px] overflow-hidden border border-[#E0DACF] bg-[#EDE9E1]">
              <iframe
                title="Duule Luxury Hotel Jijiga Location Map"
                src="https://maps.google.com/maps?q=Duule%20Hotel%20Jijiga%20Somali%20Region%20Ethiopia&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
              <div className="absolute bottom-3 left-3 bg-[#171615]/90 text-white px-3 py-1.5 rounded-[2px] text-[11px] backdrop-blur-xs flex items-center gap-2 border border-[#C59648]/40 shadow-lg pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-[#C59648] animate-ping" />
                <span>Duule Luxury Hotel &bull; Jijiga Main Boulevard</span>
              </div>
            </div>
          ) : (
            /* Stylized vector map landmark radar */
            <div className="relative h-72 sm:h-96 lg:h-[420px] rounded-[2px] bg-[#0C1A27] overflow-hidden border border-[#1A3852] flex items-center justify-center">
              {/* Stylized vector map grid background */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(#C59648 1px, transparent 1px), radial-gradient(#ffffff 1px, #0C1A27 1px)',
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
                <div className="bg-[#0C1A27] text-white px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-[2px] border border-[#C59648] text-[10px] sm:text-xs font-serif font-bold mt-1 sm:mt-2 shadow-xl whitespace-nowrap">
                  Duule Luxury Hotel
                </div>
              </div>

              {/* Airport Pin */}
              <button
                onClick={() => setSelectedMapPin('airport')}
                aria-label="View route to Wilwal International Airport"
                className="absolute bottom-6 sm:bottom-12 left-4 sm:left-12 z-20 flex items-center gap-1.5 sm:gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C59648]"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#182C3F] group-hover:bg-[#C59648] text-white group-hover:text-black flex items-center justify-center shadow-lg transition-colors border border-[#2B4B68]">
                  <Plane className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="hidden sm:inline-block bg-[#0C1A27]/90 text-neutral-200 group-hover:text-white px-2.5 py-1 text-[11px] rounded-[2px] border border-[#20405C]">
                  Wilwal Airport (15 min)
                </span>
              </button>

              {/* Sayidka Monument Pin */}
              <button
                onClick={() => setSelectedMapPin('sayidka')}
                aria-label="View route to Sayidka Monument"
                className="absolute top-8 sm:top-16 left-6 sm:left-20 z-20 flex items-center gap-1.5 sm:gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C59648]"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#182C3F] group-hover:bg-[#C59648] text-white group-hover:text-black flex items-center justify-center shadow-lg transition-colors border border-[#2B4B68]">
                  <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="hidden sm:inline-block bg-[#0C1A27]/90 text-neutral-200 group-hover:text-white px-2.5 py-1 text-[11px] rounded-[2px] border border-[#20405C]">
                  Sayidka Monument (2 min)
                </span>
              </button>

              {/* Regional Admin Pin */}
              <button
                onClick={() => setSelectedMapPin('admin')}
                aria-label="View route to Somali Regional Government"
                className="absolute bottom-6 sm:bottom-14 right-4 sm:right-16 z-20 flex items-center gap-1.5 sm:gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C59648]"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#182C3F] group-hover:bg-[#C59648] text-white group-hover:text-black flex items-center justify-center shadow-lg transition-colors border border-[#2B4B68]">
                  <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="hidden sm:inline-block bg-[#0C1A27]/90 text-neutral-200 group-hover:text-white px-2.5 py-1 text-[11px] rounded-[2px] border border-[#20405C]">
                  Regional Administration (4 min)
                </span>
              </button>

              {/* University Pin */}
              <button
                onClick={() => setSelectedMapPin('university')}
                aria-label="View route to Jigjiga University"
                className="absolute top-8 sm:top-12 right-6 sm:right-24 z-20 flex items-center gap-1.5 sm:gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C59648]"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#182C3F] group-hover:bg-[#C59648] text-white group-hover:text-black flex items-center justify-center shadow-lg transition-colors border border-[#2B4B68]">
                  <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="hidden sm:inline-block bg-[#0C1A27]/90 text-neutral-200 group-hover:text-white px-2.5 py-1 text-[11px] rounded-[2px] border border-[#20405C]">
                  Jigjiga University (6 min)
                </span>
              </button>
            </div>
          )}

          {/* Quick Landmark Legend Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 mt-4 sm:mt-6 text-xs">
            {mapLandmarks.map((lm) => (
              <button
                type="button"
                key={lm.id}
                onClick={() => {
                  setSelectedMapPin(lm.id);
                  setMapMode('landmarks');
                }}
                aria-pressed={selectedMapPin === lm.id}
                className={`p-2.5 sm:p-3.5 rounded-[2px] border cursor-pointer transition-colors text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C59648] ${
                  selectedMapPin === lm.id && mapMode === 'landmarks'
                    ? 'bg-[#0C1A27] text-white border-[#C59648]'
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
