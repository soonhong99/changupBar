// packages/web/src/components/ui/ListingCard.tsx

"use client"; // ⬅️ 클라이언트 컴포넌트로 전환

import { Listing } from '@prisma/client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { likeListing } from '@/lib/api';
import { MouseEvent } from 'react';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { isLoggedIn, token } = useAuth();

  const handleLikeClick = async (e: MouseEvent) => {
    e.preventDefault(); // 카드 전체 링크가 눌리는 것을 방지
    e.stopPropagation();

    if (!isLoggedIn || !token) {
      alert('로그인이 필요한 기능입니다.');
      // 또는 router.push('/login'); 등으로 로그인 페이지로 보낼 수 있습니다.
      return;
    }

    try {
      const result = await likeListing(listing.id, token);
      alert(result.message); // 성공 메시지 표시
      // TODO: 여기에 하트 모양을 채우는 등의 UI 업데이트 로직 추가
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  return (
    <Link href={`/listings/${listing.id}`} className="block group">
      <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 relative">
        {/* 찜하기 버튼 */}
        {isLoggedIn && (
          <button
            onClick={handleLikeClick}
            className="absolute top-2 right-2 bg-white rounded-full p-2 z-10 hover:bg-red-100"
            aria-label="찜하기"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
            </svg>
          </button>
        )}
        
        {/* 카드 내용 */}
        <div className="w-full h-48 bg-gray-200">
          <img 
            src={listing.coverImage} 
            alt={listing.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500">{listing.address.split(' ')[0]} {listing.address.split(' ')[1]}</p>
          <h3 className="text-lg font-semibold truncate mt-1 group-hover:text-blue-600">
            {listing.name}
          </h3>
          <p className="text-gray-700 truncate my-2">
            {listing.summary}
          </p>
          <div className="font-bold text-xl text-right">
            {listing.keyMoney.toLocaleString()}원
          </div>
        </div>
      </div>
    </Link>
  );
}