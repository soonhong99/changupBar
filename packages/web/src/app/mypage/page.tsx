// packages/web/src/app/mypage/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { useAuth } from "@/context/AuthContext";
import { getMyLikedListings, ListingWithCounts } from "@/lib/api";
import ListingCard from "@/components/ui/ListingCard";
import { Bell, Heart, TrendingDown, TrendingUp, Clock, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import Modal from "@/components/ui/Modal"; // ⬅️ Modal import
import { useRouter } from "next/navigation"; // ⬅️ router import
import ConsultationForm from "@/components/forms/ConsultationForm"; // ⬅️ Form import

export default function MyPage() {
  const { isLoggedIn, token } = useAuth();
  const [likedListings, setLikedListings] = useState<ListingWithCounts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotificationGuide, setShowNotificationGuide] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // ⬅️ 모달 상태 추가
  const router = useRouter(); // ⬅️ router 추가

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
    <> 
    <main className="max-w-7xl mx-auto p-8">
      {/* 헤더 섹션 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">내가 찜한 매물 목록</h1>
        <p className="text-gray-600 dark:text-gray-400">
          찜한 매물의 중요한 변경사항을 실시간으로 알려드립니다
        </p>
      </div>

      {/* 알림 안내 배너 */}
      {showNotificationGuide && (
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 relative">
          <button
            onClick={() => setShowNotificationGuide(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            ✕
          </button>
          
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                찜하면 문자로 알려드려요!
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">💰 가격 변동 알림</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <TrendingDown className="w-4 h-4 text-green-600" />
                    <span>권리금이 <span className="font-semibold text-green-600">인하</span>될 시 즉시 알림</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <TrendingUp className="w-4 h-4 text-red-600" />
                    <span>권리금이 <span className="font-semibold text-red-600">인상</span>될 시 즉시 알림</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">📋 계약 상태 알림</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span><span className="font-semibold text-orange-600">계약 진행중</span>으로 변경 시 알림</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span><span className="font-semibold text-blue-600">계약 완료</span> 시 알림</span>
                  </div>
                  {/* <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    <span><span className="font-semibold text-blue-600">재등록</span> 시 긴급 알림</span>
                  </div> */}
                </div>
              </div>
              
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg px-4 py-3">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>💡 Tip:</strong> 정말 관심 있는 매물만 찜해두세요. 중요한 변경사항이 있을 때만 문자를 보내드려요!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 찜한 매물 목록 */}
      {likedListings.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            아직 찜한 매물이 없습니다.<br />
            마음에 드는 매물에 하트(♡)를 눌러보세요!
          </p>
          <Link 
            href="/search"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            매물 둘러보기
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              총 <span className="font-semibold text-blue-600">{likedListings.length}개</span>의 매물을 찜하셨습니다
            </p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Bell className="w-4 h-4 mr-1" />
              <span>알림이 활성화되어 있습니다</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {likedListings.map((listing) => (
              <div key={listing.id} className="relative">
                <ListingCard listing={listing} />
                {/* 계약 상태 표시 */}
                {listing.contractStatus === 'PENDING' && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    계약 진행중
                  </div>
                )}
                {listing.contractStatus === 'SOLD' && (
                  <div className="absolute top-4 right-4 bg-gray-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    계약 완료
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* 하단 CTA */}
      <div className="mt-16 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-10 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            궁금한 점이 있으신가요?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            찜한 매물에 대한 내용을 스마트창업이 친절히 알려드리겠습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:010-****-****"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              📞 전화 문의하기
            </a>
            {/* Link를 button으로 변경하고 onClick 이벤트 추가 */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-200 border border-gray-200"
            >
              💬 온라인 상담 예약
            </button>
          </div>
        </div>
    </main>
    <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="매물 상담 신청"
      >
        <ConsultationForm 
          onSuccess={() => {
            setIsModalOpen(false);
            router.push('/');
          }} 
        />
      </Modal>
    </>
  );
}