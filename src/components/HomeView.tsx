import React, { useState } from 'react';
import { PageId, Room, GalleryItem } from '../types';
import {
  ROOMS_DATA,
  HOTEL_AMENITIES,
  DINING_VENUES,
  GALLERY_ITEMS,
  TESTIMONIALS,
  NEARBY_LANDMARKS,
  HOTEL_INFO,
} from '../data/hotelData';
import { HOTEL_IMAGES } from '../assets/images';
import {
  Calendar,
  Users,
  BedDouble,
  ArrowRight,
  Sparkles,
  Waves,
  Coffee,
  Utensils,
  Car,
  Wifi,
  Dumbbell,
  Check,
  MapPin,
  Clock,
  Star,
  ShieldCheck,
  ChevronRight,
  Eye,
  MessageCircle,
  Building,
  ShoppingBag,
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (page: PageId, targetRoomId?: string) => void;
  onOpenLightbox: (item: GalleryItem) => void;
  onQuickSearch: (params: { checkIn: string; checkOut: string; guests: number; roomType: string }) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenLightbox,
  onQuickSearch,
}) => {
  // Quick booking bar state
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(todayStr);
  const [checkOut, setCheckOut] = useState(tomorrowStr);
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState('executive-room');

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickSearch({ checkIn, checkOut, guests, roomType });
    onNavigate('booking');
  };

  const getAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Waves':
        return <Waves className="w-5 h-5 text-[#C59648]" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#C59648]" />;
      case 'Building':
        return <Building className="w-5 h-5 text-[#C59648]" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-[#C59648]" />;
      case 'Users':
        return <Users className="w-5 h-5 text-[#C59648]" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-[#C59648]" />;
      case 'Car':
        return <Car className="w-5 h-5 text-[#C59648]" />;
      case 'Dumbbell':
        return <Dumbbell className="w-5 h-5 text-[#C59648]" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-[#C59648]" />;
      case 'Wifi':
      default:
        return <Wifi className="w-5 h-5 text-[#C59648]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#222222]">
      {/* 1. HERO SECTION */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Full-width hotel hero image background with overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={HOTEL_IMAGES.daylightFacade}
            alt="Duule Luxury Hotel Curved Blue Glass Architecture in Jijiga"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
          />
          {/* Subtle multi-layer gradient with deep midnight navy & brass undertones */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1622] via-[#0A1622]/65 to-black/45" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center text-white mt-12 sm:mt-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1C2A]/85 backdrop-blur-md border border-[#C59648]/40 mb-6 sm:mb-8 text-[11px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.25em] text-[#E0DACF] max-w-full">
            <span className="w-2 h-2 rounded-full bg-[#C59648] animate-pulse shrink-0" />
            <span className="truncate">Jijiga, Ethiopia &bull; 5-Star Landmark Hotel &bull; Rio Architects Design</span>
          </div>

          <h1 className="font-serif text-3xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-wide text-[#FAF8F5] drop-shadow-md leading-[1.12] mb-4 sm:mb-6">
            Duule Luxury Hotel
          </h1>

          <p className="max-w-2xl mx-auto font-serif italic text-base sm:text-2xl md:text-3xl text-[#E8DFC9] font-light mb-8 sm:mb-12 tracking-wide leading-relaxed">
            &ldquo;Where iconic curved glass architecture meets warm Somali-Ethiopian hospitality.&rdquo;
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-6">
            <button
              onClick={() => onNavigate('booking')}
              className="w-full sm:w-auto px-8 sm:px-9 py-4 min-h-[48px] bg-gradient-to-r from-[#B8973A] via-[#C59648] to-[#D3AA67] text-[#121110] text-xs uppercase font-bold tracking-[0.22em] rounded-[2px] shadow-2xl hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Your Stay</span>
            </button>
            <button
              onClick={() => onNavigate('rooms')}
              className="w-full sm:w-auto px-8 sm:px-9 py-4 min-h-[48px] bg-[#0E1F30]/80 backdrop-blur-md text-[#FAF8F5] border border-[#FAF8F5]/30 hover:border-[#C59648] hover:text-[#C59648] text-xs uppercase font-semibold tracking-[0.22em] rounded-[2px] transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95"
            >
              <span>Explore Accommodations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom subtle scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-xs text-[#E0DACF]/75 tracking-widest uppercase">
          <span className="text-[10px] tracking-[0.25em]">Scroll to Discover</span>
          <div className="w-[1px] h-7 bg-gradient-to-b from-[#C59648] to-transparent animate-pulse" />
        </div>
      </section>

      {/* QUICK RESERVATION BAR */}
      <section className="relative z-20 max-w-6xl mx-auto px-3.5 sm:px-4 -mt-8 sm:-mt-12">
        <div className="bg-[#0C1A27] text-[#FAF8F5] rounded-[2px] shadow-2xl p-4 sm:p-7 border border-[#1C3750]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1A334A] text-xs text-[#A6BFD3]">
            <span className="uppercase tracking-[0.2em] font-semibold text-[#C59648] text-[10px] sm:text-[11px]">
              Direct Booking Assurance
            </span>
            <span className="hidden sm:inline text-[#B8C9D8] text-xs">
              Best Rate Guaranteed &bull; Complimentary Wilwal Airport (JIJ) Shuttle
            </span>
          </div>
          <form
            onSubmit={handleQuickSearchSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 items-end"
          >
            <div>
              <label className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-[#A6BFD3] mb-1.5 font-medium">
                Check-in Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={checkIn}
                  min={todayStr}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-3.5 py-3 min-h-[44px] bg-[#102334] text-base sm:text-sm text-white border border-[#20405C] rounded-[2px] focus:outline-none focus:border-[#C59648] transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-[#A6BFD3] mb-1.5 font-medium">
                Check-out Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || todayStr}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-3.5 py-3 min-h-[44px] bg-[#102334] text-base sm:text-sm text-white border border-[#20405C] rounded-[2px] focus:outline-none focus:border-[#C59648] transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-[#A6BFD3] mb-1.5 font-medium">
                Guests
              </label>
              <div className="relative">
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-3.5 py-3 min-h-[44px] bg-[#102334] text-base sm:text-sm text-white border border-[#20405C] rounded-[2px] focus:outline-none focus:border-[#C59648] transition-colors"
                >
                  <option value={1}>1 Guest (Solo / Diplomat)</option>
                  <option value={2}>2 Guests (Double / Couple)</option>
                  <option value={3}>3 Guests (Family)</option>
                  <option value={4}>4 Guests (Family Suite / Group)</option>
                  <option value={5}>5+ Guests (Penthouse / Delegation)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-[#A6BFD3] mb-1.5 font-medium">
                Preferred Room
              </label>
              <div className="relative">
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full px-3.5 py-3 min-h-[44px] bg-[#102334] text-base sm:text-sm text-white border border-[#20405C] rounded-[2px] focus:outline-none focus:border-[#C59648] transition-colors"
                >
                  <option value="deluxe-room">Deluxe Room ($85 / night)</option>
                  <option value="executive-room">Executive Business Suite ($125 / night)</option>
                  <option value="family-suite">Family Luxury Suite ($165 / night)</option>
                  <option value="presidential-suite">Presidential Suite ($240 / night)</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3.5 px-4 min-h-[48px] bg-gradient-to-r from-[#B8973A] to-[#D3AA67] hover:from-[#C59648] hover:to-[#E0C07F] text-[#121110] text-xs uppercase font-bold tracking-[0.2em] rounded-[2px] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg active:scale-95"
              >
                <span>Check Rates</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 2. SHORT INTRODUCTION */}
      <section className="py-16 sm:py-28 lg:py-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold">
              <span className="w-6 h-[1px] bg-[#C59648]" />
              <span>Jijiga’s Architectural Crown</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#171615] font-normal leading-[1.16]">
              A Five-Star Landmark in the Somali Region of Ethiopia
            </h2>

            <p className="text-base sm:text-lg text-[#443E35] leading-relaxed font-light">
              Duule Luxury Hotel stands as Jijiga’s premier 5-star landmark. Designed by renowned Rio Architects, our iconic curved azure-blue glass curtain high-rise, grand stylized entrance columns, and Italian marble atrium redefine luxury hospitality across the Somali Region.
            </p>

            <p className="text-sm sm:text-base text-[#5C5549] leading-relaxed">
              Whether you are an international diplomat attending high-level regional summits, an NGO official, an executive, or a family celebrating life’s milestones, Duule welcomes you with spotless executive comfort, an indoor heated pool, cedar sauna, and exquisite Somali-Ethiopian fine dining.
            </p>

            <div className="pt-6 flex flex-wrap items-center gap-6 sm:gap-12 border-t border-[#E8E3DA]">
              <div>
                <span className="block font-serif text-3xl sm:text-4xl font-semibold text-[#C59648]">70+</span>
                <span className="text-xs uppercase tracking-wider text-[#6B6355]">Luxury Rooms &amp; Suites</span>
              </div>
              <div>
                <span className="block font-serif text-3xl sm:text-4xl font-semibold text-[#C59648]">15 Min</span>
                <span className="text-xs uppercase tracking-wider text-[#6B6355]">From Wilwal (JIJ) Airport</span>
              </div>
              <div>
                <span className="block font-serif text-3xl sm:text-4xl font-semibold text-[#C59648]">2</span>
                <span className="text-xs uppercase tracking-wider text-[#6B6355]">Grand Summit Ballrooms</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onNavigate('about')}
                className="text-xs uppercase tracking-[0.22em] font-semibold text-[#171615] hover:text-[#C59648] flex items-center gap-2 group transition-colors min-h-[44px]"
              >
                <span>Discover Our Architecture &amp; Story</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative z-10 rounded-[2px] overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={HOTEL_IMAGES.nightFountain}
                alt="Duule Luxury Hotel Illuminated Night Entrance and Fountain in Jijiga"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-72 sm:h-96 lg:h-[480px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Overlapping small accent card */}
            <div className="absolute -bottom-8 -left-6 sm:-left-8 bg-[#0C1A27] text-white p-6 rounded-[2px] shadow-2xl border border-[#1A3852] max-w-[320px] z-20 hidden sm:block">
              <div className="flex items-center gap-2 text-[#C59648] mb-2.5">
                <Waves className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest font-semibold">Heated Indoor Pool &amp; Spa</span>
              </div>
              <p className="text-xs text-[#B8C9D8] leading-relaxed">
                Rejuvenate in our turquoise mosaic indoor pool and Finnish cedar sauna suites after traveling into Jijiga.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED ROOMS */}
      <section className="py-16 sm:py-28 lg:py-36 bg-[#F2EFE9] border-y border-[#E5E0D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold mb-2">
                <span className="w-6 h-[1px] bg-[#C59648]" />
                <span>Private Sanctuaries</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#171615] font-normal">
                Featured Accommodations
              </h2>
            </div>
            <button
              onClick={() => onNavigate('rooms')}
              className="text-xs uppercase tracking-[0.22em] font-semibold text-[#171615] hover:text-[#C59648] flex items-center gap-2 transition-colors self-start md:self-end min-h-[44px]"
            >
              <span>View All 4 Room Classes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ROOMS_DATA.slice(0, 3).map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-[2px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-[#E0DACF] flex flex-col group hover:-translate-y-1"
              >
                {/* Image container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                  <img
                    src={room.image}
                    alt={room.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-[#0C1A27]/90 backdrop-blur-md px-3.5 py-1.5 text-xs text-[#FAF8F5] tracking-wider rounded-[2px] border border-[#1A3852] shadow-lg">
                    From <span className="font-serif text-base font-bold text-[#D3AA67]">${room.pricePerNight}</span> / night
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 text-[11px] font-medium tracking-wide text-[#171615] rounded-[2px] shadow-sm">
                    {room.view}
                  </div>
                </div>

                {/* Body details */}
                <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl text-[#171615] font-normal mb-2 group-hover:text-[#C59648] transition-colors">
                      {room.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#635C50] mb-5 line-clamp-2 leading-relaxed font-light">
                      {room.tagline}
                    </p>

                    {/* Room Key specs */}
                    <div className="grid grid-cols-2 gap-2.5 text-xs text-[#4A453D] pb-5 mb-5 border-b border-[#EFEBE3]">
                      <div className="flex items-center gap-2">
                        <BedDouble className="w-3.5 h-3.5 text-[#C59648] shrink-0" />
                        <span className="truncate">{room.bedType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-[#C59648] shrink-0" />
                        <span>Up to {room.capacity} Guests</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wifi className="w-3.5 h-3.5 text-[#C59648] shrink-0" />
                        <span>Fast Fiber Wi-Fi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Coffee className="w-3.5 h-3.5 text-[#C59648] shrink-0" />
                        <span className="truncate">{room.breakfastIncluded ? 'Breakfast Included' : 'Breakfast Available'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => onNavigate('booking', room.id)}
                      className="flex-1 py-3 px-4 min-h-[44px] bg-[#0C1A27] hover:bg-[#C59648] hover:text-[#121110] text-white text-xs uppercase font-bold tracking-[0.2em] rounded-[2px] transition-all text-center active:scale-95"
                    >
                      Reserve Room
                    </button>
                    <button
                      onClick={() => onNavigate('rooms', room.id)}
                      className="p-3 min-h-[44px] min-w-[44px] border border-[#D1CAC0] text-[#171615] hover:border-[#C59648] hover:text-[#C59648] rounded-[2px] transition-colors flex items-center justify-center"
                      title="View room details"
                      aria-label={`View details for ${room.name}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOTEL AMENITIES */}
      <section className="py-16 sm:py-28 lg:py-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold mb-3">
            <span className="w-6 h-[1px] bg-[#C59648]" />
            <span>5-Star Comfort &amp; Facilities</span>
            <span className="w-6 h-[1px] bg-[#C59648]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#171615] font-normal mb-4">
            Curated Hotel Amenities
          </h2>
          <p className="text-base sm:text-lg text-[#554F44] leading-relaxed font-light">
            Every amenity at Duule Luxury Hotel has been conceived to ensure effortless relaxation, productive diplomatic engagements, and restorative wellness in Jijiga.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {HOTEL_AMENITIES.map((amenity) => (
            <div
              key={amenity.id}
              className="p-6 sm:p-7 bg-white rounded-[2px] border border-[#E8E3DA] hover:border-[#C59648]/70 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="w-12 h-12 rounded-[2px] bg-[#FAF6EE] flex items-center justify-center mb-5 group-hover:bg-[#C59648]/15 transition-colors">
                  {getAmenityIcon(amenity.iconName)}
                </div>

                {amenity.badge && (
                  <span className="inline-block px-2.5 py-1 text-[10px] uppercase tracking-wider bg-[#F4EFE6] text-[#7E6324] font-semibold rounded-[2px] mb-2.5">
                    {amenity.badge}
                  </span>
                )}

                <h3 className="font-serif text-xl text-[#171615] font-medium mb-2.5 group-hover:text-[#C59648] transition-colors">
                  {amenity.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#635C50] leading-relaxed font-light">
                  {amenity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. DINING SECTION PREVIEW */}
      <section className="py-16 sm:py-28 lg:py-36 bg-[#0B1724] text-[#FAF8F5] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold">
                <span className="w-6 h-[1px] bg-[#C59648]" />
                <span>Culinary Excellence</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#FAF8F5] font-normal leading-[1.16]">
                Somali Traditions &amp; International Gastronomy
              </h2>

              <p className="text-sm sm:text-base text-[#C2BAAD] leading-relaxed font-light">
                Experience Somali culinary specialties alongside beloved Ethiopian dishes and continental classics. Indulge in tender spiced camel medallions, aromatic basmati rice, tender goat suqaar, and freshly brewed Somali spiced milk tea.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#C59648] shrink-0 mt-1" />
                  <span className="text-xs sm:text-sm text-[#E0DACF]">
                    100% Halal certified kitchen serving tender camel fillet steaks, spiced basmati &amp; goat suqaar
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#C59648] shrink-0 mt-1" />
                  <span className="text-xs sm:text-sm text-[#E0DACF]">
                    Fresh morning bakery with delicate Somali malawax crepes, pure mountain honey &amp; Harar coffee
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#C59648] shrink-0 mt-1" />
                  <span className="text-xs sm:text-sm text-[#E0DACF]">
                    Panoramic skyline terrace with sunset views of Jijiga and handcrafted artisan mocktails
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onNavigate('dining')}
                  className="w-full sm:w-auto px-8 py-4 min-h-[48px] bg-gradient-to-r from-[#B8973A] to-[#D3AA67] hover:from-[#C59648] hover:to-[#E0C07F] text-[#121110] text-xs uppercase font-bold tracking-[0.22em] rounded-[2px] transition-all inline-flex items-center justify-center gap-2.5 shadow-xl hover:-translate-y-0.5 active:scale-95"
                >
                  <span>Explore Restaurants &amp; Menus</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-5">
                <div className="rounded-[2px] overflow-hidden shadow-xl border border-[#1E3750] group">
                  <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
                    alt="Duule Grand Restaurant Dining Room"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="p-4 sm:p-5 bg-[#0F2233] border-t border-[#1C364D]">
                    <h4 className="font-serif text-lg text-white font-medium">Duule Grand Restaurant</h4>
                    <p className="text-xs text-[#A6BFD3] mt-1 font-light">Authentic Somali &amp; Ethiopian culinary specialties</p>
                  </div>
                </div>
                <div className="rounded-[2px] overflow-hidden shadow-xl border border-[#1E3750] group">
                  <img
                    src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
                    alt="Somali and Ethiopian Spiced Coffee and Tea Ritual"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-44 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="p-4 bg-[#0F2233] border-t border-[#1C364D]">
                    <h4 className="font-serif text-base text-white font-medium">Spiced Tea &amp; Coffee Lounge</h4>
                    <p className="text-xs text-[#A6BFD3] mt-0.5 font-light">Traditional Shaah Cadays &amp; freshly roasted beans</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 pt-0 sm:pt-8">
                <div className="rounded-[2px] overflow-hidden shadow-xl border border-[#1E3750] group">
                  <img
                    src={HOTEL_IMAGES.cafePatio}
                    alt="Duule Garden Cafe Terrace & Pergola Lounge"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-44 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="p-4 bg-[#0F2233] border-t border-[#1C364D]">
                    <h4 className="font-serif text-base text-white font-medium">Outdoor Garden Cafe &amp; Lounge</h4>
                    <p className="text-xs text-[#A6BFD3] mt-0.5 font-light">Pergola terrace with wicker seating &amp; spiced tea</p>
                  </div>
                </div>
                <div className="rounded-[2px] overflow-hidden shadow-xl border border-[#1E3750] group">
                  <img
                    src="https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80"
                    alt="Sunrise Buffet & Bakery"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="p-4 sm:p-5 bg-[#0F2233] border-t border-[#1C364D]">
                    <h4 className="font-serif text-lg text-white font-medium">Sunrise Buffet &amp; Bakery</h4>
                    <p className="text-xs text-[#A6BFD3] mt-1 font-light">Freshly baked viennoiserie, malawax &amp; fruit station</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. GALLERY PREVIEW */}
      <section className="py-16 sm:py-28 lg:py-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold mb-2">
              <span className="w-6 h-[1px] bg-[#C59648]" />
              <span>Visual Showcase</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#171615] font-normal">
              Scenes of Duule Luxury Hotel
            </h2>
          </div>
          <button
            onClick={() => onNavigate('gallery')}
            className="text-xs uppercase tracking-[0.22em] font-semibold text-[#171615] hover:text-[#C59648] flex items-center gap-2 transition-colors self-start md:self-end min-h-[44px]"
          >
            <span>Open Full Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {GALLERY_ITEMS.slice(0, 8).map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => onOpenLightbox(item)}
              aria-label={`View photo: ${item.title}`}
              className="group relative h-56 sm:h-72 rounded-[2px] overflow-hidden cursor-pointer shadow-sm border border-[#E5E0D6] bg-neutral-900 text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C59648]"
            >
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D3AA67] font-semibold mb-1">
                  {item.categoryLabel}
                </span>
                <p className="font-serif text-sm sm:text-base font-medium leading-snug">
                  {item.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 7. LOCATION & JIJIGA LANDMARKS */}
      <section className="py-16 sm:py-24 lg:py-32 bg-[#F2EFE9] border-y border-[#E5E0D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold">
                <span className="w-6 h-[1px] bg-[#C59648]" />
                <span>Prime Central Address</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#171615] font-normal leading-[1.18]">
                In the Heart of Jijiga near Sayidka Monument
              </h2>

              <p className="text-base text-[#4D473D] leading-relaxed font-light">
                Positioned on the main boulevard of Jijiga, Duule Luxury Hotel places you within walking distance of the historic Sayidka equestrian statue and a quick drive from Wilwal International Airport, Jigjiga University, and regional government headquarters.
              </p>

              <div className="space-y-3 pt-2">
                {NEARBY_LANDMARKS.slice(0, 4).map((landmark, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-4 bg-white rounded-[2px] border border-[#E0DACF] flex items-center justify-between hover:border-[#C59648]/60 transition-colors shadow-xs"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-[#171615]">{landmark.name}</h4>
                      <p className="text-xs text-[#6B6355] mt-0.5">{landmark.description}</p>
                    </div>
                    <div className="text-right shrink-0 pl-3 sm:pl-4">
                      <span className="block text-xs font-semibold text-[#C59648]">{landmark.distance}</span>
                      <span className="text-[10px] sm:text-[11px] text-[#8C8375]">{landmark.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-xs uppercase tracking-[0.22em] font-semibold text-[#171615] hover:text-[#C59648] flex items-center gap-2 transition-colors min-h-[44px]"
                >
                  <span>Interactive Map &amp; Airport Chauffeur</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-[2px] overflow-hidden shadow-2xl border border-[#DCD6CA] bg-white p-5 sm:p-8">
                <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-[#E8E3DA]">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#171615]">Hotel Arrival &amp; Airport VIP Shuttle</h3>
                    <p className="text-xs text-[#736B5F] mt-1">Direct transfers to/from Wilwal International Airport (JIJ)</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[2px] bg-[#FAF6EE] flex items-center justify-center text-[#C59648] shrink-0">
                    <Car className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>

                <div className="py-6 sm:py-7 space-y-4 sm:space-y-5 text-xs sm:text-sm text-[#4A453D]">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#C59648] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#171615] block mb-0.5">Hotel Address:</strong>
                      <span className="leading-relaxed">{HOTEL_INFO.address}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#C59648] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#171615] block mb-0.5">Check-in &amp; Check-out:</strong>
                      <span>Check-in: {HOTEL_INFO.checkInTime} &bull; Check-out: {HOTEL_INFO.checkOutTime}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-[#C59648] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#171615] block mb-0.5">Wilwal Airport Pickup:</strong>
                      <span>Complimentary flight monitoring and curbside executive pickup for guests.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 sm:pt-5 border-t border-[#E8E3DA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-xs text-[#6B6355]">Need private chauffeur assistance?</span>
                  <a
                    href={`tel:${HOTEL_INFO.phone}`}
                    className="w-full sm:w-auto text-center text-xs font-bold uppercase tracking-wider text-[#171615] hover:text-[#C59648] transition-colors py-2.5 px-3.5 border border-[#D5CEC2] rounded-[2px]"
                  >
                    Call {HOTEL_INFO.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. GUEST EXPERIENCE / TESTIMONIALS */}
      <section className="py-16 sm:py-28 lg:py-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold mb-3">
            <span className="w-6 h-[1px] bg-[#C59648]" />
            <span>Honored Guests</span>
            <span className="w-6 h-[1px] bg-[#C59648]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#171615] font-normal mb-4">
            Guest Impressions &amp; Memories
          </h2>
          <p className="text-base sm:text-lg text-[#554F44] leading-relaxed font-light">
            Reflections from regional diplomats, international consultants, and families who make Duule Luxury Hotel their home in Jijiga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-6 sm:p-9 bg-white rounded-[2px] border border-[#E8E3DA] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center gap-1 text-[#C59648] mb-4 sm:mb-5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <blockquote className="font-serif italic text-base sm:text-lg text-[#2A2723] leading-relaxed mb-6 sm:mb-8">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>

              <div className="pt-5 sm:pt-6 border-t border-[#F0ECE4] flex items-center gap-3.5">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#C59648]/40 shrink-0"
                />
                <div>
                  <h4 className="text-sm font-semibold text-[#171615]">{t.author}</h4>
                  <p className="text-xs text-[#635C50]">{t.title}</p>
                  <p className="text-[11px] text-[#8C8375] mt-0.5">{t.country} &bull; {t.roomType}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FINAL BOOKING CTA BANNER */}
      <section className="relative py-16 sm:py-28 lg:py-36 bg-[#091520] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={HOTEL_IMAGES.nightFountain}
            alt="Duule Luxury Hotel Evening Atmosphere"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#C59648] font-semibold mb-3 sm:mb-4 block">
            Plan Your Journey To Jijiga
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-tight mb-4 sm:mb-6 text-[#FAF8F5]">
            Experience 5-Star Luxury in Jijiga
          </h2>
          <p className="text-sm sm:text-lg text-[#D0C8BC] max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-light">
            Secure your sanctuary today. Enjoy direct booking assurance, flexible cancellation, and complimentary Wilwal Airport transfer service.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5">
            <button
              onClick={() => onNavigate('booking')}
              className="w-full sm:w-auto px-8 sm:px-10 py-4 min-h-[48px] bg-gradient-to-r from-[#B8973A] via-[#C59648] to-[#D3AA67] text-[#121110] text-xs uppercase font-bold tracking-[0.22em] rounded-[2px] shadow-2xl hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Your Room</span>
            </button>
            <a
              href={`https://wa.me/${HOTEL_INFO.whatsappNumber}?text=Hello%20Duule%20Luxury%20Hotel,%20I%20would%20like%20to%20inquire%20about%20a%20stay.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 sm:px-9 py-4 min-h-[48px] bg-[#0E1F30] border border-[#20405C] text-[#FAF8F5] hover:border-[#C59648] hover:text-[#C59648] text-xs uppercase font-semibold tracking-[0.22em] rounded-[2px] transition-all text-center flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
