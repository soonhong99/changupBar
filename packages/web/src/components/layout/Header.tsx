// packages/web/src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };
  
  // --- 공통 스타일 클래스 ---
  const navLinkClasses = "text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300";
  const primaryButtonClasses = "inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105";
  const secondaryButtonClasses = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200";

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 및 브랜드 */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                <span className="text-white font-bold text-lg">🏠</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                스마트창업
              </span>
              <div className="px-2 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-semibold rounded-full shadow-sm">
                HOT
              </div>
            </Link>
            
            {/* 데스크톱 네비게이션 */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/search" className={navLinkClasses}>
                🔍 매물 찾기
              </Link>
              <Link href="/featured" className={navLinkClasses}>
                ⭐ 특급 매물
              </Link>
              <Link href="/consulting" className={navLinkClasses}>
                💼 창업 컨설팅
              </Link>
              <Link href="/success-stories" className={navLinkClasses}>
                📈 성공 사례
              </Link>
            </div>
          </div>

          {/* 사용자 메뉴 */}
          <div className="flex items-center space-x-4">
            {isLoggedIn && user ? (
              // --- 로그인 시 보여줄 UI ---
              <div className="flex items-center space-x-4">
                {/* ADMIN 유저에게만 관리자 페이지 링크를 보여줍니다. */}
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium rounded-full shadow-md hover:from-green-600 hover:to-emerald-600 transition-all duration-200">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                    <span>관리자</span>
                  </Link>
                )}
                
                {/* 사용자 정보 */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {user.name}님
                    </span>
                  </div>
                  
                  <Link href="/mypage" className={secondaryButtonClasses}>
                    마이페이지
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            ) : (
              // --- 로그아웃 시 보여줄 UI ---
              <div className="flex items-center space-x-3">
                <Link href="/login" className={secondaryButtonClasses}>
                  로그인
                </Link>
                <Link href="/register" className={primaryButtonClasses}>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  무료 회원가입
                </Link>
              </div>
            )}

            {/* 모바일 메뉴 버튼 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="px-4 py-4 space-y-3">
              <Link href="/search" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                🔍 매물 찾기
              </Link>
              <Link href="/featured" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                ⭐ 특급 매물
              </Link>
              <Link href="/consulting" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                💼 창업 컨설팅
              </Link>
              <Link href="/success-stories" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                📈 성공 사례
              </Link>
            </div>
          </div>
        )}
      </nav>
      
      {/* 특별 공지 배너 */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-center py-2">
        <div className="flex items-center justify-center space-x-2 text-sm font-medium">
          <span className="animate-pulse">🔥</span>
          <span>7월 한정 특가! 창업 컨설팅 무료 + 권리금 100만원 할인</span>
          <span className="animate-pulse">🔥</span>
        </div>
      </div>
    </header>
  );
}