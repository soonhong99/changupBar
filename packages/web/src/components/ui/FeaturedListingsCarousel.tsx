"use client";

import { useState, useEffect, MouseEvent } from 'react';
import { Listing } from '@prisma/client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { likeListing } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface FeaturedListingsCarouselProps {
  listings: Listing[];
}

export default function FeaturedListingsCarousel({ listings }: FeaturedListingsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const { isLoggedIn, token, likedIds, toggleLike } = useAuth();
  const router = useRouter();

  // Auto-rotate functionality
  useEffect(() => {
    if (!isAutoPlaying || isPaused || listings.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % listings.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, isPaused, listings.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + listings.length) % listings.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % listings.length);
  };

  const handleLikeClick = async (e: MouseEvent, listing: Listing) => {
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

  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;
    const totalItems = listings.length;
    
    // Calculate position in circular array
    let position = diff;
    if (Math.abs(diff) > totalItems / 2) {
      position = diff > 0 ? diff - totalItems : diff + totalItems;
    }

    // Calculate rotation and translation
    const rotateY = position * 25; // Degrees of rotation per card
    const translateZ = Math.abs(position) > 1 ? -300 : -150 * Math.abs(position);
    const translateX = position * 95; // Horizontal spacing (Adjusted for wider cards)
    const scale = Math.abs(position) > 1 ? 0.7 : 1 - Math.abs(position) * 0.2;
    const opacity = Math.abs(position) > 1 ? 0.3 : 1 - Math.abs(position) * 0.3;
    const zIndex = listings.length - Math.abs(position);

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity: opacity,
      zIndex: zIndex,
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    };
  };

  if (listings.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <div className="text-6xl mb-4">⏰</div>
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          잠시만요, 새로운 특급 매물을 준비 중입니다!
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          곧 매물을 공개할 예정이니 조금만 기다려주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[680px] overflow-hidden"> {/* Increased height */}
      {/* 3D Container */}
      <div 
        className="relative w-full h-full flex items-center justify-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{ perspective: '1200px' }}
      >
        <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          {listings.map((listing, index) => {
            const isLiked = likedIds.has(listing.id);
            
            return (
              <div
                key={listing.id}
                className="absolute w-[420px] h-[560px] cursor-pointer" // Increased card size
                style={getCardStyle(index)}
                onClick={() => setCurrentIndex(index)}
              >
                <Link href={`/listings/${listing.id}`} className="block w-full h-full">
                  <div className="relative w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transform transition-transform hover:scale-105">
                    {/* Best Pick Badge */}
                    {index === 0 && (
                      <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                        🏆 Best Pick
                      </div>
                    )}

                    {/* Like Button */}
                    <button
                      onClick={(e) => handleLikeClick(e, listing)}
                      className="absolute top-4 left-4 z-20 p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
                      aria-label="찜하기"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 transition-all ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-300 hover:text-red-500'}`} 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        fill="none"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                      </svg>
                    </button>

                    {/* Image */}
                    <div className="w-full h-[320px] overflow-hidden"> {/* Increased image height */}
                      <img 
                        src={listing.coverImage} 
                        alt={listing.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Location Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {listing.address.split(' ')[0]} {listing.address.split(' ')[1]}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        {listing.name}
                      </h3>

                      {/* Summary */}
                      <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">
                        {listing.summary}
                      </p>

                      {/* Price */}
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">권리금</span>
                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                          {listing.keyMoney > 0 ? `${listing.keyMoney.toLocaleString()}만 원` : '없음'}
                        </p>
                      </div>
                    </div>

                    {/* Gradient Overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none rounded-2xl"></div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrevious}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all hover:scale-110"
        aria-label="Previous listing"
      >
        <svg className="w-6 h-6 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all hover:scale-110"
        aria-label="Next listing"
      >
        <svg className="w-6 h-6 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {listings.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'w-8 bg-indigo-600 dark:bg-indigo-400' 
                : 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-400'
            }`}
            aria-label={`Go to listing ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play Toggle */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-8 right-8 z-30 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all"
        aria-label={isAutoPlaying ? "Pause auto-play" : "Start auto-play"}
      >
        {isAutoPlaying ? (
          <svg className="w-5 h-5 text-gray-800 dark:text-gray-200" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-800 dark:text-gray-200" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )}
      </button>
    </div>
  );
}