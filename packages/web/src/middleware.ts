// packages/web/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const { pathname } = request.nextUrl;

  console.log(`[미들웨어 실행] 경로: ${pathname}`); // ⬅️ 1. 실행 확인

  if (pathname.startsWith('/admin')) {
    console.log('[어드민 경로 접근 감지]'); // ⬅️ 2. 경로 감지 확인

    if (!token) {
      console.log('[판단] 토큰 없음. 로그인 페이지로 이동.'); // ⬅️ 3. 토큰 유무 판단
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      console.log('[정보 확인 시작] 백엔드에 사용자 정보 요청...'); // ⬅️ 4. API 호출 시작 확인
      const api_url = process.env.INTERNAL_API_URL!; 
      const res = await fetch(`${api_url}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('인증 실패');

      const user = await res.json();
      console.log('[정보 확인 완료] 받은 사용자 역할:', user.role); // ⬅️ 5. 받아온 역할(role) 확인

      if (user.role !== 'ADMIN') {
        console.log('[판단] ADMIN이 아님. 메인 페이지로 이동.'); // ⬅️ 6. ADMIN 여부 판단
        return NextResponse.redirect(new URL('/', request.url));
      }

      console.log('[판단] ADMIN 확인됨. 접근 허용.'); // ⬅️ 7. 최종 판단
      return NextResponse.next();

    } catch (error) {
      console.error('[미들웨어 에러]', error); // ⬅️ 8. 에러 발생 시 확인
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
