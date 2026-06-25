import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth as authApi } from '../api';
import storage, { KEYS } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = storage.get(KEYS.TOKEN);
    if (token) {
      authApi.me()
        .then((u) => {
          setUser(u);
          storage.setJSON(KEYS.USER, u);
        })
        .catch(() => {
          storage.remove(KEYS.TOKEN);
          storage.remove(KEYS.USER);
        })
        .finally(() => setLoading(false));
    } else {
      const cached = storage.getJSON(KEYS.USER);
      if (cached) setUser(cached);
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password });
    storage.set(KEYS.TOKEN, data.token);
    storage.setJSON(KEYS.USER, data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (userData) => {
    const data = await authApi.register(userData);
    storage.set(KEYS.TOKEN, data.token);
    storage.setJSON(KEYS.USER, data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const googleLogin = useCallback(async (credential) => {
    const data = await authApi.google(credential);
    storage.set(KEYS.TOKEN, data.token);
    storage.setJSON(KEYS.USER, data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const sendOtp = useCallback(async (phone) => {
    return await authApi.sendOtp(phone);
  }, []);

  const verifyOtp = useCallback(async (phone, otp) => {
    const data = await authApi.verifyOtp(phone, otp);
    storage.set(KEYS.TOKEN, data.token);
    storage.setJSON(KEYS.USER, data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    storage.remove(KEYS.TOKEN);
    storage.remove(KEYS.USER);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, sendOtp, verifyOtp, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
