import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Normalize Telegram Chat ID (fixes negative sign on personal chat IDs)
export function normalizeChatId(raw: string | number | undefined): string {
  if (!raw) return '6512581908';
  const str = String(raw).trim();
  // Supergroups start with -100. If someone provided -6512581908 for a personal account, strip the '-'
  if (str.startsWith('-') && !str.startsWith('-100')) {
    return str.replace(/^-+/, '');
  }
  return str;
}

// Default Telegram credentials ensuring deployed instances (Cloud Run / production)
// dispatch reservations even if custom secrets were omitted during container deployment
export const DEFAULT_TELEGRAM_BOT_TOKEN = '8983036050:AAEoJyzULDL7hf6GCQ143H7DBH1rEDRPduo';
export const DEFAULT_TELEGRAM_CHAT_ID = '6512581908';

// In-memory runtime override if set via Admin Settings or environment
let runtimeBotToken = process.env.TELEGRAM_BOT_TOKEN || DEFAULT_TELEGRAM_BOT_TOKEN;
let runtimeChatId = normalizeChatId(process.env.TELEGRAM_CHAT_ID || DEFAULT_TELEGRAM_CHAT_ID);

// Data directory for persistent storage
const DATA_DIR = path.join(process.cwd(), 'data');
const RESERVATIONS_FILE = path.join(DATA_DIR, 'reservations.json');

interface ReservationRecord {
  id: string;
  referenceNumber: string;
  formData: any;
  roomName: string;
  roomType: string;
  totalNights: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  createdAt: string;
  assignedRoomNumber?: string;
  adminNotes?: string;
  source?: 'online' | 'walk-in' | 'phone';
  approvedAt?: string;
  approvalMessage?: string;
  telegramMessageId?: number;
  telegramChatId?: string;
}

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
    approvedAt: '2026-09-20T16:20:00.000Z',
    approvalMessage: 'Dear Ambassador Amina Warsame, your reservation has been confirmed with VIP protocol.',
  },
];

function loadReservations(): ReservationRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(RESERVATIONS_FILE)) {
      const data = fs.readFileSync(RESERVATIONS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(INITIAL_RESERVATIONS, null, 2));
    return INITIAL_RESERVATIONS;
  } catch (err) {
    console.error('Error reading reservations file, using in-memory default:', err);
    return INITIAL_RESERVATIONS;
  }
}

let serverReservations: ReservationRecord[] = loadReservations();

function saveReservations(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(serverReservations, null, 2));
  } catch (err) {
    console.error('Error writing reservations file:', err);
  }
}

function generateApprovalMessage(reservation: ReservationRecord): string {
  const guest = reservation.formData?.guestName || 'Valued Guest';
  const room = reservation.roomName || 'Luxury Suite';
  const checkIn = reservation.formData?.checkIn || 'your scheduled arrival date';
  const checkOut = reservation.formData?.checkOut || 'your scheduled departure date';
  const ref = reservation.referenceNumber;

  return `Dear ${guest}, greetings from Duule Luxury Hotel in Jijiga! Your reservation (${ref}) has been officially APPROVED & CONFIRMED by our reception management. Your ${room} is reserved from ${checkIn} to ${checkOut}. Our concierge team has logged your itinerary and scheduled complimentary Wilwal Airport (JIJ) chauffeur pickup upon your flight arrival. We look forward to welcoming you!`;
}

function generateTelegramCard(
  reservation: ReservationRecord,
  statusOverride?: 'pending' | 'confirmed' | 'cancelled'
) {
  const status = statusOverride || reservation.status;
  const { referenceNumber, roomName, totalPrice, totalNights, formData } = reservation;

  const payLabel =
    formData.paymentMethod === 'telebirr'
      ? 'Telebirr (Mobile Money)'
      : formData.paymentMethod === 'cbe'
      ? 'CBE Birr / Mobile Banking'
      : formData.paymentMethod === 'card'
      ? 'Credit / Debit Card'
      : 'Pay Upon Arrival at Hotel';

  const groupInfo = formData.isGroupBooking
    ? `\n🏛️ <b>Delegation/Group:</b> ${formData.organizationName || 'Yes'} (<b>${formData.roomCount || 1} Rooms</b>)`
    : '';

  const cleanPhone = (formData.phone || '').replace(/[^0-9+]/g, '');
  const waNumber = cleanPhone.replace(/^0/, '251').replace(/^\+/, '');

  let statusHeader = `🟡 <b>STATUS: PENDING FRONT-DESK CONFIRMATION</b>\n<i>Awaiting reception officer approval...</i>`;
  if (status === 'confirmed') {
    statusHeader = `🟢 <b>STATUS: ACCEPTED & CONFIRMED ✅</b>\n<i>Approved by Front-Desk Staff. Guest folio active.</i>`;
  } else if (status === 'cancelled') {
    statusHeader = `🔴 <b>STATUS: DECLINED / CANCELLED ❌</b>`;
  }

  const messageHtml = [
    `🛎️ <b>DIRECT RESERVATION — DUULE LUXURY HOTEL</b>`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🔖 <b>Ref Number:</b> <code>${referenceNumber}</code>`,
    `👤 <b>Guest Name:</b> ${formData.guestName}`,
    `📞 <b>Phone:</b> ${formData.phone}`,
    `✉️ <b>Email:</b> ${formData.email}`,
    groupInfo,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🛏️ <b>Room Type:</b> ${roomName}${formData.roomCount && formData.roomCount > 1 ? ` (${formData.roomCount} Rooms)` : ''}`,
    `📅 <b>Check-in:</b> ${formData.checkIn} (from 14:00)`,
    `📅 <b>Check-out:</b> ${formData.checkOut} (until 12:00)`,
    `🌙 <b>Nights:</b> ${totalNights}`,
    `👥 <b>Guests:</b> ${formData.adults} Adults, ${formData.children} Children`,
    `💳 <b>Payment:</b> ${payLabel}`,
    `💰 <b>Total Amount:</b> $${totalPrice} USD`,
    formData.specialRequests ? `\n📝 <b>Special Requests:</b>\n<i>${formData.specialRequests}</i>` : '',
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    statusHeader,
    `\n⏱️ <i>Updated: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' })} EAT</i>`,
  ]
    .filter(Boolean)
    .join('\n');

  // Build inline keyboard based on status
  const buttons: any[] = [];
  if (status === 'pending') {
    buttons.push([
      {
        text: '✅ Accept & Confirm',
        callback_data: `accept_${referenceNumber}`,
      },
      {
        text: '❌ Decline',
        callback_data: `decline_${referenceNumber}`,
      },
    ]);
  } else if (status === 'confirmed') {
    buttons.push([
      {
        text: '🟢 Confirmed in Ledger',
        callback_data: `noop_${referenceNumber}`,
      },
    ]);
  }

  const secondaryRow: any[] = [];
  if (waNumber) {
    secondaryRow.push({
      text: '💬 WhatsApp Guest',
      url: `https://wa.me/${waNumber}?text=Hello%20${encodeURIComponent(formData.guestName)},%20this%20is%20Duule%20Luxury%20Hotel%20Jijiga.%20Your%20reservation%20${referenceNumber}%20is%20received.`,
    });
  }
  const appUrl = process.env.APP_URL || '';
  if (appUrl) {
    secondaryRow.push({
      text: '🏨 Reception Portal',
      url: `${appUrl}/#admin`,
    });
  }
  if (secondaryRow.length > 0) {
    buttons.push(secondaryRow);
  }

  return { messageHtml, replyMarkup: { inline_keyboard: buttons } };
}

/**
 * Helper to dispatch Telegram messages with automatic fallback for chat ID format
 */
async function sendTelegramMessageWithFallback(
  token: string,
  targetChatId: string,
  messageHtml: string,
  replyMarkup: any
): Promise<{ ok: boolean; data: any; effectiveChatId: string }> {
  let chatId = normalizeChatId(targetChatId);

  console.log(`[Telegram] Dispatching message to chat ID: ${chatId}...`);
  const payload = {
    chat_id: chatId,
    text: messageHtml,
    parse_mode: 'HTML',
    reply_markup: replyMarkup,
  };

  let res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  let data = await res.json();

  // If chat not found, try alternative representation (e.g. without leading minus if has minus, or vice versa)
  if (!data.ok && data.description && data.description.includes('chat not found')) {
    console.warn(`[Telegram] Primary send failed with "chat not found" for ${chatId}. Retrying with alternate ID format...`);
    const altChatId = chatId.startsWith('-') ? chatId.replace(/^-+/, '') : `-${chatId}`;
    const retryRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, chat_id: altChatId }),
    });
    const retryData = await retryRes.json();
    if (retryData.ok) {
      console.log(`[Telegram] Successfully delivered to alternate chatId: ${altChatId}`);
      runtimeChatId = altChatId;
      return { ok: true, data: retryData, effectiveChatId: altChatId };
    }
  }

  return { ok: data.ok, data, effectiveChatId: chatId };
}

/**
 * Endpoint to check Telegram Bot status and whether automatic delivery is armed
 */
app.get('/api/telegram/status', (req, res) => {
  const activeToken = runtimeBotToken || process.env.TELEGRAM_BOT_TOKEN || '';
  const activeChatId = normalizeChatId(runtimeChatId || process.env.TELEGRAM_CHAT_ID);
  const isConfigured = Boolean(activeToken && activeChatId);

  const maskedToken =
    activeToken.length > 8
      ? `${activeToken.slice(0, 4)}...${activeToken.slice(-4)}`
      : activeToken
      ? '***'
      : '';

  res.json({
    configured: isConfigured,
    hasToken: Boolean(activeToken),
    hasChatId: Boolean(activeChatId),
    maskedToken,
    chatId: activeChatId,
    defaultRecipient: '@zazadigital1',
    botName: 'hotelreservationjijigaBot',
  });
});

/**
 * Endpoint to test or update Telegram Bot credentials from the Admin Portal
 */
app.post('/api/telegram/configure', async (req, res) => {
  try {
    const { token, chatId, sendTestMessage } = req.body;

    if (token) runtimeBotToken = token.trim();
    if (chatId) runtimeChatId = normalizeChatId(chatId.trim());

    const activeToken = runtimeBotToken || process.env.TELEGRAM_BOT_TOKEN;
    const activeChatId = normalizeChatId(runtimeChatId || process.env.TELEGRAM_CHAT_ID);

    if (!activeToken || !activeChatId) {
      return res.status(400).json({
        success: false,
        error: 'Both Bot Token and Target Chat ID are required.',
      });
    }

    if (sendTestMessage) {
      const testMsg =
        `🏨 <b>Duule Luxury Hotel — Telegram Bot Connected</b>\n\n` +
        `✅ Automated reservation delivery & two-way acceptance is active.\n` +
        `📍 Location: Jijiga, Ethiopia\n` +
        `⏱️ Timestamp: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' })} (EAT)\n\n` +
        `<i>New website guest reservations will arrive with [✅ Accept & Confirm] buttons.</i>`;

      const result = await sendTelegramMessageWithFallback(activeToken, activeChatId, testMsg, null);
      if (!result.ok) {
        return res.status(400).json({
          success: false,
          error: result.data?.description || 'Failed to send test message via Telegram API',
        });
      }
    }

    // Restart poller with new token if needed
    startTelegramPoller();

    return res.json({
      success: true,
      message: 'Telegram Bot credentials updated and verified successfully!',
      chatId: activeChatId,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

/**
 * GET all reservations
 */
app.get('/api/reservations', (req, res) => {
  res.json({ success: true, reservations: serverReservations });
});

/**
 * GET single reservation status for real-time polling by the guest voucher
 */
app.get('/api/reservations/:refNumber/status', (req, res) => {
  const { refNumber } = req.params;
  const match = serverReservations.find(
    (r) => r.referenceNumber === refNumber || r.id === refNumber
  );

  if (!match) {
    return res.json({
      success: true,
      found: false,
      referenceNumber: refNumber,
      status: 'pending',
    });
  }

  return res.json({
    success: true,
    found: true,
    referenceNumber: match.referenceNumber,
    status: match.status,
    approvedAt: match.approvedAt,
    approvalMessage: match.approvalMessage || (match.status === 'confirmed' ? generateApprovalMessage(match) : undefined),
    guestName: match.formData?.guestName,
    roomName: match.roomName,
    totalPrice: match.totalPrice,
    totalNights: match.totalNights,
    assignedRoomNumber: match.assignedRoomNumber,
  });
});

/**
 * Core Automated Dispatch Endpoint:
 * Fired automatically when a guest submits a reservation on the website.
 */
app.post('/api/telegram/notify', async (req, res) => {
  try {
    const reservation = req.body as ReservationRecord;

    if (!reservation || !reservation.referenceNumber || !reservation.formData) {
      return res.status(400).json({
        success: false,
        error: 'Invalid reservation payload.',
      });
    }

    // Upsert into server storage
    const existingIndex = serverReservations.findIndex(
      (r) => r.referenceNumber === reservation.referenceNumber || r.id === reservation.id
    );

    const recordToSave: ReservationRecord = {
      ...reservation,
      status: reservation.status || 'pending',
      createdAt:
        reservation.createdAt ||
        new Date().toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' }),
    };

    if (existingIndex >= 0) {
      serverReservations[existingIndex] = { ...serverReservations[existingIndex], ...recordToSave };
    } else {
      serverReservations.unshift(recordToSave);
    }
    saveReservations();

    const activeToken = runtimeBotToken || process.env.TELEGRAM_BOT_TOKEN;
    const activeChatId = normalizeChatId(runtimeChatId || process.env.TELEGRAM_CHAT_ID);

    // Build message with Accept / Decline interactive buttons
    const { messageHtml, replyMarkup } = generateTelegramCard(recordToSave, 'pending');

    if (activeToken && activeChatId) {
      const sendResult = await sendTelegramMessageWithFallback(
        activeToken,
        activeChatId,
        messageHtml,
        replyMarkup
      );

      if (!sendResult.ok) {
        console.warn('Telegram Bot API responded with error:', sendResult.data);
        return res.json({
          success: true,
          automated: false,
          delivered: false,
          reason: sendResult.data?.description || 'Telegram API error',
          message: 'Saved to hotel ledger. Telegram bot delivery failed.',
        });
      }

      // Store message ID so we can edit it later when accepted
      recordToSave.telegramMessageId = sendResult.data?.result?.message_id;
      recordToSave.telegramChatId = sendResult.effectiveChatId;
      saveReservations();

      return res.json({
        success: true,
        automated: true,
        delivered: true,
        telegramMessageId: sendResult.data?.result?.message_id,
        chatId: sendResult.effectiveChatId,
        message: 'Reservation automatically delivered to hotel Telegram bot!',
      });
    }

    return res.json({
      success: true,
      automated: false,
      delivered: false,
      reason: 'TELEGRAM_BOT_TOKEN not configured yet',
      message: 'Saved to hotel ledger. Automatic bot is in standby mode.',
    });
  } catch (err: any) {
    console.error('Error in /api/telegram/notify:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error while dispatching to Telegram',
    });
  }
});

/**
 * Shared Acceptance Logic:
 * Changes status from 'pending' to 'confirmed', generates approval message,
 * and edits the Telegram message with the confirmed state.
 */
async function processReservationAcceptance(
  referenceNumber: string,
  staffName = 'Front-Desk Officer'
) {
  const index = serverReservations.findIndex(
    (r) => r.referenceNumber === referenceNumber || r.id === referenceNumber
  );

  if (index === -1) {
    return { success: false, error: `Reservation ${referenceNumber} not found.` };
  }

  const reservation = serverReservations[index];
  reservation.status = 'confirmed';
  reservation.approvedAt = new Date().toISOString();
  reservation.adminNotes = `Approved by ${staffName} via Telegram Bot on ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' })} EAT`;
  reservation.approvalMessage = generateApprovalMessage(reservation);
  saveReservations();

  // If we have an active bot token and message ID, update the Telegram message
  const activeToken = runtimeBotToken || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = reservation.telegramChatId || runtimeChatId || process.env.TELEGRAM_CHAT_ID;
  const messageId = reservation.telegramMessageId;

  if (activeToken && chatId && messageId) {
    try {
      const { messageHtml, replyMarkup } = generateTelegramCard(reservation, 'confirmed');

      await fetch(`https://api.telegram.org/bot${activeToken}/editMessageText`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          text: messageHtml,
          parse_mode: 'HTML',
          reply_markup: replyMarkup,
        }),
      });
    } catch (e) {
      console.warn('Could not edit Telegram message on accept:', e);
    }
  }

  return { success: true, reservation };
}

/**
 * Endpoint to accept/approve a reservation (from Reception Portal or API)
 */
app.post('/api/reservations/accept', async (req, res) => {
  const { referenceNumber, staffName, roomNumber } = req.body;
  if (!referenceNumber) {
    return res.status(400).json({ success: false, error: 'referenceNumber is required.' });
  }

  const result = await processReservationAcceptance(referenceNumber, staffName || 'Reception Desk');
  if (result.success && roomNumber && result.reservation) {
    result.reservation.assignedRoomNumber = roomNumber;
    saveReservations();
  }

  return res.json(result);
});

/**
 * Simulate Telegram Accept:
 * Perfect for preview and testing! Allows instant simulation of staff tapping
 * the Telegram "Accept" button without waiting for an external webhook.
 */
app.post('/api/telegram/simulate-accept', async (req, res) => {
  const { referenceNumber } = req.body;
  if (!referenceNumber) {
    return res.status(400).json({ success: false, error: 'referenceNumber is required.' });
  }

  const result = await processReservationAcceptance(
    referenceNumber,
    'Telegram Bot Staff Simulation'
  );
  return res.json(result);
});

/**
 * Unified processor for Telegram updates (invoked by both Webhook and Long-Poller)
 */
async function handleTelegramUpdate(update: any): Promise<{ ok: boolean; handled?: string; refNumber?: string; [key: string]: any }> {
  const activeToken = runtimeBotToken || process.env.TELEGRAM_BOT_TOKEN;
  if (!activeToken) return { ok: false, error: 'No token' };

  try {
    // 1. Handle Inline Button Clicks (callback_query)
    if (update.callback_query) {
      const { id: callbackQueryId, data, from, message } = update.callback_query;
      const staffName = from?.first_name || from?.username || 'Telegram Staff';

      if (data && data.startsWith('accept_')) {
        const refNumber = data.replace('accept_', '').trim();
        console.log(`[Telegram] Staff ${staffName} accepted reservation: ${refNumber}`);
        const acceptResult = await processReservationAcceptance(refNumber, `${staffName} (Telegram)`);

        // Acknowledge callback query to Telegram so the button stops showing a spinner
        if (callbackQueryId) {
          try {
            await fetch(`https://api.telegram.org/bot${activeToken}/answerCallbackQuery`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                callback_query_id: callbackQueryId,
                text: `✅ Reservation ${refNumber} ACCEPTED! Guest voucher updated live on website.`,
                show_alert: true,
              }),
            });
          } catch (e) {
            console.warn('answerCallbackQuery error:', e);
          }
        }

        return { ok: true, handled: 'accept', refNumber, acceptResult };
      }

      if (data && data.startsWith('decline_')) {
        const refNumber = data.replace('decline_', '').trim();
        console.log(`[Telegram] Staff ${staffName} declined reservation: ${refNumber}`);
        const index = serverReservations.findIndex(
          (r) => r.referenceNumber === refNumber || r.id === refNumber
        );

        if (index >= 0) {
          serverReservations[index].status = 'cancelled';
          serverReservations[index].adminNotes = `Declined by ${staffName} on Telegram at ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' })}`;
          saveReservations();

          if (message?.chat?.id && message?.message_id) {
            const { messageHtml, replyMarkup } = generateTelegramCard(
              serverReservations[index],
              'cancelled'
            );
            try {
              await fetch(`https://api.telegram.org/bot${activeToken}/editMessageText`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: message.chat.id,
                  message_id: message.message_id,
                  text: messageHtml,
                  parse_mode: 'HTML',
                  reply_markup: replyMarkup,
                }),
              });
            } catch (e) {
              console.warn('editMessageText error:', e);
            }
          }
        }

        if (callbackQueryId) {
          try {
            await fetch(`https://api.telegram.org/bot${activeToken}/answerCallbackQuery`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                callback_query_id: callbackQueryId,
                text: `❌ Reservation ${refNumber} declined.`,
                show_alert: false,
              }),
            });
          } catch (e) {
            console.warn('answerCallbackQuery error:', e);
          }
        }

        return { ok: true, handled: 'decline', refNumber };
      }

      if (data && data.startsWith('noop_')) {
        if (callbackQueryId) {
          try {
            await fetch(`https://api.telegram.org/bot${activeToken}/answerCallbackQuery`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                callback_query_id: callbackQueryId,
                text: 'This reservation is already accepted and active in the hotel ledger.',
                show_alert: false,
              }),
            });
          } catch (e) {
            // ignore
          }
        }
        return { ok: true, handled: 'noop' };
      }
    }

    // 2. Handle Text Commands in Telegram (e.g. /start, /accept DLH-74921, /list)
    if (update.message && update.message.text) {
      const text = update.message.text.trim();
      const chatId = update.message.chat.id;
      const staffName = update.message.from?.first_name || update.message.from?.username || 'Staff';

      if (text.startsWith('/start')) {
        const welcomeMsg =
          `🏨 <b>Duule Luxury Hotel — Jijiga, Ethiopia</b>\n` +
          `<i>Official Front-Desk Reception Terminal Bot</i>\n\n` +
          `✅ <b>Connected Chat ID:</b> <code>${chatId}</code>\n` +
          `• Direct reservations submitted on the website will arrive here with instant <b>[✅ Accept & Confirm]</b> buttons.\n` +
          `• Tapping Accept updates the guest's voucher screen on the website live!\n\n` +
          `<b>Quick Commands:</b>\n` +
          `• <code>/accept [REF]</code> — Approve reservation\n` +
          `• <code>/decline [REF]</code> — Decline reservation\n` +
          `• <code>/list</code> — View pending reservations`;

        await fetch(`https://api.telegram.org/bot${activeToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: welcomeMsg,
            parse_mode: 'HTML',
          }),
        });
        return { ok: true, handled: 'command_start' };
      }

      if (text.startsWith('/accept') || text.startsWith('/approve')) {
        const parts = text.split(/\s+/);
        const refNumber = parts[1]?.toUpperCase().trim();

        if (!refNumber) {
          await fetch(`https://api.telegram.org/bot${activeToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: '⚠️ Please provide reference number: e.g. <code>/accept DLH-74921</code>',
              parse_mode: 'HTML',
            }),
          });
          return { ok: true, handled: 'command_accept_missing_ref' };
        }

        const result = await processReservationAcceptance(
          refNumber,
          `${staffName} (Telegram command)`
        );

        const reply = result.success
          ? `✅ <b>Success:</b> Reservation <code>${refNumber}</code> has been <b>ACCEPTED & CONFIRMED</b>.\n\nGuest: <b>${result.reservation?.formData?.guestName}</b>\nRoom: <b>${result.reservation?.roomName}</b>\nThe guest voucher on the website has been updated live with their approval voucher.`
          : `⚠️ <b>Error:</b> Could not find reservation <code>${refNumber}</code>.`;

        await fetch(`https://api.telegram.org/bot${activeToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: reply,
            parse_mode: 'HTML',
          }),
        });
        return { ok: true, handled: 'command_accept', refNumber };
      }

      if (text.startsWith('/list')) {
        const pending = serverReservations.filter((r) => r.status === 'pending');
        if (pending.length === 0) {
          await fetch(`https://api.telegram.org/bot${activeToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: '📋 <b>No pending reservations.</b> All folios are confirmed in the ledger!',
              parse_mode: 'HTML',
            }),
          });
        } else {
          let msg = `📋 <b>Pending Reservations (${pending.length}):</b>\n\n`;
          for (const p of pending.slice(0, 5)) {
            msg += `• <b>${p.referenceNumber}</b> — ${p.formData?.guestName} (${p.roomName})\n  Dates: ${p.formData?.checkIn} to ${p.formData?.checkOut} | $${p.totalPrice}\n  Tap to approve: <code>/accept ${p.referenceNumber}</code>\n\n`;
          }
          await fetch(`https://api.telegram.org/bot${activeToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: msg,
              parse_mode: 'HTML',
            }),
          });
        }
        return { ok: true, handled: 'command_list' };
      }
    }

    return { ok: true, handled: 'none' };
  } catch (err: any) {
    console.error('Error in handleTelegramUpdate:', err);
    return { ok: false, error: err.message };
  }
}

/**
 * Background Polling Worker for Telegram:
 * Continuously polls getUpdates so Telegram button clicks and commands
 * work seamlessly inside this container environment without requiring external webhook ports!
 */
let isPollerRunning = false;
let updateOffset = 0;

export async function startTelegramPoller() {
  const activeToken = runtimeBotToken || process.env.TELEGRAM_BOT_TOKEN;
  if (!activeToken) {
    console.log('[Telegram Poller] No bot token configured, poller in standby.');
    return;
  }

  if (isPollerRunning) return;
  isPollerRunning = true;
  console.log('[Telegram Poller] Starting Telegram Long-Polling worker for interactive buttons...');

  // Ensure webhook is deleted so getUpdates works properly
  try {
    await fetch(`https://api.telegram.org/bot${activeToken}/deleteWebhook?drop_pending_updates=false`);
  } catch (err) {
    console.warn('[Telegram Poller] deleteWebhook note:', err);
  }

  const poll = async () => {
    if (!isPollerRunning) return;
    const token = runtimeBotToken || process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      setTimeout(poll, 4000);
      return;
    }

    try {
      const url = `https://api.telegram.org/bot${token}/getUpdates?offset=${updateOffset}&timeout=10`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          updateOffset = Math.max(updateOffset, update.update_id + 1);
          await handleTelegramUpdate(update);
        }
      }
    } catch (err: any) {
      // Network hiccup, retry after delay
    }

    // Schedule next poll
    setTimeout(poll, 1200);
  };

  poll();
}

/**
 * TELEGRAM WEBHOOK ENDPOINT:
 * Telegram sends incoming updates (button clicks, commands) here if a webhook is active.
 */
app.post('/api/telegram/webhook', async (req, res) => {
  try {
    const update = req.body;
    const result = await handleTelegramUpdate(update);
    return res.json(result);
  } catch (err: any) {
    console.error('Error handling Telegram webhook:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * Helper to configure Telegram Webhook
 */
app.post('/api/telegram/set-webhook', async (req, res) => {
  try {
    const activeToken = runtimeBotToken || process.env.TELEGRAM_BOT_TOKEN;
    if (!activeToken) {
      return res.status(400).json({ success: false, error: 'Telegram bot token is not configured.' });
    }

    const { webhookUrl } = req.body;
    const url = webhookUrl || `${req.protocol}://${req.get('host')}/api/telegram/webhook`;

    const tgRes = await fetch(`https://api.telegram.org/bot${activeToken}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await tgRes.json();
    return res.json({ success: data.ok, data, webhookUrl: url });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Express v5 requires '*all' instead of '*'
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Duule Luxury Hotel Server running on http://0.0.0.0:${PORT}`);
    // Launch Telegram background poller
    startTelegramPoller();
  });
}

startServer();
