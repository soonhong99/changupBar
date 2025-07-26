import Link from 'next/link';
import { ArrowLeft, FileText, Shield, User, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  const companyName = "스마트창업";
  const effectiveDate = "2025년 7월 26일";

  const sections = [
    {
      id: "purpose",
      title: "제1조 (목적)",
      icon: <FileText className="w-5 h-5" />,
      content: `본 약관은 ${companyName}(이하 "회사")이 제공하는 창업정보 서비스 및 관련 서비스의 이용조건 및 절차, 회사와 회원간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.`
    },
    {
      id: "definitions",
      title: "제2조 (정의)",
      icon: <User className="w-5 h-5" />,
      content: `
        1. "서비스"란 회사가 제공하는 창업정보, 상가정보, 컨설팅 등 모든 서비스를 의미합니다.
        2. "회원"이란 회사의 서비스에 접속하여 본 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.
        3. "창업상품"이란 회사가 중개하는 점포, 사업체 양도양수 정보를 의미합니다.
      `
    },
    {
      id: "agreement",
      title: "제3조 (약관의 효력 및 변경)",
      icon: <Shield className="w-5 h-5" />,
      content: `
        1. 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력을 발생합니다.
        2. 회사는 합리적인 사유가 발생할 경우 관련 법령에 위배되지 않는 범위에서 본 약관을 개정할 수 있습니다.
        3. 약관이 변경되는 경우 변경사유 및 적용일자를 명시하여 현행약관과 함께 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.
      `
    },
    {
      id: "service",
      title: "제4조 (서비스의 제공 및 변경)",
      icon: <FileText className="w-5 h-5" />,
      content: `
        1. 회사는 다음과 같은 업무를 수행합니다:
           • 창업 관련 정보 제공
           • 상가 및 점포 양도양수 중개
           • 창업 컨설팅 서비스
           • 기타 창업 관련 부대서비스
        2. 회사는 상당한 이유가 있는 경우 운영상, 기술상의 필요에 따라 제공하고 있는 전부 또는 일부 서비스를 변경할 수 있습니다.
      `
    },
    {
      id: "responsibility",
      title: "제5조 (회원의 의무)",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: `
        1. 회원은 다음 행위를 하여서는 안됩니다:
           • 신청 또는 변경 시 허위내용의 등록
           • 타인의 정보도용
           • 회사가 게시한 정보의 변경
           • 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시
           • 회사 기타 제3자의 저작권 등 지적재산권에 대한 침해
           • 회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위
           • 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 회사에 공개 또는 게시하는 행위
      `
    },
    {
      id: "disclaimer",
      title: "제6조 (면책조항)",
      icon: <Shield className="w-5 h-5" />,
      content: `
        1. 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
        2. 회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.
        3. 회사는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 그 밖의 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.
        4. 회사가 제공하는 창업상품 정보는 양도인이 제공한 정보를 바탕으로 하며, 실제 현장 확인 후 차이가 있을 수 있음을 알려드립니다.
      `
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* 헤더 */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              홈으로 돌아가기
            </Link>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">이용약관</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {companyName} 서비스 이용약관 • 시행일: {effectiveDate}
            </p>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 목차 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">목차</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                {section.icon}
                <span className="text-sm">{section.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* 약관 내용 */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {section.icon}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* 연락처 정보 */}
        <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">문의사항</h2>
          <p className="text-gray-600 dark:text-gray-400">
            본 약관에 대한 문의사항이 있으시면 언제든지 연락 주시기 바랍니다.
          </p>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p>회사명: {companyName}</p>
            <p>시행일: {effectiveDate}</p>
            <p>최종 수정일: {new Date().toLocaleDateString('ko-KR')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}