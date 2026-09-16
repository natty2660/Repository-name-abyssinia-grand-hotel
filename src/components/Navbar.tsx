import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { HOTEL_INFO } from '../data/hotelData';
import {
  Menu,
  X,
  Phone,
  Calendar,
  Compass,
  Sparkles,
  MessageCircle,
  MapPin,
  Clock,
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId, targetRoomId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addisTime, setAddisTime] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update Addis Ababa local time (East Africa Time: UTC+3)
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Africa/Addis_Ababa',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        setAddisTime(formatter.format(now));
      } catch {
        setAddisTime('Addis Ababa');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile menu on navigate
  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'rooms', label: 'Rooms & Suites' },
    { id: 'about', label: 'Our Story' },
    { id: 'dining', label: 'Fine Dining' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top micro bar for phone, location, Addis Ababa time, and WhatsApp */}
      <div
        className={`hidden lg:block transition-all duration-300 text-[11px] tracking-wider border-b border-[#2A2722] ${
          isScrolled
            ? 'h-0 opacity-0 overflow-hidden py-0'
            : 'bg-[#121110] text-[#B8AFA2] py-2 px-6'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#C59648]" />
              <span>Kazanchis, Bole Road, Addis Ababa</span>
            </div>
            {addisTime && (
              <div className="flex items-center gap-2 text-[#D8D0C3]">
                <Clock className="w-3.5 h-3.5 text-[#C59648]" />
                <span>Addis Ababa Time: <strong className="text-[#FAF8F5] font-semibold">{addisTime} (EAT)</strong></span>
              </div>
            )}
            <div className="flex items-center gap-2 text-[#9A9082]">
              <span>24/7 Diplomatic Concierge &bull; Curbside VIP Service</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a
              href={`tel:${HOTEL_INFO.phone}`}
              className="flex items-center gap-1.5 hover:text-[#C59648] transition-colors"
              aria-label="Call hotel reception"
            >
              <Phone className="w-3.5 h-3.5 text-[#C59648]" />
              <span className="text-[#FAF8F5]">{HOTEL_INFO.phone}</span>
            </a>
            <span className="text-[#3A3631]">|</span>
            <a
              href={`https://wa.me/${HOTEL_INFO.whatsappNumber}?text=Hello%20Abyssinia%20Grand%20Hotel,%20I%20would%20like%20to%20inquire%20about%20a%20reservation.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#25D366] hover:text-[#3ce679] transition-colors"
              aria-label="Direct WhatsApp concierge"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="text-[#E0DACF] hover:text-white font-medium">WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-[#121110]/95 backdrop-blur-md py-3.5 shadow-2xl border-b border-[#292621]'
            : 'bg-[#151413]/90 backdrop-blur-sm py-4 border-b border-[#2C2924]'
        }`}
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Tag */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-3.5 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C59648] shrink-0"
            aria-label="Abyssinia Grand Hotel Home"
          >
            {/* Elegant Hotel Emblem */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[2px] bg-gradient-to-br from-[#D3AA67] via-[#C59648] to-[#8A5D2E] p-[1px] flex items-center justify-center shadow-lg shrink-0">
              <div className="w-full h-full bg-[#151413] flex flex-col items-center justify-center text-center">
                <span className="font-serif text-[#FAF8F5] text-sm sm:text-lg font-bold leading-none tracking-widest group-hover:text-[#D3AA67] transition-colors">
                  A
                </span>
                <span className="text-[6px] sm:text-[7px] tracking-[0.2em] text-[#C59648] uppercase font-sans font-semibold">
                  GRAND
                </span>
              </div>
            </div>
            <div>
              <span className="block font-serif text-lg sm:text-2xl font-medium tracking-[0.08em] sm:tracking-[0.12em] text-[#FAF8F5] group-hover:text-[#D3AA67] transition-colors leading-tight">
                ABYSSINIA
              </span>
              <span className="block text-[8px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.28em] text-[#A69D8F] uppercase font-sans font-medium">
                Grand Hotel &bull; Addis Ababa
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2 text-xs uppercase tracking-[0.18em] font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'text-[#C59648]'
                      : 'text-[#E0DACF] hover:text-[#FFFFFF]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-[#C59648]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Desktop Right CTA: Book Now */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('booking')}
              className={`px-6 py-2.5 min-h-[44px] text-xs font-bold uppercase tracking-[0.22em] transition-all duration-300 flex items-center gap-2.5 rounded-[2px] shadow-md ${
                currentPage === 'booking'
                  ? 'bg-[#C59648] text-[#121110] ring-2 ring-[#FAF8F5]/40'
                  : 'bg-gradient-to-r from-[#B8973A] to-[#D3AA67] text-[#121110] hover:from-[#C59648] hover:to-[#E0C07F] hover:shadow-xl hover:-translate-y-0.5'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Your Stay</span>
            </button>
          </div>

          {/* Mobile Actions: Book Now Pill + Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 lg:hidden">
            <button
              onClick={() => handleNavClick('booking')}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 min-h-[38px] text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-[#C59648] text-[#121110] rounded-[2px] flex items-center gap-1 shadow-md active:scale-95"
            >
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Book</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 min-h-[44px] min-w-[44px] text-[#E0DACF] hover:text-[#C59648] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C59648] rounded-[2px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#C59648]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-[58px] sm:top-[65px] bg-[#121110] z-40 lg:hidden overflow-y-auto border-t border-[#2A2824] animate-fadeIn pb-12"
          style={{ animationDuration: '200ms' }}
        >
          <div className="px-5 sm:px-6 py-5 space-y-3">
            {addisTime && (
              <div className="pb-3 mb-2 border-b border-[#252320] flex items-center justify-between text-xs text-[#B8AFA2]">
                <span className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#C59648]" />
                  <span>Addis Ababa (EAT)</span>
                </span>
                <span className="text-[#FAF8F5] font-semibold">{addisTime}</span>
              </div>
            )}

            <div className="text-[11px] tracking-[0.25em] text-[#C59648] uppercase font-semibold pb-1">
              Menu Navigation
            </div>
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full text-left py-3.5 px-4 min-h-[48px] rounded-[2px] text-base tracking-wider font-medium transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-[#221F1B] text-[#C59648] border-l-2 border-[#C59648]'
                      : 'text-[#E0DACF] hover:bg-[#1C1A17] hover:text-white'
                  }`}
                >
                  <span className="uppercase text-sm tracking-widest">{link.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#C59648]" />}
                </button>
              );
            })}

            {/* Mobile Book Now button */}
            <div className="pt-4 pb-2">
              <button
                onClick={() => handleNavClick('booking')}
                className="w-full py-4 min-h-[48px] bg-gradient-to-r from-[#B8973A] to-[#D3AA67] text-[#121110] text-xs uppercase font-bold tracking-[0.22em] rounded-[2px] flex items-center justify-center gap-2 shadow-lg"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Your Room</span>
              </button>
            </div>

            {/* Mobile Quick Info */}
            <div className="pt-5 border-t border-[#252320] space-y-3.5 text-xs text-[#B8AFA2]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C59648] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{HOTEL_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C59648] shrink-0" />
                <a href={`tel:${HOTEL_INFO.phone}`} className="hover:text-white transition-colors text-sm font-medium">
                  {HOTEL_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href={`https://wa.me/${HOTEL_INFO.whatsappNumber}?text=Hello%20Abyssinia%20Grand%20Hotel,%20I%20would%20like%20to%20inquire%20about%20a%20stay.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:underline font-medium"
                >
                  WhatsApp Concierge Chat
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
