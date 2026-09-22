import React, { useState, useEffect, useMemo } from 'react';
import { PageId, ReservationRecord, ReservationStatus } from '../types';
import { ROOMS_DATA, HOTEL_INFO } from '../data/hotelData';
import {
  getStoredReservations,
  updateReservationStatus,
  deleteReservation,
  resetReservationsToDefault,
  subscribeToReservations,
  saveReservation,
  TELEGRAM_USERNAME,
  getTelegramDispatchUrl,
  getGuestWhatsAppApprovalUrl,
  buildTelegramReservationMessage,
  fetchTelegramBotStatus,
  updateTelegramBotConfig,
  dispatchAutomatedTelegramBooking,
  TelegramBotStatus,
} from '../utils/reservationStore';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  UserCheck,
  Search,
  Filter,
  Plus,
  Printer,
  ExternalLink,
  MessageCircle,
  Send,
  BedDouble,
  Calendar,
  Users,
  Building,
  RotateCcw,
  Lock,
  Unlock,
  Eye,
  Key,
  DollarSign,
  Copy,
  Check,
  FileText,
  Phone,
  Mail,
  Sparkles,
  Bot,
  Radio,
  Settings,
  RefreshCw,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: PageId) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  // Authentication PIN state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('duule_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Data state
  const [reservations, setReservations] = useState<ReservationRecord[]>(getStoredReservations);
  const [statusFilter, setStatusFilter] = useState<'all' | ReservationStatus>('all');
  const [roomFilter, setRoomFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Active Actions
  const [selectedRecord, setSelectedRecord] = useState<ReservationRecord | null>(null);
  const [actionModalType, setActionModalType] = useState<
    'approve' | 'folio' | 'newBooking' | 'telegramPreview' | 'telegramSettings' | null
  >(null);
  const [assignRoomNumber, setAssignRoomNumber] = useState('');
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Telegram Bot automated server status
  const [botStatus, setBotStatus] = useState<TelegramBotStatus | null>(null);
  const [botTokenInput, setBotTokenInput] = useState('');
  const [botChatIdInput, setBotChatIdInput] = useState('');
  const [botSaveLoading, setBotSaveLoading] = useState(false);
  const [botTestSuccess, setBotTestSuccess] = useState('');
  const [botTestError, setBotTestError] = useState('');
  const [resendingBotId, setResendingBotId] = useState<string | null>(null);
  const [resendStatusMessage, setResendStatusMessage] = useState<string | null>(null);

  // New Walk-in form state
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 2);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  const [newBookingForm, setNewBookingForm] = useState({
    guestName: '',
    phone: '',
    email: '',
    roomType: 'executive-room',
    checkIn: todayStr,
    checkOut: tomorrowStr,
    adults: 2,
    children: 0,
    specialRequests: 'Front-desk walk-in registration.',
    assignedRoom: 'Suite 204',
  });

  // Clock
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Africa/Addis_Ababa',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
        setCurrentTime(formatter.format(now));
      } catch {
        setCurrentTime('Jijiga EAT (UTC+3)');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync with store
  useEffect(() => {
    const unsubscribe = subscribeToReservations(() => {
      setReservations(getStoredReservations());
    });
    return () => unsubscribe();
  }, []);

  // Sync Telegram Bot server status
  useEffect(() => {
    if (isAuthenticated) {
      fetchTelegramBotStatus().then((st) => {
        if (st) {
          setBotStatus(st);
          if (st.chatId) setBotChatIdInput(st.chatId);
        }
      });
    }
  }, [isAuthenticated]);

  const handleSaveBotConfig = async (sendTest = false) => {
    setBotSaveLoading(true);
    setBotTestSuccess('');
    setBotTestError('');

    const res = await updateTelegramBotConfig(botTokenInput, botChatIdInput, sendTest);
    setBotSaveLoading(false);

    if (res.success) {
      setBotTestSuccess(
        sendTest
          ? 'Verification test message dispatched and delivered to your Telegram chat successfully!'
          : 'Telegram bot credentials saved and armed for automatic dispatch!'
      );
      // Refresh status
      const st = await fetchTelegramBotStatus();
      if (st) setBotStatus(st);
    } else {
      setBotTestError(res.error || 'Failed to update or verify Telegram credentials.');
    }
  };

  const handleResendBotNotification = async (resRecord: ReservationRecord) => {
    setResendingBotId(resRecord.id);
    setResendStatusMessage(null);
    try {
      const result = await dispatchAutomatedTelegramBooking(resRecord);
      if (result.delivered) {
        setResendStatusMessage(`Delivered to Telegram Bot (Msg #${result.telegramMessageId}) for Ref ${resRecord.referenceNumber}`);
      } else {
        setResendStatusMessage(`Bot delivery notice: ${result.message}`);
      }
    } catch (e: any) {
      setResendStatusMessage(`Dispatch error: ${e.message}`);
    } finally {
      setResendingBotId(null);
      setTimeout(() => setResendStatusMessage(null), 5000);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '1234') {
      setIsAuthenticated(true);
      sessionStorage.setItem('duule_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('Incorrect PIN. (Demo default PIN is 1234)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('duule_admin_auth');
    setPinInput('');
  };

  // KPIs
  const totalCount = reservations.length;
  const pendingCount = reservations.filter((r) => r.status === 'pending').length;
  const confirmedCount = reservations.filter((r) => r.status === 'confirmed').length;
  const checkedInCount = reservations.filter((r) => r.status === 'checked-in').length;
  const totalRevenue = reservations.reduce((sum, r) => sum + (r.status !== 'cancelled' ? r.totalPrice : 0), 0);

  // Filtering
  const filteredReservations = useMemo(() => {
    return reservations.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (roomFilter !== 'all' && item.roomType !== roomFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.formData.guestName.toLowerCase().includes(q);
        const matchRef = item.referenceNumber.toLowerCase().includes(q);
        const matchPhone = item.formData.phone.toLowerCase().includes(q);
        const matchEmail = item.formData.email.toLowerCase().includes(q);
        const matchRoom = item.roomName.toLowerCase().includes(q);
        if (!matchName && !matchRef && !matchPhone && !matchEmail && !matchRoom) {
          return false;
        }
      }
      return true;
    });
  }, [reservations, statusFilter, roomFilter, searchQuery]);

  const handleOpenApproveModal = (res: ReservationRecord) => {
    setSelectedRecord(res);
    setAssignRoomNumber(res.assignedRoomNumber || 'Suite ' + (200 + Math.floor(Math.random() * 40)));
    setAdminNotesInput(res.adminNotes || 'Confirmed by Front Desk Officer.');
    setActionModalType('approve');
  };

  const handleConfirmApproval = () => {
    if (!selectedRecord) return;
    updateReservationStatus(selectedRecord.id, 'confirmed', assignRoomNumber, adminNotesInput);
    // Synchronize with server persistence and Telegram edit
    fetch('/api/reservations/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referenceNumber: selectedRecord.referenceNumber,
        roomNumber: assignRoomNumber,
        notes: adminNotesInput,
        staffName: 'Admin Reception Desk',
      }),
    }).catch((err) => console.warn('Server accept notification:', err));
    setActionModalType(null);
    setSelectedRecord(null);
  };

  const handleStatusChange = (id: string, status: ReservationStatus) => {
    updateReservationStatus(id, status);
  };

  const handleCopyTelegram = (res: ReservationRecord) => {
    const text = buildTelegramReservationMessage(res);
    navigator.clipboard.writeText(text);
    setCopiedId(res.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookingForm.guestName.trim()) return;

    const currentRoom = ROOMS_DATA.find((r) => r.id === newBookingForm.roomType) || ROOMS_DATA[0];

    const d1 = new Date(newBookingForm.checkIn);
    const d2 = new Date(newBookingForm.checkOut);
    const diffDays = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
    const subtotal = currentRoom.pricePerNight * diffDays;
    const tax = Math.round(subtotal * 0.15);
    const grandTotal = subtotal + tax;

    const refNumber = `DLH-${Math.floor(10000 + Math.random() * 90000)}`;

    const record: ReservationRecord = {
      id: refNumber,
      referenceNumber: refNumber,
      formData: {
        checkIn: newBookingForm.checkIn,
        checkOut: newBookingForm.checkOut,
        adults: Number(newBookingForm.adults),
        children: Number(newBookingForm.children),
        roomType: newBookingForm.roomType,
        guestName: newBookingForm.guestName,
        email: newBookingForm.email || 'walkin@duulehotel.com',
        phone: newBookingForm.phone || '+251',
        specialRequests: newBookingForm.specialRequests,
      },
      roomName: currentRoom.name,
      roomType: currentRoom.id,
      totalNights: diffDays,
      totalPrice: grandTotal,
      status: 'confirmed',
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }) + ' at ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      assignedRoomNumber: newBookingForm.assignedRoom || 'Suite 201',
      adminNotes: 'Direct Walk-in registered at Front Office.',
      source: 'walk-in',
    };

    saveReservation(record);
    setActionModalType(null);
    setNewBookingForm({
      guestName: '',
      phone: '',
      email: '',
      roomType: 'executive-room',
      checkIn: todayStr,
      checkOut: tomorrowStr,
      adults: 2,
      children: 0,
      specialRequests: 'Front-desk walk-in registration.',
      assignedRoom: 'Suite 204',
    });
  };

  // PIN Gate Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0E1A24] flex items-center justify-center p-4 pt-24 pb-16 text-white font-sans">
        <div className="max-w-md w-full bg-[#142433] rounded-[4px] border border-[#21394F] shadow-2xl p-6 sm:p-8 relative">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-[#C59648]/20 border border-[#C59648]/40 text-[#D3AA67] mx-auto flex items-center justify-center mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C59648] font-bold block mb-1">
              Front Office Operations
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              Duule Reception Portal
            </h2>
            <p className="text-xs text-[#9BB1C4] mt-2 font-light">
              Secure access for hotel management, front-desk reservation approvals, and guest registration.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9BB1C4] mb-1.5 font-medium">
                Enter Staff Authorization PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={8}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  className="w-full px-4 py-3 bg-[#0B151F] border border-[#2A4864] rounded-[2px] text-white text-center tracking-[0.5em] font-mono text-xl focus:outline-none focus:border-[#C59648] transition-colors"
                  autoFocus
                />
                <Key className="w-4 h-4 text-[#C59648] absolute right-3.5 top-3.5 opacity-60" />
              </div>
              {pinError && (
                <p className="text-xs text-rose-400 mt-2 flex items-center gap-1.5 justify-center">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{pinError}</span>
                </p>
              )}
            </div>

            <div className="p-3 bg-[#0B1724] rounded-[2px] border border-[#1A334A] text-xs text-[#8BA4BA] flex items-center justify-between">
              <span>Default Demo Staff PIN:</span>
              <strong className="text-[#C59648] font-mono text-sm px-2 py-0.5 bg-[#172D40] rounded border border-[#C59648]/30">
                1234
              </strong>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#C59648] hover:bg-[#D3AA67] text-[#121110] font-bold text-xs uppercase tracking-[0.2em] rounded-[2px] transition-colors flex items-center justify-center gap-2 active:scale-95"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Desk</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#1F374D] flex items-center justify-between text-xs text-[#7892A8]">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-white transition-colors"
            >
              &larr; Return to Hotel Site
            </button>
            <span>Jijiga EAT</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F1EB] text-[#222222] pt-24 sm:pt-28 pb-20 font-sans">
      {/* Top Front-Office Header Bar */}
      <div className="bg-[#12202E] text-white border-b border-[#21394F] sticky top-16 sm:top-20 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[2px] bg-[#C59648]/20 border border-[#C59648]/50 text-[#D3AA67] flex items-center justify-center font-serif text-lg font-bold">
              D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg sm:text-xl text-white font-medium tracking-wide">
                  Duule Luxury Hotel &bull; Front Office Desk
                </h1>
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] uppercase font-bold tracking-wider rounded">
                  Live System
                </span>
              </div>
              <p className="text-xs text-[#9BB1C4] font-light flex items-center gap-2">
                <span>Jijiga Local Time: <strong className="text-[#C59648]">{currentTime || 'EAT (UTC+3)'}</strong></span>
                <span>&bull;</span>
                <span>Officer on Duty: <strong className="text-white">Duty Manager</strong></span>
              </p>
            </div>
          </div>

          {/* Quick Bar Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Automated Telegram Bot Status & Config Button */}
            <button
              onClick={() => {
                setActionModalType('telegramSettings');
                setBotTestSuccess('');
                setBotTestError('');
              }}
              className="px-3 py-1.5 rounded-[2px] bg-[#102A43] hover:bg-[#1A3D60] text-[#7DD3FC] border border-[#234E75] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Configure and monitor automated Telegram Bot dispatch"
            >
              <Bot className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Automated Bot</span>
              {botStatus?.configured ? (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              ) : (
                <span className="text-[10px] text-amber-300 font-bold bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/40">
                  Standby
                </span>
              )}
            </button>

            {/* Telegram Channel direct link */}
            <a
              href={`https://t.me/${TELEGRAM_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-[2px] bg-[#0088cc]/20 hover:bg-[#0088cc]/30 text-[#4fc3f7] border border-[#0088cc]/40 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title={`Direct Telegram notifications channel to @${TELEGRAM_USERNAME}`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram: @{TELEGRAM_USERNAME}</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            {/* New Walk-in Reservation button */}
            <button
              onClick={() => setActionModalType('newBooking')}
              className="px-3.5 py-1.5 rounded-[2px] bg-[#C59648] hover:bg-[#D3AA67] text-[#121110] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Walk-in / Phone</span>
            </button>

            {/* Lock / Exit */}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-[2px] bg-[#1E3347] hover:bg-[#2B455E] text-[#B5CADB] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Lock reception dashboard"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>
          </div>
        </div>

        {/* Global Dispatch Notification Banner if active */}
        {resendStatusMessage && (
          <div className="bg-[#0B1E2E] border-t border-[#1C3E5E] px-4 py-2 text-xs text-[#90CAF9] flex items-center justify-between">
            <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
              <Bot className="w-4 h-4 text-[#38BDF8] shrink-0" />
              <span>{resendStatusMessage}</span>
              <button
                onClick={() => setResendStatusMessage(null)}
                className="ml-auto text-xs text-[#82B1FF] hover:text-white"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* KPI Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Pending Reviews */}
          <div
            onClick={() => setStatusFilter('pending')}
            className={`cursor-pointer p-4 sm:p-5 rounded-[2px] border transition-all ${
              statusFilter === 'pending'
                ? 'bg-[#FFF8E7] border-[#C59648] ring-2 ring-[#C59648]/30'
                : 'bg-white border-[#E0DACF] hover:border-[#C59648]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#8A7F70] font-semibold">
                Pending Approval
              </span>
              <span className="relative flex h-2.5 w-2.5">
                {pendingCount > 0 && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                )}
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${pendingCount > 0 ? 'bg-amber-500' : 'bg-gray-300'}`} />
              </span>
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#171615]">
              {pendingCount}
            </div>
            <span className="text-[11px] text-amber-800 mt-1 block font-light">
              Requires review &amp; room assignment
            </span>
          </div>

          {/* Confirmed */}
          <div
            onClick={() => setStatusFilter('confirmed')}
            className={`cursor-pointer p-4 sm:p-5 rounded-[2px] border transition-all ${
              statusFilter === 'confirmed'
                ? 'bg-[#EBF7EE] border-emerald-600 ring-2 ring-emerald-600/30'
                : 'bg-white border-[#E0DACF] hover:border-emerald-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#8A7F70] font-semibold">
                Confirmed Bookings
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-emerald-900">
              {confirmedCount}
            </div>
            <span className="text-[11px] text-emerald-700 mt-1 block font-light">
              Ready for guest arrival
            </span>
          </div>

          {/* In-House Checked In */}
          <div
            onClick={() => setStatusFilter('checked-in')}
            className={`cursor-pointer p-4 sm:p-5 rounded-[2px] border transition-all ${
              statusFilter === 'checked-in'
                ? 'bg-[#EDF5FD] border-sky-600 ring-2 ring-sky-600/30'
                : 'bg-white border-[#E0DACF] hover:border-sky-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#8A7F70] font-semibold">
                In-House (Stay)
              </span>
              <UserCheck className="w-4 h-4 text-sky-600" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-sky-900">
              {checkedInCount}
            </div>
            <span className="text-[11px] text-sky-700 mt-1 block font-light">
              Currently occupying rooms
            </span>
          </div>

          {/* Total Bookings */}
          <div
            onClick={() => setStatusFilter('all')}
            className={`cursor-pointer p-4 sm:p-5 rounded-[2px] border transition-all ${
              statusFilter === 'all'
                ? 'bg-[#FAF8F5] border-[#171615] ring-2 ring-[#171615]/20'
                : 'bg-white border-[#E0DACF] hover:border-[#171615]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#8A7F70] font-semibold">
                Total Portfolio
              </span>
              <Building className="w-4 h-4 text-[#685F53]" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#171615]">
              {totalCount}
            </div>
            <span className="text-[11px] text-[#7A7265] mt-1 block font-light">
              All reservation manifests
            </span>
          </div>

          {/* Projected Revenue */}
          <div className="col-span-2 sm:col-span-1 p-4 sm:p-5 rounded-[2px] border border-[#E0DACF] bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#8A7F70] font-semibold">
                Projected Revenue
              </span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-emerald-800">
              ${totalRevenue.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#7A7265] mt-1 block font-light">
              USD total stay value
            </span>
          </div>
        </div>

        {/* Telegram & WhatsApp Hybrid Dispatch Notification Bar */}
        <div className="bg-gradient-to-r from-[#0C2438] via-[#143650] to-[#0D263B] text-white p-4 sm:p-5 rounded-[2px] border border-[#1E4362] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#0088cc]/20 border border-[#0088cc]/40 text-[#38bdf8] flex items-center justify-center shrink-0 mt-0.5">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">
                  Direct Dispatch to Telegram Concierge: <span className="text-[#38bdf8]">@{TELEGRAM_USERNAME}</span>
                </h3>
                <span className="px-2 py-0.5 bg-[#0088cc]/30 text-[#7dd3fc] text-[10px] uppercase tracking-wider rounded font-mono font-medium">
                  Option C Active
                </span>
              </div>
              <p className="text-xs text-[#A0B8CD] mt-0.5 leading-relaxed font-light">
                When reservations are placed, a complete ticket payload is prepared with one-click dispatch to Telegram username <strong>@{TELEGRAM_USERNAME}</strong> and hotel WhatsApp desk.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href={`https://t.me/${TELEGRAM_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-semibold rounded-[2px] flex items-center gap-1.5 transition-colors active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Open Telegram @{TELEGRAM_USERNAME}</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={() => resetReservationsToDefault()}
              className="px-3 py-2 bg-[#1B364D] hover:bg-[#254B6B] text-[#BDD3E5] text-xs font-medium rounded-[2px] flex items-center gap-1.5 transition-colors"
              title="Reload default demo reservations (including Dr. Abdrehman Hassen)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Records</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-[2px] border border-[#E0DACF] shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            {[
              { id: 'all', label: 'All Bookings', count: totalCount },
              { id: 'pending', label: 'Pending', count: pendingCount },
              { id: 'confirmed', label: 'Confirmed', count: confirmedCount },
              { id: 'checked-in', label: 'In-House', count: checkedInCount },
              { id: 'cancelled', label: 'Cancelled', count: reservations.filter((r) => r.status === 'cancelled').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-[2px] text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? 'bg-[#171615] text-[#FAF8F5]'
                    : 'bg-[#F2ECE1] text-[#595246] hover:bg-[#E5DEC\-D]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    statusFilter === tab.id ? 'bg-[#C59648] text-[#121110] font-bold' : 'bg-[#DDD5C7] text-[#443E35]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Room Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            {/* Room Filter Dropdown */}
            <select
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="px-3 py-2 bg-[#FAF8F5] border border-[#DCD5C8] rounded-[2px] text-xs text-[#333] focus:outline-none focus:border-[#C59648]"
            >
              <option value="all">All Room Types</option>
              {ROOMS_DATA.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guest, ref, phone..."
                className="w-full pl-8 pr-3 py-2 bg-[#FAF8F5] border border-[#DCD5C8] rounded-[2px] text-xs text-[#333] placeholder-[#8A7F70] focus:outline-none focus:border-[#C59648]"
              />
              <Search className="w-3.5 h-3.5 text-[#8A7F70] absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Reservations Manifest List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#736B5F]">
            <span>
              Showing <strong>{filteredReservations.length}</strong> of {totalCount} reservations
            </span>
            <button
              onClick={() => window.print()}
              className="hover:text-[#171615] flex items-center gap-1 font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Daily Manifest</span>
            </button>
          </div>

          {filteredReservations.length === 0 ? (
            <div className="bg-white rounded-[2px] border border-[#E0DACF] p-12 text-center">
              <Building className="w-10 h-10 text-[#C59648]/40 mx-auto mb-3" />
              <h4 className="font-serif text-lg text-[#171615] mb-1">No Reservations Match Your Criteria</h4>
              <p className="text-xs text-[#7A7265] max-w-sm mx-auto mb-4 font-light">
                Try adjusting your search query or switching your status filter tab.
              </p>
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setRoomFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#171615] text-white text-xs uppercase font-bold tracking-wider rounded-[2px]"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredReservations.map((res) => {
              const statusColors = {
                pending: 'bg-amber-100 text-amber-900 border-amber-300',
                confirmed: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                'checked-in': 'bg-sky-100 text-sky-900 border-sky-300',
                'checked-out': 'bg-gray-100 text-gray-800 border-gray-300',
                cancelled: 'bg-rose-100 text-rose-900 border-rose-300',
              }[res.status];

              const statusLabels = {
                pending: 'Pending Approval',
                confirmed: 'Confirmed & Assigned',
                'checked-in': 'Checked-In (In-House)',
                'checked-out': 'Checked-Out',
                cancelled: 'Cancelled',
              }[res.status];

              return (
                <div
                  key={res.id}
                  className="bg-white rounded-[2px] border border-[#E0DACF] hover:border-[#C59648] transition-all shadow-sm overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-4 sm:p-5 border-b border-[#F0ECE4] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#FAF8F5]">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 bg-[#171615] text-[#FAF8F5] rounded-[2px] tracking-wider">
                        {res.referenceNumber}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-[2px] border font-medium ${statusColors}`}>
                        {statusLabels}
                      </span>
                      {res.assignedRoomNumber && (
                        <span className="text-xs px-2.5 py-0.5 rounded-[2px] bg-[#E8EFF5] text-[#1D4A70] border border-[#BED4E6] font-semibold flex items-center gap-1">
                          <BedDouble className="w-3 h-3" />
                          <span>{res.assignedRoomNumber}</span>
                        </span>
                      )}
                      {res.source === 'walk-in' && (
                        <span className="text-[11px] px-2 py-0.5 bg-[#EFEBE4] text-[#696154] rounded">
                          Walk-in Registration
                        </span>
                      )}
                      {res.formData.isGroupBooking && (
                        <span className="text-xs px-2.5 py-0.5 rounded-[2px] bg-[#FAF3E6] text-[#8C6418] border border-[#ECD9B5] font-semibold flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>Delegation ({res.formData.roomCount || 1} Rooms)</span>
                        </span>
                      )}
                      <span className="text-[11px] px-2 py-0.5 bg-[#EDE8DE] text-[#554E42] rounded font-medium">
                        {res.formData.paymentMethod === 'telebirr'
                          ? 'Telebirr'
                          : res.formData.paymentMethod === 'cbe'
                          ? 'CBE Birr'
                          : res.formData.paymentMethod === 'card'
                          ? 'Card'
                          : 'Pay at Front Desk'}
                      </span>
                    </div>

                    <div className="text-xs text-[#8A8174] flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#C59648]" />
                      <span>Booked on: {res.createdAt}</span>
                    </div>
                  </div>

                  {/* Card Content Grid */}
                  <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
                    {/* Guest Information (Col 4) */}
                    <div className="lg:col-span-4 space-y-2 border-b lg:border-b-0 lg:border-r border-[#F0ECE4] pb-4 lg:pb-0 lg:pr-4">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C8375] font-semibold block">
                        Primary Guest Details
                      </span>
                      <h4 className="font-serif text-lg text-[#171615] font-bold">
                        {res.formData.guestName}
                      </h4>
                      <div className="space-y-1 text-xs text-[#5D5548]">
                        <p className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-[#C59648] shrink-0" />
                          <strong className="text-[#171615]">{res.formData.phone}</strong>
                        </p>
                        <p className="flex items-center gap-2 break-all">
                          <Mail className="w-3.5 h-3.5 text-[#C59648] shrink-0" />
                          <span>{res.formData.email}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-[#C59648] shrink-0" />
                          <span>{res.formData.adults} Adults, {res.formData.children} Children</span>
                        </p>
                        {res.formData.isGroupBooking && res.formData.organizationName && (
                          <p className="text-xs text-[#8C6418] font-medium pt-1">
                            Org / Delegation: <strong>{res.formData.organizationName}</strong>
                          </p>
                        )}
                      </div>

                      {/* Guest Direct Messaging Links */}
                      <div className="pt-2 flex flex-wrap items-center gap-2">
                        {/* WhatsApp Guest */}
                        <a
                          href={getGuestWhatsAppApprovalUrl(res)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-[2px] bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[11px] font-semibold flex items-center gap-1"
                          title="Message guest on WhatsApp with booking confirmation"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp Guest</span>
                        </a>

                        {/* Telegram Copy Payload */}
                        <button
                          onClick={() => handleCopyTelegram(res)}
                          className="px-2.5 py-1 rounded-[2px] bg-[#0088cc]/10 text-[#0077b5] hover:bg-[#0088cc]/20 border border-[#0088cc]/30 text-[11px] font-semibold flex items-center gap-1"
                          title="Copy Telegram ticket text"
                        >
                          {copiedId === res.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === res.id ? 'Copied!' : 'Copy Telegram Text'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Stay & Room Specifications (Col 5) */}
                    <div className="lg:col-span-5 space-y-2 border-b lg:border-b-0 lg:border-r border-[#F0ECE4] pb-4 lg:pb-0 lg:pr-4">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C8375] font-semibold block">
                        Room &amp; Stay Itinerary
                      </span>
                      <h4 className="font-serif text-base text-[#171615] font-semibold flex items-center gap-2">
                        <span>{res.roomName}</span>
                      </h4>

                      <div className="grid grid-cols-2 gap-2 text-xs text-[#5D5548] pt-1">
                        <div className="p-2 bg-[#FAF8F5] rounded border border-[#EAE5DC]">
                          <span className="text-[10px] uppercase text-[#8A8174] block font-medium">Check-In</span>
                          <strong className="text-[#171615] font-serif">{res.formData.checkIn}</strong>
                          <span className="text-[10px] text-[#8A8174] block">From 14:00</span>
                        </div>
                        <div className="p-2 bg-[#FAF8F5] rounded border border-[#EAE5DC]">
                          <span className="text-[10px] uppercase text-[#8A8174] block font-medium">Check-Out</span>
                          <strong className="text-[#171615] font-serif">{res.formData.checkOut}</strong>
                          <span className="text-[10px] text-[#8A8174] block">Until 12:00</span>
                        </div>
                      </div>

                      {/* Special Requests */}
                      {res.formData.specialRequests && (
                        <div className="p-2.5 bg-[#FFFDF9] border border-[#E8DFC8] rounded text-xs text-[#736342]">
                          <span className="font-semibold block text-[#615132]">Guest Notes &amp; Preferences:</span>
                          <span className="text-[11px] leading-relaxed">{res.formData.specialRequests}</span>
                        </div>
                      )}

                      {/* Admin Notes */}
                      {res.adminNotes && (
                        <div className="text-[11px] text-[#4A5D6E] bg-[#F1F6FA] px-2.5 py-1.5 rounded border border-[#D5E3EE]">
                          <strong>Staff Note:</strong> {res.adminNotes}
                        </div>
                      )}
                    </div>

                    {/* Financial Summary & Actions (Col 3) */}
                    <div className="lg:col-span-3 flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C8375] font-semibold block">
                          Stay Total ({res.totalNights} Nights)
                        </span>
                        <div className="font-serif text-2xl font-bold text-[#171615] mt-1">
                          ${res.totalPrice} <span className="text-xs font-sans font-normal text-[#7A7265]">USD</span>
                        </div>
                        <span className="text-[11px] text-[#8A8174]">Tax &amp; 15% VAT included</span>
                      </div>

                      {/* Management Action Buttons */}
                      <div className="space-y-2 pt-2">
                        {res.status === 'pending' && (
                          <button
                            onClick={() => handleOpenApproveModal(res)}
                            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider rounded-[2px] flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve &amp; Assign Room</span>
                          </button>
                        )}

                        {res.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(res.id, 'checked-in')}
                            className="w-full py-2 bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold uppercase tracking-wider rounded-[2px] flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Check-In Guest</span>
                          </button>
                        )}

                        {res.status === 'checked-in' && (
                          <button
                            onClick={() => handleStatusChange(res.id, 'checked-out')}
                            className="w-full py-2 bg-[#2B2723] hover:bg-[#171615] text-white text-xs font-bold uppercase tracking-wider rounded-[2px] flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <span>Check-Out Guest</span>
                          </button>
                        )}

                        {/* Dispatch to Telegram @zazadigital1 */}
                        <a
                          href={getTelegramDispatchUrl(res)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-semibold rounded-[2px] flex items-center justify-center gap-1.5 transition-colors"
                          title={`Send this reservation ticket to Telegram @${TELEGRAM_USERNAME}`}
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch to Telegram</span>
                        </a>

                        {/* Automated Telegram Bot Trigger */}
                        <button
                          onClick={() => handleResendBotNotification(res)}
                          disabled={resendingBotId === res.id}
                          className="w-full py-1.5 bg-[#102A43] hover:bg-[#1A3D60] text-[#7DD3FC] border border-[#234E75] text-[11px] font-medium rounded-[2px] flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                          title="Trigger automated Telegram Bot API message directly to hotel channel"
                        >
                          <Bot className="w-3 h-3 text-[#38BDF8]" />
                          <span>{resendingBotId === res.id ? 'Triggering Bot Dispatch...' : 'Resend via Automated Bot'}</span>
                        </button>

                        {/* View Guest Folio / Registration Card */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedRecord(res);
                              setActionModalType('folio');
                            }}
                            className="flex-1 py-1.5 bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#DCD5C8] text-[#443E35] text-xs font-medium rounded-[2px] flex items-center justify-center gap-1 transition-colors"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Guest Folio</span>
                          </button>

                          {res.status !== 'cancelled' && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to cancel booking ${res.referenceNumber}?`)) {
                                  handleStatusChange(res.id, 'cancelled');
                                }
                              }}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-medium rounded-[2px] transition-colors"
                              title="Cancel Reservation"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal: Approve & Assign Room */}
      {actionModalType === 'approve' && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-[4px] border border-[#DCD5C8] shadow-2xl p-6 sm:p-8 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE4]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C59648] font-bold block">
                  Front Desk Confirmation
                </span>
                <h3 className="font-serif text-xl text-[#171615] font-bold">
                  Approve Reservation ({selectedRecord.referenceNumber})
                </h3>
              </div>
              <button
                onClick={() => setActionModalType(null)}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#888] hover:text-[#111] flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            <div className="py-5 space-y-4 text-xs sm:text-sm">
              <div className="p-3 bg-[#FAF8F5] rounded border border-[#EAE5DC]">
                <p><strong>Guest:</strong> {selectedRecord.formData.guestName}</p>
                <p><strong>Room:</strong> {selectedRecord.roomName}</p>
                <p><strong>Dates:</strong> {selectedRecord.formData.checkIn} to {selectedRecord.formData.checkOut} ({selectedRecord.totalNights} Nights)</p>
                <p><strong>Total Price:</strong> ${selectedRecord.totalPrice} USD</p>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#4A453D] font-bold mb-1.5">
                  Assign Room Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={assignRoomNumber}
                  onChange={(e) => setAssignRoomNumber(e.target.value)}
                  placeholder="e.g. Suite 402, Room 305, Penthouse 601"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DCD5C8] rounded-[2px] text-sm text-[#171615] focus:outline-none focus:border-[#C59648]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#4A453D] font-bold mb-1.5">
                  Reception Staff Notes (Internal)
                </label>
                <textarea
                  rows={3}
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                  placeholder="e.g. Airport shuttle assigned; VIP fruit basket requested."
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DCD5C8] rounded-[2px] text-xs text-[#171615] focus:outline-none focus:border-[#C59648]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#F0ECE4] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActionModalType(null)}
                className="px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-[#666] hover:text-[#111]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApproval}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs uppercase font-bold tracking-wider rounded-[2px] transition-colors"
              >
                Confirm &amp; Approve Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Guest Registration Folio / Printable Card */}
      {actionModalType === 'folio' && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full rounded-[4px] border border-[#DCD5C8] shadow-2xl p-6 sm:p-10 my-8">
            <div className="flex items-center justify-between pb-6 border-b-2 border-[#171615]">
              <div>
                <span className="font-serif text-2xl font-bold tracking-wider text-[#171615] block">
                  DUULE LUXURY HOTEL
                </span>
                <span className="text-[10px] tracking-[0.25em] text-[#C59648] uppercase block">
                  Jijiga &bull; Somali Region &bull; Ethiopia
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase tracking-widest text-[#8A7F70] block font-mono">
                  GUEST REGISTRATION FOLIO
                </span>
                <span className="font-mono text-base font-bold text-[#171615]">
                  {selectedRecord.referenceNumber}
                </span>
              </div>
            </div>

            <div className="py-6 space-y-6 text-xs text-[#333]">
              <div className="grid grid-cols-2 gap-4 border-b border-[#F0ECE4] pb-4">
                <div>
                  <span className="text-[10px] text-[#888] uppercase block">Guest Full Name</span>
                  <strong className="text-base font-serif text-[#171615]">{selectedRecord.formData.guestName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#888] uppercase block">Assigned Room</span>
                  <strong className="text-base font-serif text-[#C59648]">{selectedRecord.assignedRoomNumber || 'Front Desk Assignment'}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-[#F0ECE4] pb-4">
                <div>
                  <span className="text-[10px] text-[#888] uppercase block">Check-In</span>
                  <strong>{selectedRecord.formData.checkIn}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#888] uppercase block">Check-Out</span>
                  <strong>{selectedRecord.formData.checkOut}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#888] uppercase block">Total Nights</span>
                  <strong>{selectedRecord.totalNights} Night(s)</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#888] uppercase block">Guests</span>
                  <strong>{selectedRecord.formData.adults} Adults, {selectedRecord.formData.children} Children</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-[#F0ECE4] pb-4">
                <div>
                  <span className="text-[10px] text-[#888] uppercase block">Contact Telephone</span>
                  <strong>{selectedRecord.formData.phone}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#888] uppercase block">Email Address</span>
                  <strong className="break-all">{selectedRecord.formData.email}</strong>
                </div>
              </div>

              {selectedRecord.formData.specialRequests && (
                <div className="border-b border-[#F0ECE4] pb-4">
                  <span className="text-[10px] text-[#888] uppercase block">Special Requests &amp; Notes</span>
                  <p className="mt-1">{selectedRecord.formData.specialRequests}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-[10px] text-[#888] uppercase block">Total Bill Amount</span>
                  <span className="font-serif text-2xl font-bold text-[#171615]">${selectedRecord.totalPrice} USD</span>
                  <span className="text-[10px] text-[#888] block">Inclusive of 15% Ethiopian VAT</span>
                </div>
                <div className="border border-dashed border-[#BBB] px-6 py-4 text-center rounded">
                  <span className="text-[10px] text-[#888] block mb-6">Guest Signature Upon Arrival</span>
                  <div className="w-36 border-b border-[#333]" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#171615] flex items-center justify-between">
              <button
                onClick={() => setActionModalType(null)}
                className="px-4 py-2 text-xs uppercase font-medium text-[#666] hover:text-[#111]"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-[#171615] hover:bg-[#C59648] hover:text-[#121110] text-white text-xs font-bold uppercase tracking-wider rounded-[2px] flex items-center gap-2 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Folio</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Walk-in / Phone Reservation */}
      {actionModalType === 'newBooking' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-xl w-full rounded-[4px] border border-[#DCD5C8] shadow-2xl p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE4]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C59648] font-bold block">
                  Front Desk Registration
                </span>
                <h3 className="font-serif text-xl text-[#171615] font-bold">
                  Create Walk-in / Phone Reservation
                </h3>
              </div>
              <button
                onClick={() => setActionModalType(null)}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#888] hover:text-[#111] flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateWalkIn} className="py-5 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-1">
                    Primary Guest Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newBookingForm.guestName}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, guestName: e.target.value })}
                    placeholder="e.g. Dr. Hassen"
                    className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#DCD5C8] rounded text-sm text-[#171615]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-1">
                    Telephone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={newBookingForm.phone}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, phone: e.target.value })}
                    placeholder="+251 90 087 6644"
                    className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#DCD5C8] rounded text-sm text-[#171615]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-1">
                    Room Category
                  </label>
                  <select
                    value={newBookingForm.roomType}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, roomType: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#DCD5C8] rounded text-sm text-[#171615]"
                  >
                    {ROOMS_DATA.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} (${r.pricePerNight}/night)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-1">
                    Assign Room #
                  </label>
                  <input
                    type="text"
                    value={newBookingForm.assignedRoom}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, assignedRoom: e.target.value })}
                    placeholder="Suite 302"
                    className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#DCD5C8] rounded text-sm text-[#171615]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={newBookingForm.checkIn}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, checkIn: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#DCD5C8] rounded text-sm text-[#171615]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-1">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={newBookingForm.checkOut}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, checkOut: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#DCD5C8] rounded text-sm text-[#171615]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold mb-1">
                  Guest Special Requests / Notes
                </label>
                <input
                  type="text"
                  value={newBookingForm.specialRequests}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, specialRequests: e.target.value })}
                  placeholder="Airport pickup, high floor, etc."
                  className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#DCD5C8] rounded text-sm text-[#171615]"
                />
              </div>

              <div className="pt-4 border-t border-[#F0ECE4] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActionModalType(null)}
                  className="px-4 py-2 text-xs uppercase font-medium text-[#666]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#C59648] hover:bg-[#D3AA67] text-[#121110] text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
                >
                  Save &amp; Confirm Walk-in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Automated Telegram Bot Settings Modal */}
      {actionModalType === 'telegramSettings' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[3px] border border-[#C59648]/40 shadow-2xl max-w-xl w-full p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE4]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#102A43] text-[#38BDF8] flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#171615] font-bold">
                    Automated Telegram Bot Integration
                  </h3>
                  <p className="text-xs text-[#7A7265]">
                    Direct server-to-Telegram notification engine for Duule Hotel
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActionModalType(null)}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#888] hover:text-[#111] flex items-center justify-center text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Current Status Pill */}
              <div className="p-3.5 bg-[#FAF8F5] border border-[#EAE5DC] rounded-[2px] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8C8375] tracking-wider block">
                    Automation Status
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {botStatus?.configured ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <strong className="text-xs text-emerald-800">
                          Active — Dispatches directly on booking submit
                        </strong>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <strong className="text-xs text-amber-800">
                          Standby — Configure credentials below
                        </strong>
                      </>
                    )}
                  </div>
                </div>
                {botStatus?.maskedToken && (
                  <span className="text-[10px] font-mono px-2 py-1 bg-[#EDE8DE] text-[#554E42] rounded">
                    Token: {botStatus.maskedToken}
                  </span>
                )}
              </div>

              {/* Bot Explanation */}
              <div className="text-xs text-[#5D5548] leading-relaxed bg-[#F0F7FD] p-3.5 rounded border border-[#CDE3F7]">
                <p className="font-medium text-[#1E5B94] mb-1">
                  How Automated Reservation Works (Option 1):
                </p>
                <p>
                  When a customer clicks &ldquo;Confirm Reservation&rdquo; on the website, our server instantly calls the Telegram Bot API. The hotel team receives the full guest folio, dates, and WhatsApp link in Telegram <strong>without the customer having to click or forward anything manually</strong>.
                </p>
              </div>

              {/* Feedback messages */}
              {botTestSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{botTestSuccess}</span>
                </div>
              )}
              {botTestError && (
                <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{botTestError}</span>
                </div>
              )}

              {/* Form fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-1 text-[#171615]">
                    Telegram Bot API Token (from @BotFather)
                  </label>
                  <input
                    type="text"
                    value={botTokenInput}
                    onChange={(e) => setBotTokenInput(e.target.value)}
                    placeholder="e.g. 7891234567:AAHk1_xyz..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DCD5C8] rounded text-xs font-mono text-[#171615] focus:outline-none focus:border-[#C59648]"
                  />
                  <span className="text-[10px] text-[#8C8375] mt-1 block">
                    Can also be declared permanently as <code>TELEGRAM_BOT_TOKEN</code> in your environment.
                  </span>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-1 text-[#171615]">
                    Target Chat ID or Group ID
                  </label>
                  <input
                    type="text"
                    value={botChatIdInput}
                    onChange={(e) => setBotChatIdInput(e.target.value)}
                    placeholder="e.g. -1001234567890 (Staff Group) or @zazadigital1"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DCD5C8] rounded text-xs font-mono text-[#171615] focus:outline-none focus:border-[#C59648]"
                  />
                  <span className="text-[10px] text-[#8C8375] mt-1 block">
                    The Chat ID of the hotel manager or Telegram Staff Group.
                  </span>
                </div>
              </div>

              {/* 3-Step Setup Quick Guide */}
              <div className="border-t border-[#F0ECE4] pt-3 text-[11px] text-[#6E6659] space-y-1.5">
                <strong className="block text-[#171615] text-xs">Quick 1-Minute Setup Guide:</strong>
                <ol className="list-decimal list-inside space-y-1 pl-1">
                  <li>Open Telegram and message <strong>@BotFather</strong>.</li>
                  <li>Send <code>/newbot</code>, give it a name (e.g. <em>Duule Front Desk</em>).</li>
                  <li>Copy the HTTP API token into the field above.</li>
                  <li>Add your bot to your reception Telegram group and click <strong>&ldquo;Verify &amp; Send Test Message&rdquo;</strong>.</li>
                </ol>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F0ECE4] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActionModalType(null)}
                className="w-full sm:w-auto px-4 py-2 text-xs uppercase font-medium text-[#666] hover:text-[#111]"
              >
                Close
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={botSaveLoading}
                  onClick={() => handleSaveBotConfig(true)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#102A43] hover:bg-[#1A3D60] text-[#7DD3FC] border border-[#234E75] text-xs font-medium rounded flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{botSaveLoading ? 'Verifying...' : 'Verify & Send Test Message'}</span>
                </button>

                <button
                  type="button"
                  disabled={botSaveLoading}
                  onClick={() => handleSaveBotConfig(false)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#C59648] hover:bg-[#D3AA67] text-[#121110] text-xs font-bold uppercase tracking-wider rounded disabled:opacity-50 cursor-pointer"
                >
                  <span>Save Config</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
