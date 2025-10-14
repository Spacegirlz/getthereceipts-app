// Free Usage Service (client-side, localStorage-first)
// Tracks starter receipts and daily receipt/chat caps for logged-in free users.

const ls = typeof window !== 'undefined' ? window.localStorage : null;

const isLS = () => {
  try {
    if (!ls) return false;
    const k = '__gtr_ls_test__';
    ls.setItem(k, '1');
    ls.removeItem(k);
    return true;
  } catch (_) { return false; }
};

const todayUTC = () => {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
    .toISOString()
    .slice(0, 10); // YYYY-MM-DD
};

const getNum = (key, def = 0) => {
  if (!isLS()) return def;
  const v = ls.getItem(key);
  const n = v == null ? def : parseInt(v, 10);
  return Number.isFinite(n) ? n : def;
};

const setNum = (key, val) => {
  if (!isLS()) return false;
  ls.setItem(key, String(val));
  return true;
};

export const FreeUsageService = {
  // Starter receipts: 3 per account total
  checkAndIncrementStarterReceipt(userId) {
    const key = `gtr_free_starter_used_${userId}`;
    const used = getNum(key, 0);
    if (used < 3) {
      setNum(key, used + 1);
      return { allowed: true, reason: 'starter', remaining: 3 - (used + 1) };
    }
    return { allowed: false, reason: 'starter_exhausted', remaining: 0 };
  },

  // Daily receipt: 1 per UTC day (after starter exhausted)
  checkAndIncrementDailyReceipt(userId) {
    const date = todayUTC();
    const key = `gtr_free_daily_receipts_${userId}_${date}`;
    const count = getNum(key, 0);
    if (count < 1) {
      setNum(key, count + 1);
      return { allowed: true, reason: 'daily', remaining: 1 - (count + 1) };
    }
    return { allowed: false, reason: 'daily_limit', remaining: 0, resetAt: `${date}T24:00:00Z` };
  },

  // Daily chat: 5 per UTC day
  checkAndIncrementDailyChat(userId) {
    const date = todayUTC();
    const key = `gtr_free_daily_chats_${userId}_${date}`;
    const count = getNum(key, 0);
    if (count < 5) {
      setNum(key, count + 1);
      return { allowed: true, remaining: 5 - (count + 1) };
    }
    return { allowed: false, remaining: 0, resetAt: `${date}T24:00:00Z` };
  },

  // Helpers for reads (optional UI)
  getStarterUsed(userId) { return getNum(`gtr_free_starter_used_${userId}`, 0); },
  getTodayReceiptCount(userId) { return getNum(`gtr_free_daily_receipts_${userId}_${todayUTC()}`, 0); },
  getTodayChatCount(userId) { return getNum(`gtr_free_daily_chats_${userId}_${todayUTC()}`, 0); }
};

export default FreeUsageService;


