// packages/web/src/components/ui/ListingCard.tsx

"use client";

import { Listing } from '@prisma/client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { likeListing, ListingWithCounts } from '@/lib/api';
import { MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Heart } from 'lucide-react'; // ⬅️ 아이콘 import

interface ListingCardProps {
  listing: ListingWithCounts;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { isLoggedIn, token, likedIds, toggleLike } = useAuth();
  const router = useRouter();

  const isLiked = likedIds.has(listing.id);

  const handleLikeClick = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn || !token) {
      alert('로그인이 필요한 기능입니다.');
      router.push('/login');      
      return;
    }
    
    toggleLike(listing.id);

    try {
      const result = await likeListing(listing.id, token);
      if (result.message.includes('찜했습니다')) {
        const goToMyPage = window.confirm(
          `'${listing.name}' 매물이 찜 목록에 추가되었습니다.\n\n찜한 매물들을 보러 가시겠습니까?`
        );
        if (goToMyPage) {
          router.push('/mypage');
        }
      }
    } catch (err) {
      toggleLike(listing.id);
      alert(err instanceof Error ? err.message : '오류가 발생했습니다.');
    }
  };

  return (
    <Link href={`/listings/${listing.id}`} className="block group rounded-lg">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden h-full flex flex-col
                      shadow-sm hover:shadow-xl dark:hover:border-gray-600 transition-all duration-300 relative">
        
        {/* '찜하기' 버튼: 반투명 배경과 블러 효과로 개선 */}
        <button
          onClick={handleLikeClick}
          className="absolute top-3 right-3 z-10 rounded-full p-2 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm 
                     transition-colors hover:bg-red-100/70 dark:hover:bg-red-900/50"
          aria-label="찜하기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-all ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-300 hover:text-red-500'}`} viewBox="0 0 24 24" stroke="currentColor" fill="none">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
          </svg>
        </button> 
        
        {/* 이미지 영역 */}
        <div className="w-full h-48 bg-gray-100 dark:bg-gray-700">
          <img 
            src={listing.coverImage} 
            alt={listing.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* 컨텐츠 영역 */}
        <div className="p-4 flex-grow flex flex-col">
          {/* 위치 태그 */}
          <div className="mb-2">
            <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold px-2.5 py-1 rounded-full">
              {listing.address.split(' ')[0]} {listing.address.split(' ')[1]}
            </span>
          </div>

          {/* 매물 이름 */}
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {listing.name}
          </h3>
          
          {/* 한 줄 요약 */}
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1 flex-grow">
            {listing.summary}
          </p>

          {/* 가격 정보 (구분선 추가) */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-right">
             <span className="text-xs text-gray-500 dark:text-gray-400 block">권리금</span>
             <p className="text-xl font-bold text-gray-900 dark:text-gray-200">
                {listing.keyMoney > 0 ? `${listing.keyMoney.toLocaleString()}만 원` : '없음'}
             </p>
          </div>
          <div className="flex items-center justify-end space-x-4 mt-2 pt-2 border-t text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{listing.viewCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{listing._count.likedBy.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}