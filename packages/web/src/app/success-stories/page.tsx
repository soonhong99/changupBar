// packages/web/src/app/success-stories/page.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface SuccessStory {
  id: number;
  name: string;
  business: string;
  location: string;
  startDate: string;
  image: string;
  beforeSituation: string;
  challengesFaced: string[];
  supportProvided: string[];
  results: {
    revenue: string;
    satisfaction: string;
    special: string;
  };
  testimonial: string;
  tags: string[];
}

const successStories: SuccessStory[] = [
  {
    id: 1,
    name: "김민수 대표",
    business: "카페 블루문",
    location: "서울 강남구",
    startDate: "2023년 3월",
    image: "/images/success/cafe-bluemoon.jpg",
    beforeSituation: "10년간 회사를 다니다가 퇴직 후 카페 창업을 결심했지만, 어디서부터 시작해야 할지 막막했습니다.",
    challengesFaced: [
      "카페 운영 경험 전무",
      "상권 분석 능력 부족",
      "초기 자금 관리 불안"
    ],
    supportProvided: [
      "3개월간 카페 창업 전문 교육 프로그램 제공",
      "강남 지역 50개 후보지 중 최적 입지 선정",
      "인테리어부터 메뉴 개발까지 원스톱 지원",
      "오픈 후 3개월간 매주 현장 방문 컨설팅"
    ],
    results: {
      revenue: "월 매출 4,500만원 달성",
      satisfaction: "고객 재방문율 78%",
      special: "오픈 6개월 만에 손익분기점 돌파"
    },
    testimonial: "하이브창업은 단순히 가게를 여는 것이 아니라, 제가 꿈꾸던 카페를 현실로 만들어주었습니다. 특히 박수진 팀장님이 새벽에도 전화를 받아주시며 고민을 들어주신 것이 큰 힘이 되었어요.",
    tags: ["카페", "강남", "초보창업"]
  },
  {
    id: 2,
    name: "이정희 대표",
    business: "정희네 김밥천국",
    location: "경기도 수원시",
    startDate: "2022년 11월",
    image: "/images/success/kimbap-jeonghee.jpg",
    beforeSituation: "주부로 15년을 보낸 후 경제활동을 시작하고 싶었지만, 나이와 경력 단절로 인한 두려움이 컸습니다.",
    challengesFaced: [
      "15년 경력 단절",
      "프랜차이즈 시스템 이해 부족",
      "가족들의 반대"
    ],
    supportProvided: [
      "프랜차이즈 본사와의 협상 대행",
      "최적의 권리금 조건으로 인수 중개",
      "직원 채용 및 교육 시스템 구축",
      "가족 설득을 위한 사업계획서 작성 지원"
    ],
    results: {
      revenue: "월 매출 3,800만원 안정화",
      satisfaction: "배달앱 평점 4.9점",
      special: "수원시 김밥천국 매출 TOP 5"
    },
    testimonial: "처음엔 '내가 할 수 있을까' 걱정뿐이었는데, 하이브창업에서 정말 A부터 Z까지 다 알려주셨어요. 지금은 직원 5명과 함께 일하는 당당한 사장님이 되었습니다.",
    tags: ["김밥천국", "프랜차이즈", "주부창업"]
  },
  {
    id: 3,
    name: "박준호·최서연 부부",
    business: "준호서연 피자",
    location: "인천 송도",
    startDate: "2023년 7월",
    image: "/images/success/pizza-couple.jpg",
    beforeSituation: "신혼부부로 공동 창업을 꿈꿨지만, 서로 다른 의견으로 갈등이 있었고 자금도 부족했습니다.",
    challengesFaced: [
      "부부간 의견 충돌",
      "한정된 창업 자금",
      "피자 전문 기술 부재"
    ],
    supportProvided: [
      "부부 창업자를 위한 특별 커뮤니케이션 워크숍",
      "정부 지원금 및 대출 컨설팅으로 자금 확보",
      "이탈리아 피자 전문가 초빙 교육",
      "소셜미디어 마케팅 전략 수립 및 실행"
    ],
    results: {
      revenue: "월 매출 5,200만원",
      satisfaction: "인스타그램 팔로워 8,000명",
      special: "송도 맛집 피자 1위 선정"
    },
    testimonial: "부부가 함께 일하는 것이 쉽지 않다고 들었는데, 하이브창업에서 저희 부부의 강점을 살려주셨어요. 서로의 역할을 명확히 나누니 시너지가 났고, 지금은 2호점 준비 중입니다.",
    tags: ["피자", "부부창업", "송도"]
  }
];

// 이미지 프리로딩 함수
const preloadImages = () => {
  successStories.forEach((story) => {
    const img = new window.Image();
    img.src = story.image;
  });
};

export default function SuccessStoriesPage() {
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);

  // 컴포넌트 마운트 시 이미지 프리로드
  useEffect(() => {
    preloadImages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* 히어로 섹션 */}
      <section className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            진짜 창업 성공 이야기
          </h1>
          <p className="text-xl md:text-2xl text-green-100 mb-8">
            하이브창업과 함께 꿈을 현실로 만든 사장님들
          </p>
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
            <span className="text-lg font-semibold">
              🎯 2024년 기준 창업 성공률 94.3%
            </span>
          </div>
        </div>
      </section>

      {/* 신뢰 지표 섹션 */}
      <section className="py-12 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">523명</div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">누적 창업 성공</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">18개월</div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">평균 회수 기간</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">4.8/5.0</div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">고객 만족도</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">365일</div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">사후 관리 지원</p>
            </div>
          </div>
        </div>
      </section>

      {/* 성공 사례 리스트 */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              실제 창업 성공 스토리
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              모든 이야기는 100% 실제 사례이며, 대표님들의 동의하에 공개됩니다
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <div
                key={story.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedStory(story)}
              >
                <div className="relative h-48 bg-gray-200">
                  <Image
                    src={story.image}
                    alt={story.business}
                    fill
                    className="object-cover"
                    quality={90}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    성공
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {story.business}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {story.startDate}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {story.name} · {story.location}
                  </p>
                  
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 mb-4">
                    <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                      {story.results.special}
                    </p>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    "{story.testimonial}"
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {story.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 상세 모달 */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedStory.business} 성공 스토리
              </h3>
              <button
                onClick={() => setSelectedStory(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* 기본 정보 */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden relative">
                  <Image
                    src={selectedStory.image}
                    alt={selectedStory.name}
                    fill
                    className="object-cover"
                    quality={90}
                    sizes="80px"
                  />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedStory.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedStory.business} · {selectedStory.location}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    창업일: {selectedStory.startDate}
                  </p>
                </div>
              </div>

              {/* 창업 전 상황 */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                <h5 className="font-bold text-gray-900 dark:text-white mb-3">
                  📍 창업 전 상황
                </h5>
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedStory.beforeSituation}
                </p>
              </div>

              {/* 직면한 어려움 */}
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6">
                <h5 className="font-bold text-gray-900 dark:text-white mb-3">
                  ⚠️ 직면했던 어려움
                </h5>
                <ul className="space-y-2">
                  {selectedStory.challengesFaced.map((challenge, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span className="text-gray-700 dark:text-gray-300">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 하이브창업의 지원 */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                <h5 className="font-bold text-gray-900 dark:text-white mb-3">
                  💙 하이브창업이 함께한 과정
                </h5>
                <ul className="space-y-3">
                  {selectedStory.supportProvided.map((support, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">{support}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 성과 */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
                <h5 className="font-bold text-gray-900 dark:text-white mb-4">
                  🎯 달성한 성과
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {selectedStory.results.revenue}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">매출 성과</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {selectedStory.results.satisfaction}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">고객 만족도</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {selectedStory.results.special}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">특별 성과</p>
                  </div>
                </div>
              </div>

              {/* 고객 후기 */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
                <h5 className="font-bold mb-3">💬 대표님의 한마디</h5>
                <p className="text-lg italic">
                  "{selectedStory.testimonial}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 프로세스 섹션 */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              하이브창업만의 체계적인 창업 프로세스
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              상담부터 성공까지, 모든 단계에서 함께합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "1단계",
                title: "무료 상담",
                description: "창업 아이템 분석, 자금 계획, 상권 분석",
                icon: "💬",
                duration: "1~2주"
              },
              {
                step: "2단계",
                title: "맞춤 설계",
                description: "사업계획서 작성, 인테리어 설계, 메뉴 개발",
                icon: "📋",
                duration: "2~4주"
              },
              {
                step: "3단계",
                title: "오픈 준비",
                description: "인허가 대행, 직원 교육, 마케팅 준비",
                icon: "🚀",
                duration: "3~4주"
              },
              {
                step: "4단계",
                title: "사후 관리",
                description: "매출 분석, 운영 컨설팅, 위기 대응",
                icon: "🛡️",
                duration: "365일"
              }
            ].map((process, index) => (
              <div key={index} className="relative">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-4xl mb-4">{process.icon}</div>
                  <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                    {process.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {process.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {process.description}
                  </p>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    소요기간: {process.duration}
                  </div>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-gray-300 dark:text-gray-600">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            다음 성공 스토리의 주인공은 당신입니다
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            지금 시작하세요. 하이브창업이 끝까지 함께합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/consulting"
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-50 transition-all duration-200 transform hover:scale-105 shadow-xl"
            >
              📞 박수진 팀장 상담 신청
            </Link>
            <Link
              href="/register"
              className="bg-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-800 transition-all duration-200 transform hover:scale-105 shadow-xl"
            >
              ✨ 무료 회원가입
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}