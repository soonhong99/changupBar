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
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
          {/* {featuredListings.length === 0 ? (
  <FeaturedListingsCarousel listings={[]} />
) : (
  <FeaturedListingsCarousel listings={featuredListings} />
)} */}
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