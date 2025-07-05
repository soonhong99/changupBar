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
  BarChart3
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

  // 금액 포맷팅
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  // 주소에서 구 정보 추출
  const getDistrict = (address: string) => {
    const parts = address.split(' ');
    return parts[1] || address;
  };

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
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 font-medium shadow-lg">
            <Building className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-300">{getCategoryName(listing.category)}</span>
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
                <span className="font-medium">{listing.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 핵심 지표 섹션 */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="relative bg-white dark:bg-gray-800 shadow-xl p-6 border border-gray-100 dark:border-gray-700 rounded-xl">
            <span className="absolute -top-3 left-4 text-xxs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
              월 순수익
            </span>
            {/* <div className="flex items-center justify-between mb-2 mt-4">
              <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div> */}
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(listing.netProfit)}만
            </p>
          </div>

          <div className="relative bg-white dark:bg-gray-800 shadow-xl p-6 border border-gray-100 dark:border-gray-700 rounded-xl">
            <span className="absolute -top-3 left-4 text-xxs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
              권리금
            </span>
            {/* <div className="flex items-center justify-between mb-2 mt-4">
              <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div> */}
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(listing.keyMoney)}만
            </p>
          </div>

          <div className="relative bg-white dark:bg-gray-800 shadow-xl p-6 border border-gray-100 dark:border-gray-700 rounded-xl">
            <span className="absolute -top-3 left-4 text-xxs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded">
              임대료
            </span>
            {/* <div className="flex items-center justify-between mb-2 mt-4">
              <Building className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div> */}
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(listing.monthlyRent)}만
            </p>
          </div>

          <div className="relative bg-white dark:bg-gray-800 shadow-xl p-6 border border-gray-100 dark:border-gray-700 rounded-xl">
            <span className="absolute -top-3 left-4 text-xxs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded">
              입지
            </span>
            {/* <div className="flex items-center justify-between mb-2 mt-4">
              <MapPin className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div> */}
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {getDistrict(listing.address)}
            </p>
          </div>
        </div>

        {/* 특장점 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* 매물 특징 */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              매물 특징
            </h2>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>

            {/* 특징 아이콘 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {listing.isAutomated && (
                <div className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">풀오토 시스템</span>
                </div>
              )}
              {listing.hasParking && (
                <div className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Car className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">주차 가능</span>
                </div>
              )}
              <div className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">즉시 인수가능</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Users className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">단골 확보</span>
              </div>
            </div>
          </div>

          {/* 사이드바 정보 */}
          <div className="space-y-6">
            {/* 신뢰 배지 */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">창업바 보증 매물</h3>
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                관심있으신가요?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                전문 상담사가 자세한 정보와 함께 창업 성공을 도와드립니다.
              </p>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group">
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
                {/* 조회수 기능은 추후 구현 예정 */}
                {/* <div className="flex justify-between">
                  <dt className="text-sm text-gray-600 dark:text-gray-400">조회수</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">{listing.viewCount || 0}회</dd>
                </div> */}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}