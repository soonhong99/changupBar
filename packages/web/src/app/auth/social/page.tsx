"use client";

import { useEffect, Suspense } from 'react'; // ⬅️ Suspense 추가
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// 1. 실제 로직을 수행하는 부분을 별도의 컴포넌트로 분리합니다.
function SocialCallbackComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      login(token);
      router.replace('/');
    } else {
      router.replace('/login?error=social-login-failed');
    }
  }, [searchParams, login, router]);

  return null; // 로직 처리 중에는 아무것도 표시하지 않음
}

// 2. 페이지의 기본 export는 Suspense로 감싸는 역할을 합니다.
export default function SocialCallbackPage() {
  const loadingUI = (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-lg">로그인 정보를 처리 중입니다...</p>
      </div>
    </div>
  );
  
  return (
    <Suspense fallback={loadingUI}>
      <SocialCallbackComponent />
    </Suspense>
  );
}