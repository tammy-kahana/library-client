import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../api/auth';
import { setAuthToken, setUnauthorizedHandler } from '../api/client';

// ההתחברות נשמרת ב-sessionStorage: רענון הדף לא מנתק, וכל לשונית נפרדת.
// כך אפשר להתחבר בשתי לשוניות כשתי קוראות שונות ולהדגים התנגשות על אותו עותק.
const STORAGE_KEY = 'library.session';
const storage = sessionStorage;

const AuthContext = createContext(null);

function loadSession() {
  try {
    const session = JSON.parse(storage.getItem(STORAGE_KEY));
    if (session && new Date(session.expiresAtUtc) > new Date()) {
      return session;
    }
  } catch {
    // ערך פגום: מתעלמים ומתחילים מחדש
  }
  storage.removeItem(STORAGE_KEY);
  return null;
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => {
    const saved = loadSession();
    setAuthToken(saved?.token ?? null);
    return saved;
  });

  const startSession = useCallback((authResponse) => {
    const newSession = {
      token: authResponse.token,
      expiresAtUtc: authResponse.expiresAtUtc,
      user: authResponse.user,
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    setAuthToken(newSession.token);
    setSession(newSession);
  }, []);

  const logout = useCallback(() => {
    storage.removeItem(STORAGE_KEY);
    setAuthToken(null);
    setSession(null);
  }, []);

  // token שפג באמצע העבודה: מתנתקים וחוזרים למסך ההתחברות
  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
      navigate('/login', { replace: true, state: { message: 'פג תוקף ההתחברות. יש להתחבר מחדש.' } });
    });
  }, [logout, navigate]);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: session !== null,
      hasRole: (...roles) => roles.includes(session?.user?.role),
      login: async (email, password) => startSession(await authApi.login(email, password)),
      register: async (fullName, email, password) =>
        startSession(await authApi.register(fullName, email, password)),
      logout,
    }),
    [session, startSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
