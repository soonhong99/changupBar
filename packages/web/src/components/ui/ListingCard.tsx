// packages/web/src/components/ui/ListingCard.tsx

"use client";

import { Listing } from '@prisma/client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { likeListing, ListingWithCounts } from '@/lib/api';
import { MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Heart, BadgeCheck, XCircle } from 'lucide-react'; // ⬅️ 아이콘 import

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

  // 권리금 포맷팅 함수
  const formatKeyMoney = (keyMoney: number) => {
    if (keyMoney === 0) return '없음';
    
    // 10,000만원 이상이면 억 단위로 표시
    if (keyMoney >= 10000) {
      const billion = Math.floor(keyMoney / 10000);
      const remainder = keyMoney % 10000;
      
      if (remainder === 0) {
        return `${billion}억`;
      } else {
        // 소수점 한 자리까지만 표시 (예: 1.2억)
        const decimal = Math.floor(remainder / 1000);
        if (decimal === 0) {
          return `${billion}억`;
        }
        return `${billion}.${decimal}억`;
      }
    }
    
    // 10,000만원 미만은 기존처럼 표시
    return `${keyMoney.toLocaleString()}만원`;
  };

  return (
    <Link href={`/listings/${listing.id}`} className="block group rounded-lg">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden h-full flex flex-col
                      shadow-sm hover:shadow-xl dark:hover:border-gray-600 transition-all duration-300 relative">
        {listing.contractStatus !== 'AVAILABLE' && (
  <div className="absolute inset-0 z-20 pointer-events-none">
    {/* 그라디언트 오버레이 - 위에서 아래로 점점 진해지는 효과 */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80"></div>
    
    {/* 상태 표시 - 우측 상단 */}
    <div className="absolute top-4 left-4">
      {listing.contractStatus === 'PENDING' && (
        <div className="bg-amber-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
          <div className="relative">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute inset-0 w-2 h-2 bg-white rounded-full animate-ping"></div>
          </div>
          <span className="text-sm font-bold tracking-wide">계약 진행중</span>
        </div>
      )}
      {listing.contractStatus === 'SOLD' && (
        <div className="bg-red-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-bold tracking-wide">계약 완료</span>
        </div>
      )}
    </div>

    {/* 중앙 메시지 - 더 세련된 디자인 */}
    <div className="absolute inset-0 flex items-center justify-center p-6">
      <div className="text-center">
        {listing.contractStatus === 'PENDING' && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/20 backdrop-blur-sm rounded-full mb-3">
              <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-white text-sm font-medium leading-tight">
              {/* <span className="block text-base font-bold mb-1">계약 진행 중</span> */}
              {/* <span className="opacity-90">이미 다른 분이 상담 중입니다</span> */}
            </p>
          </>
        )}
        {listing.contractStatus === 'SOLD' && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-3 border border-white/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-white text-sm font-medium leading-tight">
              {/* <span className="block text-base font-bold mb-1">계약 완료</span> */}
              {/* <span className="opacity-90">좋은 매물은 정말 빨리 나가네요</span> */}
            </p>
          </>
        )}
      </div>
    </div>

    {/* 하단 정보 바 */}
    <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm border-t border-white/10">
      <div className="px-4 py-3 flex items-center justify-between">
        <p className="text-white/80 text-xs">
          {listing.contractStatus === 'PENDING' 
            ? '⚡ 예비 순번 접수 가능!' 
            : '✨ 비슷한 매물을 찾고 계셨나요?'}
        </p>
        {/* <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // 비슷한 매물 보기 로직
          }}
          className="text-white text-xs font-medium hover:underline pointer-events-auto"
        >
          비슷한 매물 보기 →
        </button> */}
      </div>
    </div>
  </div>
)}

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
              {listing.sido} {listing.sigungu}
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
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-end">
  {/* 특징 아이콘 그룹 - 제한된 개수만 표시 */}
  <div className="flex items-center space-x-2 text-lg">
    {(() => {
      const features = [
        { 
          condition: listing.isAutomated, 
          element: (
            <span key="auto" title="풀오토 매장" className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold shadow-sm">
              ⚡ 오토
            </span>
          )
        },
        { 
          condition: listing.isFirstFloor, 
          element: (
            <span key="first" title="1층 매물" className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-semibold shadow-sm">
              🏢 1층
            </span>
          )
        },
        { 
          condition: listing.isNearStation, 
          element: (
            <span key="station" title="역세권" className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-semibold shadow-sm">
              🚇 역세
            </span>
          )
        },
        { 
          condition: listing.isBeginnerFriendly, 
          element: (
            <span key="beginner" title="초보 추천" className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-lg text-xs font-semibold shadow-sm">
              🌱 초보
            </span>
          )
        },
        { 
          condition: listing.isWomanFriendly, 
          element: (
            <span key="woman" title="여성 추천" className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-pink-50 dark:bg-pink-950 border border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 rounded-lg text-xs font-semibold shadow-sm">
              👩 여성
            </span>
          )
        },
        { 
          condition: listing.hasParking, 
          element: (
            <span key="parking" title="주차 가능" className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 rounded-lg text-xs font-semibold shadow-sm">
              🅿️ 주차
            </span>
          )
        }
      ];
      
      const activeFeatures = features.filter(f => f.condition);
      const visibleFeatures = activeFeatures.slice(0, 3);
      const remainingCount = activeFeatures.length - 3;
      
      return (
        <>
          {visibleFeatures.map(f => f.element)}
          {remainingCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-semibold shadow-sm">
              +{remainingCount}
            </span>
          )}
        </>
      );
    })()}
  </div>

  {/* 가격 정보 */}
  <div className="text-right">
    <span className="text-xs text-gray-500 dark:text-gray-400 block">권리금</span>
    <p className="text-xl font-bold text-gray-900 dark:text-gray-200">
        {formatKeyMoney(listing.keyMoney)}
    </p>
  </div>
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