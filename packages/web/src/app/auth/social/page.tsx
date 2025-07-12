// packages/web/src/app/auth/social/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SocialCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    // 1. URL에서 토큰을 추출합니다.
    const token = searchParams.get('token');

    if (token) {
      // 2. AuthContext의 login 함수를 호출하여 토큰을 저장합니다.
      login(token);
      // 3. 메인 페이지로 이동시킵니다.
      router.replace('/');
    } else {
      // 토큰이 없으면 로그인 페이지로 보냅니다.
      router.replace('/login?error=social-login-failed');
    }
  }, [searchParams, login, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-lg">로그인 정보를 처리 중입니다...</p>
      </div>
    </div>
  );
}