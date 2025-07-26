// packages/web/src/components/layout/Footer.tsx

import Link from 'next/link';

export default function Footer() {
  const companyName = "스마트창업";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* 중요 안내사항 - 접을 수 있는 형태 */}
        <details className="mb-6">
          <summary className="cursor-pointer font-semibold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
            ※ 중요 안내사항 (클릭하여 펼치기)
          </summary>
          <div className="mt-3 pl-4 border-l-2 border-gray-300 dark:border-gray-600">
            <ul className="space-y-1 text-xs leading-relaxed">
              <li>• 저희 {companyName} 사이트의 창업상품들은 실제 존재하는 것들을 기준으로 작성되었습니다.</li>
              <li>• 양도인의 보안 유지 요청으로 정확한 위치와 세부 정보는 비공개로 처리됩니다.</li>
              <li>• 정확한 정보 확인 및 현장답사를 원하시면 언제든 연락 주시기 바랍니다.</li>
            </ul>
          </div>
        </details>

        {/* 하단 정보 */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs">
          <p className="text-gray-500 dark:text-gray-400">
            Copyright ⓒ {currentYear} {companyName} All Rights Reserved.
          </p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <Link 
              href="/privacy" 
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              개인정보처리방침
            </Link>
            <Link 
              href="/terms" 
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}