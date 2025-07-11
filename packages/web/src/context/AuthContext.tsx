// packages/web/src/context/AuthContext.tsx

"use client";

import { User } from '@prisma/client'; // ⬅️ User 타입 import
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

  useEffect(() => {
    // useEffect 내부에서 비동기 작업을 처리하기 위한 함수 선언
    const bootstrapAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        // fetchUserAndLikes가 끝날 때까지 기다립니다.
        await fetchUserAndLikes(storedToken);
      }
      // 모든 작업이 끝난 후 로딩 상태를 false로 변경합니다.
      setIsLoading(false); 
    };

    bootstrapAuth();
  }, []); // 이 useEffect는 앱이 처음 마운트될 때 한 번만 실행됩니다.
  const fetchUserAndLikes = async (currentToken: string) => {
    try {
      // 사용자 정보와 '찜' 목록을 동시에 요청해서 받아옵니다.
      const [userData, likedListingsData] = await Promise.all([
        getMe(currentToken),
        getMyLikedListings(currentToken)
      ]);
      
      setUser(userData);
      if (likedListingsData) {
        setLikedIds(new Set(likedListingsData.map(l => l.id)));
      }
    } catch (error) {
      // 토큰이 유효하지 않은 경우 등 에러 발생 시 로그아웃 처리
      console.error("Failed to fetch user data:", error);
      logout();
    }
  };

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken); // 토큰을 localStorage에 저장
    Cookies.set('authToken', newToken, { expires: 1 });
    fetchUserAndLikes(newToken); // ⬅️ 유저/찜 정보 모두 불러오기
  };

  const logout = () => {
    setToken(null);
    setUser(null); // ⬅️ 로그아웃 시 user 정보 비우기
    setLikedIds(new Set()); // ⬅️ 로그아웃 시 '찜 목록' 비우기
    localStorage.removeItem('authToken'); // localStorage에서 토큰 제거
    Cookies.remove('authToken'); // ⬅️ 쿠키에서 제거
  };

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