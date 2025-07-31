// packages/web/src/app/page.tsx
import { getFeaturedListings, getRandomListingsByCategory } from "@/lib/api";
import ListingCard from "@/components/ui/ListingCard";
import CountdownTimer from "@/components/ui/CountdownTimer";
import Link from 'next/link'; // ⬅️ Link 추가
import { ArrowRight } from "lucide-react"; // ⬅️ ArrowRight 아이콘 추가
import ExpandableContent from "@/components/ui/ExpandableContent";
import ConsultantMessage from "@/components/content/ConsultantMessage";

export const revalidate = 0;

export default async function HomePage() {
  const [featuredListings, randomListingsByCategory] = await Promise.all([
    getFeaturedListings(),
    getRandomListingsByCategory()
  ]);

  // 대표 매물 중 가장 먼저 마감되는 매물의 종료 시간을 찾습니다.
  const countdownTarget = featuredListings.length > 0
    ? featuredListings.reduce((earliest, current) => 
        new Date(earliest.featuredEnd!) < new Date(current.featuredEnd!) ? earliest : current
      ).featuredEnd!.toString()
    : new Date().toISOString();
  
  const categoryOrder = [
    '휴게음식점', '일반음식점', '주류/치킨/호프', '오락/스포츠/관리', '판매/소매'
  ];

  return (
    <main className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen">

      {/* 1. 히어로 섹션 (배경 이미지 추가) */}
      <section className="relative text-center py-20">
        {/* 배경 이미지: public 폴더에 저장한 이미지 경로를 사용합니다. */}
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('/images/main/hero-bg.png')` }}
        >
          {/* 개선된 오버레이: 그라데이션과 조절 가능한 투명도 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70"></div>
          {/* 추가 텍스트 배경을 위한 중앙 영역 강조 */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/30 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* 메인 타이틀 - 텍스트 섀도우와 배경 추가 */}
          <div className="relative">
            {/* 텍스트 뒤 반투명 배경 */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] rounded-3xl border border-white/20 shadow-2xl"></div>
            
            <div className="relative py-8 px-6">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                {/* <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg"> */}
                <span className="text-white drop-shadow-lg">
                  함께 성장하는
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
                  스마트창업
                </span>
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-white drop-shadow-lg">
                여러분의 <strong className="text-yellow-300 drop-shadow-sm">꿈을 현실로</strong> 만들어 드리겠습니다.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* --- 혜택 강조 섹션 --- */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 100% 실매물 보장 카드 */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-md transition transform hover:scale-105 hover:shadow-lg">
            {/* 모바일용 UI - md 이하에서만 보임 */}
            <div className="block md:hidden p-6">
              <div className="flex items-center mb-3">
                <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-semibold">100% 맞춤형 사업 추천</h3>
              </div>
              <p className="text-blue-100">지속가능한 수익성인지 철저히 검증합니다</p>
            </div>

            {/* 데스크톱용 UI - md 이상에서만 보임 */}
            <div className="hidden md:block overflow-hidden">
              {/* 이미지 영역 - 1:1 비율 */}
              <div className="relative w-full aspect-square">
                <img
                  src="/images/main/real-property.png"
                  alt="실매물 보장"
                  className="w-full h-full object-cover"
                />
                {/* 이미지 위에 아이콘 */}
                <div className="absolute top-4 left-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* 텍스트 영역 */}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">100% 맞춤형 사업 추천</h3>
                <p className="text-blue-100">지속가능한 수익성인지 철저히 검증합니다</p>
              </div>
            </div>
          </div>

          {/* 전담 컨설턴트 카드 */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-md transition transform hover:scale-105 hover:shadow-lg">
            {/* 모바일용 UI - md 이하에서만 보임 */}
            <div className="block md:hidden p-6">
              <div className="flex items-center mb-3">
                <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-semibold">당신만을 위한 컨설팅</h3>
              </div>
              <p className="text-purple-100">미래 계획까지 함께 고민합니다</p>
            </div>

            {/* 데스크톱용 UI - md 이상에서만 보임 */}
            <div className="hidden md:block overflow-hidden">
              {/* 이미지 영역 - 1:1 비율 */}
              <div className="relative w-full aspect-square">
                <img
                  src="/images/main/consultant.png"
                  alt="전담 컨설턴트"
                  className="w-full h-full object-cover"
                />
                {/* 이미지 위에 아이콘 */}
                <div className="absolute top-4 left-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* 텍스트 영역 */}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">당신만을 위한 컨설팅</h3>
                <p className="text-purple-100">미래 계획까지 함께 고민합니다</p>
              </div>
            </div>
          </div>

          {/* 완벽한 후처리 카드 */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-md transition transform hover:scale-105 hover:shadow-lg">
            {/* 모바일용 UI - md 이하에서만 보임 */}
            <div className="block md:hidden p-6">
              <div className="flex items-center mb-3">
                <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-semibold">완벽한 후처리</h3>
              </div>
              <p className="text-green-100">계약 후에도 3개월간 함께합니다</p>
            </div>

            {/* 데스크톱용 UI - md 이상에서만 보임 */}
            <div className="hidden md:block overflow-hidden">
              {/* 이미지 영역 - 1:1 비율 */}
              <div className="relative w-full aspect-square">
                <img
                  src="/images/main/afterservice.png"
                  alt="애프터서비스"
                  className="w-full h-full object-cover"
                />
                {/* 이미지 위에 아이콘 */}
                <div className="absolute top-4 left-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* 텍스트 영역 */}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">완벽한 후처리</h3>
                <p className="text-green-100">계약 후에도 3개월간 함께합니다</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <ExpandableContent title="확신이 서지 않을 때마다 눌러주세요!">
            <ConsultantMessage/>
          </ExpandableContent>
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

        {/* --- 대표 매물 목록 --- */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              주간 특급 매물 
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
                  {/* Top 랭킹 배지 - z-20으로 가장 위에 표시 */}
                  <div className="absolute -top-3 -right-3 z-30">
                    {index === 0 && (
                      <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                        <span className="text-lg">🥇</span> TOP 1
                      </div>
                    )}
                    {index === 1 && (
                      <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                        <span className="text-lg">🥈</span> TOP 2
                      </div>
                    )}
                    {index === 2 && (
                      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                        <span className="text-lg">🥉</span> TOP 3
                      </div>
                    )}
                  </div>
                  
                  <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <ListingCard listing={listing} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-16">
          {categoryOrder.map(category => {
            const listings = randomListingsByCategory[category] || [];
            if (listings.length === 0) return null; // 해당 카테고리에 매물이 없으면 섹션 자체를 표시하지 않음

            return (
              <section key={category}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {category} <span className="text-blue-600">추천 매물</span>
                  </h2>
                  <Link href={`/search?mainCategory=${encodeURIComponent(category)}`} className="group flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    <span>더보기</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
        
        {/* --- 찜하기 기능 가이드 섹션 --- */}
        <div className="mt-12 mb-12 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 border border-pink-200 dark:border-pink-800">
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
                  변동사항 발생 시 <span className="font-semibold text-blue-600">문자 메세지</span>로 즉시 알려드립니다
                </p>
              </div>
            </div>

            {/* 수정된 섹션 */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start">
                  <div className="text-2xl mr-3">💡</div>
                  <div className="text-sm">
                    <p className="text-blue-800 dark:text-blue-200 font-semibold mb-1">나만의 창업 스토리</p>
                    <p className="text-blue-700 dark:text-blue-300">
                      수익성도 중요하지만, 내가 정말 하고 싶은 일인지, 나의 가치관과 맞는지가 더 중요합니다
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-2xl mr-3">🎯</div>
                  <div className="text-sm">
                    <p className="text-blue-800 dark:text-blue-200 font-semibold mb-1">창업 유형 매칭</p>
                    <p className="text-blue-700 dark:text-blue-300">
                      카페, 음식점, 소매점 등 다양한 업종 중 나의 성향과 꿈에 맞는 창업 유형을 찾아보세요
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-2xl mr-3">🌟</div>
                  <div className="text-sm">
                    <p className="text-blue-800 dark:text-blue-200 font-semibold mb-1">지속가능한 성공</p>
                    <p className="text-blue-700 dark:text-blue-300">
                      열정과 비전이 있을 때 어려움도 극복하고 진정한 성공을 이룰 수 있습니다
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

                {/* --- 행동 유도 섹션 --- */}
                {/* --- 행동 유도 섹션 --- */}
        <div className="relative overflow-hidden">
          {/* 배경 패턴 */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          
          <div className="relative text-center text-white p-10 rounded-2xl shadow-xl">
            <div className="max-w-4xl mx-auto">
              {/* 메인 헤드라인 */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  스마트창업 고객 맞춤 상담
                </div>
                
                <h3 className="text-3xl font-bold mb-4">
                  꿈과 소망을 공유하고<br />
                  <span className="text-yellow-300">실질적인 발판</span>을 만들어보세요
                </h3>
              </div>

              {/* 혜택 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-3xl mb-2">📊</div>
                  <h4 className="font-semibold mb-1">성공을 위한 데이터 나침반</h4>
                  <p className="text-sm text-blue-100">뜬구름 잡는 예측이 아닌, 객관적인 데이터 제공</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-3xl mb-2">💼</div>
                  <h4 className="font-semibold mb-1">가장 현실적인 성공의 시작점</h4>
                  <p className="text-sm text-blue-100">무리한 투자가 아닌 가장 안전하고 확실한 길 안내</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-3xl mb-2">📋</div>
                  <h4 className="font-semibold mb-1">든든한 동행, 성공적인 시작</h4>
                  <p className="text-sm text-blue-100">상담부터 계약까지, 곁에서 함께 걷겠습니다</p>
                </div>
              </div>

              {/* CTA 버튼들 */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="tel:01025361178" 
                  className="group bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-yellow-400 hover:text-gray-900 transition-all duration-300 shadow-lg flex items-center gap-3"
                >
                  <svg className="w-5 h-5 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>스마트 전화 상담</span>
                </a>
              </div>

              {/* 추가 안내 문구 */}
              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-blue-100">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>남녀노소 누구나</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>당일 상담 가능</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}