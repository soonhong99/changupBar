"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, ArrowRight } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ConsultationForm from '@/components/forms/ConsultationForm';
import { ListingWithCounts } from '@/lib/api';

interface Props {
  listing: ListingWithCounts;
}

export default function ListingDetailCTA({ listing }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // 1. 현재 매물 정보로 자동완성될 초기 데이터를 준비합니다.
  const initialDataForForm = {
    desiredLocation: `${listing.sido || ''} ${listing.sigungu || ''}`.trim(),
    desiredCategory: listing.subCategory || '',
    investmentAmount: listing.keyMoney, // '원' 단위를 '만원' 단위로 변환
  };

  return (
    <>
      {/* 기존 CTA 버튼 UI */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 sticky top-32">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          해당 매물에 대한 확신이 드셨나요?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          궁금하신 모든 내용을 빠짐없이 알려드리겠습니다.
        </p>
        {/* 2. 버튼을 누르면 모달이 열리도록 onClick 이벤트를 수정/추가합니다. */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 group shadow-lg"
        >
          <Phone className="w-5 h-5" />
          온라인 상담 신청
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
         <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
            전화 문의: 010-****-****
          </p>
      </div>

      {/* 모달 컴포넌트 */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="매물 상담 신청"
      >
        {/* 3. ConsultationForm에 준비된 초기 데이터를 전달합니다. */}
        <ConsultationForm 
          initialData={initialDataForForm}
          onSuccess={() => {
            setIsModalOpen(false);
            router.push('/');
          }} 
        />
      </Modal>
    </>
  );
}