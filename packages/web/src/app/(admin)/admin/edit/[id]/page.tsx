// packages/web/src/app/(admin)/admin/edit/[id]/page.tsx
"use client";

import { useEffect, useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getListingById, updateListing } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { UpdateListingInput } from '@shared/schemas/listing.schema';
import { Listing } from '@prisma/client';

export default function EditListingPage() {
  const [listing, setListing] = useState<Listing | null>(null);
  const [formData, setFormData] = useState<Partial<UpdateListingInput>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      getListingById(id)
        .then(data => {
          if (data) {
            setListing(data);
            // ⬇️ 이 부분이 핵심입니다.
            // Date 객체를 HTML input이 이해할 수 있는 문자열로 변환합니다.
            const formattedData = {
                ...data,
                // bestUntil이 Date 객체이면, YYYY-MM-DDTHH:mm 형식의 문자열로 변환
                bestUntil: data.bestUntil ? data.bestUntil.toISOString().slice(0, 16) : undefined,
              };
              setFormData(formattedData);
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const isNumber = type === 'number';
    
    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : isNumber ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('로그인이 필요합니다.');
      return;
    }

    try {
      await updateListing(id, formData, token);
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류 발생');
    }
  };

  if (isLoading) return <div className="p-8">매물 정보를 불러오는 중...</div>;
  if (!listing) return <div className="p-8">매물 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">매물 수정: {listing.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow">
        
        {/* --- 기본 정보 섹션 --- */}
        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">기본 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">매물 이름</label>
              <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">업종</label>
              <select name="category" id="category" value={formData.category || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option value="CAFE_BAKERY">카페/베이커리</option>
                <option value="RESTAURANT_BAR">주점/식당</option>
                <option value="RETAIL_ETC">판매점/기타</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700">한 줄 요약</label>
              <input type="text" name="summary" id="summary" value={formData.summary || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
            </div>
             <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">주소</label>
              <input type="text" name="address" id="address" value={formData.address || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
            </div>
             <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">상세 설명</label>
              <textarea name="description" id="description" value={formData.description || ''} onChange={handleChange} rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
            </div>
          </div>
        </div>

        {/* --- 계약 및 비용 정보 섹션 --- */}
        <div className="border-b pb-6">
           <h2 className="text-lg font-semibold mb-4 text-gray-800">계약 및 비용 정보 (숫자만 입력)</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label htmlFor="deposit" className="block text-sm font-medium text-gray-700">보증금</label>
                <input type="number" name="deposit" id="deposit" value={formData.deposit || 0} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="monthlyRent" className="block text-sm font-medium text-gray-700">월세</label>
                <input type="number" name="monthlyRent" id="monthlyRent" value={formData.monthlyRent || 0} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="keyMoney" className="block text-sm font-medium text-gray-700">권리금</label>
                <input type="number" name="keyMoney" id="keyMoney" value={formData.keyMoney || 0} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
              {/* 여기에 다른 비용 필드들도 동일한 패턴으로 추가할 수 있습니다. */}
           </div>
        </div>
        
        {/* --- 상세 특성 섹션 --- */}
        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">상세 특성</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-4">
            <div className="flex items-center">
              <input id="isAutomated" name="isAutomated" type="checkbox" checked={formData.isAutomated || false} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
              <label htmlFor="isAutomated" className="ml-2 block text-sm text-gray-900">풀오토</label>
            </div>
            <div className="flex items-center">
              <input id="hasParking" name="hasParking" type="checkbox" checked={formData.hasParking || false} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
              <label htmlFor="hasParking" className="ml-2 block text-sm text-gray-900">주차 가능</label>
            </div>
             {/* hasParking은 DB 스키마에서 삭제했었으므로, 다시 추가하시려면 schema.prisma 수정 및 migrate가 필요합니다. */}
          </div>
        </div>
        
        {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
        
        <div className="flex justify-end pt-4">
          <button type="button" onClick={() => router.back()} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mr-2">
            취소
          </button>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
            수정 완료
          </button>
        </div>
      </form>
    </div>
  );
}