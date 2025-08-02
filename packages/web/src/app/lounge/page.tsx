// app/lounge/page.tsx

import Link from 'next/link';

export default function LoungePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">스마트 라운지</h1>
      <p className="mb-8">성공하는데 있어 최우선시 되는 내용만 선별하였습니다.</p>
      
      {/* 공지사항 카드 - 최우선으로 배치 */}
      <div className="mb-8">
        {/* Link에 'group' 클래스를 추가하여 내부 요소의 hover 상태를 제어합니다. */}
        <Link href="/notices" className="block group">
            <div className="px-6 py-5 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center space-x-4">
                
                {/* 1. 전문적인 아이콘 영역 */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                {/* lucide-react의 Megaphone 아이콘 사용 예시 */}
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-6 h-6 text-orange-600 dark:text-orange-400"
                >
                    <path d="m3 11 18-5v12L3 14v-3z"/>
                    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
                </svg>
                </div>
                
                {/* 2. 압축되고 행동을 유도하는 텍스트 */}
                <div className="flex-1">
                <p className="text-base font-semibold text-gray-800 dark:text-gray-100">
                    새로운 소식 및 주요 공지사항 확인하기
                </p>
                </div>

                {/* 3. 동적인 화살표 아이콘 */}
                <div className="text-gray-400 dark:text-gray-500">
                <svg 
                    className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                </div>
                
            </div>
            </div>
        </Link>
    </div>

      {/* 기타 메뉴 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 나의 창업 유형은? 카드 */}
        <Link href="/fit" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-2">🤔 나의 창업 유형은?</h2>
          <p className="text-gray-600 dark:text-gray-300">테스트를 통해 나의 창업 스타일을 확인하세요.</p>
        </Link>

        {/* 성공 사례 카드 */}
        <Link href="/success-stories" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">🏆 성공 사례 보러가기</h2>
          <p className="text-gray-600 dark:text-gray-300">성공적인 창업을 이룬 분들의 '진짜'이야기를 만나보세요.</p>
        </Link>
      </div>
    </div>
  );
}