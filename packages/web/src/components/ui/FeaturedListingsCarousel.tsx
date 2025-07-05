"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ListingCard 타입 정의
interface Listing {
  id: string;
  name: string;
  coverImage: string;
  address: string;
  summary: string;
  keyMoney: number;
}

interface FeaturedListingsCarouselProps {
  listings: Listing[];
}

export default function FeaturedListingsCarousel({ listings }: FeaturedListingsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // 자동 재생
  useEffect(() => {
    if (!isAutoPlaying || listings.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % listings.length);
    }, 4000); // 4초마다 전환

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, listings.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + listings.length) % listings.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % listings.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  if (listings.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <div className="text-6xl mb-4">⏰</div>
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          잠시만요, 새로운 특급 매물을 준비 중입니다!
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          곧 놀라운 매물들을 공개할 예정이니 조금만 기다려주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800">
      {/* 3D 캐러셀 컨테이너 */}
      <div className="absolute inset-0 flex items-center justify-center perspective-[1200px]">
        <div className="relative w-full h-full flex items-center justify-center">
          {listings.map((listing, index) => {
            const offset = index - currentIndex;
            const isActive = index === currentIndex;
            
            // 3개만 보이도록 제한
            if (Math.abs(offset) > 1) return null;

            return (
              <div
                key={listing.id}
                className={`absolute transition-all duration-700 ease-out ${
                  isActive ? 'z-20' : 'z-10'
                }`}
                style={{
                  transform: `
                    translateX(${offset * 320}px) 
                    translateZ(${Math.abs(offset) * -200}px) 
                    rotateY(${offset * -25}deg)
                    scale(${isActive ? 1 : 0.8})
                  `,
                  opacity: isActive ? 1 : 0.6,
                  filter: isActive ? 'none' : 'brightness(0.7)',
                }}
              >
                <div className="w-[400px] bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow">
                  {/* Best Pick 뱃지 */}
                  {index === 0 && (
                    <div className="absolute top-4 right-4 z-30 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                      <span className="text-lg">🏆</span> Best Pick
                    </div>
                  )}

                  {/* 이미지 영역 */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={listing.coverImage}
                      alt={listing.name}
                      className="w-full h-full object-cover"
                    />
                    {/* 그라데이션 오버레이 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>

                  {/* 컨텐츠 영역 */}
                  <div className="p-6">
                    {/* 위치 태그 */}
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold px-3 py-1.5 rounded-full">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {listing.address.split(' ').slice(0, 2).join(' ')}
                      </span>
                    </div>

                    {/* 매물 이름 */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {listing.name}
                    </h3>

                    {/* 요약 */}
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                      {listing.summary}
                    </p>

                    {/* 가격 정보 */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">권리금</span>
                        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {listing.keyMoney > 0 ? `${listing.keyMoney.toLocaleString()}만 원` : '권리금 없음'}
                        </p>
                      </div>
                    </div>

                    {/* CTA 버튼 */}
                    {isActive && (
                      <button className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-full font-semibold hover:shadow-lg transition-all transform hover:scale-105">
                        자세히 보기
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 네비게이션 화살표 */}
      <button
        onClick={goToPrevious}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all transform hover:scale-110"
        aria-label="이전 매물"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all transform hover:scale-110"
        aria-label="다음 매물"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* 인디케이터 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {listings.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-white'
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`${index + 1}번째 매물로 이동`}
          />
        ))}
      </div>

      {/* 자동 재생 토글 */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-8 right-8 z-30 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all"
        aria-label={isAutoPlaying ? '자동 재생 정지' : '자동 재생 시작'}
      >
        {isAutoPlaying ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )}
      </button>
    </div>
  );
}