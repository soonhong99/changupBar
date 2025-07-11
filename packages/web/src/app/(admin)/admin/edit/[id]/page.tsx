// packages/web/src/app/(admin)/admin/edit/[id]/page.tsx

"use client";

import { useEffect, useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getListingById, updateListing, getPresignedUrl} from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { UpdateListingInput } from '@shared/schemas/listing.schema';
import { Listing } from '@prisma/client';
import FeaturedPropertySettings from '@/components/admin/FeaturedPropertySettings';
import {
  ArrowLeft,
  Save,
  Upload,
  MapPin,
  DollarSign,
  Info,
  Car,
  Zap,
  Image,
  AlertCircle,
  CheckCircle,
  Building,
  Calculator,
  Truck,
  Train,
  Home
} from 'lucide-react';

// ⬇️ Daum Postcode 타입을 위한 window 객체 확장
declare global {
  interface Window {
    daum: any;
  }
}

export default function EditListingPage() {
  const [listing, setListing] = useState<Listing | null>(null);
  const [formData, setFormData] = useState<Partial<UpdateListingInput>>({});
  const [newCoverImageFile, setNewCoverImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const id = params.id as string;

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function(data: any) {
        setFormData(prev => ({
          ...prev,
          sido: data.sido,
          sigungu: data.sigungu,
          eupmyeondong: data.bname,
          roadAddress: data.roadAddress,
        }));
      }
    }).open();
  };

  useEffect(() => {
    if (id) {
      getListingById(id)
        .then(data => {
          if (data) {
            setListing(data);
  
            // ⬇️ null을 undefined로 변환하여 타입 불일치 해결
            const formattedData = {
              ...data,
              sido: data.sido ?? undefined,
              sigungu: data.sigungu ?? undefined,
              eupmyeondong: data.eupmyeondong ?? undefined,
              roadAddress: data.roadAddress ?? undefined,
              detailAddress: data.detailAddress ?? undefined,
              featuredStart: data.featuredStart ? new Date(data.featuredStart).toISOString().slice(0, 16) : undefined,
              featuredEnd: data.featuredEnd ? new Date(data.featuredEnd).toISOString().slice(0, 16) : undefined,
              bestUntil: data.bestUntil ? new Date(data.bestUntil).toISOString().slice(0, 16) : undefined,
            };
            
            setFormData(formattedData);
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [id]);

  // 실수익 자동 계산
  useEffect(() => {
    const netProfit = (formData.monthlyRevenue || 0)
      - (formData.materialCost || 0)
      - (formData.personnelCost || 0)
      - (formData.utilityCost || 0)
      - (formData.otherCost || 0)
      - (formData.monthlyRent || 0);

    setFormData(prev => ({ ...prev, netProfit }));
  }, [
    formData.monthlyRevenue,
    formData.materialCost,
    formData.personnelCost,
    formData.utilityCost,
    formData.otherCost,
    formData.monthlyRent
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewCoverImageFile(file);

      // 미리보기 URL 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const isNumber = type === 'number';

    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : isNumber ? Number(value) : value,
    }));
  };

  const handleFeaturedSettingsChange = (newFeaturedData: Partial<UpdateListingInput>) => {
    setFormData(prev => ({ ...prev, ...newFeaturedData }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!token) {
      setError('로그인이 필요합니다.');
      return;
    }

    setIsUploading(true);
    let finalCoverImageUrl = listing?.coverImage;

    try {
      if (newCoverImageFile) {
        const { uploadUrl, publicUrl } = await getPresignedUrl({
          filename: newCoverImageFile.name,
          filetype: newCoverImageFile.type,
        }, token);

        await fetch(uploadUrl, {
          method: 'PUT',
          body: newCoverImageFile,
          headers: { 'Content-Type': newCoverImageFile.type },
        });

        finalCoverImageUrl = publicUrl;
      }

      const dataToSubmit = {
        ...formData,
        coverImage: finalCoverImageUrl,
        featuredStart: formData.featuredStart ? new Date(formData.featuredStart).toISOString() : null,
        featuredEnd: formData.featuredEnd ? new Date(formData.featuredEnd).toISOString() : null,
      };

      await updateListing(id, dataToSubmit, token);
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  // 금액 포맷팅 함수
  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">매물 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">매물 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">매물 수정</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{listing.name}</p>
              </div>
            </div>

            {/* 상태 표시 */}
            <div className="flex items-center space-x-2">
              {listing.isWeeklyBest && (
                <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                  주간 대표
                </span>
              )}
              {listing.isBest && (
                <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">
                  BEST 매물
                </span>
              )}
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                listing.status === 'PUBLISHED'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : listing.status === 'DRAFT'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {listing.status === 'PUBLISHED' ? '공개' : listing.status === 'DRAFT' ? '임시저장' : '보관'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 알림 메시지 */}
      {(error || success) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          {error && (
            <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <p className="text-green-700 dark:text-green-400">매물이 성공적으로 수정되었습니다.</p>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 공개 설정 섹션 */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">공개 설정</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                공개 상태
              </label>
              <select
                name="status"
                id="status"
                value={formData.status || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="PUBLISHED">공개</option>
                <option value="DRAFT">임시저장</option>
                <option value="ARCHIVED">블라인드</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isBest"
                  checked={formData.isBest || false}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">BEST 매물로 설정</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isWeeklyBest"
                  checked={formData.isWeeklyBest || false}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">주간 대표 매물로 설정</span>
              </label>
            </div>
          </div>

          {/* 대표 매물 설정 컴포넌트 */}
          {formData.isWeeklyBest && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <FeaturedPropertySettings
                formData={formData}
                onFormDataChange={handleFeaturedSettingsChange}
              />
            </div>
          )}
        </div>

        {/* 기본 정보 섹션 */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">기본 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                매물 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>

            {/* --- 기존 '상세 주소' input div를 삭제하고 아래 코드로 교체 --- */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                주소 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.roadAddress || ''}
                  placeholder="주소 검색 버튼을 눌러주세요"
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600"
                />
                <button
                  type="button"
                  onClick={handleAddressSearch}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md whitespace-nowrap hover:bg-gray-700"
                >
                  주소 검색
                </button>
              </div>
              <input
                type="text"
                name="detailAddress"
                value={formData.detailAddress || ''}
                onChange={handleChange}
                placeholder="상세주소 입력 (예: A동 101호)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                한 줄 요약 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="summary"
                id="summary"
                value={formData.summary || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>

            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                지역 구분 <span className="text-red-500">*</span>
              </label>
              <select
                name="region"
                id="region"
                value={formData.region || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="METROPOLITAN">수도권</option>
                <option value="NON_METROPOLITAN">수도권 외</option>
              </select>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                업종 구분 <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                id="category"
                value={formData.category || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="CAFE_BAKERY">카페/베이커리</option>
                <option value="RESTAURANT_BAR">주점/식당</option>
                <option value="RETAIL_ETC">판매점/기타</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                상세 설명 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={20}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
          </div>
        </div>

        {/* 계약 및 비용 정보 섹션 */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">계약 및 비용 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="deposit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                보증금 (만원)
              </label>
              <input
                type="number"
                name="deposit"
                id="deposit"
                value={formData.deposit || 0}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label htmlFor="monthlyRent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                월세 (만원)
              </label>
              <input
                type="number"
                name="monthlyRent"
                id="monthlyRent"
                value={formData.monthlyRent || 0}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label htmlFor="keyMoney" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                권리금 (만원)
              </label>
              <input
                type="number"
                name="keyMoney"
                id="keyMoney"
                value={formData.keyMoney || 0}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* 매출 및 수익 정보 섹션 */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">매출 및 수익 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="monthlyRevenue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                월 평균 매출 (만원)
              </label>
              <input
                type="number"
                name="monthlyRevenue"
                id="monthlyRevenue"
                value={formData.monthlyRevenue || 0}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label htmlFor="materialCost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                월 평균 재료비 (만원)
              </label>
              <input
                type="number"
                name="materialCost"
                id="materialCost"
                value={formData.materialCost || 0}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label htmlFor="personnelCost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                월 평균 인건비 (만원)
              </label>
              <input
                type="number"
                name="personnelCost"
                id="personnelCost"
                value={formData.personnelCost || 0}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label htmlFor="utilityCost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                월 평균 공과금 (만원)
              </label>
              <input
                type="number"
                name="utilityCost"
                id="utilityCost"
                value={formData.utilityCost || 0}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label htmlFor="otherCost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                월 평균 기타비용 (만원)
              </label>
              <input
                type="number"
                name="otherCost"
                id="otherCost"
                value={formData.otherCost || 0}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label htmlFor="deliveryPercent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* 실수익 표시 (자동 계산) */}
            <div className="lg:col-span-3 mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-700 dark:text-gray-300">예상 월 실수익</span>
                <span className={`text-2xl font-bold ${(formData.netProfit || 0) >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatNumber(formData.netProfit || 0)}만원
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                * 실수익 = 매출 - (재료비 + 인건비 + 공과금 + 기타비용 + 월세)
              </p>
            </div>
          </div>
        </div>

        {/* 매물 특성 섹션 */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">매물 특성</h2>
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">매물 특성</h2>
  
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {/* 풀오토 매장 */}
    <label className="group cursor-pointer">
      <div className={`
        relative p-4 rounded-xl border-2 transition-all duration-200 
        ${formData.isAutomated 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-700/50'
        }
      `}>
        <div className="flex flex-col items-center space-y-2">
          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center
            ${formData.isAutomated 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
            }
          `}>
            🤖
          </div>
          <span className={`
            text-sm font-medium text-center
            ${formData.isAutomated 
              ? 'text-blue-700 dark:text-blue-300' 
              : 'text-gray-700 dark:text-gray-300'
            }
          `}>
            풀오토 매장
          </span>
        </div>
        <input
          type="checkbox"
          name="isAutomated"
          checked={formData.isAutomated || false}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {formData.isAutomated && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </label>

    {/* 주차 가능 */}
    <label className="group cursor-pointer">
      <div className={`
        relative p-4 rounded-xl border-2 transition-all duration-200 
        ${formData.hasParking 
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-700/50'
        }
      `}>
        <div className="flex flex-col items-center space-y-2">
          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center
            ${formData.hasParking 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
            }
          `}>
            🚗
          </div>
          <span className={`
            text-sm font-medium text-center
            ${formData.hasParking 
              ? 'text-green-700 dark:text-green-300' 
              : 'text-gray-700 dark:text-gray-300'
            }
          `}>
            주차 가능
          </span>
        </div>
        <input
          type="checkbox"
          name="hasParking"
          checked={formData.hasParking || false}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {formData.hasParking && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </label>

    {/* 여성 추천 */}
    <label className="group cursor-pointer">
      <div className={`
        relative p-4 rounded-xl border-2 transition-all duration-200 
        ${formData.isWomanFriendly 
          ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20' 
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-700/50'
        }
      `}>
        <div className="flex flex-col items-center space-y-2">
          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center
            ${formData.isWomanFriendly 
              ? 'bg-pink-500 text-white' 
              : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
            }
          `}>
            👩
          </div>
          <span className={`
            text-sm font-medium text-center
            ${formData.isWomanFriendly 
              ? 'text-pink-700 dark:text-pink-300' 
              : 'text-gray-700 dark:text-gray-300'
            }
          `}>
            여성 추천
          </span>
        </div>
        <input
          type="checkbox"
          name="isWomanFriendly"
          checked={formData.isWomanFriendly || false}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {formData.isWomanFriendly && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </label>

    {/* 1층 매물 */}
    <label className="group cursor-pointer">
      <div className={`
        relative p-4 rounded-xl border-2 transition-all duration-200 
        ${formData.isFirstFloor 
          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-700/50'
        }
      `}>
        <div className="flex flex-col items-center space-y-2">
          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center
            ${formData.isFirstFloor 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
            }
          `}>
            🏢
          </div>
          <span className={`
            text-sm font-medium text-center
            ${formData.isFirstFloor 
              ? 'text-orange-700 dark:text-orange-300' 
              : 'text-gray-700 dark:text-gray-300'
            }
          `}>
            1층 매물
          </span>
        </div>
        <input
          type="checkbox"
          name="isFirstFloor"
          checked={formData.isFirstFloor || false}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {formData.isFirstFloor && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </label>

    {/* 역세권 */}
    <label className="group cursor-pointer">
      <div className={`
        relative p-4 rounded-xl border-2 transition-all duration-200 
        ${formData.isNearStation 
          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-700/50'
        }
      `}>
        <div className="flex flex-col items-center space-y-2">
          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center
            ${formData.isNearStation 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
            }
          `}>
            🚊
          </div>
          <span className={`
            text-sm font-medium text-center
            ${formData.isNearStation 
              ? 'text-purple-700 dark:text-purple-300' 
              : 'text-gray-700 dark:text-gray-300'
            }
          `}>
            역세권
          </span>
        </div>
        <input
          type="checkbox"
          name="isNearStation"
          checked={formData.isNearStation || false}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {formData.isNearStation && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </label>

    {/* 초보 추천 */}
    <label className="group cursor-pointer">
      <div className={`
        relative p-4 rounded-xl border-2 transition-all duration-200 
        ${formData.isBeginnerFriendly 
          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-700/50'
        }
      `}>
        <div className="flex flex-col items-center space-y-2">
          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center
            ${formData.isBeginnerFriendly 
              ? 'bg-emerald-500 text-white' 
              : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
            }
          `}>
            🌱
          </div>
          <span className={`
            text-sm font-medium text-center
            ${formData.isBeginnerFriendly 
              ? 'text-emerald-700 dark:text-emerald-300' 
              : 'text-gray-700 dark:text-gray-300'
            }
          `}>
            초보 추천
          </span>
        </div>
        <input
          type="checkbox"
          name="isBeginnerFriendly"
          checked={formData.isBeginnerFriendly || false}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {formData.isBeginnerFriendly && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </label>
  </div>
</div>
        </div>

        {/* 이미지 업로드 섹션 */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">대표 이미지</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                대표 이미지 변경
              </label>
              <input
                type="file"
                name="coverImage"
                id="coverImage"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/20 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/40"
              />
            </div>

            {/* 이미지 미리보기 */}
            {(previewUrl || listing.coverImage) && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">현재 이미지</p>
                <img
                  src={previewUrl || listing.coverImage}
                  alt="대표 이미지"
                  className="w-full max-w-md h-64 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* 제출 버튼 */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                저장 중...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                변경사항 저장
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}