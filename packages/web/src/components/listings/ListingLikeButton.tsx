"use client";

import { useAuth } from '@/context/AuthContext';
import { likeListing } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface ListingLikeButtonProps {
  listingId: string;
  listingName: string;
}

export default function ListingLikeButton({ listingId, listingName }: ListingLikeButtonProps) {
  const { isLoggedIn, token, likedIds, toggleLike } = useAuth();
  const router = useRouter();
  const isLiked = likedIds.has(listingId);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLikeClick = async () => {
    if (isProcessing) return; // 중복 클릭 방지

    if (!isLoggedIn || !token) {
      alert('로그인이 필요한 기능입니다.');
      router.push('/login');
      return;
    }
    
    setIsProcessing(true);
    
    // UI 즉시 반영
    toggleLike(listingId);

    try {
      const result = await likeListing(listingId, token);
      if (result.message.includes('찜했습니다')) {
        const goToMyPage = window.confirm(
          `'${listingName}' 매물이 찜 목록에 추가되었습니다.\n\n찜한 매물들을 보러 가시겠습니까?`
        );
        if (goToMyPage) {
          router.push('/mypage');
        }
      }
    } catch (err) {
      toggleLike(listingId); // 에러 발생 시 UI 원상 복구
      alert(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    // 그라데이션 배경과 부드러운 애니메이션 추가
    <div className="relative rounded-2xl overflow-hidden group">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-100 via-sky-200 to-indigo-200 dark:from-teal-900/70 dark:via-sky-900/70 dark:to-indigo-900/70 transition-transform duration-500 group-hover:scale-110"></div>
        
        <div className="relative bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                매물이 마음에 드시나요?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-sm mx-auto">
                찜하기를 눌러 관심 매물을 저장하고,
                <br />
                마이페이지에서 편리하게 관리해보세요!
            </p>
            <button
                onClick={handleLikeClick}
                disabled={isProcessing}
                className={`group/button relative inline-flex items-center justify-center gap-3 px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ease-in-out overflow-hidden transform hover:-translate-y-1 shadow-lg
                           ${isLiked
                             ? 'bg-red-500 text-white'
                             : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-50'
                           }
                           disabled:opacity-70 disabled:cursor-wait`}
            >
                {/* 찜 했을 때 나타나는 반짝임 효과 */}
                {isLiked && (
                  <span className="absolute inset-0 bg-white/20 scale-0 group-hover/button:scale-100 rounded-full transition-transform duration-300"></span>
                )}
                
                <Heart 
                  className={`relative z-10 w-7 h-7 transition-all duration-300 ease-in-out group-hover/button:animate-pulse
                             ${isLiked ? 'text-white fill-white' : 'text-red-500'}
                             ${isProcessing ? 'animate-ping' : ''}`} 
                />
                <span className="relative z-10">{isLiked ? '찜 완료!' : '찜하기'}</span>
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              찜 하시면 실시간 변동 정보를 문자로 알려드려요.
            </p>
        </div>
    </div>
  );
}