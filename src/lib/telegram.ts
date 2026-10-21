import { TelegramUser } from '../types/account';

// Recognized Telegram Admins (case-insensitive)
export const ADMIN_USERNAMES = ['el_bicho14', 'dev_lecter'];

export function checkIsAdmin(username?: string | null): boolean {
  if (!username) return false;
  const clean = username.trim().toLowerCase().replace('@', '');
  return ADMIN_USERNAMES.includes(clean);
}

// Telegram WebApp window type declaration
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        initData?: string;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
            language_code?: string;
          };
          start_param?: string;
        };
        themeParams?: Record<string, string>;
        colorScheme?: 'light' | 'dark';
        MainButton?: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (fn: () => void) => void;
        };
        HapticFeedback?: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
      };
    };
  }
}

/**
 * Reads real user from Telegram WebApp initData on startup.
 * If username is @dev_lecter or @el_bicho14, they get admin privileges automatically.
 */
export function getInitialTelegramUser(): TelegramUser {
  try {
    // 1. Detect official Telegram WebApp environment
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      try {
        tg.ready();
        tg.expand();
      } catch {
        // Ignore iframe constraints
      }

      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser && tgUser.id) {
        const username = tgUser.username ? tgUser.username.replace('@', '') : undefined;
        const isAdmin = checkIsAdmin(username);
        const user: TelegramUser = {
          id: tgUser.id,
          firstName: tgUser.first_name || 'Player',
          lastName: tgUser.last_name,
          username,
          photoUrl: tgUser.photo_url,
          isAdmin,
        };
        localStorage.setItem('efb_tg_user', JSON.stringify(user));
        return user;
      }
    }

    // 2. Check cached authenticated Telegram user in localStorage
    const cached = localStorage.getItem('efb_tg_user');
    if (cached) {
      const parsed = JSON.parse(cached) as TelegramUser;
      parsed.isAdmin = checkIsAdmin(parsed.username);
      return parsed;
    }
  } catch (err) {
    console.warn('Telegram auth detection notice:', err);
  }

  // 3. Fallback for non-Telegram browser
  return {
    id: 10000001,
    firstName: 'Player',
    lastName: '',
    username: undefined,
    photoUrl: '',
    isAdmin: false,
  };
}

export function saveTelegramUser(user: TelegramUser): void {
  try {
    localStorage.setItem('efb_tg_user', JSON.stringify(user));
  } catch {
    // Ignore storage errors
  }
}
