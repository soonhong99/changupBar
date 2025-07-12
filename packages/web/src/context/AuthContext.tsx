// packages/web/src/context/AuthContext.tsx

"use client";

import { User } from '@prisma/client'; // ⬅️ User 타입 import
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import Cookies from 'js-cookie'; // ⬅️ import 추가
import { getMyLikedListings, getMe } from '@/lib/api'; // ⬅️ 추가

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
  likedIds: Set<string>; // ⬅️ 추가: 찜한 ID 목록 (Set으로 중복 방지 및 빠른 조회)
  toggleLike: (listingId: string) => void; // ⬅️ 추가: 찜 상태 토글 함수
  user: User | null; // ⬅️ user 상태 추가
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null); // ⬅️ user 상태 추가
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set()); // ⬅️ 추가
  const [isLoading, setIsLoading] = useState(true); // ⬅️ 로딩 상태 추가 (초기값 true)

  const fetchUserAndLikes = useCallback(async (currentToken: string) => {
    try {
      const [userData, likedListingsData] = await Promise.all([
        getMe(currentToken),
        getMyLikedListings(currentToken)
      ]);
      setUser(userData);
      if (likedListingsData) {
        setLikedIds(new Set(likedListingsData.map(l => l.id)));
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      // logout(); // 무한 루프를 막기 위해 logout 호출은 신중해야 합니다.
    }
  }, []); // ⬅️ 의존성 배열 추가

  useEffect(() => {
    const bootstrapAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        await fetchUserAndLikes(storedToken);
      }
      setIsLoading(false); 
    };
    bootstrapAuth();
  }, [fetchUserAndLikes]); // ⬅️ 의존성 배열에 fetchUserAndLikes 추가

  const login = useCallback((newToken: string) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    Cookies.set('authToken', newToken, { expires: 1 });
    fetchUserAndLikes(newToken);
  }, [fetchUserAndLikes]); // ⬅️ 의존성 배열에 fetchUserAndLikes 추가

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setLikedIds(new Set());
    localStorage.removeItem('authToken');
    Cookies.remove('authToken');
  }, []); // ⬅️ 의존성 배열 추가

  const toggleLike = (listingId: string) => { // ⬅️ 추가
    setLikedIds(prev => {
      const newLikedIds = new Set(prev);
      if (newLikedIds.has(listingId)) {
        newLikedIds.delete(listingId);
      } else {
        newLikedIds.add(listingId);
      }
      return newLikedIds;
    });
  };

  const value = {
    token,
    user,
    login,
    logout,
    isLoggedIn: !!token,
    likedIds, // ⬅️ 추가
    toggleLike, // ⬅️ 추가
    isLoading,
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