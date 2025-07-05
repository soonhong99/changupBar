// /src/components/admin/FeaturedPropertySettings.tsx

import { UpdateListingInput } from '@shared/schemas/listing.schema';

// 컴포넌트가 받을 props 타입을 정의합니다.
interface Props {
  formData: Partial<UpdateListingInput>;
  onFormDataChange: (newFormData: Partial<UpdateListingInput>) => void;
}

// 날짜를 'YYYY-MM-DDTHH:mm' 형식으로 변환하는 헬퍼 함수
// datetime-local input value에 맞추기 위함입니다. Date 객체를 직접 사용해도 좋습니다.
const toDateTimeLocal = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  const d = new Date(date);
  // 시간대 오프셋 보정을 제거하고 로컬 시간 그대로 사용
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function FeaturedPropertySettings({ formData, onFormDataChange }: Props) {
  const isFeatured = !!formData.isWeeklyBest;

  const handleToggle = () => {
    const newIsFeatured = !isFeatured;
    onFormDataChange({
      ...formData,
      isWeeklyBest: newIsFeatured,
      // 기능 비활성화 시 날짜 데이터 초기화
      featuredStart: newIsFeatured ? formData.featuredStart : undefined,
      featuredEnd: newIsFeatured ? formData.featuredEnd : undefined,
    });
  };

  // 날짜/시간 변경을 처리하는 핸들러
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFormDataChange({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 프리셋 버튼으로 기간을 설정하는 함수
  const setPreset = (days: number) => {
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + days);
  
    onFormDataChange({
      ...formData,
      // ISO 문자열 대신 datetime-local 형식으로 저장
      featuredStart: toDateTimeLocal(start),
      featuredEnd: toDateTimeLocal(end),
    });
  };

  // 선택된 기간을 텍스트로 계산하여 보여주는 함수
  const getDurationText = () => {
    if (formData.featuredStart && formData.featuredEnd) {
      const start = new Date(formData.featuredStart);
      const end = new Date(formData.featuredEnd);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';
      
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `(총 ${diffDays}일)`;
    }
    return '';
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-800/50">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          대표 매물 설정
        </h2>
        {/* --- 토글 스위치 UI --- */}
        <button
          type="button"
          onClick={handleToggle}
          className={`${
            isFeatured ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
        >
          <span
            className={`${
              isFeatured ? 'translate-x-5' : 'translate-x-0'
            } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
          />
        </button>
      </div>
      
      {isFeatured && (
        <div className="mt-6 space-y-6 animate-fade-in-down"> {/* 간단한 애니메이션 효과 추가 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              노출 기간
              <span className="ml-2 font-semibold text-indigo-600 dark:text-indigo-400">
                {getDurationText()}
              </span>
            </label>
            {/* UI/UX 개선을 위해 'react-datepicker' 같은 라이브러리를 사용한
              Date Range Picker로 교체하는 것을 강력히 권장합니다.
              우선은 기존 datetime-local input을 개선된 레이아웃에 맞게 배치합니다.
            */}
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="datetime-local"
                name="featuredStart"
                value={toDateTimeLocal(formData.featuredStart)}
                onChange={handleDateChange}
                className="mt-1 block w-full rounded-md shadow-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="datetime-local"
                name="featuredEnd"
                value={toDateTimeLocal(formData.featuredEnd)}
                onChange={handleDateChange}
                className="mt-1 block w-full rounded-md shadow-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              빠른 설정
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" onClick={() => setPreset(7)} className="px-3 py-1 text-sm border rounded-md text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">1주일</button>
              <button type="button" onClick={() => setPreset(14)} className="px-3 py-1 text-sm border rounded-md text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">2주일</button>
              <button type="button" onClick={() => setPreset(30)} className="px-3 py-1 text-sm border rounded-md text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">1개월</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// (선택) 간단한 CSS 애니메이션을 위해 globals.css에 추가
/* @tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .animate-fade-in-down {
    animation: fadeInDown 0.3s ease-out forwards;
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
*/