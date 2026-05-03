/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import mockData from '@/data/mock.json';

interface AuthContextValue {
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  isAdmin: false,
  login: () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('hodor-admin');
    if (stored === 'true') setIsAdmin(true);
  }, []);

  const login = (username: string, password: string): boolean => {
    if (
      username === mockData.admin.username &&
      password === mockData.admin.password
    ) {
      setIsAdmin(true);
      localStorage.setItem('hodor-admin', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('hodor-admin');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
