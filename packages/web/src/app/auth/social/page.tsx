// packages/web/src/app/auth/social/page.tsx

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
    const action = searchParams.get('action'); // ⬅️ action 파라미터를 가져옵니다.

    if (token) {
      login(token);
      // ⬇️ action 값에 따라 다른 경로로 보냅니다.
      if (action === 'verify_phone') {
        // 핸드폰 인증이 필요하면, /verify-phone 페이지로 이동
        console.log('[SocialCallback] Redirecting to /verify-phone');
        // router.replace 대신 router.push 사용
        router.push('/verify-phone');
        // router.replace('/verify-phone');
      } else {
        // 핸드폰 인증이 필요 없으면, 메인 페이지로 이동
        router.replace('/');
      }
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