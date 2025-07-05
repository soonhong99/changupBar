// packages/web/src/app/(admin)/admin/new/page.tsx
"use client";

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createListing, getPresignedUrl } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { CreateListingInput } from '@shared/schemas/listing.schema';

// 초기 폼 데이터 - optional 필드들을 명시적으로 초기화
const initialFormData: Omit<CreateListingInput, 'bestUntil' | 'coverImage' | 'featuredStart' | 'featuredEnd'> & {
  utilityCost: number;
  otherCost: number;
  deliveryPercent: number;
} = {
  name: '',
  summary: '',
  address: '',
  region: 'METROPOLITAN',
  category: 'CAFE_BAKERY',
  deposit: 0,
  monthlyRent: 0,
  keyMoney: 0,
  monthlyRevenue: 0,
  materialCost: 0,
  personnelCost: 0,
  utilityCost: 0,
  otherCost: 0,
  deliveryPercent: 0,
  netProfit: 0,
  isAutomated: false,
  hasParking: false,
  isFirstFloor: false,
  isNearStation: false,
  description: '',
  imageUrls: [],
  status: 'DRAFT',
  isBest: false,
  isWeeklyBest: false,
};

export default function NewListingPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { token, isLoading: isAuthLoading } = useAuth();

  // 실수익 자동 계산
  useEffect(() => {
    const netProfit = formData.monthlyRevenue 
      - formData.materialCost 
      - formData.personnelCost 
      - (formData.utilityCost || 0)  // undefined 처리
      - (formData.otherCost || 0)     // undefined 처리
      - formData.monthlyRent;
    
    setFormData(prev => ({ ...prev, netProfit }));
  }, [
    formData.monthlyRevenue,
    formData.materialCost,
    formData.personnelCost,
    formData.utilityCost,
    formData.otherCost,
    formData.monthlyRent
  ]);

  // 파일 변경 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      
      // 이미지 미리보기
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 입력 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!coverImageFile) {
      setError('대표 이미지를 선택해주세요.');
      return;
    }
    if (!token) {
      setError('로그인이 필요합니다.');
      return;
    }

    setIsUploading(true);
    try {
      // 1. Pre-signed URL 요청
      const { uploadUrl, publicUrl } = await getPresignedUrl({
        filename: coverImageFile.name,
        filetype: coverImageFile.type,
      }, token);

      // 2. S3에 파일 업로드
      await fetch(uploadUrl, {
        method: 'PUT',
        body: coverImageFile,
        headers: {
          'Content-Type': coverImageFile.type,
        },
      });

      // 3. 매물 생성
      await createListing({ 
        ...formData, 
        coverImage: publicUrl,
      }, token);
      
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  // 숫자 포맷팅 함수
  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">새 매물 등록</h1>
        <p className="text-gray-600 dark:text-gray-400">등록할 매물의 정보를 입력해주세요.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 기본 정보 섹션 */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">기본 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300">
                매물 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 릴렉스 커피 강남점"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300">
                상세 주소 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="서울시 강남구 역삼동 123-45"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300">
                한 줄 요약 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="summary"
                id="summary"
                value={formData.summary}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="매물의 핵심 특징을 한 줄로 요약해주세요"
                required
              />
            </div>

            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300">
                지역 구분 <span className="text-red-500">*</span>
              </label>
              <select
                name="region"
                id="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="METROPOLITAN">수도권</option>
                <option value="NON_METROPOLITAN">수도권 외</option>
              </select>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300">
                업종 구분 <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="CAFE_BAKERY">카페/베이커리</option>
                <option value="RESTAURANT_BAR">주점/식당</option>
                <option value="RETAIL_ETC">판매점/기타</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300">
                상세 설명 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                rows={20}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="매물에 대한 상세한 설명을 입력해주세요"
                required
              />
            </div>
          </div>
        </div>

        {/* 계약 및 비용 정보 섹션 */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">계약 및 비용 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="deposit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300">
                보증금 (만원)
              </label>
              <input
                type="number"
                name="deposit"
                id="deposit"
                value={formData.deposit}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="monthlyRent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300">
                월세 (만원)
              </label>
              <input
                type="number"
                name="monthlyRent"
                id="monthlyRent"
                value={formData.monthlyRent}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="keyMoney" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300">
                권리금 (만원)
              </label>
              <input
                type="number"
                name="keyMoney"
                id="keyMoney"
                value={formData.keyMoney}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* 매출 및 수익 정보 섹션 */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">매출 및 수익 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="monthlyRevenue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300">
                월 평균 매출 (만원)
              </label>
              <input
                type="number"
                name="monthlyRevenue"
                id="monthlyRevenue"
                value={formData.monthlyRevenue}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="materialCost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300">
                월 평균 재료비 (만원)
              </label>
              <input
                type="number"
                name="materialCost"
                id="materialCost"
                value={formData.materialCost}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="personnelCost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300">
                월 평균 인건비 (만원)
              </label>
              <input
                type="number"
                name="personnelCost"
                id="personnelCost"
                value={formData.personnelCost}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="utilityCost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300">
                월 평균 공과금 (만원)
              </label>
              <input
                type="number"
                name="utilityCost"
                id="utilityCost"
                value={formData.utilityCost || 0}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="otherCost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300">
                월 평균 기타비용 (만원)
              </label>
              <input
                type="number"
                name="otherCost"
                id="otherCost"
                value={formData.otherCost || 0}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="deliveryPercent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300">
                배달 비중 (%)
              </label>
              <input
                type="number"
                name="deliveryPercent"
                id="deliveryPercent"
                value={formData.deliveryPercent || 0}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            {/* 실수익 표시 (자동 계산) */}
            <div className="lg:col-span-3 mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-700">예상 월 실수익</span>
                <span className={`text-2xl font-bold ${formData.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatNumber(formData.netProfit)}만원
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                * 실수익 = 매출 - (재료비 + 인건비 + 공과금 + 기타비용 + 월세)
              </p>
            </div>
          </div>
        </div>

        {/* 매물 특성 섹션 */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">매물 특성</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isAutomated"
                  checked={formData.isAutomated}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">풀오토 매장</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="hasParking"
                  checked={formData.hasParking}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">주차 가능</span>
              </label>
            </div>

            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isFirstFloor"
                  checked={formData.isFirstFloor}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">1층 매물</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isNearStation"
                  checked={formData.isNearStation}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">역세권</span>
              </label>
            </div>
          </div>
        </div>

        {/* 이미지 업로드 섹션 */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">대표 이미지</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300">
                대표 이미지 업로드 <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="coverImage"
                id="coverImage"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
            </div>
            
            {/* 이미지 미리보기 */}
            {coverImagePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">미리보기</p>
                <img
                  src={coverImagePreview}
                  alt="대표 이미지 미리보기"
                  className="w-full max-w-md h-64 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}
          </div>
        </div>

        {/* 공개 설정 섹션 */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">공개 설정</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300">
                공개 상태
              </label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DRAFT">임시저장</option>
                <option value="PUBLISHED">공개</option>
                <option value="ARCHIVED">보관</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isBest"
                  checked={formData.isBest}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">BEST 매물로 설정</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isWeeklyBest"
                  checked={formData.isWeeklyBest}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">주간 대표 매물로 설정</span>
              </label>
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* 제출 버튼 */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isUploading || isAuthLoading}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isAuthLoading ? '인증 확인 중...' : isUploading ? '저장 중...' : '매물 등록'}
          </button>
        </div>
      </form>
    </div>
  );
}