// packages/web/src/context/AuthContext.tsx

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie'; // ⬅️ import 추가

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // 앱이 처음 로드될 때 localStorage에서 토큰을 가져옵니다.
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken); // 토큰을 localStorage에 저장
    Cookies.set('authToken', newToken, { expires: 1 });
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken'); // localStorage에서 토큰 제거
    Cookies.remove('authToken'); // ⬅️ 쿠키에서 제거
  };

  const value = {
    token,
    login,
    logout,
    isLoggedIn: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}