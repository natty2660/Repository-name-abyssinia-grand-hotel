export type PageId = 'home' | 'rooms' | 'about' | 'dining' | 'gallery' | 'contact' | 'booking' | 'admin';

export type ReservationStatus = 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';

export interface ReservationRecord {
  id: string; // e.g. "DLH-49210"
  referenceNumber: string;
  formData: BookingFormData;
  roomName: string;
  roomType: string;
  totalNights: number;
  totalPrice: number;
  status: ReservationStatus;
  createdAt: string;
  assignedRoomNumber?: string;
  adminNotes?: string;
  source?: 'online' | 'walk-in' | 'phone';
  approvedAt?: string;
  approvalMessage?: string;
  telegramMessageId?: number;
}

export interface Room {
  id: string;
  name: string;
  tagline: string;
  pricePerNight: number;
  bedType: string;
  capacity: number;
  sizeSqM: number;
  view: string;
  breakfastIncluded: boolean;
  breakfastAvailable: boolean;
  workDesk: boolean;
  image: string;
  additionalImages?: string[];
  description: string;
  highlights: string[];
  amenities: string[];
}

export interface Amenity {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
}

export interface DiningVenue {
  id: string;
  name: string;
  cuisine: string;
  hours: string;
  dressCode: string;
  description: string;
  image: string;
  highlights: string[];
  menuPreview: { name: string; desc: string; price: string }[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'all' | 'exterior' | 'lobby' | 'rooms' | 'dining' | 'pool' | 'conference';
  categoryLabel: string;
  image: string;
  caption: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  country: string;
  rating: number;
  stayDate: string;
  roomType: string;
  avatar: string;
}

export interface HotelStatistic {
  value: string;
  label: string;
  sublabel: string;
}

export interface BookingFormData {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomType: string;
  guestName: string;
  email: string;
  phone: string;
  specialRequests: string;
  paymentMethod?: 'hotel' | 'telebirr' | 'cbe' | 'card';
  isGroupBooking?: boolean;
  roomCount?: number;
  organizationName?: string;
}

export interface BookingConfirmation {
  referenceNumber: string;
  formData: BookingFormData;
  roomName: string;
  totalNights: number;
  totalPrice: number;
  timestamp: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}
