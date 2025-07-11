// packages/web/src/app/page.tsx
import { getFeaturedListings } from "@/lib/api";
import ListingCard from "@/components/ui/ListingCard";
import CountdownTimer from "@/components/ui/CountdownTimer";
import FeaturedListingsCarousel from "@/components/ui/FeaturedListingsCarousel";

export default async function HomePage() {
  const featuredListings = await getFeaturedListings();
  // 대표 매물 중 가장 먼저 마감되는 매물의 종료 시간을 찾습니다.
  const countdownTarget = featuredListings.length > 0
    ? featuredListings.reduce((earliest, current) => 
        new Date(earliest.featuredEnd!) < new Date(current.featuredEnd!) ? earliest : current
      ).featuredEnd!.toString()
    : new Date().toISOString();

  return (
    <main className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* --- 상단 헤더 및 소개 --- */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold mb-6 shadow-lg">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            전문가 검증 완료
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              스마트창업 한정
            </span>
            <br />
            특급 매물 공개
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
            스마트창업에서 검증된 S급 매물들을 <strong className="text-blue-600 dark:text-blue-400">최저권리금</strong>으로 만날수있는 기회
          </p>
        </div>

        {/* --- 긴급성 강조 배너 --- */}
        <div className="mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl"></div>
          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-red-200 dark:border-red-800 p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-600 dark:text-red-400 font-semibold text-lg">실시간 마감 임박</span>
              </div>
            </div>
            <CountdownTimer targetDate={countdownTarget} />
            <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                무료 상담 가능
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                비밀 보장
              </span>
            </div>
          </div>
        </div>

        {/* --- 혜택 강조 섹션 --- */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center mb-3">
            <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
              <h3 className="text-lg font-semibold">100% 실매물 보장</h3>
            </div>
            <p className="text-blue-100">허위 매물 0%, 모든 매물 현장 확인 완료</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center mb-3">
              <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-semibold">수수료 50% 할인</h3>
            </div>
            <p className="text-green-100">이번 주 계약 시 중개수수료 대폭 할인</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center mb-3">
              <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-semibold">전담 컨설턴트</h3>
            </div>
            <p className="text-purple-100">창업 전문가 1:1 맞춤 컨설팅 제공</p>
          </div>
        </div>

        {/* --- 대표 매물 목록 --- */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              엄선된 특급 매물 
              <span className="text-red-500 text-2xl ml-2">🔥</span>
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>실시간 업데이트</span>
            </div>
          </div>

          {featuredListings.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <div className="text-6xl mb-4">⏰</div>
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                잠시만요, 새로운 특급 매물을 준비 중입니다!
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                곧 매물을 공개할 예정이니 조금만 기다려주세요.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredListings.map((listing, index) => (
                <div key={listing.id} className="relative group">
                  {index === 0 && (
                    <div className="absolute -top-3 -right-3 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      🏆 Best Pick
                    </div>
                  )}
                  <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <ListingCard listing={listing} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
{/* --- 찜하기 기능 가이드 섹션 --- */}
<div className="mb-12 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 border border-pink-200 dark:border-pink-800">
  <div className="max-w-4xl mx-auto">
    <div className="text-center mb-6">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mb-4 shadow-lg">
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        마음에 드는 매물을 놓치지 마세요!
      </h3>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        하트 버튼으로 관심 매물을 저장하고 실시간 알림을 받아보세요
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mr-3">
            <span className="text-pink-500 dark:text-pink-400 font-bold">1</span>
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">하트 클릭</h4>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          마음에 드는 매물의 <span className="text-pink-500 font-semibold">♥</span> 버튼을 클릭하면 마이페이지에 자동 저장됩니다
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mr-3">
            <span className="text-pink-500 dark:text-pink-400 font-bold">2</span>
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">실시간 모니터링</h4>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          찜한 매물의 <span className="font-semibold">권리금 변동</span>, <span className="font-semibold">판매 상태</span>, <span className="font-semibold">정보 업데이트</span>를 자동으로 추적합니다
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mr-3">
            <span className="text-pink-500 dark:text-pink-400 font-bold">3</span>
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">즉시 알림</h4>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          변동사항 발생 시 <span className="font-semibold text-blue-600">문자</span> 또는 <span className="font-semibold text-yellow-600">카카오톡</span>으로 즉시 알려드립니다
        </p>
      </div>
    </div>

    <div className="mt-6 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-yellow-300 dark:border-yellow-700">
      <div className="flex items-start">
        <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div className="text-sm">
          <p className="text-yellow-800 dark:text-yellow-200 font-semibold mb-1">💡 알고 계셨나요?</p>
          <p className="text-yellow-700 dark:text-yellow-300">
            찜한 매물의 권리금이 <span className="font-bold">10% 이상 낮아지면</span> 즉시 알림을 받을 수 있어, 최적의 타이밍에 계약할 수 있습니다!
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

        {/* --- 행동 유도 섹션 --- */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold mb-4">
            지금 바로 상담 받고 특별 혜택까지!
          </h3>
          <p className="text-blue-100 mb-6">
            창업 전문가와 무료 상담 후 최대 500만원 창업 지원 쿠폰까지 받아보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              📞 무료 상담 신청
            </button>
            <button className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors shadow-lg">
              💰 지원쿠폰 확인하기
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}