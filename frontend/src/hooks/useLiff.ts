import { useState, useEffect } from 'react';
import { liffService, LiffUserProfile } from '../services/liff';
import { apiService } from '../services/api';
import { UserProfile } from '../types';

export function useLiff() {
  const [isReady, setIsReady] = useState(false);
  const [isLiffApp, setIsLiffApp] = useState(false);
  const [liffUser, setLiffUser] = useState<LiffUserProfile | null>(null);
  const [dbUser, setDbUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Safety timeout: Never stay stuck on loading screen longer than 2.5 seconds
    const timer = setTimeout(() => {
      if (mounted) {
        setLoading(false);
        setIsReady(true);
      }
    }, 2500);

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
            console.warn('DB fetch timeout/error, proceeding with default state:', dbErr);
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
