// packages/web/src/app/(admin)/admin/page.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getAllListings, deleteListingById, ListingFilter, getPendingConsultationCount, PaginatedResponse, ListingWithCounts} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { categories, mainCategories } from "@/data/categories"; // ⬅️ 카테고리 데이터 import

export default function AdminDashboardPage() {
  const [listings, setListings] = useState<ListingWithCounts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ListingFilter>({
    sortBy: 'createdAt',
    order: 'desc',
    mainCategory: '', // ⬅️ category를 mainCategory로 변경
    subCategory: '',  // ⬅️ subCategory 추가
    status: '', // 'DRAFT', 'PUBLISHED', 'ARCHIVED'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuth();
  const [pendingCount, setPendingCount] = useState(0); // ⬅️ 신규 상담 건수 state 추가

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const fetchListingsAndStats = useCallback(async () => { // ⬅️ 함수 이름 변경 및 로직 통합
    if (!token) return;

    setIsLoading(true);
    try {
      // 두 API를 병렬로 호출하여 성능 최적화
      // admin에서는 전체 목록을 보여주므로 큰 limit 값 설정
      const adminFilters = {
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
        limit: 1000, // admin에서는 충분히 큰 값으로 설정
        page: 1
      };
      const [listingsResponse, countData] = await Promise.all([
        getAllListings(adminFilters, token),
        getPendingConsultationCount(token)
      ]);
      setListings(listingsResponse.listings);
      setPendingCount(countData.count);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, token]);

  useEffect(() => {
    const timer = setTimeout(fetchListingsAndStats, 300);
    return () => clearTimeout(timer);
  }, [fetchListingsAndStats]); // ⬅️ 이제 fetchListings 함수 자체를 의존성으로 가집니다.

  const handleDelete = async (id: string) => {
    if (confirm('정말로 이 매물을 삭제하시겠습니까?')) {
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }
      try {
        await deleteListingById(id, token);
        alert('삭제되었습니다.');
        fetchListingsAndStats();
      } catch (error) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  // 검색 필터링
  const filteredListings = listings.filter(listing =>
    listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (listing.sido || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (listing.sigungu || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 통계 계산
  const stats = {
    total: listings.length,
    published: listings.filter(l => l.status === 'PUBLISHED').length,
    draft: listings.filter(l => l.status === 'DRAFT').length,
    archived: listings.filter(l => l.status === 'ARCHIVED').length,
    featured: listings.filter(l => l.isWeeklyBest).length,
  };

  if (isLoading) {
    return <div className="p-8">목록을 불러오는 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                📊 매물 관리 대시보드
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                전체 매물을 효율적으로 관리하고 모니터링하세요
              </p>
            </div>
            <Link 
              href="/admin/new" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              새 매물 등록
            </Link>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">전체 매물</dt>
                    <dd className="text-lg font-semibold text-gray-900 dark:text-gray-100">{stats.total} 건</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">공개된 매물</dt>
                    <dd className="text-lg font-semibold text-gray-900 dark:text-gray-100">{stats.published} 건</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">임시저장</dt>
                    <dd className="text-lg font-semibold text-gray-900 dark:text-gray-100">{stats.draft} 건</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">블라인드</dt>
                    <dd className="text-lg font-semibold text-gray-900 dark:text-gray-100">{stats.archived} 건</dd>
                  </dl>
                </div>
              </div>
            </div>

            {/* ⬇️ '신규 상담 신청' 카드를 아래 코드로 교체합니다. */}
            <Link href="/admin/consultations" className="block relative"> {/* ⬅️ 1. relative 추가 */}
              {/* 2. 빨간 알림 배지 (조건부 렌더링) */}
              {pendingCount > 0 && (
                <div className="absolute top-0 right-0 -mt-2 -mr-2 z-10">
                  <span className="flex h-6 w-6 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 text-white text-xs items-center justify-center">
                      {pendingCount}
                    </span>
                  </span>
                </div>
              )}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 h-full hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">신규 상담 신청</dt>
                        {/* 3. 하드코딩된 숫자 '5'를 상태 변수로 교체 */}
                        <dd className="text-lg font-semibold text-gray-900 dark:text-gray-100">{pendingCount} 건</dd>
                      </dl>
                    </div>
                  </div>
                </div>
            </Link>
          </div>
        </div>

        {/* 필터 및 검색 섹션 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">🔍 검색 및 필터</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* 검색 */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">검색</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="매물명, 지역으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* 상태 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">상태</label>
              <select 
                name="status" 
                onChange={handleFilterChange} 
                value={filters.status} 
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">전체</option>
                <option value="PUBLISHED">공개</option>
                <option value="DRAFT">임시저장</option>
                <option value="ARCHIVED">블라인드</option>
              </select>
            </div>

            {/* 업종 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">업종 선택</label>
              <select 
                name="mainCategory" 
                onChange={handleFilterChange} 
                value={filters.mainCategory} 
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">전체</option>
                {mainCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">상세 업종</label>
              <select 
                name="subCategory" 
                onChange={handleFilterChange} 
                value={filters.subCategory}
                disabled={!filters.mainCategory}
                className={`block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!filters.mainCategory ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="">전체</option>
                {filters.mainCategory && categories[filters.mainCategory]?.map(subCat => (
                  <option key={subCat} value={subCat}>{subCat}</option>
                ))}
              </select>
            </div>

            {/* 정렬 기준 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">정렬 기준</label>
              <select 
                name="sortBy" 
                onChange={handleFilterChange} 
                value={filters.sortBy} 
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="createdAt">등록순</option>
                <option value="keyMoney">권리금순</option>
                <option value="status">상태순</option>
                <option value="viewCount">조회수순</option> {/* ⬅️ 추가 */}
                <option value="likeCount">인기순</option>   {/* ⬅️ 추가 */}
              </select>
            </div>

            {/* 정렬 순서 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">정렬 순서</label>
              <select 
                name="order" 
                onChange={handleFilterChange} 
                value={filters.order} 
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="desc">내림차순</option>
                <option value="asc">오름차순</option>
              </select>
            </div>
          </div>
        </div>

        {/* 매물 목록 테이블 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              📋 매물 목록 
              <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                ({filteredListings.length}개)
              </span>
            </h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-400">매물 목록을 불러오는 중...</span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">매물 정보</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">주소</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">권리금</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">상태</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">등록일</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">관리</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredListings.map((listing) => (
                    <tr key={listing.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${listing.isWeeklyBest ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''} ${listing.status === 'ARCHIVED' ? 'opacity-60' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {listing.isWeeklyBest && (
                            <span className="text-yellow-500 mr-2 text-lg" title="특급 매물">⭐</span>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {listing.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {listing.subCategory}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {listing.sido} {listing.sigungu}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {listing.keyMoney.toLocaleString()}만 원
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          listing.status === 'PUBLISHED' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                            : listing.status === 'DRAFT'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
                        }`}>
                          {listing.status === 'PUBLISHED' && '🟢 공개'}
                          {listing.status === 'DRAFT' && '🟡 임시저장'}
                          {listing.status === 'ARCHIVED' && '⚫ 블라인드'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(listing.createdAt).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link 
                            href={`/admin/edit/${listing.id}`} 
                            className="inline-flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium rounded-full transition-colors"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            수정
                          </Link>
                          <button 
                            onClick={() => handleDelete(listing.id)} 
                            className="inline-flex items-center px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded-full transition-colors"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && filteredListings.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-gray-400 dark:text-gray-500 text-4xl mb-4">📝</div>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
                조건에 맞는 매물이 없습니다
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                검색어나 필터 조건을 변경해보세요
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}