// packages/web/src/app/auth/social/page.tsx

"use client";

import { useEffect, Suspense, useState } from 'react'; // ⬅️ Suspense 추가
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// 1. 실제 로직을 수행하는 부분을 별도의 컴포넌트로 분리합니다.
function SocialCallbackComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false); // ⬅️ 추가: 처리 중 상태

  useEffect(() => {
    // 1. 이미 처리 중이면, 다시 실행하지 않고 즉시 종료합니다.
    if (isProcessing) return;

    const token = searchParams.get('token');
    const action = searchParams.get('action');
    const redirectTo = searchParams.get('redirect');

    if (token) {
      // 2. 작업을 시작하기 전에 "처리 중"으로 상태를 변경합니다.
      setIsProcessing(true);

      // 3. login 함수가 완전히 끝난 후(.then)에 페이지를 이동합니다.
      login(token).then(() => {
        if (action === 'verify_phone') {
          // 전화번호 인증이 필요한 경우, redirect 파라미터를 함께 전달
          if (redirectTo) {
            const encodedRedirect = encodeURIComponent(redirectTo);
            router.replace(`/verify-phone?redirect=${encodedRedirect}`);
          } else {
            router.replace('/verify-phone');
          }
        } else {
          // redirect 파라미터가 있으면 해당 페이지로, 없으면 홈으로 이동
          router.replace(redirectTo || '/');
        }
      });
    } else {
      router.replace('/login?error=social-login-failed');
    }
  }, [searchParams, login, router, isProcessing]); // ⬅️ isProcessing 추가

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