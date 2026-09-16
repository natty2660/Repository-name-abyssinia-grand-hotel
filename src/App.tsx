import React, { useState, useEffect, useCallback } from 'react';
import { PageId, GalleryItem } from './types';
import { GALLERY_ITEMS } from './data/hotelData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { RoomsView } from './components/RoomsView';
import { AboutView } from './components/AboutView';
import { DiningView } from './components/DiningView';
import { GalleryView } from './components/GalleryView';
import { ContactView } from './components/ContactView';
import { BookingView } from './components/BookingView';
import { Lightbox } from './components/Lightbox';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('executive-room');

  // Quick reservation bar state passed from Home
  const [searchParams, setSearchParams] = useState<{
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    roomType?: string;
  }>({});

  // Lightbox modal state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxList, setLightboxList] = useState<GalleryItem[]>(GALLERY_ITEMS);

  // Synchronize with URL hash on mount and hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const validPages: PageId[] = ['home', 'rooms', 'about', 'dining', 'gallery', 'contact', 'booking'];
      if (validPages.includes(hash as PageId)) {
        setCurrentPage(hash as PageId);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: PageId, targetRoomId?: string) => {
    if (targetRoomId) {
      setSelectedRoomId(targetRoomId);
    }
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickSearch = (params: {
    checkIn: string;
    checkOut: string;
    guests: number;
    roomType: string;
  }) => {
    setSearchParams(params);
    setSelectedRoomId(params.roomType);
  };

  const handleOpenLightbox = (item: GalleryItem, indexInFiltered?: number, currentList?: GalleryItem[]) => {
    const list = currentList || GALLERY_ITEMS;
    setLightboxList(list);

    let idx = indexInFiltered;
    if (idx === undefined) {
      idx = list.findIndex((x) => x.id === item.id);
      if (idx === -1) idx = 0;
    }
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const handleLightboxNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % lightboxList.length);
  }, [lightboxList.length]);

  const handleLightboxPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + lightboxList.length) % lightboxList.length);
  }, [lightboxList.length]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#222222] font-sans">
      {/* Top Main Navigation */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main className="flex-1" id="main-content">
        {currentPage === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenLightbox={(item) => handleOpenLightbox(item, undefined, GALLERY_ITEMS)}
            onQuickSearch={handleQuickSearch}
          />
        )}

        {currentPage === 'rooms' && (
          <RoomsView
            onNavigate={handleNavigate}
            selectedRoomId={selectedRoomId}
          />
        )}

        {currentPage === 'about' && (
          <AboutView onNavigate={handleNavigate} />
        )}

        {currentPage === 'dining' && (
          <DiningView onNavigate={handleNavigate} />
        )}

        {currentPage === 'gallery' && (
          <GalleryView onOpenLightbox={handleOpenLightbox} />
        )}

        {currentPage === 'contact' && (
          <ContactView onNavigate={handleNavigate} />
        )}

        {currentPage === 'booking' && (
          <BookingView
            initialRoomId={selectedRoomId}
            initialCheckIn={searchParams.checkIn}
            initialCheckOut={searchParams.checkOut}
            initialGuests={searchParams.guests}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Lightbox for Gallery */}
      <Lightbox
        items={lightboxList}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={handleLightboxNext}
        onPrev={handleLightboxPrev}
      />
    </div>
  );
}
