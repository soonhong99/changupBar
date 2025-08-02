"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';
import ConsultationForm from '@/components/forms/ConsultationForm';

export default function HomeCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="relative overflow-hidden">
        {/* ... (기존 CTA 섹션의 배경 패턴 div는 동일) ... */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
          {/* ... */}
        </div>

        <div className="relative text-center text-white p-10 rounded-2xl shadow-xl">
          <div className="max-w-4xl mx-auto">
            {/* ... (메인 헤드라인, 혜택 그리드는 동일) ... */}

            {/* ⬇️ CTA 버튼들 수정 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="tel:01025361178" 
                className="group bg-white text-blue-600 px-8 py-4 rounded-full font-semibold ..."
              >
                {/* ... (전화 상담 버튼 내용은 동일) ... */}
              </a>
              {/* 온라인 상담 신청 버튼 추가 */}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="group bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-yellow-300 transition-all duration-300 shadow-lg"
              >
                💬 온라인 상담 신청
              </button>
            </div>

            {/* ... (추가 안내 문구는 동일) ... */}
          </div>
        </div>
      </div>

      {/* 모달 컴포넌트 */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="맞춤 매물 상담 신청"
      >
        <ConsultationForm 
          onSuccess={() => {
            setIsModalOpen(false);
            router.push('/');
          }} 
        />
      </Modal>
    </>
  );
}