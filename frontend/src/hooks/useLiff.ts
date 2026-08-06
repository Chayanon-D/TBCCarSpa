import { useState, useEffect } from 'react';
import { liffService, LiffUserProfile } from '../services/liff';
import { apiService } from '../services/api';
import { UserProfile } from '../types';

export function useLiff() {
  const [isReady, setIsReady] = useState(false);
  const [isLiffApp, setIsLiffApp] = useState(false);
  const [liffUser, setLiffUser] = useState<LiffUserProfile | null>(null);
  const [dbUser, setDbState] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('tbc_user_profile');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const setDbUser = (user: UserProfile | null | ((prev: UserProfile | null) => UserProfile | null)) => {
    setDbState((prev) => {
      const next = typeof user === 'function' ? user(prev) : user;
      if (next) {
        try {
          localStorage.setItem('tbc_user_profile', JSON.stringify(next));
        } catch (e) {
          console.error('Failed to cache user profile in localStorage:', e);
        }
      }
      return next;
    });
  };

  useEffect(() => {
    let mounted = true;

    // Safety timeout: Never stay stuck on loading screen longer than 3.5 seconds
    const timer = setTimeout(() => {
      if (mounted) {
        setLoading(false);
        setIsReady(true);
      }
    }, 3500);

    async function init() {
      try {
        const initialized = await liffService.initLiff();
        if (!mounted) return;

        setIsLiffApp(liffService.isInClient());

        if (initialized && liffService.isLoggedIn()) {
          const profile = await liffService.getProfile();
          if (profile && mounted) {
            setLiffUser(profile);
            try {
              const syncedUser = await apiService.syncLiffUser({
                lineUserId: profile.userId,
                lineDisplayName: profile.displayName,
                linePictureUrl: profile.pictureUrl,
              });
              if (mounted) setDbUser(syncedUser);
            } catch (syncErr) {
              console.warn('Backend sync timeout/error, using profile directly:', syncErr);
            }
          }
        } else {
          // Fetch initial DB user with timeout protection
          try {
            const user = await apiService.getUserProfile();
            if (mounted) setDbUser(user);
          } catch (dbErr) {
            console.warn('DB fetch timeout/error, proceeding with cached state:', dbErr);
          }
        }
      } catch (err) {
        console.error('Failed to initialize LIFF hook:', err);
      } finally {
        if (mounted) {
          clearTimeout(timer);
          setIsReady(true);
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  const loginWithLine = () => {
    if (liffService.isInitialized()) {
      liffService.login();
    }
  };

  const logoutLine = () => {
    try {
      localStorage.removeItem('tbc_user_profile');
    } catch {}
    liffService.logout();
  };

  return {
    isReady,
    isLiffApp,
    liffUser,
    dbUser,
    setDbUser,
    loading,
    loginWithLine,
    logoutLine,
  };
}
