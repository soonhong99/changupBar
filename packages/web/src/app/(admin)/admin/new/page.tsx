// packages/web/src/app/(admin)/admin/new/page.tsx
"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createListing, getPresignedUrl } from '@/lib/api'; // getPresignedUrl 추가
import { useAuth } from '@/context/AuthContext';
import { CreateListingInput } from '@shared/schemas/listing.schema';

// initialFormData에서 coverImage 필드를 제거합니다.
const initialFormData: Omit<CreateListingInput, 'bestUntil' | 'coverImage'> = {
  name: '', summary: '', address: '', region: 'METROPOLITAN', category: 'CAFE_BAKERY',
  deposit: 0, monthlyRent: 0, keyMoney: 0, monthlyRevenue: 0, materialCost: 0, personnelCost: 0, netProfit: 0,
  isAutomated: false, hasParking: false, isFirstFloor: false, isNearStation: false,
  description: '', imageUrls: [], status: 'DRAFT', isBest: false,
};

export default function NewListingPage() {
  const [formData, setFormData] = useState(initialFormData);
  // --- 추가된 state ---
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  // -------------------
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { token, isLoading: isAuthLoading } = useAuth(); // token을 가져옵니다.

  // --- 파일 변경을 감지하는 핸들러 추가 ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImageFile(e.target.files[0]);
    }
  };
  // ------------------------------------

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

  // --- handleSubmit 로직 전체 수정 ---
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
      // 1. 백엔드에 Pre-signed URL 요청
      const { uploadUrl, publicUrl } = await getPresignedUrl({
        filename: coverImageFile.name,
        filetype: coverImageFile.type,
      }, token);

      // 2. 받은 URL로 S3에 파일 직접 업로드
      await fetch(uploadUrl, {
        method: 'PUT',
        body: coverImageFile,
        headers: {
          'Content-Type': coverImageFile.type,
        },
      });

      // 3. 모든 정보 취합하여 최종 매물 생성 API 호출
      await createListing({ 
        ...formData, 
        coverImage: publicUrl, // S3에 업로드된 최종 URL 사용f
        imageUrls: [], // 상세 이미지는 나중에 추가
      },
      token
    );
      
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류 발생');
    } finally {
      setIsUploading(false);
    }
  };
  // ------------------------------------

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">새 매물 등록</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <div className="p-4 border rounded-md">
          <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">매물 이름</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="summary" className="block text-sm font-medium">한 줄 요약</label>
              <input type="text" name="summary" id="summary" value={formData.summary} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
            </div>
             <div>
              <label htmlFor="address" className="block text-sm font-medium">주소</label>
              <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
            </div>
             <div>
              <label htmlFor="description" className="block text-sm font-medium">상세 설명</label>
              <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
            </div>
             {/* --- 대표 이미지 입력 필드 수정 --- */}
             <div>
              <label htmlFor="coverImage" className="block text-sm font-medium">대표 이미지</label>
              <input type="file" name="coverImage" id="coverImage" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
            </div>
            {/* ------------------------------- */}
          </div>
        </div>

        {/* 계약 및 비용 정보 */}
        <div className="p-4 border rounded-md">
           <h2 className="text-lg font-semibold mb-4">계약 및 비용 정보 (숫자만 입력)</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label htmlFor="deposit" className="block text-sm font-medium">보증금</label>
                <input type="number" name="deposit" id="deposit" value={formData.deposit} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="monthlyRent" className="block text-sm font-medium">월세</label>
                <input type="number" name="monthlyRent" id="monthlyRent" value={formData.monthlyRent} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="keyMoney" className="block text-sm font-medium">권리금</label>
                <input type="number" name="keyMoney" id="keyMoney" value={formData.keyMoney} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
              {/* 여기에 다른 비용 필드들도 동일하게 추가할 수 있습니다. */}
           </div>
        </div>
        
        {error && <p className="text-red-500">{error}</p>}
        
        <div className="flex justify-end">
          {/* --- 전송 버튼 수정 --- */}
          <button type="submit" disabled={isUploading || isAuthLoading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
            {isAuthLoading ? '인증 확인 중...' : isUploading ? '저장 중...' : '매물 저장'}
          </button>
          {/* -------------------- */}
        </div>
      </form>
    </div>
  );
}