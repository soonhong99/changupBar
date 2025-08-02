// packages/web/src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // ⬅️ AuthProvider import
import Header from "@/components/layout/Header";
import Script from 'next/script'; // ⬅️ Script 컴포넌트 import
import Footer from "@/components/layout/Footer"; // ⬅️ Footer import
import AuthGuard from "@/components/auth/AuthGuard"; // ⬅️ AuthGuard import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: '스마트창업 | 상위 1% 매물, 상위 1% 사업가의 만남',
    template: '%s | 스마트창업',
  },
  description: '불확실함을 확신으로 바꾸는 단 한가지 방법',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
        <AuthGuard>
          <Header />
          <main>{children}</main>
          <Footer /> {/* ⬅️ Footer를 main 태그 다음에 추가 */}
        </AuthGuard>
        </AuthProvider>
        {/* ⬇️ Daum 우편번호 서비스를 위한 스크립트를 추가합니다. */}
        <Script
          src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}