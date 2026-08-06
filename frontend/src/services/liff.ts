import liff from '@line/liff';

export interface LiffUserProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

let isLiffInitialized = false;

export const liffService = {
  async initLiff(): Promise<boolean> {
    const liffId = import.meta.env.VITE_LIFF_ID;
    if (!liffId || liffId.includes('YOUR_') || liffId.includes('xxxxxxx')) {
      console.warn('⚠️ LIFF ID is not configured in .env. Running in Demo/Web Browser mode.');
      isLiffInitialized = false;
      return false;
    }

    try {
      await liff.init({ liffId });
      isLiffInitialized = true;
      console.log('✅ LINE LIFF initialized successfully!');
      return true;
    } catch (error) {
      console.error('❌ LINE LIFF init failed:', error);
      isLiffInitialized = false;
      return false;
    }
  },

  isInitialized(): boolean {
    return isLiffInitialized;
  },

  isLoggedIn(): boolean {
    if (!isLiffInitialized || typeof window === 'undefined' || !liff.isLoggedIn) return false;
    try {
      return liff.isLoggedIn();
    } catch {
      return false;
    }
  },

  login(): void {
    if (isLiffInitialized && liff.login) {
      try {
        liff.login({ redirectUri: window.location.href });
      } catch (err) {
        console.error('LINE LIFF login error:', err);
      }
    } else {
      console.warn('LINE LIFF is not initialized with valid VITE_LIFF_ID. Bypassing LIFF login for Demo.');
    }
  },

  logout(): void {
    if (isLiffInitialized && liff.logout) {
      try {
        liff.logout();
      } catch (err) {
        console.error('LINE LIFF logout error:', err);
      }
    }
    window.location.reload();
  },

  async getProfile(): Promise<LiffUserProfile | null> {
    if (!isLiffInitialized) return null;
    try {
      if (!liff.isLoggedIn()) return null;
      const profile = await liff.getProfile();
      return {
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage,
      };
    } catch (error) {
      console.error('Failed to get LIFF profile:', error);
      return null;
    }
  },

  isInClient(): boolean {
    if (!isLiffInitialized || typeof window === 'undefined') return false;
    try {
      return liff.isInClient ? liff.isInClient() : false;
    } catch {
      return false;
    }
  },

  closeWindow(): void {
    if (isLiffInitialized && liff.closeWindow) {
      try {
        liff.closeWindow();
      } catch (err) {
        console.error('Error closing LIFF window:', err);
      }
    }
  },
};
