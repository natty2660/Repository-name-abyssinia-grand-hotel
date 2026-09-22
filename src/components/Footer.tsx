import React, { useState } from 'react';
import { PageId } from '../types';
import { HOTEL_INFO } from '../data/hotelData';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Award,
  Sparkles,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@') || !newsletterEmail.includes('.')) {
      setNewsletterStatus('error');
      return;
    }
    setNewsletterStatus('success');
    setNewsletterEmail('');
    setTimeout(() => {
      setNewsletterStatus('idle');
    }, 6000);
  };

  const handleNav = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#121110] text-[#E0DACF] border-t border-[#26231F] relative overflow-hidden">
      {/* Decorative top accent line with gold gradient */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C59648] to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-12 sm:pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 pb-12 sm:pb-16 border-b border-[#252320]">
          {/* Col 1: Brand & Heritage */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[2px] bg-gradient-to-br from-[#D3AA67] via-[#C59648] to-[#143D59] p-[1px] flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#121110] flex flex-col items-center justify-center">
                  <span className="font-serif text-[#FAF8F5] text-lg font-bold leading-none">D</span>
                  <span className="text-[7px] tracking-[0.2em] text-[#C59648] uppercase font-sans font-semibold">5-STAR</span>
                </div>
              </div>
              <div>
                <span className="block font-serif text-xl font-bold tracking-wider text-[#FAF8F5]">
                  DUULE
                </span>
                <span className="block text-[10px] tracking-[0.25em] text-[#A6BFD3] uppercase font-sans">
                  Luxury Hotel &bull; Jijiga
                </span>
              </div>
            </div>

            <p className="text-sm text-[#A69D8F] leading-relaxed font-light">
              Jijiga’s premier 5-star landmark hotel designed by Rio Architects. Featuring iconic curved blue-glass architecture, heated indoor pool, grand event centers, and authentic hospitality.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1 text-[#C59648]">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-sm font-serif">★</span>
                ))}
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#B8AFA2]">
                5-Star Luxury Rating
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.25em] text-[#C59648] font-bold">
              Explore Hotel
            </h3>
            <ul className="space-y-3 text-sm font-light">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-[#C59648] transition-colors text-left"
                >
                  Home &amp; Experience
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('rooms')}
                  className="hover:text-[#C59648] transition-colors text-left"
                >
                  Rooms &amp; Penthouse Suites
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('dining')}
                  className="hover:text-[#C59648] transition-colors text-left"
                >
                  Fine Dining &amp; Coffee Ritual
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-[#C59648] transition-colors text-left"
                >
                  Our Story &amp; Sustainability
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('gallery')}
                  className="hover:text-[#C59648] transition-colors text-left"
                >
                  Visual Photo Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('booking')}
                  className="text-[#D3AA67] hover:text-[#FAF8F5] transition-colors font-medium flex items-center gap-1.5"
                >
                  <span>Book Your Stay</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('admin')}
                  className="text-[#99B6CE] hover:text-white transition-colors text-xs flex items-center gap-1.5 pt-1 border-t border-[#252320]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0088cc]" />
                  <span>Reception Admin Portal (Option C)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.25em] text-[#C59648] font-bold">
              Location &amp; Contact
            </h3>
            <ul className="space-y-3 text-sm text-[#A69D8F] font-light">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C59648] shrink-0 mt-0.5" />
                <span className="leading-snug">{HOTEL_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C59648] shrink-0" />
                <a href={`tel:${HOTEL_INFO.phone}`} className="hover:text-white transition-colors break-all">
                  {HOTEL_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C59648] shrink-0" />
                <a href={`mailto:${HOTEL_INFO.email}`} className="hover:text-white transition-colors break-all">
                  {HOTEL_INFO.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C59648] shrink-0" />
                <span>Front Desk: 24/7 Open</span>
              </li>
              <li className="pt-1">
                <a
                  href={`https://wa.me/${HOTEL_INFO.whatsappNumber}?text=Hello%20Duule%20Luxury%20Hotel,%20I%20would%20like%20to%20inquire%20about%20a%20booking.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-[2px] bg-[#1C2C1D] text-[#25D366] text-xs font-semibold hover:bg-[#254228] transition-colors border border-[#25D366]/30 active:scale-95 max-w-full"
                >
                  <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">WhatsApp: {HOTEL_INFO.whatsappDisplay}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Exclusive Inquiries */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.25em] text-[#C59648] font-bold">
              The Duule Chronicle
            </h3>
            <p className="text-xs text-[#A69D8F] leading-relaxed font-light">
              Receive private invitations to seasonal culinary events, cultural evenings, diplomatic summit updates, and executive suite privileges.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2.5">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-3 min-h-[44px] bg-[#1A1816] text-xs text-white placeholder-[#7A7369] border border-[#33302B] rounded-[2px] focus:outline-none focus:border-[#C59648] transition-colors"
                  aria-label="Email address for hotel newsletter"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3.5 bg-[#C59648] hover:bg-[#D3AA67] text-[#121110] text-xs font-bold transition-colors rounded-[2px] flex items-center justify-center active:scale-95"
                  aria-label="Subscribe to hotel newsletter"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {newsletterStatus === 'error' && (
                <p className="text-xs text-red-400">Please enter a valid email address.</p>
              )}
              {newsletterStatus === 'success' && (
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Thank you. You have been added to our private guest register.</span>
                </p>
              )}
            </form>

            <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#8C8377]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C59648] shrink-0" />
                <span>Verified 5-Star Standard</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#C59648] shrink-0" />
                <span>Best Luxury Hotel in Jijiga</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright and disclaimer */}
        <div className="pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-[#7A7369]">
          <p>
            &copy; {new Date().getFullYear()} Duule Luxury Hotel. Jijiga, Somali Region, Ethiopia. Architecture by Rio Architects. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 sm:gap-6">
            <span className="text-[#D3AA67] bg-[#1A1917] px-3 py-1 rounded-[2px] border border-[#3A3326] flex items-center gap-1.5 font-medium text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Direct Booking Official Portal
            </span>
            <button
              onClick={() => handleNav('admin')}
              className="text-[#D3AA67] hover:text-white transition-colors underline underline-offset-4 flex items-center gap-1"
            >
              <span>Staff Reception Portal</span>
            </button>
            <button
              onClick={() => handleNav('contact')}
              className="hover:text-[#E0DACF] transition-colors"
            >
              Contact Desk
            </button>
            <button
              onClick={() => handleNav('about')}
              className="hover:text-[#E0DACF] transition-colors"
            >
              Ethical &amp; Green Tourism
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
