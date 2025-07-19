// packages/web/src/components/process/ProcessCTA.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, MessageSquare } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ConsultationForm from '@/components/forms/ConsultationForm';

export default function ProcessCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            이제 망설이지 마세요!
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            5,000명이 넘는 창업자가 스마트창업과 함께 성공의 길을 걸었습니다.<br />
            다음 주인공은 바로 당신입니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/search"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
            >
              지금 매물 둘러보기
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            {/* ⬇️ 이 버튼이 모달을 띄웁니다. */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg shadow-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              무료 상담 신청하기
              <MessageSquare className="w-5 h-5 ml-2" />
            </button>
          </div>
          <p className="mt-6 text-sm text-blue-100">
            ※ 상담 신청 후 24시간 이내에 전문 컨설턴트가 연락드립니다
          </p>
        </div>
      </section>

      {/* 모달 컴포넌트 */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="맞춤 매물 상담 신청"
      >
        <ConsultationForm 
          onSuccess={() => {
            setIsModalOpen(false);
            router.push('/'); // 성공 시 홈으로 이동
          }} 
        />
      </Modal>
    </>
  );
}