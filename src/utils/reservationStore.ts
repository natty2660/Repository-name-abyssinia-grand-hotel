import { ReservationRecord, ReservationStatus, BookingFormData } from '../types';

export const TELEGRAM_USERNAME = 'zazadigital1';
export const HOTEL_WHATSAPP_NUMBER = '251900876644';

const STORAGE_KEY = 'duule_hotel_reservations_v2';
const EVENT_NAME = 'duule_reservations_updated';

// Realistic seed data including the sample from user's screenshot
const INITIAL_RESERVATIONS: ReservationRecord[] = [
  {
    id: 'DLH-74921',
    referenceNumber: 'DLH-74921',
    formData: {
      checkIn: '2026-09-29',
      checkOut: '2026-10-05',
      adults: 2,
      children: 0,
      roomType: 'executive-room',
      guestName: 'Dr. Abdrehman Hassen',
      email: 'natnaelbezuneh000@gmail.com',
      phone: '+251900876644',
      specialRequests: 'Wilwal Airport (JIJ) Chauffeur Pickup; High Floor Quiet Room; Notes: Arriving on evening Ethiopian Airlines flight from Addis Ababa.',
    },
    roomName: 'Executive Business Suite',
    roomType: 'executive-room',
    totalNights: 6,
    totalPrice: 1656,
    status: 'pending',
    createdAt: 'September 21, 2026 at 06:31 AM',
    assignedRoomNumber: '',
    adminNotes: 'Awaiting Wilwal airport flight arrival confirmation.',
    source: 'online',
  },
  {
    id: 'DLH-63102',
    referenceNumber: 'DLH-63102',
    formData: {
      checkIn: '2026-09-22',
      checkOut: '2026-09-25',
      adults: 1,
      children: 0,
      roomType: 'deluxe-room',
      guestName: 'Ambassador Amina Warsame',
      email: 'amina.w@diplomacy.gov.et',
      phone: '+251911428901',
      specialRequests: 'High Floor Quiet Room; Traditional Coffee in Room Upon Arrival',
    },
    roomName: 'Deluxe City & Plateau View Room',
    roomType: 'deluxe-room',
    totalNights: 3,
    totalPrice: 587,
    status: 'confirmed',
    createdAt: 'September 20, 2026 at 04:15 PM',
    assignedRoomNumber: 'Suite 504',
    adminNotes: 'VIP protocol. Room pre-inspected by housekeeping.',
    source: 'online',
  },
  {
    id: 'DLH-51980',
    referenceNumber: 'DLH-51980',
    formData: {
      checkIn: '2026-09-20',
      checkOut: '2026-09-24',
      adults: 3,
      children: 1,
      roomType: 'family-suite',
      guestName: 'Mohamed Farah Guleid',
      email: 'm.guleid@diasporafinance.com',
      phone: '+251930771234',
      specialRequests: 'Feather-Free Hypoallergenic Bedding; Extra towels and crib setup',
    },
    roomName: 'Family Interconnecting Suite',
    roomType: 'family-suite',
    totalNights: 4,
    totalPrice: 1794,
    status: 'checked-in',
    createdAt: 'September 19, 2026 at 11:40 AM',
    assignedRoomNumber: 'Suite 310',
    adminNotes: 'Checked in at 2:30 PM. Keycards handed to guest.',
    source: 'walk-in',
  },
];

export function getStoredReservations(): ReservationRecord[] {
  if (typeof window === 'undefined') return INITIAL_RESERVATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RESERVATIONS));
      return INITIAL_RESERVATIONS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RESERVATIONS));
      return INITIAL_RESERVATIONS;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading reservations from localStorage', err);
    return INITIAL_RESERVATIONS;
  }
}

export function saveReservation(reservation: ReservationRecord): void {
  const current = getStoredReservations();
  // prepend new booking
  const updated = [reservation, ...current.filter((r) => r.id !== reservation.id)];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (err) {
    console.error('Error saving reservation', err);
  }
}

export function updateReservationStatus(
  id: string,
  status: ReservationStatus,
  assignedRoomNumber?: string,
  adminNotes?: string
): void {
  const current = getStoredReservations();
  const updated = current.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        status,
        ...(assignedRoomNumber !== undefined ? { assignedRoomNumber } : {}),
        ...(adminNotes !== undefined ? { adminNotes } : {}),
      };
    }
    return item;
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (err) {
    console.error('Error updating reservation', err);
  }
}

export function deleteReservation(id: string): void {
  const current = getStoredReservations();
  const updated = current.filter((r) => r.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (err) {
    console.error('Error deleting reservation', err);
  }
}

export function resetReservationsToDefault(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RESERVATIONS));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (err) {
    console.error('Error resetting reservations', err);
  }
}

export function subscribeToReservations(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener('storage', callback);
  };
}

/**
 * Format a comprehensive Telegram dispatch text payload for @zazadigital1
 */
export function buildTelegramReservationMessage(res: ReservationRecord): string {
  const payLabel =
    res.formData.paymentMethod === 'telebirr'
      ? 'Telebirr (Mobile Money)'
      : res.formData.paymentMethod === 'cbe'
      ? 'CBE Birr / CBE Mobile Banking'
      : res.formData.paymentMethod === 'card'
      ? 'Credit/Debit Card (Visa/Mastercard)'
      : 'Pay Upon Arrival at Hotel Front Desk';

  const groupInfo = res.formData.isGroupBooking
    ? `🏛️ *Group/Delegation:* ${res.formData.organizationName || 'Yes'} (${res.formData.roomCount || 1} Rooms)`
    : '';

  return [
    `🏨 *NEW RESERVATION — DUULE LUXURY HOTEL, JIJIGA*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🔖 *Booking Ref:* \`${res.referenceNumber}\``,
    `👤 *Guest Name:* ${res.formData.guestName}`,
    `📞 *Phone:* ${res.formData.phone}`,
    `✉️ *Email:* ${res.formData.email}`,
    groupInfo,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🛏️ *Room:* ${res.roomName}${res.formData.roomCount && res.formData.roomCount > 1 ? ` (Qty: ${res.formData.roomCount})` : ''}`,
    `📅 *Check-in:* ${res.formData.checkIn} (from 14:00)`,
    `📅 *Check-out:* ${res.formData.checkOut} (until 12:00)`,
    `🌙 *Duration:* ${res.totalNights} Night(s)`,
    `👥 *Guests:* ${res.formData.adults} Adults${res.formData.children ? `, ${res.formData.children} Children` : ''}`,
    `💳 *Payment Preference:* ${payLabel}`,
    `💰 *Estimated Total:* $${res.totalPrice} USD`,
    `📌 *Status:* ${res.status.toUpperCase()}`,
    res.formData.specialRequests ? `\n📝 *Special Requests:*\n_${res.formData.specialRequests}_` : '',
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `⚡ *Action Required:* Please review & confirm via Duule Front-Desk Portal.`,
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Generate direct Telegram Web/App URI
 */
export function getTelegramDispatchUrl(res: ReservationRecord): string {
  const text = encodeURIComponent(buildTelegramReservationMessage(res));
  return `https://t.me/${TELEGRAM_USERNAME}?text=${text}`;
}

/**
 * Generate direct WhatsApp dispatch URI to hotel desk
 */
export function getWhatsAppDispatchUrl(res: ReservationRecord): string {
  const msg = [
    `*Duule Luxury Hotel — Reservation Inquiry*`,
    `Booking Ref: ${res.referenceNumber}`,
    `Guest: ${res.formData.guestName}`,
    `Room: ${res.roomName}`,
    `Dates: ${res.formData.checkIn} to ${res.formData.checkOut} (${res.totalNights} nights)`,
    `Total: $${res.totalPrice} USD`,
    `Phone: ${res.formData.phone}`,
    `Email: ${res.formData.email}`,
    res.formData.specialRequests ? `Notes: ${res.formData.specialRequests}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${HOTEL_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/**
 * Generate direct WhatsApp confirmation message from reception to guest
 */
export function getGuestWhatsAppApprovalUrl(res: ReservationRecord): string {
  const cleanPhone = res.formData.phone.replace(/[^0-9]/g, '');
  const roomNotice = res.assignedRoomNumber ? `Your assigned room is ${res.assignedRoomNumber}.` : '';
  const text = [
    `Dear ${res.formData.guestName},`,
    `Greetings from Duule Luxury Hotel in Jijiga!`,
    `We are delighted to confirm your reservation (${res.referenceNumber}) for ${res.roomName} from ${res.formData.checkIn} to ${res.formData.checkOut}.`,
    roomNotice,
    `Complimentary Wilwal Airport pickup and 24/7 concierge will be at your service.`,
    `We look forward to welcoming you to Jijiga!`,
    `Warm regards,\nFront Office Team | Duule Luxury Hotel`,
  ]
    .filter(Boolean)
    .join('\n\n');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * AUTOMATED TELEGRAM BOT DISPATCH (Option 1):
 * Automatically delivers reservation to the hotel's Telegram Bot in the background
 * without requiring the customer to send any manual message.
 */
export interface AutomatedTelegramResult {
  success: boolean;
  automated: boolean;
  delivered: boolean;
  message: string;
  reason?: string;
  telegramMessageId?: number;
}

export async function dispatchAutomatedTelegramBooking(
  reservation: ReservationRecord
): Promise<AutomatedTelegramResult> {
  try {
    const res = await fetch('/api/telegram/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservation),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      return {
        success: false,
        automated: false,
        delivered: false,
        message: errJson?.error || 'Server error while sending Telegram notification',
      };
    }

    const data: AutomatedTelegramResult = await res.json();
    return data;
  } catch (err: any) {
    console.warn('Network error calling /api/telegram/notify:', err);
    return {
      success: false,
      automated: false,
      delivered: false,
      message: err?.message || 'Could not reach server notification endpoint',
    };
  }
}

export interface TelegramBotStatus {
  configured: boolean;
  hasToken: boolean;
  hasChatId: boolean;
  maskedToken: string;
  chatId: string;
  defaultRecipient: string;
}

export async function fetchTelegramBotStatus(): Promise<TelegramBotStatus | null> {
  try {
    const res = await fetch('/api/telegram/status');
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function updateTelegramBotConfig(
  token: string,
  chatId: string,
  sendTestMessage = false
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/telegram/configure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, chatId, sendTestMessage }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update credentials' };
  }
}

export interface ReservationServerStatus {
  success: boolean;
  found: boolean;
  referenceNumber: string;
  status: ReservationStatus;
  approvedAt?: string;
  approvalMessage?: string;
  guestName?: string;
  roomName?: string;
  totalPrice?: number;
  totalNights?: number;
  assignedRoomNumber?: string;
}

/**
 * Poll live reservation status from the server
 */
export async function fetchReservationStatus(
  referenceNumber: string
): Promise<ReservationServerStatus | null> {
  try {
    const res = await fetch(`/api/reservations/${encodeURIComponent(referenceNumber)}/status`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.found) {
      // Keep local store in sync
      const current = getStoredReservations();
      const match = current.find((r) => r.referenceNumber === referenceNumber || r.id === referenceNumber);
      if (match && (match.status !== data.status || match.approvalMessage !== data.approvalMessage)) {
        updateReservationStatus(
          match.id,
          data.status,
          data.assignedRoomNumber,
          data.approvalMessage
        );
      }
    }
    return data;
  } catch (err) {
    return null;
  }
}

/**
 * Simulate or trigger Telegram Accept
 */
export async function simulateTelegramAccept(
  referenceNumber: string
): Promise<{ success: boolean; error?: string; reservation?: any }> {
  try {
    const res = await fetch('/api/telegram/simulate-accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referenceNumber }),
    });
    const data = await res.json();
    if (data.success && data.reservation) {
      // Update local storage
      const current = getStoredReservations();
      const match = current.find((r) => r.referenceNumber === referenceNumber || r.id === referenceNumber);
      if (match) {
        updateReservationStatus(
          match.id,
          'confirmed',
          data.reservation.assignedRoomNumber,
          data.reservation.approvalMessage
        );
      }
    }
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}


