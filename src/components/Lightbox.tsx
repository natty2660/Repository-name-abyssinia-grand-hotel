import React, { useEffect } from 'react';
import { GalleryItem } from '../types';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface LightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    // Lock body scroll
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex] || items[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6 transition-all duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Hotel Image Lightbox"
      onClick={onClose}
    >
      {/* Top Bar with Title, Counter, and Close */}
      <div
        className="absolute top-0 left-0 right-0 p-3 sm:p-6 flex items-center justify-between text-white z-10 bg-gradient-to-b from-black/90 via-black/60 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
          <span className="hidden xs:inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-widest bg-[#C59648] text-black font-semibold rounded-xs shrink-0">
            {currentItem.categoryLabel}
          </span>
          <h3 className="font-serif text-sm sm:text-xl font-medium tracking-wide text-[#FAF8F5] truncate">
            {currentItem.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <span className="text-[11px] sm:text-xs uppercase tracking-wider text-neutral-400 font-sans">
            {currentIndex + 1}/{items.length}
          </span>
          <button
            onClick={onClose}
            className="p-2 text-neutral-300 hover:text-white bg-neutral-950/70 hover:bg-neutral-800 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C59648]"
            aria-label="Close Lightbox"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 text-white bg-black/60 hover:bg-[#C59648] hover:text-black rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C59648] z-20 min-h-[44px] min-w-[44px] flex items-center justify-center shadow-lg"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 text-white bg-black/60 hover:bg-[#C59648] hover:text-black rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C59648] z-20 min-h-[44px] min-w-[44px] flex items-center justify-center shadow-lg"
        aria-label="Next image"
      >
        <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
      </button>

      {/* Main Image Container */}
      <div
        className="relative max-w-6xl max-h-[85vh] w-full flex flex-col items-center justify-center px-1 sm:px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentItem.image}
          alt={currentItem.title}
          referrerPolicy="no-referrer"
          className="max-h-[66vh] sm:max-h-[72vh] max-w-full object-contain rounded-xs shadow-2xl transition-transform duration-300"
        />

        {/* Caption bar */}
        {currentItem.caption && (
          <div className="mt-3 sm:mt-4 text-center max-w-2xl px-3">
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans font-light line-clamp-3 sm:line-clamp-none">
              {currentItem.caption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
