// packages/web/src/app/page.tsx

"use client"; // ⬅️ 이 페이지를 클라이언트 컴포넌트로 만듭니다.

import { useEffect, useState } from "react";
import { getAllListings, ListingFilter } from "@/lib/api";
import ListingCard from "@/components/ui/ListingCard";
import { Listing } from "@prisma/client";

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filters, setFilters] = useState<ListingFilter>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadListings() {
      setIsLoading(true);
      const data = await getAllListings(filters);
      setListings(data);
      setIsLoading(false);
    }
    loadListings();
  }, [filters]); // filters 상태가 바뀔 때마다 이 useEffect가 다시 실행됩니다.

  const handleFilterChange = (key: keyof ListingFilter, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <main className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">매물 찾기</h1>
      
      {/* 필터 UI */}
      <div className="flex flex-wrap gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700">업종</label>
          <select 
            onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">전체</option>
            <option value="CAFE_BAKERY">카페/베이커리</option>
            <option value="RESTAURANT_BAR">주점/식당</option>
            <option value="RETAIL_ETC">판매점/기타</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">권리금</label>
           <select 
            onChange={(e) => handleFilterChange('keyMoneyLte', e.target.value ? parseInt(e.target.value) : undefined)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">전체</option>
            <option value="50000000">5천만원 이하</option>
            <option value="100000000">1억원 이하</option>
            <option value="200000000">2억원 이하</option>
          </select>
        </div>
        {/* TODO: 지역 필터도 동일한 방식으로 추가할 수 있습니다. */}
      </div>

      {/* 매물 목록 */}
      {isLoading ? (
        <p>매물을 불러오는 중입니다...</p>
      ) : listings.length === 0 ? (
        <p>선택한 조건에 맞는 매물이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}