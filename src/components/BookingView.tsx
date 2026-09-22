import React, { useState, useEffect } from 'react';
import { PageId, BookingFormData, BookingConfirmation, ReservationRecord, ReservationStatus } from '../types';
import { ROOMS_DATA, HOTEL_INFO } from '../data/hotelData';
import {
  saveReservation,
  getTelegramDispatchUrl,
  getWhatsAppDispatchUrl,
  buildTelegramReservationMessage,
  TELEGRAM_USERNAME,
  dispatchAutomatedTelegramBooking,
  AutomatedTelegramResult,
  fetchReservationStatus,
  simulateTelegramAccept,
} from '../utils/reservationStore';
import {
  Calendar,
  Users,
  BedDouble,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Printer,
  ArrowRight,
  ShieldCheck,
  Building,
  Info,
  Send,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  Wallet,
  Smartphone,
  Banknote,
  Bot,
  Radio,
} from 'lucide-react';

interface BookingViewProps {
  initialRoomId?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  onNavigate: (page: PageId) => void;
}

export const BookingView: React.FC<BookingViewProps> = ({
  initialRoomId = 'executive-room',
  initialCheckIn,
  initialCheckOut,
  initialGuests = 2,
  onNavigate,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultOutDate = new Date();
  defaultOutDate.setDate(defaultOutDate.getDate() + 2);
  const defaultOutStr = defaultOutDate.toISOString().split('T')[0];

  const [formData, setFormData] = useState<BookingFormData>({
    checkIn: initialCheckIn || todayStr,
    checkOut: initialCheckOut || defaultOutStr,
    adults: initialGuests || 2,
    children: 0,
    roomType: initialRoomId || 'executive-room',
    guestName: '',
    email: '',
    phone: '',
    specialRequests: '',
    paymentMethod: 'hotel',
    isGroupBooking: false,
    roomCount: 1,
    organizationName: '',
  });

  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const [savedRecord, setSavedRecord] = useState<ReservationRecord | null>(null);
  const [copiedTelegram, setCopiedTelegram] = useState(false);
  const [botResult, setBotResult] = useState<AutomatedTelegramResult | null>(null);
  const [isDispatchingBot, setIsDispatchingBot] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<ReservationStatus>('pending');
  const [approvalMessage, setApprovalMessage] = useState<string | null>(null);
  const [isSimulatingAccept, setIsSimulatingAccept] = useState(false);

  // Sync if initialRoomId changes
  useEffect(() => {
    if (initialRoomId) {
      setFormData((prev) => ({ ...prev, roomType: initialRoomId }));
    }
  }, [initialRoomId]);

  // Real-time polling for Telegram bot acceptance and status changes
  useEffect(() => {
    if (!confirmation) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const res = await fetchReservationStatus(confirmation.referenceNumber);
        if (isMounted && res && res.found) {
          if (res.status !== bookingStatus) {
            setBookingStatus(res.status);
          }
          if (res.approvalMessage) {
            setApprovalMessage(res.approvalMessage);
          }
        }
      } catch (err) {
        // silent catch on network hiccups
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [confirmation, bookingStatus]);

  const handleSimulateAccept = async () => {
    if (!confirmation) return;
    setIsSimulatingAccept(true);
    try {
      const res = await simulateTelegramAccept(confirmation.referenceNumber);
      if (res.success) {
        setBookingStatus('confirmed');
        if (res.reservation?.approvalMessage) {
          setApprovalMessage(res.reservation.approvalMessage);
        }
      }
    } finally {
      setIsSimulatingAccept(false);
    }
  };

  const currentRoom = ROOMS_DATA.find((r) => r.id === formData.roomType) || ROOMS_DATA[0];

  // Calculate nights
  const calcNights = (): number => {
    try {
      const d1 = new Date(formData.checkIn);
      const d2 = new Date(formData.checkOut);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  const nights = calcNights();
  const roomQuantity = formData.isGroupBooking && formData.roomCount ? formData.roomCount : 1;
  const subtotal = currentRoom.pricePerNight * nights * roomQuantity;
  const taxesAndService = Math.round(subtotal * 0.15); // 15% estimated Ethiopian VAT & municipal tax
  const grandTotal = subtotal + taxesAndService;

  const quickRequestTags = [
    'Early Check-in (subject to availability)',
    'High Floor Quiet Room',
    'Wilwal Airport (JIJ) Chauffeur Pickup',
    'Special Celebration / Anniversary Setup',
    'Feather-Free Hypoallergenic Bedding',
    'Traditional Coffee in Room Upon Arrival',
  ];

  const toggleAddon = (tag: string) => {
    if (selectedAddons.includes(tag)) {
      setSelectedAddons(selectedAddons.filter((t) => t !== tag));
    } else {
      setSelectedAddons([...selectedAddons, tag]);
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};

    if (!formData.checkIn) newErrors.checkIn = 'Please select a check-in date.';
    if (!formData.checkOut) newErrors.checkOut = 'Please select a check-out date.';
    if (formData.checkIn && formData.checkOut) {
      const d1 = new Date(formData.checkIn);
      const d2 = new Date(formData.checkOut);
      if (d2 <= d1) {
        newErrors.checkOut = 'Check-out date must be after check-in date.';
      }
    }

    if (!formData.guestName.trim()) {
      newErrors.guestName = 'Primary guest full name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required for booking confirmation.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Build confirmation
    const combinedRequests = [
      ...selectedAddons,
      formData.specialRequests ? `Notes: ${formData.specialRequests}` : '',
    ]
      .filter(Boolean)
      .join('; ');

    const randomRefNumber = `DLH-${Math.floor(10000 + Math.random() * 90000)}`;

    const confirmed: BookingConfirmation = {
      referenceNumber: randomRefNumber,
      formData: {
        ...formData,
        specialRequests: combinedRequests,
      },
      roomName: currentRoom.name,
      totalNights: nights,
      totalPrice: grandTotal,
      timestamp: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };

    const newRecord: ReservationRecord = {
      id: randomRefNumber,
      referenceNumber: randomRefNumber,
      formData: {
        ...formData,
        specialRequests: combinedRequests,
      },
      roomName: currentRoom.name,
      roomType: currentRoom.id,
      totalNights: nights,
      totalPrice: grandTotal,
      status: 'pending',
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }) + ' at ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      source: 'online',
    };

    saveReservation(newRecord);
    setSavedRecord(newRecord);
    setConfirmation(confirmed);
    setBookingStatus('pending');
    setApprovalMessage(null);
    setIsDispatchingBot(true);
    setBotResult(null);
    window.scrollTo({ top: 120, behavior: 'smooth' });

    // Option 1: Automatic background transmission to Hotel Telegram Bot
    dispatchAutomatedTelegramBooking(newRecord)
      .then((res) => {
        setBotResult(res);
      })
      .catch((err) => {
        console.warn('Telegram automated bot delivery failed:', err);
      })
      .finally(() => {
        setIsDispatchingBot(false);
      });
  };

  const handleCopyTelegram = () => {
    if (!savedRecord) return;
    const text = buildTelegramReservationMessage(savedRecord);
    navigator.clipboard.writeText(text);
    setCopiedTelegram(true);
    setTimeout(() => setCopiedTelegram(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#222222] pt-24 sm:pt-32 pb-24 sm:pb-32">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C59648] font-semibold mb-3">
            <span className="w-6 h-[1px] bg-[#C59648]" />
            <span>Direct Reservations</span>
            <span className="w-6 h-[1px] bg-[#C59648]" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#171615] font-normal mb-4 sm:mb-6 leading-tight">
            Book Your Stay at Duule Luxury Hotel
          </h1>
          <p className="text-sm sm:text-lg text-[#5D564A] leading-relaxed font-light">
            Reserve directly for best rate guarantee, complimentary Wilwal Airport transfer, and personalized concierge arrival assistance in Jijiga.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {confirmation ? (
          /* Confirmation Voucher Screen */
          <div className="max-w-3xl mx-auto bg-white rounded-[2px] border border-[#E0DACF] shadow-2xl overflow-hidden animate-fadeIn">
            {/* Top Header - Dynamically updates from Pending to Accepted */}
            <div
              className={`p-6 sm:p-10 border-b text-center transition-colors duration-500 ${
                bookingStatus === 'confirmed'
                  ? 'bg-gradient-to-b from-[#14281A] to-[#0D1A11] text-[#FAF8F5] border-[#224A2B]'
                  : 'bg-[#171615] text-[#FAF8F5] border-[#33302B]'
              }`}
            >
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full mx-auto flex items-center justify-center mb-3 sm:mb-4 transition-all duration-500 ${
                  bookingStatus === 'confirmed'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-950/30'
                    : 'bg-[#C59648]/20 text-[#D3AA67] border border-[#C59648]/30'
                }`}
              >
                {bookingStatus === 'confirmed' ? (
                  <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
                ) : (
                  <Clock className="w-8 h-8 sm:w-9 sm:h-9 text-[#D3AA67]" />
                )}
              </div>

              <span
                className={`text-xs uppercase tracking-[0.25em] font-semibold block mb-1.5 ${
                  bookingStatus === 'confirmed' ? 'text-emerald-400' : 'text-[#C59648]'
                }`}
              >
                {bookingStatus === 'confirmed'
                  ? 'Official Front-Desk Approval'
                  : 'Reservation Request Delivered'}
              </span>

              <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal mb-2 sm:mb-3">
                {bookingStatus === 'confirmed'
                  ? 'Accepted & Confirmed!'
                  : 'Pending: Your request is delivered.'}
              </h2>

              <div className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 bg-[#252320] rounded-[2px] border border-[#423E37] text-[11px] sm:text-xs font-mono tracking-widest text-[#E0DACF] mt-2">
                BOOKING REF: {confirmation.referenceNumber}
              </div>
            </div>

            {/* Voucher Details */}
            <div className="p-5 sm:p-12 space-y-5 sm:space-y-6">
              {/* PRIMARY STATUS & APPROVAL CARD */}
              {bookingStatus === 'confirmed' ? (
                <div className="p-5 sm:p-6 bg-[#F6F9F5] border-2 border-[#2E7D32]/60 rounded-[3px] shadow-sm space-y-3 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D8E6D5]">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20] border border-[#A5D6A7] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                        Accepted &amp; Confirmed!
                      </span>
                      <span className="text-xs text-[#2E7D32] font-semibold">
                        Reception Desk Approved
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#1B5E20] bg-white px-2.5 py-1 rounded border border-[#C8E6C9] self-start sm:self-auto">
                      Folio Status: ACTIVE
                    </span>
                  </div>

                  {/* High-visibility Approval Message */}
                  <div className="p-4 bg-white rounded border border-[#C8E6C9] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2E7D32]">
                      <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                      <span>Official Approval Message from Duule Luxury Hotel:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#1B5E20] leading-relaxed font-serif italic">
                      "{approvalMessage ||
                        `Dear ${confirmation.formData.guestName}, greetings from Duule Luxury Hotel in Jijiga. Your reservation (${confirmation.referenceNumber}) has been officially APPROVED & CONFIRMED by our front-office reception. Your ${confirmation.roomName} has been assigned, and our Wilwal Airport (JIJ) chauffeur service is scheduled for your arrival.`}"
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#2E7D32]">
                    <span>Assigned Room: <strong>{savedRecord?.assignedRoomNumber || 'Suite 204 (Executive Floor)'}</strong></span>
                    <span>Airport Transfer: <strong>Wilwal Airport (JIJ) Scheduled</strong></span>
                    <span>Check-in: <strong>{confirmation.formData.checkIn} at 14:00</strong></span>
                  </div>
                </div>
              ) : (
                <div className="p-5 sm:p-6 bg-[#FAF7F0] border-2 border-[#D9C49A] rounded-[3px] shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8DCC2]">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#FFF3D6] text-[#8C6010] border border-[#E8D196] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#A06C0C]" />
                        Pending: Your request is delivered.
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#2C6E49] bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                      <span>Live Sync: Waiting for Front-Desk Approval</span>
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm text-[#4E473C] leading-relaxed space-y-1.5">
                    <p>
                      Thank you, <strong>{confirmation.formData.guestName}</strong>. Your reservation request has been delivered directly to the front-desk reception desk at Duule Luxury Hotel in Jijiga.
                    </p>
                    <p className="text-[#6D6353] text-xs">
                      Our front-office duty officer has received your booking ticket on Telegram. As soon as the officer confirms your dates and room allocation, this screen will instantly update to <strong>"Accepted &amp; Confirmed"</strong> with your official approval voucher.
                    </p>
                  </div>

                  {/* Preview / Testing Simulation Button */}
                  <div className="pt-3 border-t border-[#E8DCC2] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-[#7D7362] text-[11px] font-light">
                      Staff reviewing on Telegram Bot (@{TELEGRAM_USERNAME})
                    </span>
                    <button
                      type="button"
                      onClick={handleSimulateAccept}
                      disabled={isSimulatingAccept}
                      className="px-3.5 py-1.5 rounded bg-[#171615] hover:bg-[#2A2724] text-[#D3AA67] border border-[#423E37] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95 disabled:opacity-50"
                      title="Test staff accepting booking from Telegram"
                    >
                      <Bot className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>
                        {isSimulatingAccept
                          ? 'Processing Approval...'
                          : 'Simulate Staff Tapping "Accept" in Telegram'}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Official Direct Booking Guarantee Banner */}
              <div className="p-4 bg-[#FAF6EE] border border-[#C59648]/40 rounded-[2px] text-xs text-[#7E6324] leading-relaxed flex items-start gap-3 shadow-xs">
                <ShieldCheck className="w-5 h-5 shrink-0 text-[#C59648] mt-0.5" />
                <div>
                  <strong className="text-[#171615] block mb-0.5">Official Direct Booking Guarantee:</strong>
                  Your reservation reference <strong className="text-[#171615] font-mono">{confirmation.referenceNumber}</strong> has been logged into the Duule Front-Desk ledger. Complimentary Wilwal Airport (JIJ) transfer has been assigned to your booking. Flexible cancellation is honored up to 24 hours prior to 2:00 PM check-in.
                </div>
              </div>

              {/* Guest & Stay Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 pt-5 sm:pt-6 border-t border-[#F0ECE4] text-xs sm:text-sm text-[#555047]">
                <div className="space-y-1.5">
                  <h4 className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#8C8375] font-semibold mb-2">
                    Stay Summary
                  </h4>
                  <p className="text-base font-semibold text-[#171615] mb-2 font-serif">
                    {confirmation.roomName} {confirmation.formData.roomCount && confirmation.formData.roomCount > 1 ? `(${confirmation.formData.roomCount} Rooms)` : ''}
                  </p>
                  <p>Check-in: <strong className="text-[#171615]">{confirmation.formData.checkIn}</strong> (From 2:00 PM)</p>
                  <p>Check-out: <strong className="text-[#171615]">{confirmation.formData.checkOut}</strong> (By 12:00 PM)</p>
                  <p>Total Duration: <strong className="text-[#171615]">{confirmation.totalNights} Night(s)</strong></p>
                  <p>Guests: <strong className="text-[#171615]">{confirmation.formData.adults} Adults, {confirmation.formData.children} Children</strong></p>
                  {confirmation.formData.isGroupBooking && confirmation.formData.organizationName && (
                    <p className="text-[#171615]">Delegation / Org: <strong>{confirmation.formData.organizationName}</strong></p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#8C8375] font-semibold mb-2">
                    Guest &amp; Payment Details
                  </h4>
                  <p className="text-base font-semibold text-[#171615] mb-2 font-serif">
                    {confirmation.formData.guestName}
                  </p>
                  <p className="break-all">Email: <strong className="text-[#171615]">{confirmation.formData.email}</strong></p>
                  <p>Phone: <strong className="text-[#171615]">{confirmation.formData.phone}</strong></p>
                  <p>
                    Payment: <strong className="text-[#171615]">
                      {confirmation.formData.paymentMethod === 'telebirr'
                        ? 'Telebirr (Show Ref Code at Desk)'
                        : confirmation.formData.paymentMethod === 'cbe'
                        ? 'CBE Birr / Mobile Banking'
                        : confirmation.formData.paymentMethod === 'card'
                        ? 'Credit/Debit Card (Visa/MC)'
                        : 'Pay Upon Arrival at Hotel'}
                    </strong>
                  </p>
                  <p>Booking Date: {confirmation.timestamp}</p>
                </div>
              </div>

              {/* Requests */}
              {confirmation.formData.specialRequests && (
                <div className="p-3.5 sm:p-4 bg-[#FAF8F5] rounded-[2px] border border-[#EAE5DC] text-xs sm:text-sm text-[#555047]">
                  <strong className="block text-[#171615] mb-1">Special Preferences &amp; Requests:</strong>
                  <span>{confirmation.formData.specialRequests}</span>
                </div>
              )}

              {/* Direct Concierge Chat Options */}
              {savedRecord && (
                <div className="p-4 sm:p-5 bg-[#FAF8F5] rounded-[3px] border border-[#EAE5DC] text-[#4E473C] space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#7A7265]">
                    <span className="font-semibold text-[#171615]">Optional: Direct Concierge Inquiries</span>
                    <span className="text-[11px] text-[#C59648]">Front Desk Available 24/7</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <a
                      href={getTelegramDispatchUrl(savedRecord)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2.5 bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-medium rounded-[2px] flex items-center justify-center gap-2 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Chat with Front-Desk Telegram (@{TELEGRAM_USERNAME})</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>

                    <a
                      href={getWhatsAppDispatchUrl(savedRecord)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2.5 bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs font-medium rounded-[2px] flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Concierge: +{HOTEL_INFO.whatsappDisplay}</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#EAE5DC] text-[11px] text-[#7A7265]">
                    <button
                      type="button"
                      onClick={handleCopyTelegram}
                      className="text-[#171615] hover:text-[#C59648] underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedTelegram ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedTelegram ? 'Ticket copied to clipboard!' : 'Copy booking ticket text'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('admin')}
                      className="text-[#8C6010] hover:underline"
                    >
                      Reception Staff Portal &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* Pricing breakdown */}
              <div className="pt-5 sm:pt-6 border-t border-[#F0ECE4] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#8C8375] uppercase tracking-wider block">Estimated Total</span>
                  <span className="text-[11px] sm:text-xs text-[#736B5F] font-light">Inclusive of Ethiopian taxes &amp; service</span>
                </div>
                <span className="font-serif text-2xl sm:text-4xl font-bold text-[#171615]">
                  ${confirmation.totalPrice} USD
                </span>
              </div>

              {/* Actions */}
              <div className="pt-6 sm:pt-8 border-t border-[#F0ECE4] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                <button
                  onClick={handlePrint}
                  className="w-full sm:w-auto px-6 py-3.5 min-h-[44px] border border-[#171615] text-[#171615] hover:bg-[#171615] hover:text-white text-xs uppercase font-bold tracking-wider rounded-[2px] flex items-center justify-center gap-2 transition-colors active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Voucher</span>
                </button>

                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                  <button
                    onClick={() => setConfirmation(null)}
                    className="w-full sm:w-auto px-5 py-3.5 min-h-[44px] bg-[#FAF6EE] text-[#555047] hover:bg-[#F2EFE9] text-xs uppercase font-semibold tracking-wider rounded-[2px] transition-colors text-center"
                  >
                    Modify Request
                  </button>
                  <button
                    onClick={() => onNavigate('home')}
                    className="w-full sm:w-auto px-7 py-3.5 min-h-[44px] bg-[#171615] hover:bg-[#C59648] hover:text-[#121110] text-white text-xs uppercase font-bold tracking-[0.2em] rounded-[2px] transition-colors active:scale-95 text-center"
                  >
                    Return to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Main Booking Form Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left Side: Booking Form Fields */}
            <div className="lg:col-span-8 bg-white p-5 sm:p-8 lg:p-12 rounded-[2px] border border-[#E5E0D6] shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
                {/* Step 1: Stay Dates & Guests */}
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C59648] font-bold mb-4 sm:mb-5">
                    <span>1. Stay Schedule &amp; Party Size</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 text-xs sm:text-sm">
                    <div>
                      <label className="block text-[#4A453D] font-medium mb-1.5 text-xs uppercase tracking-wider">
                        Check-in Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        min={todayStr}
                        value={formData.checkIn}
                        onChange={(e) => {
                          setFormData({ ...formData, checkIn: e.target.value });
                          if (errors.checkIn) setErrors({ ...errors, checkIn: undefined });
                        }}
                        className={`w-full px-3.5 py-3 min-h-[44px] border rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648] ${
                          errors.checkIn ? 'border-red-500 bg-red-50/20' : 'border-[#D1CAC0]'
                        }`}
                      />
                      {errors.checkIn && (
                        <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.checkIn}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#4A453D] font-medium mb-1.5 text-xs uppercase tracking-wider">
                        Check-out Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        min={formData.checkIn || todayStr}
                        value={formData.checkOut}
                        onChange={(e) => {
                          setFormData({ ...formData, checkOut: e.target.value });
                          if (errors.checkOut) setErrors({ ...errors, checkOut: undefined });
                        }}
                        className={`w-full px-3.5 py-3 min-h-[44px] border rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648] ${
                          errors.checkOut ? 'border-red-500 bg-red-50/20' : 'border-[#D1CAC0]'
                        }`}
                      />
                      {errors.checkOut && (
                        <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.checkOut}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#4A453D] font-medium mb-1.5 text-xs uppercase tracking-wider">Adults (18+)</label>
                      <select
                        value={formData.adults}
                        onChange={(e) => setFormData({ ...formData, adults: Number(e.target.value) })}
                        className="w-full px-3.5 py-3 min-h-[44px] border border-[#D1CAC0] rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648]"
                      >
                        <option value={1}>1 Adult</option>
                        <option value={2}>2 Adults</option>
                        <option value={3}>3 Adults</option>
                        <option value={4}>4 Adults</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#4A453D] font-medium mb-1.5 text-xs uppercase tracking-wider">Children (0–17)</label>
                      <select
                        value={formData.children}
                        onChange={(e) => setFormData({ ...formData, children: Number(e.target.value) })}
                        className="w-full px-3.5 py-3 min-h-[44px] border border-[#D1CAC0] rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648]"
                      >
                        <option value={0}>0 Children</option>
                        <option value={1}>1 Child</option>
                        <option value={2}>2 Children</option>
                        <option value={3}>3+ Children</option>
                      </select>
                    </div>
                  </div>

                  {/* Corporate / Delegation Toggle */}
                  <div className="mt-4 p-3.5 bg-[#FAF6EE] border border-[#E8E1D3] rounded-[2px]">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.isGroupBooking || false}
                        onChange={(e) => setFormData({ ...formData, isGroupBooking: e.target.checked, roomCount: e.target.checked ? Math.max(2, formData.roomCount || 2) : 1 })}
                        className="w-4 h-4 text-[#C59648] focus:ring-[#C59648] rounded border-gray-300"
                      />
                      <span className="text-xs font-semibold text-[#171615]">
                        Corporate, NGO or Diplomatic Delegation Booking (Multiple Rooms)
                      </span>
                    </label>

                    {formData.isGroupBooking && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#E5DEC9]">
                        <div>
                          <label className="block text-[11px] font-medium text-[#5D564A] uppercase tracking-wider mb-1">
                            Organization / Agency Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. UN OCHA, Somali Regional Bureau, Commercial Bank"
                            value={formData.organizationName || ''}
                            onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                            className="w-full px-3 py-2 text-xs border border-[#D1CAC0] rounded-[2px] bg-white focus:outline-none focus:border-[#C59648]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-[#5D564A] uppercase tracking-wider mb-1">
                            Number of Rooms Required
                          </label>
                          <select
                            value={formData.roomCount || 2}
                            onChange={(e) => setFormData({ ...formData, roomCount: Number(e.target.value) })}
                            className="w-full px-3 py-2 text-xs border border-[#D1CAC0] rounded-[2px] bg-white focus:outline-none focus:border-[#C59648]"
                          >
                            {[2, 3, 4, 5, 6, 8, 10, 15, 20].map((num) => (
                              <option key={num} value={num}>
                                {num} Rooms
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 2: Choose Room Type */}
                <div className="pt-6 sm:pt-8 border-t border-[#F0ECE4]">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C59648] font-bold mb-4 sm:mb-5">
                    <span>2. Select Room Class</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {ROOMS_DATA.map((room) => {
                      const isSelected = formData.roomType === room.id;
                      return (
                        <button
                          type="button"
                          key={room.id}
                          onClick={() => setFormData({ ...formData, roomType: room.id })}
                          aria-pressed={isSelected}
                          className={`p-3.5 sm:p-4 rounded-[2px] border cursor-pointer transition-all text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C59648] ${
                            isSelected
                              ? 'border-[#C59648] bg-[#FAF6EE] shadow-md ring-1 ring-[#C59648]'
                              : 'border-[#E0DACF] bg-white hover:border-[#C59648]/60 hover:shadow-sm'
                          }`}
                        >
                          <img
                            src={room.image}
                            alt={room.name}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            className="w-full h-28 sm:h-32 object-cover rounded-[2px] mb-2.5 sm:mb-3"
                          />
                          <h4 className="font-serif text-sm sm:text-base font-medium text-[#171615]">
                            {room.name}
                          </h4>
                          <span className="text-[11px] sm:text-xs text-[#736B5F] block mb-2 font-light">
                            {room.view} &bull; {room.bedType}
                          </span>
                          <div className="flex items-baseline justify-between pt-2 border-t border-[#EAE3D5]">
                            <span className="font-serif text-lg sm:text-xl font-bold text-[#171615]">
                              ${room.pricePerNight}
                            </span>
                            <span className="text-[10px] sm:text-[11px] text-[#8C8375]">/ night</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Guest Contact Details */}
                <div className="pt-6 sm:pt-8 border-t border-[#F0ECE4]">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C59648] font-bold mb-4 sm:mb-5">
                    <span>3. Primary Guest Information</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 text-xs sm:text-sm">
                    <div className="sm:col-span-2">
                      <label className="block text-[#4A453D] font-medium mb-1.5 text-xs uppercase tracking-wider">
                        Full Name (as on Passport / ID) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.guestName}
                        onChange={(e) => {
                          setFormData({ ...formData, guestName: e.target.value });
                          if (errors.guestName) setErrors({ ...errors, guestName: undefined });
                        }}
                        placeholder="e.g. Dr. Sarah Jenkins"
                        className={`w-full px-3.5 py-3 min-h-[44px] border rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648] ${
                          errors.guestName ? 'border-red-500 bg-red-50/20' : 'border-[#D1CAC0]'
                        }`}
                      />
                      {errors.guestName && (
                        <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.guestName}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#4A453D] font-medium mb-1.5 text-xs uppercase tracking-wider">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        placeholder="sarah@example.com"
                        className={`w-full px-3.5 py-3 min-h-[44px] border rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648] ${
                          errors.email ? 'border-red-500 bg-red-50/20' : 'border-[#D1CAC0]'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#4A453D] font-medium mb-1.5 text-xs uppercase tracking-wider">
                        Phone / WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: undefined });
                        }}
                        placeholder="+251 ..."
                        className={`w-full px-3.5 py-3 min-h-[44px] border rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648] ${
                          errors.phone ? 'border-red-500 bg-red-50/20' : 'border-[#D1CAC0]'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 4: Payment Preference & Settlement */}
                <div className="pt-6 sm:pt-8 border-t border-[#F0ECE4]">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C59648] font-bold mb-4 sm:mb-5">
                    <span>4. Settlement &amp; Payment Preference</span>
                  </div>

                  <p className="text-xs text-[#6B6458] mb-3.5 font-light">
                    Select how you prefer to settle your room charges upon arrival or prior to check-in:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    {[
                      {
                        id: 'hotel',
                        title: 'Pay Upon Arrival at Front Desk',
                        desc: 'Settle in cash (USD / ETB) or card directly with the Receptionist at 2:00 PM check-in.',
                        icon: Banknote,
                        badge: 'Most Popular',
                      },
                      {
                        id: 'telebirr',
                        title: 'Telebirr Mobile Money',
                        desc: 'Direct Ethio Telecom digital payment. Merchant QR & SuperApp transfer supported.',
                        icon: Smartphone,
                        badge: 'Instant ETB',
                      },
                      {
                        id: 'cbe',
                        title: 'Commercial Bank of Ethiopia (CBE Birr)',
                        desc: 'Official CBE account transfer or CBE Birr USSD / Mobile Banking settlement.',
                        icon: Wallet,
                        badge: 'CBE Birr',
                      },
                      {
                        id: 'card',
                        title: 'International Credit / Debit Card',
                        desc: 'Visa, MasterCard, or American Express processed at hotel desk or via secure gateway.',
                        icon: CreditCard,
                        badge: 'Visa / MC',
                      },
                    ].map((method) => {
                      const isSelected = (formData.paymentMethod || 'hotel') === method.id;
                      const IconComponent = method.icon;
                      return (
                        <button
                          type="button"
                          key={method.id}
                          onClick={() => setFormData({ ...formData, paymentMethod: method.id as any })}
                          className={`p-3.5 sm:p-4 rounded-[2px] border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#C59648] bg-[#FAF6EE] shadow-sm ring-1 ring-[#C59648]'
                              : 'border-[#E0DACF] bg-white hover:border-[#C59648]/60'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <IconComponent className={`w-4 h-4 ${isSelected ? 'text-[#C59648]' : 'text-[#8C8375]'}`} />
                              <span className="text-xs sm:text-sm font-medium text-[#171615]">
                                {method.title}
                              </span>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-[2px] bg-[#EAE3D5] text-[#555047] font-semibold tracking-wider uppercase shrink-0">
                              {method.badge}
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-[#736B5F] font-light leading-relaxed">
                            {method.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 5: Special Preferences */}
                <div className="pt-6 sm:pt-8 border-t border-[#F0ECE4]">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C59648] font-bold mb-3 sm:mb-4">
                    <span>5. Special Requests &amp; Arrival Preferences</span>
                  </div>

                  <div className="mb-4 sm:mb-5">
                    <span className="block text-xs text-[#6B6458] mb-2.5 font-light">
                      Select any complimentary preferences:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {quickRequestTags.map((tag, i) => {
                        const isChecked = selectedAddons.includes(tag);
                        return (
                          <button
                            type="button"
                            key={i}
                            onClick={() => toggleAddon(tag)}
                            className={`px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs rounded-[2px] border transition-colors ${
                              isChecked
                                ? 'bg-[#171615] text-[#D3AA67] border-[#171615] shadow-sm'
                                : 'bg-[#FAF8F5] text-[#555047] border-[#D1CAC0] hover:bg-[#F2EFE9]'
                            }`}
                          >
                            {isChecked ? '✓ ' : '+ '}
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm">
                    <label className="block text-[#4A453D] font-medium mb-1.5 text-xs uppercase tracking-wider">
                      Additional Dietary, Flight or Room Requests
                    </label>
                    <textarea
                      rows={3}
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      placeholder="Please note any flight arrival numbers for Wilwal Airport (JIJ) chauffeur pickup, dietary needs, or delegation credentials..."
                      className="w-full px-3.5 py-2.5 sm:py-3 border border-[#D1CAC0] rounded-[2px] bg-[#FAF8F5] focus:outline-none focus:border-[#C59648]"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-6 sm:pt-8 border-t border-[#F0ECE4]">
                  <button
                    type="submit"
                    className="w-full py-4 min-h-[50px] bg-gradient-to-r from-[#B8973A] to-[#D3AA67] hover:from-[#C59648] hover:to-[#E0C07F] text-[#121110] text-xs uppercase font-bold tracking-[0.22em] rounded-[2px] shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Confirm &amp; Register Reservation</span>
                  </button>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-xs text-[#736B5F] font-light">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C59648]" /> Official Direct Booking Guarantee
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C59648]" /> Free 24-Hour Prior Cancellation
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C59648]" /> Complimentary Wilwal Airport Transfer
                    </span>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Side: Real-time Live Price Summary Card */}
            <div className="lg:col-span-4">
              <div className="bg-[#171615] text-[#FAF8F5] rounded-[2px] border border-[#33302B] p-5 sm:p-8 shadow-2xl sticky top-28">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#C59648] font-semibold block mb-1.5 sm:mb-2">
                  Stay Overview
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-white font-normal mb-3 sm:mb-4">
                  {currentRoom.name}
                </h3>

                <div className="rounded-[2px] overflow-hidden mb-5 sm:mb-6 h-36 sm:h-40 bg-neutral-900 shadow-md">
                  <img
                    src={currentRoom.image}
                    alt={currentRoom.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-[#B8AFA2] pb-5 sm:pb-6 border-b border-[#2C2925]">
                  <div className="flex justify-between">
                    <span>Dates:</span>
                    <span className="text-white font-medium text-right">
                      {formData.checkIn} &rarr; {formData.checkOut}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="text-white font-medium">{nights} Night(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Occupancy:</span>
                    <span className="text-white font-medium">
                      {formData.adults} Adults, {formData.children} Children
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Breakfast:</span>
                    <span className="text-[#D3AA67] font-medium">
                      {currentRoom.breakfastIncluded ? 'Included in rate' : 'Available on request'}
                    </span>
                  </div>
                </div>

                <div className="py-5 sm:py-6 space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-[#B8AFA2] border-b border-[#2C2925]">
                  <div className="flex justify-between">
                    <span>
                      ${currentRoom.pricePerNight} &times; {nights} night(s){roomQuantity > 1 ? ` &times; ${roomQuantity} rooms` : ''}
                    </span>
                    <span className="text-white font-medium">${subtotal}</span>
                  </div>
                  {formData.isGroupBooking && (
                    <div className="flex justify-between text-[#C59648] text-xs">
                      <span>Group Booking:</span>
                      <span className="font-medium">{roomQuantity} Rooms</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Taxes &amp; Service Charge (15%)</span>
                    <span className="text-white font-medium">${taxesAndService}</span>
                  </div>
                  <div className="flex justify-between pt-1 text-xs border-t border-[#2C2925]/60">
                    <span>Payment Mode:</span>
                    <span className="text-[#D3AA67] font-medium">
                      {formData.paymentMethod === 'telebirr'
                        ? 'Telebirr (Mobile Money)'
                        : formData.paymentMethod === 'cbe'
                        ? 'CBE Birr / Mobile Banking'
                        : formData.paymentMethod === 'card'
                        ? 'Credit / Debit Card'
                        : 'Pay Upon Arrival'}
                    </span>
                  </div>
                </div>

                <div className="pt-5 sm:pt-6 flex items-baseline justify-between mb-5 sm:mb-6">
                  <span className="text-xs uppercase tracking-wider text-[#C59648] font-semibold">
                    Estimated Total
                  </span>
                  <div className="text-right">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-white">
                      ${grandTotal}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#8C8375] block">USD</span>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 bg-[#1F1E1B] rounded-[2px] border border-[#33302B] space-y-1.5 sm:space-y-2 text-[11px] text-[#A69D8F]">
                  <div className="flex items-center gap-2 text-[#E0DACF]">
                    <ShieldCheck className="w-4 h-4 text-[#C59648]" />
                    <span className="font-semibold">Best Rate Direct Assurance</span>
                  </div>
                  <p className="font-light leading-relaxed">
                    Complimentary high-speed fiber Wi-Fi, luggage transfer, and 24-hour concierge assistance included with every reservation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
