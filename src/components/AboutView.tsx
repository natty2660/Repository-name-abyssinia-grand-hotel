import React from 'react';
import { PageId } from '../types';
import { HOTEL_STATS, SUSTAINABILITY_POINTS, HOTEL_INFO } from '../data/hotelData';
import {
  Sparkles,
  HeartHandshake,
  Building2,
  Users2,
  Leaf,
  ShieldCheck,
  Award,
  ArrowRight,
  Coffee,
  Globe2,
} from 'lucide-react';

interface AboutViewProps {
  onNavigate: (page: PageId) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#222222] pt-24 sm:pt-32 pb-24 sm:pb-32">
      {/* 1. Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold mb-3">
            <span className="w-6 h-[1px] bg-[#C59648]" />
            <span>Our Heritage</span>
            <span className="w-6 h-[1px] bg-[#C59648]" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#171615] font-normal mb-4 sm:mb-6 leading-tight">
            The Soul of Abyssinian Hospitality
          </h1>
          <p className="text-sm sm:text-lg text-[#5D564A] leading-relaxed font-light">
            Founded with a vision to share Ethiopia’s legendary warmth, culture, and ancient traditions with the world’s most discerning travelers.
          </p>
        </div>
      </div>

      {/* 2. Hotel Story & Heritage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 relative">
            <div className="rounded-[2px] overflow-hidden shadow-2xl border-2 sm:border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85"
                alt="Abyssinia Grand Hotel Architecture"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-72 sm:h-[460px] lg:h-[520px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-[#171615] text-white p-6 sm:p-7 rounded-[2px] shadow-2xl border border-[#33302B] max-w-xs hidden sm:block">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D3AA67] font-semibold block mb-1.5">
                Rooted in Addis Ababa
              </span>
              <p className="text-xs text-[#B8AFA2] leading-relaxed font-light">
                A beacon of architectural grace situated at the crossroads of African diplomacy and cultural preservation.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold">
              <span className="w-6 h-[1px] bg-[#C59648]" />
              <span>Chapter I &bull; The Origin</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#171615] font-normal leading-tight">
              Honoring an Ancient Land of Warmth, Coffee &amp; Sanctuary
            </h2>

            <p className="text-sm sm:text-base text-[#555047] leading-relaxed font-light">
              Ethiopia is the cradle of humanity and the historic birthplace of coffee. For millennia, travelers crossing the Horn of Africa were welcomed with open hearths, freshly washed feet, and the ceremonial pour of coffee—an unhurried declaration that in Ethiopia, a guest is never a stranger, but an honored blessing.
            </p>

            <p className="text-xs sm:text-sm text-[#6B6458] leading-relaxed font-light">
              Abyssinia Grand Hotel was established over sixteen years ago to translate that profound cultural ethos into an uncompromising five-star luxury hotel experience. Built using locally quarried limestone, bespoke native wanza and kosso wood cabinetry, and handwoven Arba Minch cotton, every corridor reflects timeless African grandeur.
            </p>

            <div className="p-5 sm:p-6 bg-[#FAF6EE] rounded-[2px] border-l-2 border-[#C59648] space-y-1.5">
              <h4 className="font-serif text-base sm:text-lg text-[#171615]">Our Guiding Philosophy</h4>
              <p className="text-xs sm:text-sm text-[#6B6458] italic leading-relaxed">
                &ldquo;True luxury is not merely flawless marble or high thread counts; it is the feeling of being genuinely known, anticipated, and cherished by the hands that welcome you.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Core Pillars */}
      <section className="py-16 sm:py-24 bg-[#F2EFE9] border-y border-[#E5E0D6] mb-16 sm:mb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold mb-2 block">
              Our Mission
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#171615] font-normal">
              Four Pillars of Our Grand Standard
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-[2px] border border-[#E0DACF] shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-[2px] bg-[#FAF6EE] flex items-center justify-center mb-5 text-[#C59648]">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-[#171615] font-medium mb-2.5">
                Ethiopian Hospitality
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6458] leading-relaxed font-light">
                Warm, attentive, and authentic. We greet every arriving traveler as our most honored guest with traditional care and heartfelt kindness.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-[2px] border border-[#E0DACF] shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-[2px] bg-[#FAF6EE] flex items-center justify-center mb-5 text-[#C59648]">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-[#171615] font-medium mb-2.5">
                Modern Facilities
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6458] leading-relaxed font-light">
                Dual redundant fiber optics, smart climate systems, heated skyline pool, high-altitude fitness suite, and international conference technology.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-[2px] border border-[#E0DACF] shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-[2px] bg-[#FAF6EE] flex items-center justify-center mb-5 text-[#C59648]">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-[#171615] font-medium mb-2.5">
                Professional Service
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6458] leading-relaxed font-light">
                Multilingual concierge staff fluent in Amharic, English, French, Arabic, and Mandarin, trained to international luxury butler standards.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-[2px] border border-[#E0DACF] shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-[2px] bg-[#FAF6EE] flex items-center justify-center mb-5 text-[#C59648]">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-[#171615] font-medium mb-2.5">
                Green Stewardship
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6458] leading-relaxed font-light">
                Direct highland organic farming partnerships, 100% renewable hydroelectric and solar heating, and zero single-use plastics across our hotel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Hotel Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-28">
        <div className="bg-[#171615] text-[#FAF8F5] p-6 sm:p-12 lg:p-16 rounded-[2px] border border-[#33302B] shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold block mb-2">
              Our Journey in Numbers
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-white">
              An Established Benchmark of African Hospitality
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-[#2B2824]">
            {HOTEL_STATS.map((stat, i) => (
              <div key={i} className="pt-4 lg:pt-0 px-2 sm:px-4">
                <span className="block font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#D3AA67] mb-1.5">
                  {stat.value}
                </span>
                <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white mb-0.5">
                  {stat.label}
                </h4>
                <p className="text-[11px] sm:text-xs text-[#8C8375]">
                  {stat.sublabel}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Sustainability & Local Community Commitment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold">
              <span className="w-6 h-[1px] bg-[#C59648]" />
              <span>Eco-Responsible Tourism</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#171615] font-normal leading-tight">
              Caring For Our Communities &amp; Ethiopian Ecology
            </h2>

            <p className="text-sm sm:text-base text-[#555047] leading-relaxed font-light">
              We consider ourselves custodians of Ethiopia’s pristine natural wonders and precious cultural arts. Every cup of coffee served and every linen washed is done with deep mindfulness toward environmental impact.
            </p>

            <div className="space-y-3.5 pt-2">
              {SUSTAINABILITY_POINTS.map((point, index) => (
                <div key={index} className="p-4 sm:p-5 bg-white rounded-[2px] border border-[#E5E0D6] shadow-sm">
                  <h4 className="font-serif text-sm sm:text-base font-medium text-[#171615] mb-1">
                    {point.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#6B6458] leading-relaxed font-light">
                    {point.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
            <img
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
              alt="Highland Coffee Heritage"
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full h-48 sm:h-72 object-cover rounded-[2px] shadow-md hover:scale-105 transition-transform duration-500"
            />
            <img
              src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80"
              alt="Sustainable Resort Grounds"
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full h-48 sm:h-72 object-cover rounded-[2px] shadow-md mt-4 sm:mt-6 hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* 6. Contact & Book CTA */}
      <section className="text-center py-12 sm:py-16 border-t border-[#EAE5DC] max-w-4xl mx-auto px-4">
        <h3 className="font-serif text-2xl sm:text-4xl text-[#171615] mb-3 sm:mb-4">
          Experience Abyssinia Grand Hotel In Person
        </h3>
        <p className="text-xs sm:text-base text-[#6B6458] mb-8 sm:mb-10 max-w-xl mx-auto font-light leading-relaxed">
          Our team is on call 24 hours a day to assist with room selection, personalized itineraries, and airport transfers.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
          <button
            onClick={() => onNavigate('booking')}
            className="w-full sm:w-auto px-8 py-3.5 sm:py-4 min-h-[48px] bg-gradient-to-r from-[#B8973A] to-[#D3AA67] hover:from-[#C59648] hover:to-[#E0C07F] text-[#121110] text-xs uppercase font-bold tracking-[0.22em] rounded-[2px] transition-all shadow-md active:scale-95 flex items-center justify-center"
          >
            Book Your Stay
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="w-full sm:w-auto px-8 py-3.5 sm:py-4 min-h-[48px] border border-[#171615] text-[#171615] hover:bg-[#171615] hover:text-white text-xs uppercase font-bold tracking-[0.22em] rounded-[2px] transition-all active:scale-95 flex items-center justify-center"
          >
            Contact Concierge
          </button>
        </div>
      </section>
    </div>
  );
};
