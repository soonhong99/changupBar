// packages/web/src/app/listings/[id]/page.tsx

import { getListingById } from '@/lib/api';
import { notFound } from 'next/navigation';

// 1. Props 타입을 명시적으로 정의합니다.
type Props = {
  params: Promise<{ id: string }>; // Promise 타입으로 변경
};

// 이 페이지는 서버에서 데이터를 미리 가져오는 서버 컴포넌트입니다.
export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params; // await 추가
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* 1. 헤드라인 (한 줄 요약) */}
      <h1 className="text-4xl font-bold mb-4 text-gray-800">
        {listing.summary}
      </h1>

      {/* 2. 핵심 정보 태그 */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="bg-blue-100 text-blue-800 text-lg font-semibold px-4 py-2 rounded-full">
          💰 월 순수익 {listing.netProfit / 10000}만원
        </div>
        <div className="bg-green-100 text-green-800 text-lg font-semibold px-4 py-2 rounded-full">
          📍 {listing.address.split(' ')[1]} {/* 주소에서 '강남구' 등 추출 */}
        </div>
        <div className="bg-purple-100 text-purple-800 text-lg font-semibold px-4 py-2 rounded-full">
          {listing.isAutomated ? '🤖 풀오토' : '💪 직접운영'}
        </div>
        <div className="bg-yellow-100 text-yellow-800 text-lg font-semibold px-4 py-2 rounded-full">
          ⭐️ 권리금 {listing.keyMoney / 10000}만원
        </div>
      </div>

      {/* 3. 사진 갤러리 (임시) */}
      <div className="bg-gray-200 w-full h-96 mb-8 flex items-center justify-center rounded-lg">
        <img src={listing.coverImage} alt={listing.name} className="object-cover h-full w-full rounded-lg" />
      </div>

      {/* 4. 상세 설명 */}
      <div className="prose lg:prose-xl max-w-full">
        <p>{listing.description}</p>
      </div>

      {/* TODO: 여기에 더 많은 상세 정보 UI를 추가할 수 있습니다. */}
    </div>
  );
}