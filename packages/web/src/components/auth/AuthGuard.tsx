// packages/web/src/components/auth/AuthGuard.tsx

"use client";

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
  requireLogin?: boolean; // 로그인 필수 여부
}

export default function AuthGuard({ children, requireLogin = false }: AuthGuardProps) {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. 인증 상태 로딩이 끝나면 검사를 시작합니다.
    if (!isLoading) {
      // 2. 로그인이 필요한 페이지인데 로그인하지 않았다면
      if (requireLogin && !isLoggedIn) {
        // 현재 페이지를 redirect 파라미터로 전달
        const redirectUrl = encodeURIComponent(pathname);
        router.replace(`/login?redirect=${redirectUrl}`);
        return;
      }

      // 3. 로그인했지만, 전화번호가 없고, 현재 페이지가 인증 페이지가 아니라면
      if (isLoggedIn && user && !user.phone && pathname !== '/verify-phone') {
        console.log(`dont have user ${user} or dont have phone ${user.phone}`)
        // 4. 핸드폰 인증 페이지로 강제 이동시킵니다.
        router.replace('/verify-phone');
      }
    }
  }, [isLoading, isLoggedIn, user, pathname, router, requireLogin]);

  // 로그인이 필요한 페이지인데 로그인하지 않았거나 로딩 중이라면 로딩 표시
  if (requireLogin && (!isLoggedIn || isLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">로그인 확인 중...</p>
        </div>
      </div>
    );
  }

  // 로딩 중이거나, 모든 조건을 통과했다면 자식 페이지를 그대로 보여줍니다.
  return <>{children}</>;
}