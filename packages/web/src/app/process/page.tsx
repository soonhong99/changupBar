// packages/web/src/app/process/page.tsx
import { MessageSquare, Search, Handshake, FileText, Key, Award, ArrowRight, CheckCircle, Clock, Shield, Users, TrendingUp, HeartHandshake } from 'lucide-react';
import Link from 'next/link';
import ProcessCTA from '@/components/process/ProcessCTA'; // ⬅️ 새로 만든 컴포넌트 import

// 각 단계를 위한 데이터 배열
const processSteps = [
  {
    step: "01",
    title: "1:1 맞춤 상담",
    subtitle: "당신의 창업 꿈을 들어드립니다",
    description: "전문 컨설턴트가 예산, 지역, 업종 등 창업 희망 조건을 상세하게 파악하고 최적의 방향을 제시합니다.",
    icon: <MessageSquare className="w-8 h-8 text-white" />,
    details: [
      "투자 가능한 예산 범위 상담",
      "희망 지역 및 상권 파악",
      "선호 업종 및 운영 경험 체크",
      "창업 목표 및 비전 설정"
    ],
    duration: "약 1-2시간",
    tip: "💡 준비하면 좋은 것: 예산 계획, 희망 지역 리스트, 관심 업종"
  },
  {
    step: "02",
    title: "상권 분석 및 매물 추천",
    subtitle: "데이터로 검증된 S급 매물만 엄선",
    description: "빅데이터 기반의 철저한 상권 분석을 통해, 조건에 맞는 최적의 매물을 선별하여 추천드립니다.",
    icon: <Search className="w-8 h-8 text-white" />,
    details: [
      "유동인구, 매출 데이터 분석",
      "경쟁업체 현황 파악",
      "상권 성장성 예측",
      "맞춤형 매물 3-5개 선별"
    ],
    duration: "약 3-5일",
    tip: "💡 알아두세요: 모든 분석 자료는 투명하게 공개됩니다"
  },
  {
    step: "03",
    title: "현장 방문 및 권리 분석",
    subtitle: "눈으로 직접 확인하고 검증합니다",
    description: "추천 매물을 직접 방문하여 시설, 운영 상태를 확인하고, 권리금 및 계약 조건의 타당성을 검토합니다.",
    icon: <Handshake className="w-8 h-8 text-white" />,
    details: [
      "매장 시설 및 인테리어 점검",
      "실제 매출 및 수익성 검증",
      "권리금 적정성 평가",
      "임대 조건 및 특약사항 확인"
    ],
    duration: "매물당 2-3시간",
    tip: "💡 체크포인트: 주방시설, 화장실, 환기시설, 주차장 등"
  },
  {
    step: "04",
    title: "양도양수 계약 체결",
    subtitle: "투명하고 안전한 계약을 보장합니다",
    description: "양도인과 양수인 간의 권리금, 시설 집기 등 모든 조건을 조율하여 투명하고 안전한 계약을 체결합니다.",
    icon: <FileText className="w-8 h-8 text-white" />,
    details: [
      "계약 조건 최종 협상",
      "계약서 작성 및 검토",
      "특약사항 명시",
      "계약금 안전 거래"
    ],
    duration: "약 1-2일",
    tip: "💡 안심하세요: 전문 법무팀이 계약서를 검토합니다"
  },
  {
    step: "05",
    title: "소유권 이전 및 잔금 처리",
    subtitle: "복잡한 행정절차도 함께합니다",
    description: "사업자 등록, 영업 허가 등 행정 절차를 지원하며, 계약 내용에 따라 안전하게 잔금을 처리합니다.",
    icon: <Key className="w-8 h-8 text-white" />,
    details: [
      "사업자 등록 대행",
      "영업 신고/허가 지원",
      "세금계산서 발행",
      "잔금 안전 거래 진행"
    ],
    duration: "약 7-10일",
    tip: "💡 준비서류: 신분증, 도장, 통장사본, 임대차계약서"
  },
  {
    step: "06",
    title: "사후 관리 및 운영 지원",
    subtitle: "오픈 후에도 든든한 파트너가 되어드립니다",
    description: "성공적인 안착을 위해, 오픈 초기 마케팅 전략과 안정적인 매장 운영 노하우를 지속적으로 지원합니다.",
    icon: <Award className="w-8 h-8 text-white" />,
    details: [
      "오픈 마케팅 전략 수립",
      "메뉴 및 가격 컨설팅",
      "직원 교육 지원",
      "3개월 집중 관리"
    ],
    duration: "오픈 후 3개월",
    tip: "💡 특별혜택: 첫 달 마케팅 비용 일부 지원"
  }
];

// 추가 혜택 데이터
const benefits = [
  {
    icon: <Shield className="w-12 h-12 text-blue-600" />,
    title: "안전거래 보장",
    description: "계약금과 잔금은 에스크로를 통해 안전하게 거래됩니다"
  },
  {
    icon: <Users className="w-12 h-12 text-blue-600" />,
    title: "전문가 네트워크",
    description: "세무사, 노무사, 인테리어 전문가와의 연계 서비스"
  },
  {
    icon: <TrendingUp className="w-12 h-12 text-blue-600" />,
    title: "성공률 95%",
    description: "체계적인 프로세스로 검증된 높은 창업 성공률"
  },
  {
    icon: <HeartHandshake className="w-12 h-12 text-blue-600" />,
    title: "평생 파트너십",
    description: "창업 후에도 지속적인 경영 컨설팅 제공"
  }
];

export default function ProcessPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
            <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">검증된 창업 프로세스</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
            처음이어도 걱정 없는<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              스마트창업 6단계 가이드
            </span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400">
            복잡하고 어려운 가게 매매, 이제는 전문가와 함께 안전하고 똑똑하게!<br />
            상담부터 오픈 후 관리까지, 모든 과정을 함께합니다.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock className="w-5 h-5 mr-2" />
              <span>평균 소요기간: 3-4주</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Shield className="w-5 h-5 mr-2" />
              <span>수수료: 권리금의 3-5%</span>
            </div>
          </div>
        </div>
      </section>

      {/* 프로세스 타임라인 섹션 */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              한 눈에 보는 창업 과정
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              각 단계를 클릭하면 더 자세한 정보를 확인할 수 있습니다
            </p>
          </div>

          <div className="relative">
            {/* 중앙 라인 */}
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-transparent dark:from-blue-700 dark:via-purple-700"></div>

            <div className="space-y-16">
              {processSteps.map((item, index) => (
                <div key={item.step} className="relative">
                  {/* 모바일 레이아웃 */}
                  <div className="lg:hidden">
                    <div className="flex items-start space-x-4">
                      {/* 아이콘 */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-sm opacity-60"></div>
                          <div className="relative w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {item.icon}
                          </div>
                          <div className="absolute -bottom-2 -right-2 bg-white text-blue-600 dark:bg-gray-800 dark:text-blue-400 text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center border-2 border-blue-200 dark:border-blue-700">
                            {item.step}
                          </div>
                        </div>
                      </div>
                      {/* 내용 */}
                      <div className="flex-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {item.title}
                          </h3>
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">
                            {item.subtitle}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {item.description}
                          </p>
                          <div className="space-y-2 mb-4">
                            {item.details.map((detail, idx) => (
                              <div key={idx} className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">{detail}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{item.duration}</span>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                            <p className="text-sm text-blue-800 dark:text-blue-300">{item.tip}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 데스크톱 레이아웃 */}
                  <div className="hidden lg:flex items-center">
                    {/* 아이콘 및 스텝 번호 */}
                    <div className={`flex-shrink-0 w-24 flex justify-center ${index % 2 === 1 ? 'lg:order-3 lg:ml-auto' : ''}`}>
                      <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-sm opacity-60"></div>
                        <div className="relative w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {item.icon}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-white text-blue-600 dark:bg-gray-800 dark:text-blue-400 text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center border-2 border-blue-200 dark:border-blue-700">
                          {item.step}
                        </div>
                      </div>
                    </div>
                    
                    {/* 컨텐츠 박스 */}
                    <div className={`w-full lg:w-2/5 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300
                                   ${index % 2 === 1 ? 'lg:order-1 lg:text-right' : 'lg:ml-auto'}`}>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">
                        {item.subtitle}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {item.description}
                      </p>
                      <div className={`space-y-2 mb-4 ${index % 2 === 1 ? 'lg:text-right' : ''}`}>
                        {item.details.map((detail, idx) => (
                          <div key={idx} className={`flex items-start ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                            <CheckCircle className={`w-5 h-5 text-green-500 ${index % 2 === 1 ? 'ml-2' : 'mr-2'} mt-0.5 flex-shrink-0`} />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{detail}</span>
                          </div>
                        ))}
                      </div>
                      <div className={`flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3 ${index % 2 === 1 ? 'lg:justify-end' : ''}`}>
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{item.duration}</span>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <p className="text-sm text-blue-800 dark:text-blue-300">{item.tip}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 추가 혜택 섹션 */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              스마트창업만의 특별한 혜택
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              단순한 중개가 아닌, 성공 창업을 위한 토탈 솔루션
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ 섹션 */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            자주 묻는 질문
          </h2>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Q. 창업 경험이 전혀 없는데도 가능한가요?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                A. 네, 물론입니다! 스마트창업의 고객 중 70% 이상이 창업이 처음이신 분들입니다. 
                전문 컨설턴트가 처음부터 끝까지 모든 과정을 함께하며, 창업 교육부터 운영 노하우까지 전수해드립니다.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Q. 중개 수수료는 얼마인가요?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                A. 일반적으로 권리금의 3-5% 수준입니다. 단순 중개가 아닌 상권분석, 계약서 검토, 
                행정처리 대행, 사후관리까지 포함된 합리적인 비용입니다. 상담 시 정확한 견적을 안내해드립니다.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Q. 계약이 파기되면 어떻게 되나요?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                A. 에스크로 시스템을 통해 계약금이 안전하게 보호됩니다. 
                정당한 사유로 계약이 파기될 경우, 계약서에 명시된 조건에 따라 계약금이 반환됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <ProcessCTA />
    </div>
  );
}