// packages/web/src/app/listings/[id]/page.tsx

import { getListingById } from '@/lib/api';
import { notFound } from 'next/navigation';
import { 
  MapPin, 
  TrendingUp, 
  Building, 
  DollarSign, 
  Calendar,
  CheckCircle,
  Star,
  Clock,
  Car,
  Zap,
  Phone,
  ArrowRight,
  Shield,
  Users,
  BarChart3,
  Package,
  Truck,
  Train,
  Receipt,
  Wallet,
  PiggyBank,
  TrendingDown,
  Calculator,
  Home,
  BikeIcon,
  Leaf,
  Smile
} from 'lucide-react';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  // 카테고리 한글 변환
  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      CAFE_BAKERY: '카페/베이커리',
      RESTAURANT_BAR: '주점/식당',
      RETAIL_ETC: '판매점/기타'
    };
    return categories[category] || category;
  };

  // 지역 한글 변환
  const getRegionName = (region: string) => {
    const regions: Record<string, string> = {
      METROPOLITAN: '수도권',
      NON_METROPOLITAN: '수도권 외'
    };
    return regions[region] || region;
  };

  // 금액 포맷팅
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  // 수익률 계산
  const profitRate = listing.monthlyRevenue > 0 
    ? Math.round((listing.netProfit / listing.monthlyRevenue) * 100) 
    : 0;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* 히어로 섹션 */}
      <div className="relative h-[60vh] min-h-[500px] w-full">
        <img 
          src={listing.coverImage} 
          alt={listing.name} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* 상단 배지 */}
        <div className="absolute top-6 left-6 flex gap-3">
          {listing.isWeeklyBest && (
            <div className="bg-yellow-500 text-white px-4 py-2 rounded-full flex items-center gap-2 font-medium shadow-lg">
              <Star className="w-4 h-4" />
              주간 베스트
            </div>
          )}
          {listing.isBest && (
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full flex items-center gap-2 font-medium shadow-lg">
              <Star className="w-4 h-4" />
              BEST 매물
            </div>
          )}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 font-medium shadow-lg">
            <Building className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-300">{getCategoryName(listing.category)}</span>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 font-medium shadow-lg">
            <MapPin className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-300">{getRegionName(listing.region)}</span>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {listing.name}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6 drop-shadow-md">
              {listing.summary}
            </p>
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">
                  {listing.sido} {listing.sigungu} 
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 핵심 지표 섹션 - 가장 중요한 정보 */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="relative bg-white dark:bg-gray-800 shadow-xl p-6 border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-2xl transition-shadow">
            <span className="absolute -top-3 left-4 text-xxs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
              월 순수익
            </span>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
              {formatCurrency(listing.netProfit)}만
            </p>
          </div>

          <div className="relative bg-white dark:bg-gray-800 shadow-xl p-6 border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-2xl transition-shadow">
            <span className="absolute -top-3 left-4 text-xxs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
              권리금
            </span>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
              {formatCurrency(listing.keyMoney)}만
            </p>
          </div>

          <div className="relative bg-white dark:bg-gray-800 shadow-xl p-6 border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-2xl transition-shadow">
            <span className="absolute -top-3 left-4 text-xxs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded">
              월 매출
            </span>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
              {formatCurrency(listing.monthlyRevenue)}만
            </p>
          </div>

          <div className="relative bg-white dark:bg-gray-800 shadow-xl p-6 border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-2xl transition-shadow">
            <span className="absolute -top-3 left-4 text-xxs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded">
              월세
            </span>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
              {formatCurrency(listing.monthlyRent)}만
            </p>
          </div>
        </div>

        {/* 매물 특성 배지 - 바로 보이는 중요 정보 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-wrap gap-3">
            {listing.isAutomated && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full font-medium">
                <Zap className="w-4 h-4" />
                풀오토 시스템
              </div>
            )}
            {listing.hasParking && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-medium">
                <Car className="w-4 h-4" />
                주차 가능
              </div>
            )}
            {listing.isFirstFloor && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full font-medium">
                <Home className="w-4 h-4" />
                1층 매물
              </div>
            )}
            {listing.isNearStation && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full font-medium">
                <Train className="w-4 h-4" />
                역세권
              </div>
            )}
            {listing.isBeginnerFriendly && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-full font-medium">
                <Leaf className="w-4 h-4" />
                초보 추천
              </div>
            )}

            {/* ⬇️ '여성 추천' 배지 추가 */}
            {listing.isWomanFriendly && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 rounded-full font-medium">
                <Smile className="w-4 h-4" />
                여성 추천
              </div>
            )}
            {listing.deliveryPercent > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full font-medium">
                <BikeIcon className="w-4 h-4" />
                배달 {listing.deliveryPercent}%
              </div>
            )}
          </div>
        </div>

        {/* 상세 정보 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* 왼쪽: 매물 특징 및 상세 정보 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 매물 특징 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                매물 특징
              </h2>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>
            </div>

            {/* 수익 구조 상세 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <Calculator className="w-6 h-6 text-green-600 dark:text-green-400" />
                수익 구조 상세
              </h2>
              
              <div className="space-y-4">
                {/* 매출 섹션 */}
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      월 평균 매출
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      +{formatCurrency(listing.monthlyRevenue)}만원
                    </span>
                  </div>
                  {listing.deliveryPercent > 0 && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      배달 매출 비중: {listing.deliveryPercent}%
                    </p>
                  )}
                </div>

                {/* 비용 섹션 */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">월 고정비용</h3>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-gray-500" />
                      월세
                    </span>
                    <span className="text-lg font-medium text-red-600 dark:text-red-400">
                      -{formatCurrency(listing.monthlyRent)}만원
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      재료비
                    </span>
                    <span className="text-lg font-medium text-red-600 dark:text-red-400">
                      -{formatCurrency(listing.materialCost)}만원
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      인건비
                    </span>
                    <span className="text-lg font-medium text-red-600 dark:text-red-400">
                      -{formatCurrency(listing.personnelCost)}만원
                    </span>
                  </div>

                  {listing.utilityCost > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-gray-500" />
                        공과금
                      </span>
                      <span className="text-lg font-medium text-red-600 dark:text-red-400">
                        -{formatCurrency(listing.utilityCost)}만원
                      </span>
                    </div>
                  )}

                  {listing.otherCost > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-gray-500" />
                        기타비용
                      </span>
                      <span className="text-lg font-medium text-red-600 dark:text-red-400">
                        -{formatCurrency(listing.otherCost)}만원
                      </span>
                    </div>
                  )}
                </div>

                {/* 순수익 섹션 */}
                <div className="pt-4 mt-4 border-t-2 border-gray-300 dark:border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <PiggyBank className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      월 순수익
                    </span>
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(listing.netProfit)}만원
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    * 순수익률: {profitRate}% (순수익 ÷ 매출 × 100)
                  </p>
                </div>
              </div>
            </div>

            {/* 초기 투자비용 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <Wallet className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                초기 투자비용
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">보증금</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(listing.deposit)}만원
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">권리금</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(listing.keyMoney)}만원
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-2">총 투자금액</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {formatCurrency(listing.deposit + listing.keyMoney)}만원
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                * 인테리어 비용 및 운영자금은 별도
              </p>
            </div>
          </div>

          {/* 오른쪽: 사이드바 정보 */}
          <div className="space-y-6">
            {/* 신뢰 배지 */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">스마트 보증 매물</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">실사 완료된 검증 매물</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">정확한 매출/수익 정보</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">전문 상담사 1:1 지원</span>
                </li>
              </ul>
            </div>

            {/* CTA 버튼 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                관심있으신가요?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                전문 상담사가 자세한 정보와 함께 창업 성공을 도와드립니다.
              </p>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl">
                <Phone className="w-5 h-5" />
                상담 신청하기
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                평일 09:00-18:00 | 주말 10:00-17:00
              </p>
            </div>

            {/* 추가 정보 */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">빠른 정보</h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600 dark:text-gray-400">매물번호</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">#{listing.id.slice(-6)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600 dark:text-gray-400">등록일</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(listing.createdAt).toLocaleDateString('ko-KR')}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600 dark:text-gray-400">업종</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">
                    {getCategoryName(listing.category)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600 dark:text-gray-400">지역</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">
                    {getRegionName(listing.region)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}