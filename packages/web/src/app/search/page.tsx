// packages/web/src/app/search/page.tsx

"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllListings, ListingFilter, getListingStats, ListingWithCounts, getMostViewedListing } from "@/lib/api";
import ListingCard from "@/components/ui/ListingCard";
import { administrativeDistricts } from '@/data/districts'; // ⬅️ 여기서 import
import Modal from "@/components/ui/Modal"; // ⬅️ Modal import
import ConsultationForm from "@/components/forms/ConsultationForm";

export default function SearchPage() {
  const [listings, setListings] = useState<ListingWithCounts[]>([]);
  const [filters, setFilters] = useState<ListingFilter>({
    sido: '',
    sigungu: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ totalCount: 0, newThisWeekCount: 0 }); // ⬅️ 통계 상태 추가
  const [mostViewed, setMostViewed] = useState<ListingWithCounts | null>(null); // ⬅️ 추가
  const [isModalOpen, setIsModalOpen] = useState(false); // ⬅️ 모달 상태 추가

  // useEffect 1: 페이지가 처음 로드될 때 한 번만 실행 (통계, 인기 매물)
  useEffect(() => {
    // 통계 데이터 불러오기
    getListingStats().then(setStats);

    // 인기 매물을 불러오고, 5분마다 반복하도록 설정
    const fetchMostViewed = () => {
      getMostViewedListing().then(setMostViewed);
    };
    fetchMostViewed(); // 즉시 실행
    const interval = setInterval(fetchMostViewed, 5 * 60 * 1000); // 5분마다

    // 컴포넌트가 사라질 때 인터벌 정리
    return () => clearInterval(interval);
  }, []); // ⬅️ 의존성 배열이 비어있어, 최초 1회만 실행됨

  // useEffect 2: 필터가 변경될 때마다 실행 (매물 목록)
  useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true);
      
      // 실제 데이터 로딩과 최소 로딩 시간(500ms)을 동시에 시작
      const startTime = Date.now();
      const activeFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v));
      const data = await getAllListings(activeFilters);
      
      // 최소 500ms를 보장
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 500 - elapsedTime);
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      setListings(data);
      setIsLoading(false);
    };

    // 300ms 디바운스
    const timer = setTimeout(loadListings, 300);
    return () => clearTimeout(timer);
  }, [filters]); // ⬅️ filters가 변경될 때만 실행됨
  
  const handleFilterChange = (key: keyof ListingFilter, value: string | number | undefined) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      // 시/도가 바뀌면, 시/군/구 선택을 초기화합니다.
      if (key === 'sido') {
        newFilters.sigungu = '';
      }
      return newFilters;
    });
  };

  // ⬇️ 정렬 select를 위한 핸들러 추가
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, order] = e.target.value.split('-');
    setFilters(prev => ({ 
      ...prev, 
      sortBy: sortBy as ListingFilter['sortBy'], // ⬅️ 타입을 강제(assertion)합니다.
      order: order as ListingFilter['order']     // ⬅️ 타입을 강제(assertion)합니다.
    }));
  };

  // --- 공통 스타일 클래스 ---
  const labelClasses = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2";
  const selectClasses = "w-full rounded-lg shadow-sm bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 px-4 py-3";

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <main className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* --- 상단 헤더 및 소개 --- */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold mb-6 shadow-lg">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            스마트 매물 검색
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              나만의 완벽한 매물
            </span>
            <br />
            지금 바로 찾아보세요
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
           검증된 <strong className="text-blue-600 dark:text-blue-400">스마트창업</strong> 매물 중에서 
            당신에게 딱 맞는 <strong className="text-purple-600 dark:text-purple-400">황금 매물</strong>을 찾아보세요
          </p>
        </div>

        {/* --- 검색 통계 --- */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalCount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">전체 매물</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.newThisWeekCount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">이번 주 신규</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
            {mostViewed ? (
              <>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 truncate">
                  {mostViewed.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  가장 인기 있는 매물 (조회수 {mostViewed.viewCount})
                </div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">-</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">가장 많이 본 매물</div>
              </>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">97%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">고객 만족도</div>
          </div>
        </div>

        {/* --- 지역 안내 섹션 --- */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-l-4 border-amber-400 p-6 rounded-lg shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
                  📍 현재 서비스 지역 안내
                </h3>
                <p className="text-amber-700 dark:text-amber-300 mb-3">
                  현재 <span className="font-semibold">서울특별시, 인천광역시, 대전광역시, 경기도</span> 지역의 검증된 매물을 
                  집중적으로 소개해드리고 있습니다.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-amber-600 dark:text-amber-400 mb-2 sm:mb-0">
                    전국 매물 확대를 위해 열심히 준비하고 있으니, 조금만 기다려 주세요! 🙏
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-amber-600 dark:text-amber-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>매주 새로운 특급매물 추가 중</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
        {/* --- 필터 UI --- */}
        <div className="mb-10 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                🎯 맞춤 검색 필터
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={() => setFilters({})}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  전체 초기화
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label htmlFor="category" className={labelClasses}>
                  <span className="flex items-center">
                    🏪 업종 카테고리
                    <span className="ml-1 text-red-500">*</span>
                  </span>
                </label>
                <select 
                  id="category"
                  onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                  className={selectClasses}
                >
                  <option value="">전체 업종</option>
                  <option value="CAFE_BAKERY">☕ 카페/베이커리</option>
                  <option value="RESTAURANT_BAR">🍽️ 주점/식당</option>
                  <option value="RETAIL_ETC">🛍️ 판매점/기타</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="keyMoney" className={labelClasses}>
                  <span className="flex items-center">
                    💰 권리금 범위
                    <span className="ml-1 text-xs text-gray-500">(최대)</span>
                  </span>
                </label>
                <select 
                  id="keyMoney"
                  onChange={(e) => handleFilterChange('keyMoneyLte', e.target.value ? parseInt(e.target.value) : undefined)}
                  className={selectClasses}
                >
                  <option value="">금액 제한 없음</option>
                  <option value="5000">💸 5천만원 이하</option>
                  <option value="10000">💳 1억원 이하</option>
                  <option value="20000">💎 2억원 이하</option>
                  <option value="50000">🏆 5억원 이하</option>
                </select>
              </div>
              
              {/* 추가 필터 플레이스홀더 */}
              <div className="space-y-2">
              <label htmlFor="sido" className={labelClasses}>📍 시/도 선택</label>
              <select
                id="sido"
                onChange={(e) => handleFilterChange('sido', e.target.value || undefined)}
                value={filters.sido}
                className={selectClasses}
              >
                <option value="">전체</option>
                {Object.keys(administrativeDistricts).map(sido => (
                  <option key={sido} value={sido}>{sido}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="sigungu" className={labelClasses}>시/군/구 선택</label>
              <select
                id="sigungu"
                onChange={(e) => handleFilterChange('sigungu', e.target.value || undefined)}
                value={filters.sigungu}
                disabled={!filters.sido} // 시/도가 선택되어야 활성화
                className={`${selectClasses} ${!filters.sido ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="">전체</option>
                {filters.sido && administrativeDistricts[filters.sido]?.map(sigungu => (
                  <option key={sigungu} value={sigungu}>{sigungu}</option>
                ))}
              </select>
            </div>
            </div>
            
            {/* 검색 결과 미리보기 */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      🔍 최적의 매물을 찾고 있습니다...
                    </span>
                  ) : (
                    <span>
                      📊 검색 결과: <strong className="text-blue-600 dark:text-blue-400">{listings.length}개</strong> 매물 발견
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  실시간 업데이트 중
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 매물 목록 --- */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {hasActiveFilters ? '맞춤 검색 결과' : '전체 매물 목록'}
              <span className="ml-2 text-blue-500">🎯</span>
            </h2>
            <div className="flex items-center space-x-4">
              {/* <div className="text-sm text-gray-600 dark:text-gray-400" style={{ writingMode: 'horizontal-tb' }}>
                정렬:
              </div> */}
              <select
                id="sort"
                onChange={handleSortChange}
                value={`${filters.sortBy}-${filters.order}`}
                className={selectClasses}
                style={{ height: '48px', width: '150px' }} // 또는 '8rem' 같은 값
              >
                <option value="createdAt-desc">최신순</option>
                <option value="keyMoney-asc">권리금 낮은순</option>
                <option value="keyMoney-desc">권리금 높은순</option>
              </select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mb-4">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                매물 검색 중...
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                최고의 매물을 찾고 있습니다. 잠시만 기다려주세요! 🔍
              </p>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <div className="text-6xl mb-4">🤔</div>
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                조건에 맞는 매물이 없습니다
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                검색 조건을 조정하거나 전체 매물을 확인해보세요
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setFilters({})}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  🔄 전체 매물 보기
                </button>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  또는 <span className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">맞춤 매물 알림</span>을 설정해보세요
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {listings.map((listing, index) => (
                  <div key={listing.id} className="relative group">
                    <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                      <ListingCard listing={listing} />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 더 많은 매물 보기 버튼 */}
              {/* <div className="text-center mt-12">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                  더 많은 매물 보기 📈
                </button>
              </div> */}
            </>
          )}
        </div>

        {/* --- 추가 서비스 안내 --- */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              🎯 원하는 매물이 없으신가요?
            </h3>
            <p className="text-green-100 mb-6">
              전문 컨설턴트가 직접 맞춤 매물을 찾아드립니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setIsModalOpen(true)} className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                💬 맞춤 매물 신청
              </button>
              <button className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
                🔔 매물 알림 설정
              </button>
            </div>
          </div>
        </div>

      </div>
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="맞춤 매물 상담 신청"
      >
        <ConsultationForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </main>
  );
}