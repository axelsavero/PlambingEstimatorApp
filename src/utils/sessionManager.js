import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Session Manager for RABPro.
 * Controls the in-memory app session for Disclaimer and runtime lifecycle.
 *
 * Sesuai requirement:
 * - Selama sesi masih aktif (pengguna memakai aplikasi, pindah tab/kalkulator, minimize sebentar),
 *   disclaimer tidak muncul berulang-ulang.
 * - Ketika sesi dihapus (aplikasi ditutup/force-close dari recent apps, aplikasi dibuka ulang,
 *   atau pengguna memilih 'Hapus Sesi'), disclaimer WAJIB muncul kembali saat aplikasi dibuka.
 */

let isAppSessionActive = false;
let sessionStartTime = null;

// Hapus sisa-sisa kunci persisten lama di disk agar tidak mengunci disclaimer selamanya
const CLEANUP_KEY = '@rabpro_disclaimer_accepted';
(async () => {
  try {
    await AsyncStorage.removeItem(CLEANUP_KEY);
  } catch (e) {
    // Ignore cleanup error
  }
})();

export const isSessionValid = () => {
  return isAppSessionActive;
};

export const startSession = () => {
  isAppSessionActive = true;
  sessionStartTime = Date.now();
};

export const clearAppSession = () => {
  isAppSessionActive = false;
  sessionStartTime = null;
};

export const getSessionInfo = () => {
  return {
    isActive: isAppSessionActive,
    startTime: sessionStartTime,
  };
};
