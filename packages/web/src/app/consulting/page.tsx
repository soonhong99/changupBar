// packages/web/src/app/consulting/page.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function ConsultingPage() {
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const phoneNumber = "010-2536-1178"; // 실제 전화번호로 변경해주세요

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              창업 컨설팅 전문가
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              10년 경력의 창업 성공 파트너와 함께하세요
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="text-lg font-semibold">✨ 창업 만족도 1위</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="text-lg font-semibold">🔄 창업 재문의 1위</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="text-lg font-semibold">📈 10년 창업 컨설팅</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 대표 소개 섹션 */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 이미지 영역 */}
            <div className="relative">
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-6">
                    <Image
                      src="/images/team/park-soojin.jpg"
                      alt="박수진 대표"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      박수진 대표
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                      창업 컨설팅 전문가
                    </p>
                    <div className="flex justify-center gap-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        경력 10년
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        전문 컨설턴트
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 소개 내용 */}
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  믿을 수 있는 창업 파트너
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  안녕하세요, 하이브창업 박수진 대표입니다. 지난 10년간 수많은 창업자분들과 함께 
                  성공적인 창업의 길을 걸어왔습니다. 단순한 컨설팅을 넘어, 여러분의 꿈이 현실이 
                  될 수 있도록 진심을 다해 돕겠습니다.
                </p>
              </div>

              {/* 주요 성과 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    500+
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    성공 창업 사례
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    98%
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    고객 만족도
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                    #1
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    재문의율
                  </p>
                </div>
              </div>

              {/* 연락처 섹션 */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <h4 className="text-2xl font-bold mb-4">무료 상담 신청하기</h4>
                <p className="text-blue-100 mb-6">
                  창업에 대한 모든 고민, 부담없이 상담해보세요
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setShowPhoneNumber(!showPhoneNumber)}
                    className="flex-1 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    {showPhoneNumber ? (
                      <a href={`tel:${phoneNumber}`} className="flex items-center justify-center gap-2">
                        📞 {phoneNumber}
                      </a>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        📞 전화번호 보기
                      </span>
                    )}
                  </button>
                  <Link
                    href="/contact"
                    className="flex-1 bg-purple-700 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-purple-800 transition-all duration-200 transform hover:scale-105 shadow-lg text-center"
                  >
                    💬 온라인 문의하기
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 전문 분야 섹션 */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              전문 컨설팅 분야
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              다양한 업종의 창업을 성공으로 이끌어드립니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "☕",
                title: "카페 창업",
                description: "트렌디한 카페 창업부터 프랜차이즈까지",
                features: ["상권 분석", "메뉴 개발", "인테리어 컨설팅"]
              },
              {
                icon: "🍔",
                title: "외식업 창업",
                description: "맛집 창업의 모든 것을 함께합니다",
                features: ["레시피 개발", "주방 설계", "마케팅 전략"]
              },
              {
                icon: "🛍️",
                title: "리테일 창업",
                description: "온/오프라인 매장 운영 노하우",
                features: ["상품 소싱", "재고 관리", "고객 관리"]
              },
              {
                icon: "💇‍♀️",
                title: "뷰티 창업",
                description: "미용실, 네일샵 등 뷰티 사업",
                features: ["입지 선정", "직원 교육", "서비스 개발"]
              },
              {
                icon: "📚",
                title: "교육 창업",
                description: "학원, 교습소 창업 전문",
                features: ["커리큘럼 개발", "강사 채용", "학생 모집"]
              },
              {
                icon: "🏢",
                title: "기타 창업",
                description: "모든 분야의 창업을 도와드립니다",
                features: ["사업 계획", "자금 조달", "운영 관리"]
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {item.description}
                </p>
                <ul className="space-y-2">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            지금 바로 창업의 첫걸음을 시작하세요
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            박수진 대표와 함께라면 성공적인 창업이 가능합니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = `tel:${phoneNumber}`}
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-xl"
            >
              📞 지금 전화 상담하기
            </button>
            <Link
              href="/register"
              className="bg-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-800 transition-all duration-200 transform hover:scale-105 shadow-xl text-center"
            >
              ✨ 무료 회원가입하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}