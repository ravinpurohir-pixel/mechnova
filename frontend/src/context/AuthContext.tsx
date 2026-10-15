import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { AuthService, getSavedLocalUser, isConfigured } from '../services/firebase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isFirebaseLive: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string, role?: UserRole) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (fields: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isFirebaseLive: false,
  login: async () => {},
  signup: async () => {},
  loginAsGuest: async () => {},
  logout: async () => {},
  updateUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check saved session or auto-initialize guest
    const saved = getSavedLocalUser();
    if (saved) {
      setUser(saved);
    } else {
      // Default guest session so app works seamlessly immediately
      const defaultGuest: UserProfile = {
        uid: 'guest_default',
        email: 'guest@mechnova.io',
        displayName: 'Guest Mechanical Engineer',
        preferredLanguage: 'en',
        role: 'engineer',
        organization: 'Industrial Field Demo',
        savedCount: 3
      };
      setUser(defaultGuest);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const u = await AuthService.login(email, pass);
      setUser(u);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, pass: string, name: string, role: UserRole = 'engineer') => {
    setLoading(true);
    try {
      const u = await AuthService.signup(email, pass, name, role);
      setUser(u);
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = async () => {
    setLoading(true);
    try {
      const u = await AuthService.loginAsGuest();
      setUser(u);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  const updateUser = (fields: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...fields };
    setUser(updated);
    localStorage.setItem('mechnova_current_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseLive: isConfigured,
        login,
        signup,
        loginAsGuest,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
