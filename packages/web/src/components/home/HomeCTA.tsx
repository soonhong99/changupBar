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
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
        </div>

        <div className="relative text-center text-white p-10 rounded-2xl shadow-xl">
          <div className="max-w-4xl mx-auto">
            {/* ... (메인 헤드라인, 혜택 그리드는 동일) ... */}
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  스마트창업 고객 맞춤 상담
                </div>
                
                <h3 className="text-3xl font-bold mb-4">
                  꿈과 소망을 공유하고<br />
                  <span className="text-yellow-300">실질적인 발판</span>을 만들어보세요
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-3xl mb-2">📊</div>
                  <h4 className="font-semibold mb-1">성공을 위한 데이터 나침반</h4>
                  <p className="text-sm text-blue-100">뜬구름 잡는 예측이 아닌, 객관적인 데이터 제공</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-3xl mb-2">💼</div>
                  <h4 className="font-semibold mb-1">가장 현실적인 성공의 시작점</h4>
                  <p className="text-sm text-blue-100">무리한 투자가 아닌 가장 안전하고 확실한 길 안내</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-3xl mb-2">📋</div>
                  <h4 className="font-semibold mb-1">든든한 동행, 성공적인 시작</h4>
                  <p className="text-sm text-blue-100">상담부터 계약까지 모든 절차를 책임집니다</p>
                </div>
            </div>

            {/* ⬇️ CTA 버튼들 수정 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                  href="tel:010********" 
                  className="group bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-yellow-400 hover:text-gray-900 transition-all duration-300 shadow-lg flex items-center gap-3"
                >
                <svg className="w-5 h-5 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>스마트 전화 상담</span>
              </a>
              {/* 온라인 상담 신청 버튼 추가 */}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="group bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-yellow-300 transition-all duration-300 shadow-lg"
              >
                💬 온라인 상담 예약
              </button>
            </div>

            {/* ... (추가 안내 문구는 동일) ... */}
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-blue-100">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>남녀노소 누구나</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>당일 상담 가능</span>
                </div>
              </div>

                          <div className="mt-4 text-center text-xs text-blue-100/80 flex items-center justify-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>상담 문의가 많아 전화 연결이 지연될 수 있습니다. 부재중일 경우, 확인 후 바로 연락드리겠습니다.</span>
            </div>
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