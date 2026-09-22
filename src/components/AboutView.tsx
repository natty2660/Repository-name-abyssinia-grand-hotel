import React from 'react';
import { PageId } from '../types';
import { HOTEL_STATS, SUSTAINABILITY_POINTS, HOTEL_INFO } from '../data/hotelData';
import { HOTEL_IMAGES } from '../assets/images';
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
  Waves,
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
            <span>Our Heritage &amp; Architecture</span>
            <span className="w-6 h-[1px] bg-[#C59648]" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#171615] font-normal mb-4 sm:mb-6 leading-tight">
            The Architectural Crown of Jijiga
          </h1>
          <p className="text-sm sm:text-lg text-[#5D564A] leading-relaxed font-light">
            Designed by Rio Architects, Duule Luxury Hotel merges iconic curved blue-glass architecture, heated indoor wellness, and warm Somali-Ethiopian hospitality in the heart of the Somali Regional State.
          </p>
        </div>
      </div>

      {/* 2. Hotel Story & Heritage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 relative">
            <div className="rounded-[2px] overflow-hidden shadow-2xl border-2 sm:border-4 border-white">
              <img
                src={HOTEL_IMAGES.daylightFacade}
                alt="Duule Luxury Hotel Curved Glass Architecture in Jijiga"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-72 sm:h-[460px] lg:h-[520px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-[#0C1A27] text-white p-6 sm:p-7 rounded-[2px] shadow-2xl border border-[#1A3852] max-w-xs hidden sm:block">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D3AA67] font-semibold block mb-1.5">
                Designed by Rio Architects
              </span>
              <p className="text-xs text-[#A6BFD3] leading-relaxed font-light">
                An architectural masterpiece featuring a curved azure glass curtain wall and double-height entrance columns defining the Jijiga skyline.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold">
              <span className="w-6 h-[1px] bg-[#C59648]" />
              <span>Chapter I &bull; The Vision</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#171615] font-normal leading-tight">
              Elevating the Somali Region with Five-Star Distinction
            </h2>

            <p className="text-sm sm:text-base text-[#555047] leading-relaxed font-light">
              Jijiga is a vibrant commercial and diplomatic gateway in the Horn of Africa, rich with trading history and cultural pride. Duule Luxury Hotel was created to provide this dynamic region with a world-class hospitality sanctuary that rivals premier international hotels.
            </p>

            <p className="text-xs sm:text-sm text-[#6B6458] leading-relaxed font-light">
              Conceived in partnership with renowned Rio Architects, our building features a signature curved azure-blue glass facade, an Italian cream marble reception lounge with back-lit golden onyx, and a serene heated indoor swimming pool. Every element is tailored for diplomatic delegates, visiting delegations, and celebrating families.
            </p>

            <div className="p-5 sm:p-6 bg-[#FAF6EE] rounded-[2px] border-l-2 border-[#C59648] space-y-1.5">
              <h4 className="font-serif text-base sm:text-lg text-[#171615]">Our Guiding Philosophy</h4>
              <p className="text-xs sm:text-sm text-[#6B6458] italic leading-relaxed">
                &ldquo;True luxury combines breathtaking architecture with the genuine warmth of welcoming every traveler as an honored guest in Jijiga.&rdquo;
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
              Our Pillars
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#171615] font-normal">
              Four Foundations of Duule Luxury Hotel
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-[2px] border border-[#E0DACF] shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-[2px] bg-[#FAF6EE] flex items-center justify-center mb-5 text-[#C59648]">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-[#171615] font-medium mb-2.5">
                Somali-Ethiopian Hospitality
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6458] leading-relaxed font-light">
                Generous, respectful, and attentive. We greet every arriving guest with traditional cardamom milk tea, single-origin coffee, and dedicated personalized care.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-[2px] border border-[#E0DACF] shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-[2px] bg-[#FAF6EE] flex items-center justify-center mb-5 text-[#C59648]">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-[#171615] font-medium mb-2.5">
                Landmark Architecture
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6458] leading-relaxed font-light">
                Rio Architects design featuring curved blue glass, heated indoor swimming pool, cedar sauna, and two column-free grand event centers.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-[2px] border border-[#E0DACF] shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-[2px] bg-[#FAF6EE] flex items-center justify-center mb-5 text-[#C59648]">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-[#171615] font-medium mb-2.5">
                Diplomatic &amp; VIP Service
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6458] leading-relaxed font-light">
                Multilingual staff fluent in Somali, Amharic, English, and Arabic, catering to international organizations, summit delegations, and wedding banquets.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-[2px] border border-[#E0DACF] shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-[2px] bg-[#FAF6EE] flex items-center justify-center mb-5 text-[#C59648]">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-[#171615] font-medium mb-2.5">
                Regional Stewardship
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6458] leading-relaxed font-light">
                100% Halal certified kitchens supporting local Somali and Ethiopian farmers, solar-assisted water heating, and career training for regional youth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Hotel Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-28">
        <div className="bg-[#0C1A27] text-[#FAF8F5] p-6 sm:p-12 lg:p-16 rounded-[2px] border border-[#1A3852] shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold block mb-2">
              By The Numbers
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-white">
              The Premier Hospitality Destination in Jijiga
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-[#1A3852]">
            {HOTEL_STATS.map((stat, i) => (
              <div key={i} className="pt-4 lg:pt-0 px-2 sm:px-4">
                <span className="block font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#D3AA67] mb-1.5">
                  {stat.value}
                </span>
                <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white mb-0.5">
                  {stat.label}
                </h4>
                <p className="text-[11px] sm:text-xs text-[#A6BFD3]">
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
              <span>Community &amp; Ecology</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#171615] font-normal leading-tight">
              Empowering Jijiga &amp; Preserving Regional Resources
            </h2>

            <p className="text-sm sm:text-base text-[#555047] leading-relaxed font-light">
              We actively invest in the development of our home city, Jijiga. From supporting regional pastoralists and farmers to introducing energy-efficient architectural innovations, we take our role seriously.
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
              src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80"
              alt="Heated Indoor Pool at Duule"
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full h-48 sm:h-72 object-cover rounded-[2px] shadow-md hover:scale-105 transition-transform duration-500"
            />
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
              alt="Sauna and Spa at Duule"
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
          Experience Duule Luxury Hotel In Person
        </h3>
        <p className="text-xs sm:text-base text-[#6B6458] mb-8 sm:mb-10 max-w-xl mx-auto font-light leading-relaxed">
          Our concierge team is available 24 hours a day to assist with room selections, event bookings, and Wilwal Airport transfers.
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
