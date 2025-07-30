// packages/web/src/context/AuthContext.tsx

"use client";

import { User } from '@prisma/client'; // ⬅️ User 타입 import
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import Cookies from 'js-cookie'; // ⬅️ import 추가
import { getMyLikedListings, getMe } from '@/lib/api'; // ⬅️ 추가

interface AuthContextType {
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isLoggedIn: boolean;
  likedIds: Set<string>; // ⬅️ 추가: 찜한 ID 목록 (Set으로 중복 방지 및 빠른 조회)
  toggleLike: (listingId: string) => void; // ⬅️ 추가: 찜 상태 토글 함수
  user: User | null; // ⬅️ user 상태 추가
  isLoading: boolean;
  refreshUser: () => Promise<void>; // ⬅️ 추가
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

  const login = useCallback(async (newToken: string) => {
    setIsLoading(true); // 1. 로그인 시작 시 로딩 상태로 변경
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    Cookies.set('authToken', newToken, { expires: 1 });
    await fetchUserAndLikes(newToken); // 2. 사용자 정보 로딩이 끝날 때까지 기다림
    setIsLoading(false); // 3. 모든 작업이 끝난 후 로딩 상태 해제
  }, [fetchUserAndLikes]);

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

  const refreshUser = useCallback(async () => {
    // 1. "나 지금부터 중요한 정보 업데이트 시작할게!" 라고 알립니다.
    setIsLoading(true);
    
    const currentToken = localStorage.getItem('authToken');
    if (currentToken) {
      // 2. 실제 업데이트 작업을 기다립니다.
      await fetchUserAndLikes(currentToken);
    }
    
    // 3. "이제 모든 정보 업데이트 끝났어!" 라고 알립니다.
    setIsLoading(false);
  }, [fetchUserAndLikes]);

  const value = {
    token,
    user,
    login,
    logout,
    isLoggedIn: !!token,
    likedIds, // ⬅️ 추가
    toggleLike, // ⬅️ 추가
    isLoading,
    refreshUser
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