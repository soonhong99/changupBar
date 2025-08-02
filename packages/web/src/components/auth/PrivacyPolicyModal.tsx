// packages/web/src/components/auth/PrivacyPolicyModal.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface Props { 
  isOpen: boolean; 
  onClose: () => void; 
  onAgree: () => void; 
}

export default function PrivacyPolicyModal({ isOpen, onClose, onAgree }: Props) {
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const companyName = "스마트창업";
    const companyEmail = "changupsmart@gmail.com";
    const companyPhone = "010-****-****";
    const effectiveDate = "2025년 7월 26일";
  
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const isScrolledToEnd = scrollTop + clientHeight >= scrollHeight - 10; // 10px 여유
        setIsScrolledToBottom(isScrolledToEnd);
      }
    };
  
    useEffect(() => {
      if (isOpen) {
        setIsScrolledToBottom(false);
      }
    }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            개인정보처리방침
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        {/* 스크롤 가능한 컨텐츠 */}
        <div 
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 space-y-8"
        >
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              <strong>{companyName}</strong>(이하 '회사')은 이용자의 개인정보를 중요시하며, 
              「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 
              관련 법령을 준수하고 있습니다.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              시행일: {effectiveDate}
            </p>
            
            {/* 1. 수집하는 개인정보 항목 */}
            <section className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                1. 수집하는 개인정보 항목
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  회원가입 시
                </h4>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                  <li>필수항목: 이름, 이메일 주소, 비밀번호, 휴대전화번호</li>
                  <li>선택항목: 없음</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  상담 신청 시
                </h4>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                  <li>필수항목: 이름, 휴대전화번호, 나이, 성별, 희망업종, 투자예산</li>
                  <li>선택항목: 희망지역, 상세 요청사항</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  카카오톡 채널 이용 시
                </h4>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                  <li>필수항목: 카카오톡 닉네임, 휴대전화번호</li>
                  <li>자동수집항목: 카카오 계정 정보, 친구 추가 일시</li>
                </ul>
              </div>
            </section>
            
            {/* 2. 개인정보 수집 및 이용목적 */}
            <section className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                2. 개인정보 수집 및 이용목적
              </h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                <li>회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인 식별</li>
                <li>상담 서비스 제공: 창업 상담, 매물 추천, 맞춤형 정보 제공</li>
                <li>마케팅 및 광고: 이벤트 안내, 광고성 정보 제공, 서비스 이용 통계</li>
                <li>고지사항 전달: 서비스 변경사항, 계약 진행상황 등 안내</li>
                <li>문자 알림 서비스: 찜한 매물의 변동사항 실시간 알림</li>
              </ul>
            </section>
            
            {/* 3. 개인정보 보유 및 이용기간 */}
            <section className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                3. 개인정보 보유 및 이용기간
              </h3>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  <strong>원칙:</strong> 개인정보 수집 및 이용목적이 달성된 후에는 
                  해당 정보를 지체 없이 파기합니다.
                </p>
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다:
              </h4>
              <div className="space-y-3">
                <div className="border-l-4 border-gray-300 pl-4">
                  <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">회원 정보</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    보존 이유: 서비스 이용의 혼선 방지<br/>
                    보존 기간: 회원 탈퇴 후 1년
                  </p>
                </div>
                <div className="border-l-4 border-gray-300 pl-4">
                  <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">상담 기록</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    보존 이유: 상담 내용 확인 및 분쟁 해결<br/>
                    보존 기간: 3년
                  </p>
                </div>
                <div className="border-l-4 border-gray-300 pl-4">
                  <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">전자상거래 기록</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    보존 이유: 전자상거래 등에서의 소비자보호에 관한 법률<br/>
                    보존 기간: 5년
                  </p>
                </div>
              </div>
            </section>
            
            {/* 4. 개인정보의 제3자 제공 */}
            <section className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                4. 개인정보의 제3자 제공
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 
                다만, 다음의 경우에는 예외로 합니다:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                <li>이용자가 사전에 동의한 경우</li>
                <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
              </ul>
            </section>
            
            {/* 5. 개인정보의 파기 */}
            <section className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                5. 개인정보의 파기
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 
                지체없이 해당 개인정보를 파기합니다.
              </p>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                파기 방법
              </h4>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                <li>전자적 파일 형태: 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제</li>
                <li>종이 문서: 분쇄기로 분쇄하거나 소각</li>
              </ul>
            </section>
            
            {/* 6. 이용자의 권리와 행사방법 */}
            <section className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                6. 이용자의 권리와 행사방법
              </h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
                  이용자는 언제든지 다음과 같은 권리를 행사할 수 있습니다:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                  <li>개인정보 열람 요구</li>
                  <li>오류 등이 있을 경우 정정 요구</li>
                  <li>삭제 요구</li>
                  <li>처리정지 요구</li>
                </ul>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                권리 행사는 서면, 전화, 이메일 등을 통하여 하실 수 있으며, 
                회사는 이에 대해 지체없이 조치하겠습니다.
              </p>
            </section>
            
            {/* 7. 개인정보 보호책임자 */}
            <section className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                7. 개인정보 보호책임자
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  개인정보 보호책임자
                </h4>
                <ul className="text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                  <li><strong>성명:</strong> ***</li>
                  <li><strong>직책:</strong> 대표</li>
                  <li><strong>연락처:</strong> {companyPhone}</li>
                  <li><strong>이메일:</strong> {companyEmail}</li>
                </ul>
              </div>
            </section>
            
            {/* 8. 개인정보처리방침 변경 */}
            <section className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                8. 개인정보처리방침 변경
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                이 개인정보처리방침은 {effectiveDate}부터 적용되며, 
                법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 
                변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
              </p>
            </section>
            
            {/* 스크롤 안내 */}
            {!isScrolledToBottom && (
              <div className="sticky bottom-0 bg-gradient-to-t from-white dark:from-gray-800 via-white dark:via-gray-800 to-transparent pt-4 pb-2">
                <div className="text-center">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium animate-pulse">
                    ↓ 내용을 끝까지 읽어주세요 ↓
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 푸터 */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
            >
              취소
            </button>
            <button
              onClick={onAgree}
              disabled={!isScrolledToBottom}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                isScrolledToBottom 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {isScrolledToBottom ? '동의합니다' : '내용을 끝까지 읽어주세요'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}