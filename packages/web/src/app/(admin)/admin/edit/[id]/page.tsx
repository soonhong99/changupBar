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
  CheckCircle
} from 'lucide-react';

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

  useEffect(() => {
    if (id) {
      getListingById(id)
        .then(data => {
          if (data) {
            setListing(data);
  
            const formattedData = {
              ...data,
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
      setError(err instanceof Error ? err.message : '알 수 없는 오류 발생');
    } finally {
      setIsUploading(false);
    }
  };

  // 금액 포맷팅 함수
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value);
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

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽 컬럼 - 기본 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 기본 정보 섹션 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-6">
                <Info className="h-5 w-5 text-indigo-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">기본 정보</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      매물 이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      업종
                    </label>
                    <select
                      name="category"
                      value={formData.category || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="CAFE_BAKERY">카페/베이커리</option>
                      <option value="RESTAURANT_BAR">주점/식당</option>
                      <option value="RETAIL_ETC">판매점/기타</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    한 줄 요약 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="summary"
                    value={formData.summary || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="매물의 핵심 특징을 간단히 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    주소 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    상세 설명 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    rows={20}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="매물에 대한 자세한 설명을 입력하세요"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 계약 정보 섹션 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-6">
                <DollarSign className="h-5 w-5 text-indigo-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">계약 및 비용 정보</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    보증금
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="deposit"
                      value={formData.deposit || 0}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <span className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400">만원</span>
                  </div>
                  {formData.deposit ? (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {formatCurrency(formData.deposit)}만원
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    월세
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="monthlyRent"
                      value={formData.monthlyRent || 0}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <span className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400">만원</span>
                  </div>
                  {formData.monthlyRent ? (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {formatCurrency(formData.monthlyRent)}만원
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    권리금
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="keyMoney"
                      value={formData.keyMoney || 0}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <span className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400">만원</span>
                  </div>
                  {formData.keyMoney ? (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {formatCurrency(formData.keyMoney)}만원
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            {/* 특성 정보 섹션 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">특성 정보</h2>
              
              <div className="space-y-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isAutomated"
                    checked={formData.isAutomated || false}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div className="ml-3">
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">풀오토</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">완전 자동화 시스템</p>
                  </div>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="hasParking"
                    checked={formData.hasParking || false}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div className="ml-3">
                    <div className="flex items-center">
                      <Car className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">주차 가능</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">전용 주차공간 제공</p>
                  </div>
                </label>
              </div>
            </div>

            {/* 대표 매물 설정 */}
            <FeaturedPropertySettings 
              formData={formData}
              onFormDataChange={handleFeaturedSettingsChange}
            />
          </div>

          {/* 오른쪽 컬럼 - 이미지 및 액션 */}
          <div className="space-y-6">
            {/* 이미지 섹션 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-4">
                <Image className="h-5 w-5 text-indigo-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">대표 이미지</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">현재 이미지</p>
                  <img
                    src={previewUrl || listing.coverImage}
                    alt="대표 이미지"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                </div>

                <div>
                  <label className="block">
                    <span className="sr-only">파일 선택</span>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 dark:text-gray-400
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-lg file:border-0
                          file:text-sm file:font-semibold
                          file:bg-indigo-50 file:text-indigo-700
                          hover:file:bg-indigo-100
                          dark:file:bg-indigo-900 dark:file:text-indigo-200
                          dark:hover:file:bg-indigo-800
                          cursor-pointer"
                      />
                    </div>
                  </label>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    JPG, PNG, GIF 최대 10MB
                  </p>
                  {newCoverImageFile && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                      ✓ 새 이미지가 선택되었습니다
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      저장 중...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      변경사항 저장
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                >
                  취소
                </button>
              </div>
            </div>

            {/* 정보 카드 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p className="font-medium mb-1">도움말</p>
                  <ul className="space-y-1 text-xs">
                    <li>• 모든 변경사항은 즉시 반영됩니다</li>
                    <li>• 이미지는 16:9 비율을 권장합니다</li>
                    <li>• 금액은 만원 단위로 입력하세요</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}