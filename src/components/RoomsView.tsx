import React, { useState, useEffect } from 'react';
import { PageId, Room } from '../types';
import { ROOMS_DATA, HOTEL_INFO } from '../data/hotelData';
import {
  BedDouble,
  Users,
  Wifi,
  Coffee,
  Briefcase,
  Maximize,
  Sparkles,
  Check,
  Calendar,
  X,
  Shield,
  ArrowRight,
  Eye,
  Info,
} from 'lucide-react';

interface RoomsViewProps {
  onNavigate: (page: PageId, targetRoomId?: string) => void;
  selectedRoomId?: string;
}

export const RoomsView: React.FC<RoomsViewProps> = ({ onNavigate, selectedRoomId }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'rooms' | 'suites'>('all');
  const [modalRoom, setModalRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (!modalRoom) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalRoom(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalRoom]);

  const filteredRooms = ROOMS_DATA.filter((room) => {
    if (activeTab === 'rooms') return room.id !== 'presidential-suite';
    if (activeTab === 'suites') return room.id === 'presidential-suite';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#222222] pt-24 sm:pt-32 pb-24 sm:pb-32">
      {/* Page Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold mb-3">
            <span className="w-6 h-[1px] bg-[#C59648]" />
            <span>Accommodations</span>
            <span className="w-6 h-[1px] bg-[#C59648]" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#171615] font-normal mb-4 sm:mb-5 leading-tight">
            Sanctuaries of Quiet Elegance
          </h1>
          <p className="text-sm sm:text-lg text-[#5D564A] leading-relaxed font-light">
            Each guestroom and suite at Abyssinia Grand Hotel balances rich Ethiopian craftsmanship with contemporary European luxury appointments, soundproofed architecture, and panoramic capital vistas.
          </p>
        </div>

        {/* Filter Tabs - Mobile Responsive Grid */}
        <div className="flex justify-center mt-8 sm:mt-10 px-1 sm:px-0">
          <div className="grid grid-cols-3 w-full max-w-lg p-1 bg-[#EAE5DC] rounded-[2px] border border-[#DCD6CA] shadow-inner">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-2.5 px-2 text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-[0.2em] font-semibold rounded-[2px] transition-all text-center min-h-[44px] flex items-center justify-center ${
                activeTab === 'all'
                  ? 'bg-[#171615] text-[#FAF8F5] shadow-md'
                  : 'text-[#6B6458] hover:text-[#171615]'
              }`}
            >
              <span className="hidden sm:inline">All Accommodations</span>
              <span className="sm:hidden">All</span>
            </button>
            <button
              onClick={() => setActiveTab('rooms')}
              className={`py-2.5 px-2 text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-[0.2em] font-semibold rounded-[2px] transition-all text-center min-h-[44px] flex items-center justify-center ${
                activeTab === 'rooms'
                  ? 'bg-[#171615] text-[#FAF8F5] shadow-md'
                  : 'text-[#6B6458] hover:text-[#171615]'
              }`}
            >
              <span className="hidden sm:inline">Guest Rooms</span>
              <span className="sm:hidden">Rooms</span>
            </button>
            <button
              onClick={() => setActiveTab('suites')}
              className={`py-2.5 px-2 text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-[0.2em] font-semibold rounded-[2px] transition-all text-center min-h-[44px] flex items-center justify-center ${
                activeTab === 'suites'
                  ? 'bg-[#171615] text-[#FAF8F5] shadow-md'
                  : 'text-[#6B6458] hover:text-[#171615]'
              }`}
            >
              <span className="hidden sm:inline">Penthouse Suites</span>
              <span className="sm:hidden">Suites</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Rooms List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-16">
        {filteredRooms.map((room, index) => {
          const isReversed = index % 2 === 1;

          return (
            <div
              key={room.id}
              id={room.id}
              className={`bg-white rounded-[2px] border border-[#E2DDD3] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all duration-300 hover:shadow-2xl ${
                selectedRoomId === room.id ? 'ring-2 ring-[#C59648]' : ''
              }`}
            >
              {/* Large Image Column */}
              <div
                className={`lg:col-span-7 relative h-72 sm:h-96 lg:h-auto lg:min-h-[420px] overflow-hidden bg-neutral-900 group ${
                  isReversed ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <img
                  src={room.image}
                  alt={room.name}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-[#171615]/90 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-[2px] border border-[#3A3631] text-[11px] sm:text-xs text-white shadow-lg">
                  <span className="text-[#A69D8F]">From </span>
                  <span className="font-serif text-lg sm:text-xl font-bold text-[#D3AA67]">${room.pricePerNight}</span>
                  <span className="text-[#A69D8F]"> / night</span>
                </div>

                <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 flex gap-2">
                  <button
                    onClick={() => setModalRoom(room)}
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 min-h-[40px] sm:min-h-[44px] bg-black/80 hover:bg-[#C59648] hover:text-[#121110] text-white text-[11px] sm:text-xs tracking-wider backdrop-blur-md rounded-[2px] transition-all flex items-center gap-1.5 sm:gap-2 border border-white/20 shadow-lg active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Details &amp; Gallery</span>
                  </button>
                </div>
              </div>

              {/* Room Content Column */}
              <div
                className={`lg:col-span-5 p-6 sm:p-8 lg:p-12 flex flex-col justify-between ${
                  isReversed ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 mb-3">
                    <span className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#C59648] font-semibold">
                      {room.sizeSqM} m&sup2; &bull; {room.view}
                    </span>
                    {room.workDesk && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] sm:text-[11px] uppercase tracking-wider bg-[#F4EFE6] text-[#635C50] rounded-[2px] font-semibold border border-[#E8E1D5]">
                        <Briefcase className="w-3 h-3 text-[#C59648]" />
                        <span>Executive Desk</span>
                      </span>
                    )}
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#171615] font-normal mb-2.5 sm:mb-3">
                    {room.name}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#5D564A] leading-relaxed mb-5 sm:mb-6 font-light">
                    {room.description}
                  </p>

                  {/* Highlights Bullet points */}
                  <div className="space-y-2 mb-5 sm:mb-6 text-xs sm:text-sm text-[#423E37]">
                    {room.highlights.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#C59648] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Amenities Pills */}
                  <div className="pt-4 sm:pt-5 border-t border-[#F0ECE4] mb-6 sm:mb-8">
                    <h4 className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#8C8375] font-semibold mb-2.5 sm:mb-3">
                      Suite Appointments
                    </h4>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {room.amenities.map((amenity, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-[11px] sm:text-xs bg-[#FAF6EE] text-[#555047] border border-[#EAE3D5] rounded-[2px]"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Booking Bar */}
                <div className="pt-5 sm:pt-6 border-t border-[#F0ECE4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-[#8C8375]">
                      Rate Starts At
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-2xl sm:text-3xl font-bold text-[#171615]">
                        ${room.pricePerNight}
                      </span>
                      <span className="text-[11px] sm:text-xs text-[#8C8375]">/ night + tax</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('booking', room.id)}
                    className="w-full sm:w-auto px-7 py-3.5 sm:py-4 min-h-[48px] bg-gradient-to-r from-[#B8973A] to-[#D3AA67] hover:from-[#C59648] hover:to-[#E0C07F] text-[#121110] text-xs uppercase font-bold tracking-[0.22em] rounded-[2px] shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Reserve Suite</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Room Details Modal */}
      {modalRoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="room-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalRoom(null);
          }}
        >
          <div className="bg-white max-w-3xl w-full max-h-[92vh] overflow-y-auto rounded-[2px] shadow-2xl border border-[#DCD6CA] p-5 sm:p-10 relative">
            <button
              onClick={() => setModalRoom(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 text-[#736B5F] hover:text-[#171615] bg-[#F2EFE9] hover:bg-[#E5E0D6] rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold block mb-1">
              Accommodation Overview
            </span>
            <h3 id="room-modal-title" className="font-serif text-2xl sm:text-4xl text-[#171615] font-normal mb-1.5 sm:mb-2 pr-10">
              {modalRoom.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#736B5F] mb-5 font-light">{modalRoom.tagline}</p>

            {/* Gallery in Modal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5">
              <img
                src={modalRoom.image}
                alt={modalRoom.name}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-48 sm:h-60 object-cover rounded-[2px] border border-[#E5E0D6]"
              />
              {modalRoom.additionalImages && modalRoom.additionalImages.length > 0 ? (
                <img
                  src={modalRoom.additionalImages[0]}
                  alt={`${modalRoom.name} perspective`}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-48 sm:h-60 object-cover rounded-[2px] border border-[#E5E0D6]"
                />
              ) : (
                <div className="bg-[#FAF6EE] flex items-center justify-center p-6 text-center text-xs text-[#8C8375] rounded-[2px] border border-[#EAE3D5]">
                  Abyssinia Grand Hotel &bull; 5-Star Luxury
                </div>
              )}
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-[#4A453D] leading-relaxed mb-5 font-light">
              <p>{modalRoom.description}</p>
            </div>

            <div className="mb-6 sm:mb-8">
              <h4 className="text-xs uppercase tracking-[0.2em] text-[#171615] font-semibold mb-2.5">
                Key Privileges &amp; Features
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#555047]">
                {modalRoom.highlights.map((hl, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#C59648] shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-5 border-t border-[#EAE5DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-[#736B5F] block">Starting rate</span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#171615]">
                  ${modalRoom.pricePerNight} <span className="text-xs font-normal text-[#736B5F]">/ night + taxes</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setModalRoom(null)}
                  className="w-full sm:w-auto px-6 py-3 min-h-[44px] border border-[#D1CAC0] text-xs uppercase tracking-[0.2em] font-semibold text-[#171615] rounded-[2px] hover:bg-[#F2EFE9] transition-colors text-center"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const id = modalRoom.id;
                    setModalRoom(null);
                    onNavigate('booking', id);
                  }}
                  className="w-full sm:w-auto px-7 py-3 min-h-[44px] bg-gradient-to-r from-[#B8973A] to-[#D3AA67] hover:from-[#C59648] hover:to-[#E0C07F] text-[#121110] text-xs uppercase font-bold tracking-[0.2em] rounded-[2px] shadow-md transition-all active:scale-95 text-center"
                >
                  Book This Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
