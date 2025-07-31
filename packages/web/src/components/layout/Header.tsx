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
  
  // 스타일 클래스 - 원래 색상으로 복원
  const navLinkClasses = "px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200";
  
  const primaryButtonClasses = "inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200";
  
  const secondaryButtonClasses = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200";

  return (
    <header className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 및 브랜드 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                스마트창업
              </span>
            </Link>
            
            {/* 데스크톱 네비게이션 - 구분선 추가 */}
            <div className="hidden lg:flex items-center ml-12">
              <div className="flex items-center space-x-1">
                <Link href="/search" className={navLinkClasses}>
                  매물 찾기
                </Link>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-2"></div>
                <Link href="/consulting" className={navLinkClasses}>
                  컨설턴트 소개
                </Link>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-2"></div>
                <Link href="/success-stories" className={navLinkClasses}>
                  성공 사례
                </Link>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-2"></div>
                <Link href="/process" className={navLinkClasses}>
                  창업 가이드북
                </Link>
              </div>
            </div>
          </div>

          {/* 사용자 메뉴 */}
          <div className="flex items-center space-x-4">
            {isLoggedIn && user ? (
              <div className="flex items-center space-x-4">
                {/* ADMIN 링크 */}
                {user.role === 'ADMIN' && (
                  <Link 
                    href="/admin" 
                    className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
                  >
                    관리자
                  </Link>
                )}
                
                {/* 사용자 정보 */}
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
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

                {/* 모바일 사용자 아바타 */}
                <div className="sm:hidden">
                  <Link href="/mypage" className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className={secondaryButtonClasses}>
                  로그인
                </Link>
                <Link href="/register" className={primaryButtonClasses}>
                  회원가입
                </Link>
              </div>
            )}

            {/* 모바일 메뉴 버튼 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 - 구분선 포함 */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-800">
            <div className="py-4 space-y-1">
              <Link 
                href="/search" 
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                매물 찾기
              </Link>
              <div className="mx-4 h-px bg-gray-200 dark:bg-gray-700"></div>
              <Link 
                href="/consulting" 
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                컨설턴트 소개
              </Link>
              <div className="mx-4 h-px bg-gray-200 dark:bg-gray-700"></div>
              <Link 
                href="/success-stories" 
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                성공 사례
              </Link>
              <div className="mx-4 h-px bg-gray-200 dark:bg-gray-700"></div>
              <Link 
                href="/process" 
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                창업 가이드북
              </Link>
              
              {/* 로그인한 사용자 메뉴 */}
              {isLoggedIn && user && (
                <>
                  <div className="mx-4 h-px bg-gray-300 dark:bg-gray-600 my-4"></div>
                  <Link 
                    href="/mypage" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    마이페이지
                  </Link>
                  <div className="mx-4 h-px bg-gray-200 dark:bg-gray-700"></div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    로그아웃
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      
      {/* 특별 공지 배너 */}
      <div className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium rounded-full shadow-lg">
              <span>🔥</span>
              <span>8월 한정! 상담시 원하는 매물 AI 분석 리포트 1건 무료 제공</span>
              <span>🔥</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}