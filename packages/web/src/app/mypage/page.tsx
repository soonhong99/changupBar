// packages/web/src/app/mypage/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { useAuth } from "@/context/AuthContext";
import { getMyLikedListings, ListingWithCounts } from "@/lib/api";
import ListingCard from "@/components/ui/ListingCard";

export default function MyPage() {
  const { isLoggedIn, token } = useAuth();
  const [likedListings, setLikedListings] = useState<ListingWithCounts[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로그인 상태이고, 토큰이 있을 때만 데이터를 불러옵니다.
    if (isLoggedIn && token) {
      getMyLikedListings(token)
        .then(data => {
          setLikedListings(data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn, token]);

  if (isLoading) {
    return <div className="p-8 text-center">정보를 불러오는 중...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4">로그인이 필요한 페이지입니다.</p>
        <Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          로그인 하러 가기
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">내가 찜한 매물 목록</h1>

      {likedListings.length === 0 ? (
        <p>아직 찜한 매물이 없습니다. 마음에 드는 매물에 하트(♡)를 눌러보세요!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {likedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      <div className="mt-16 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-10 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          궁금한 점이 있으신가요?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          찜한 매물에 대한 내용을 스마트창업이 친절히 알려드리겠습니다.
        </p>
        <a 
          href="tel:010-2536-1178"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
        >
          📞 전화 문의하기
        </a>
      </div>
    </main>
  );
}