import React, { useState } from 'react';
import { PageId, GalleryItem } from '../types';
import { GALLERY_ITEMS } from '../data/hotelData';
import { Maximize2, Sparkles, Filter } from 'lucide-react';

interface GalleryViewProps {
  onOpenLightbox: (item: GalleryItem, indexInFiltered: number, currentList: GalleryItem[]) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ onOpenLightbox }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Photographs' },
    { id: 'exterior', label: 'Exterior & Skyline' },
    { id: 'lobby', label: 'Lobby & Reception' },
    { id: 'rooms', label: 'Rooms & Suites' },
    { id: 'dining', label: 'Dining & Coffee' },
    { id: 'pool', label: 'Pool & Spa' },
    { id: 'conference', label: 'Conferences' },
  ];

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#222222] pt-24 sm:pt-32 pb-24 sm:pb-32">
      {/* 1. Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold mb-3">
            <span className="w-6 h-[1px] bg-[#C59648]" />
            <span>Visual Archives</span>
            <span className="w-6 h-[1px] bg-[#C59648]" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#171615] font-normal mb-4 sm:mb-6 leading-tight">
            Moments at Duule Luxury Hotel
          </h1>
          <p className="text-sm sm:text-lg text-[#5D564A] leading-relaxed font-light">
            Explore the Rio Architects curved glass facade, luminous marble lobby, heated indoor pool, and elegant suites awaiting you in Jijiga.
          </p>
        </div>

        {/* Category Filters with Mobile Horizontal Scroll and Desktop Wrap */}
        <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-3 pt-1 px-1 sm:px-0 no-scrollbar sm:flex-wrap sm:justify-center sm:overflow-visible">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 min-h-[42px] whitespace-nowrap text-[11px] sm:text-xs uppercase tracking-[0.18em] font-semibold rounded-[2px] shrink-0 transition-all duration-200 ${
                  isActive
                    ? 'bg-[#171615] text-[#FAF8F5] shadow-md'
                    : 'bg-[#EAE5DC] text-[#635C50] hover:text-[#171615] hover:bg-[#DDD7CC] border border-[#D8D2C5]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Gallery Masonry / Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-7">
          {filteredItems.map((item, index) => (
            <button
              type="button"
              key={item.id}
              onClick={() => onOpenLightbox(item, index, filteredItems)}
              aria-label={`View photo: ${item.title}`}
              className="group relative aspect-[4/3] rounded-[2px] overflow-hidden cursor-pointer shadow-sm border border-[#E0DACF] bg-neutral-900 transition-all duration-300 hover:shadow-2xl hover:border-[#C59648]/80 hover:-translate-y-1 text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C59648]"
            >
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />

              {/* Mobile Default Label (Clean bottom gradient for touch devices) */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent sm:hidden flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase tracking-wider text-[#D3AA67] font-semibold">
                  {item.categoryLabel}
                </span>
                <h3 className="font-serif text-base font-normal text-white truncate">
                  {item.title}
                </h3>
              </div>

              {/* Hover Overlay (Full details on hover/tap) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-6 text-white">
                <div className="flex justify-end">
                  <span className="p-2 sm:p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/20">
                    <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </span>
                </div>

                <div>
                  <span className="inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] bg-gradient-to-r from-[#B8973A] to-[#D3AA67] text-black font-bold rounded-[2px] mb-1.5 sm:mb-2 shadow-sm">
                    {item.categoryLabel}
                  </span>
                  <h3 className="font-serif text-lg sm:text-2xl font-normal text-[#FAF8F5] mb-1 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#DDD7CD] line-clamp-2 leading-relaxed font-light">
                    {item.caption}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Gallery Subtitle / Click note */}
        <div className="text-center mt-10 sm:mt-14 text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#8C8375] font-light">
          Tap any photograph to view in full-screen gallery mode
        </div>
      </div>
    </div>
  );
};
