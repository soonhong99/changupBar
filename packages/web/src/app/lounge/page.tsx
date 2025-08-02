import Link from 'next/link';
import Image from 'next/image';

function LoungeHeader() {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop"
          alt="라운지 배경"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-gray-900/80 via-gray-900/50 to-transparent"></div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center text-white">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            <span 
              className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-yellow-200"
              style={{ textShadow: '0 2px 15px rgba(253, 224, 71, 0.5)' }}
            >
              인생의 지름길을 밝히다
            </span>
          </h1>

          <p 
            className="text-xl md:text-2xl text-gray-200 mb-8"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
          >
            핵심만 선별한 알짜 정보, 연대하는 스마터
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
              <span className="text-lg font-semibold">창업유형 테스트</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
              <span className="text-lg font-semibold">실제 성공사례</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
              <span className="text-lg font-semibold">스마트 챌린지</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
              <span className="text-lg font-semibold">고독한 사업가</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function LoungePage() {
  return (
    // 전체 페이지의 상하 기본 패딩(py-8)은 제거합니다.
    <div>
      {/* 1. 개선된 라운지 헤더를 중앙 정렬 컨테이너 밖으로 이동 */}
      <LoungeHeader />

      {/* 2. 나머지 콘텐츠는 중앙 정렬 컨테이너 안에 배치 */}
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* 공지사항 카드 */}
        <div className="mb-8">
          <Link href="/notices" className="block group">
              {/* ... (기존 공지사항 카드 코드는 그대로 유지) ... */}
              <div className="px-6 py-5 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center space-x-4">
                  
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
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
                  
                  <div className="flex-1">
                  <p className="text-base font-semibold text-gray-800 dark:text-gray-100">
                      새로운 소식 및 주요 공지사항 확인하기
                  </p>
                  </div>

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
          {/* ... (기존 기타 메뉴 카드 코드는 그대로 유지) ... */}
          <Link href="/fit" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-2">🤔 나의 창업 유형은?</h2>
            <p className="text-gray-600 dark:text-gray-300">테스트를 통해 나의 창업 스타일을 확인하세요.</p>
          </Link>
          <Link href="/success-stories" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">🏆 성공 사례 보러가기</h2>
            <p className="text-gray-600 dark:text-gray-300">성공적인 창업을 이룬 분들의 '진짜'이야기를 만나보세요.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}