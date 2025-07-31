// packages/web/src/app/process/page.tsx
import { MessageSquare, Search, Handshake, FileText, Key, Award, ArrowRight, CheckCircle, Clock, Shield, Users, TrendingUp, HeartHandshake, Phone, Store, Calculator, Calendar, Building, Briefcase, DollarSign, Star, MapPin, Coffee } from 'lucide-react';
import Link from 'next/link';
import ProcessCTA from '@/components/process/ProcessCTA';
import FAQSection from '@/components/process/FAQSection'; // 분리된 클라이언트 컴포넌트

// 창업 절차 단계
const processSteps = [
  {
    step: "01",
    title: "전화 및 문자상담",
    description: "기본 상담을 통해 예산, 선호 업종, 지역 등 상담",
    icon: <Phone className="w-6 h-6" />,
    color: "from-blue-500 to-blue-600"
  },
  {
    step: "02", 
    title: "아이템 선정",
    description: "창업자의 예산, 성향, 상권분석, 매출확인 등 디테일한 상황파악",
    icon: <Search className="w-6 h-6" />,
    color: "from-purple-500 to-purple-600"
  },
  {
    step: "03",
    title: "내방상담 혹은 현장미팅",
    description: "실시간 매출인증 매출 사업체 확인 (매출자료, 유동인원, 상권파악)",
    icon: <Store className="w-6 h-6" />,
    color: "from-green-500 to-green-600"
  },
  {
    step: "04",
    title: "매장 계약",
    description: "포괄 양도양수 계약진행 및 객관적 자료확인",
    icon: <FileText className="w-6 h-6" />,
    color: "from-orange-500 to-orange-600"
  }
];

// 자금 집행 프로세스
const fundingProcess = [
  { step: "상담", description: "초기 상담 진행", percentage: "0%" },
  { step: "양도양수계약", description: "객관적 자료 확인 후 계약", percentage: "권리금 10%" },
  { step: "프랜차이즈 가맹계약", description: "본사 통보 및 계약 (2~6개월)", percentage: "가맹비" },
  { step: "중간금", description: "중간 권리금 집행", percentage: "권리금 50%" },
  { step: "오픈 전 잔금", description: "최종 잔금 정산", percentage: "권리금 40%" }
];

// 프랜차이즈별 소요 기간
const franchiseTimeline = [
  { name: "메가커피", period: "5~7개월", details: "담당 바이저미팅 2~3주 후 진행, 오픈일자 통보 및 기존 매장 하자요소는 메가본사직원이 체크 후 양도인이 올수리", icon: <Coffee className="w-5 h-5" /> },
  { name: "파리바게트", period: "3~5개월", details: "고매출 및 지역별 좋은 매장의 경우 강도있는 면접을 통해 점주 선별과정", icon: <Store className="w-5 h-5" /> },
  { name: "베스킨라빈스", period: "3~4개월", details: "SPC계열은 점주와의 디테일한 면접 진행", icon: <Store className="w-5 h-5" /> },
  { name: "기타 브랜드", period: "3개월 내외", details: "롯데리아, 투썸플레이스, 설빙 등 - 비교적 빠른 진행", icon: <Building className="w-5 h-5" /> }
];

// 성공 사례
const successCases = [
  {
    type: "은퇴 후 창업",
    title: "50대 은퇴자 A씨",
    description: "은퇴 3개월 차, 교대역 파리바게트 클럽매장 인수",
    result: "월매출 8,500만원, 안정적 수익 실현 중",
    icon: <Briefcase className="w-8 h-8" />
  },
  {
    type: "투잡 창업",
    title: "30대 직장인 B씨",
    description: "IT기업 재직 중 강남 메가커피 2개 매장 동시 운영",
    result: "자동화 시스템으로 본업 병행 가능",
    icon: <Users className="w-8 h-8" />
  },
  {
    type: "다점포 운영",
    title: "40대 자영업자 C씨",
    description: "써브웨이 운영 중 메가커피, 포케올데이 추가 창업",
    result: "브랜드 포트폴리오 다각화로 리스크 분산",
    icon: <Building className="w-8 h-8" />
  },
  {
    type: "가족 창업",
    title: "30대 부부 D씨",
    description: "1억 내외로 떡볶이 프랜차이즈 창업",
    result: "월 순수익 800만원 이상 달성",
    icon: <HeartHandshake className="w-8 h-8" />
  }
];

// FAQ 데이터
export const faqData = [
  {
    category: "창업 절차",
    questions: [
      {
        q: "창업절차는 어떻게 되나요?",
        a: "1. 전화 및 문자상담 → 2. 아이템 선정 → 3. 내방상담 혹은 현장미팅 → 4. 매장 계약의 순서로 진행됩니다. 각 단계별로 전문 컨설턴트가 함께합니다."
      },
      {
        q: "첫 상담 이후 매장 인수완료까지의 기간이 어느 정도일까요?",
        a: "각 프랜차이즈별 면접일정 교육일정에 따라 다르지만, 보통 첫 계약 후 3~4개월 정도 소요됩니다."
      }
    ]
  },
  {
    category: "자금 및 계약",
    questions: [
      {
        q: "계약 후 창업자금 집행은 어떤식으로 되나요?",
        a: "계약금 10% → 가맹비 → 중간금 50% → 잔금 40% 순으로 단계별 집행됩니다. 모든 거래는 에스크로를 통해 안전하게 진행됩니다."
      },
      {
        q: "임대차보호법이 어떤건가요?",
        a: "상가 임대차에서 약자인 임차인의 권리를 보호하는 법입니다. 월비용 인상 시 기존 금액의 5%를 초과할 수 없으며, 10년간 해당 입지에서의 사업을 보장합니다."
      }
    ]
  },
  {
    category: "창업 방식",
    questions: [
      {
        q: "신규오픈과 양도양수로 고민하는데 어떤 장단점이 있을까요?",
        a: "현재 1등 프랜차이즈는 대부분 포화 상태로, 신규 오픈은 수개월~몇년 대기가 필요합니다. 양도양수는 6개월~수년간 매출이 검증된 매장을 인수하여 리스크를 최소화할 수 있습니다."
      },
      {
        q: "프랜차이즈 창업의 장점은 무엇인가요?",
        a: "검증된 브랜드와 아이템 활용, 본사의 마케팅/지원/교육 시스템, 지속적인 신메뉴 개발 등이 장점입니다. 또한 메뉴 가치 상승으로 적정 수익 유지가 가능합니다."
      }
    ]
  },
  {
    category: "매출 검증",
    questions: [
      {
        q: "창업에 있어 수익성과 안정성이 중요한데 제공한 매출은 정확한건가요?",
        a: "국세청 부가세 과세표준증명원, POS 월별 매출자료, 매입내역, 공과금 등을 정확히 체크합니다. 허위 시 민형사상 책임을 계약서에 명시하여 신뢰성을 보장합니다."
      },
      {
        q: "운영중인 매장을 양도하고 싶은데 문의가 가능한가요?",
        a: "가능합니다. 담당자를 배정하여 안전하고 빠른 거래를 도와드립니다. 정확한 매출자료 및 경쟁력 있는 권리금 산정이 우선됩니다."
      }
    ]
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
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">매일 수많은 상담을 통한 검증된 프로세스</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
            믿고 따를 수 있는<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              스마트한 창업 가이드
            </span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400">
            평소 자주 물어오시는 내용을 정리했습니다.<br />
            궁금증 해소와 함께, 꿈을 향해 나아가는 창업의 길을 제시합니다.
          </p>
        </div>
      </section>

      {/* 창업 절차 섹션 */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              창업 절차 4단계
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              스마트창업과 함께하는 체계적인 창업 프로세스
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gray-300 dark:bg-gray-600 z-0">
                    <ArrowRight className="absolute -right-3 -top-3 w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div className="relative bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 z-10">
                  <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                    {step.icon}
                  </div>
                  <div className="text-5xl font-bold text-gray-100 dark:text-gray-800 absolute top-4 right-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 자금 집행 프로세스 */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              창업자금 집행 프로세스
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              투명하고 안전한 단계별 자금 집행
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Progress Bar */}
              <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700"></div>
              <div className="absolute top-8 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              
              <div className="relative grid grid-cols-1 md:grid-cols-5 gap-4">
                {fundingProcess.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="relative">
                      <div className="w-16 h-16 bg-white dark:bg-gray-800 border-4 border-blue-500 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{index + 1}</span>
                      </div>
                    </div>
                    <h4 className="mt-4 font-semibold text-gray-900 dark:text-white">{item.step}</h4>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{item.description}</p>
                    <p className="mt-2 text-sm font-bold text-blue-600 dark:text-blue-400">{item.percentage}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 프랜차이즈별 소요 기간 */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              프랜차이즈별 소요 기간
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              브랜드별 상세 진행 일정
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {franchiseTimeline.map((franchise, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                      {franchise.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {franchise.name}
                    </h3>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {franchise.period}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {franchise.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 성공 사례 섹션 */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              실제 창업 성공 사례
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              다양한 창업 형태별 성공 스토리
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {successCases.map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-10">
                  <Star className="w-24 h-24" />
                </div>
                <div className="relative">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                      {item.icon}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{item.type}</span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                      ✓ {item.result}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              고수익도 좋지만, 안전하고 검증된 아이템을 통해<br />
              장기적으로 꾸준한 수익이 나오는 창업을 추천드립니다.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ 섹션 - 클라이언트 컴포넌트로 분리 */}
      <FAQSection faqData={faqData} />

      {/* 추가 정보 섹션 */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">
              계약에서 오픈까지의 상세 과정
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                "1. 상담",
                "2. 양도양수 계약", 
                "3. 본사 미팅 및 인터뷰",
                "4. 본사 가맹계약",
                "5. 사업자등록증 발급",
                "6. 본사교육",
                "7. 물품 및 공과금 정산",
                "8. 오픈"
              ].map((step, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="font-medium">{step}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-lg">
              전체적인 과정을 컨설팅을 통해 안내해드립니다.
            </p>
          </div>
        </div>
      </section>

      {/* 확인 사항 체크리스트 */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              매장 인수 시 확인 사항
            </h2>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg">
            <ul className="space-y-4">
              {[
                "매출자료, 매입자료, 홀/배달 매출",
                "부가세 과세표준증명원",
                "공과금 내역서",
                "사업자등록증",
                "영업신고증",
                "최소 12개월 이상의 데이터 확보"
              ].map((item, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <ProcessCTA />
    </div>
  );
}