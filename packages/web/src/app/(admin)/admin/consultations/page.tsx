// packages/web/src/app/(admin)/admin/consultations/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getConsultationRequests, deleteConsultationRequest, markConsultationsAsContacted } from '@/lib/api';
import { ConsultationRequest } from '@prisma/client';
import { FiUser, FiPhone, FiDollarSign, FiBriefcase, FiMapPin, FiCalendar, FiClock, FiTrash2, FiFileText, FiInbox, FiLoader } from 'react-icons/fi';

// 카드 UI를 위한 단일 컴포넌트
function ConsultationCard({ 
  request, 
  onDelete,
  formatInvestmentAmount 
}: { 
  request: ConsultationRequest;
  onDelete: (id: string) => void;
  formatInvestmentAmount: (amount: number) => string;
}) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* 카드 헤더: 신청자 정보 및 관리 버튼 */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
            <FiUser className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">{request.name || '이름없음'}</h3>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{request.phone}</p>
          </div>
        </div>
        <button
          onClick={() => onDelete(request.id)}
          className="p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          aria-label="삭제"
        >
          <FiTrash2 className="w-5 h-5" />
        </button>
      </header>
      
      {/* 카드 본문: 핵심 정보 그리드 */}
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        {/* 투자 예산 */}
        <div className="flex items-start gap-3">
          <FiDollarSign className="w-5 h-5 mt-1 text-green-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">투자 예산</p>
            <p className="font-bold text-base text-green-600 dark:text-green-400">{formatInvestmentAmount(request.investmentAmount)}</p>
          </div>
        </div>
        
        {/* 상담 희망일 */}
        <div className="flex items-start gap-3">
          <FiCalendar className="w-5 h-5 mt-1 text-orange-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">상담 희망일</p>
            {request.desiredTime ? (
              <p className="font-semibold text-base text-gray-800 dark:text-gray-100">
                {new Date(request.desiredTime).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}
                <span className="ml-2 font-medium text-orange-600 dark:text-orange-400">
                  {new Date(request.desiredTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </span>
              </p>
            ) : (
              <p className="font-semibold text-base text-gray-500 dark:text-gray-400">미지정</p>
            )}
          </div>
        </div>

        {/* 희망 업종 */}
        <div className="flex items-start gap-3">
          <FiBriefcase className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">희망 업종</p>
            <p className="font-semibold text-base text-gray-800 dark:text-gray-100">{request.desiredCategory}</p>
          </div>
        </div>

        {/* 희망 지역 */}
        <div className="flex items-start gap-3">
          <FiMapPin className="w-5 h-5 mt-1 text-purple-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">희망 지역</p>
            <p className="font-semibold text-base text-gray-800 dark:text-gray-100">{request.desiredLocation || '미지정'}</p>
          </div>
        </div>
      </div>

      {/* 상세 내용 (토글) */}
      {request.details && (
        <div className="px-5 pb-5">
            <details className="bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <summary className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300 cursor-pointer list-inside flex items-center gap-2">
                    <FiFileText/> 상세 내용 보기
                </summary>
                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{request.details}</p>
                </div>
            </details>
        </div>
      )}

      {/* 카드 푸터: 신청일 */}
      <footer className="px-5 py-3 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
        <FiClock className="w-4 h-4" />
        <span>
          신청일: {new Date(request.createdAt).toLocaleString('ko-KR')}
        </span>
      </footer>
    </article>
  )
}

export default function ConsultationsPage() {
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  const handleDelete = async (id: string) => {
    if (confirm('이 상담 내역을 정말 삭제하시겠습니까?')) {
      if (!token) return alert('로그인이 필요합니다.');
      try {
        await deleteConsultationRequest(id, token);
        setRequests(prevRequests => prevRequests.filter(req => req.id !== id));
        alert('삭제되었습니다.');
      } catch (error) {
        alert(error instanceof Error ? error.message : '삭제에 실패했습니다.');
      }
    }
  };

  const formatInvestmentAmount = (amount: number) => {
    if (amount <= 5000) return '5천만원 이하';
    if (amount <= 10000) return '1억원 이하';
    if (amount <= 20000) return '2억원 이하';
    return '2억원 이상';
  };

  const sortByDesiredTime = (requests: ConsultationRequest[]) => {
    return [...requests].sort((a, b) => {
      if (!a.desiredTime && !b.desiredTime) return 0;
      if (!a.desiredTime) return 1;
      if (!b.desiredTime) return -1;
      return new Date(a.desiredTime).getTime() - new Date(b.desiredTime).getTime();
    });
  };

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      getConsultationRequests(token)
        .then(data => {
          const sortedData = sortByDesiredTime(data);
          setRequests(sortedData);
          if (data.some(req => req.status === 'PENDING')) {
            markConsultationsAsContacted(token);
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <FiLoader className="mx-auto h-12 w-12 text-indigo-600 animate-spin" />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            맞춤 상담 신청 목록
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            총 {requests.length}건의 상담 신청이 있습니다. (상담 희망일 가까운 순)
          </p>
        </header>

        {/* Content */}
        {requests.length === 0 ? (
          <div className="text-center bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-dashed border-gray-300 dark:border-gray-700 p-12">
            <FiInbox className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              아직 상담 신청이 없습니다
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              새로운 상담 신청이 들어오면 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {requests.map((req) => (
              <ConsultationCard 
                key={req.id} 
                request={req}
                onDelete={handleDelete}
                formatInvestmentAmount={formatInvestmentAmount}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}