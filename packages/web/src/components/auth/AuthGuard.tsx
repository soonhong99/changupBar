// packages/web/src/components/auth/AuthGuard.tsx

"use client";

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. 인증 상태 로딩이 끝나면 검사를 시작합니다.
    if (!isLoading) {
      // 2. 로그인했지만, 전화번호가 없고, 현재 페이지가 인증 페이지가 아니라면
      if (isLoggedIn && user && !user.phone && pathname !== '/verify-phone') {
        console.log(`dont have user ${user} or dont have phone ${user.phone}`)
        // 3. 핸드폰 인증 페이지로 강제 이동시킵니다.
        router.replace('/verify-phone');
      }
    }
  }, [isLoading, isLoggedIn, user, pathname, router]);

  // 로딩 중이거나, 모든 조건을 통과했다면 자식 페이지를 그대로 보여줍니다.
  return <>{children}</>;
}