// packages/web/src/components/forms/ConsultationForm.tsx

import { useState, FormEvent, useEffect, useRef } from 'react';
import { createConsultation } from '@/lib/api';
import DateTimePicker from '@/components/ui/DateTimePicker';
import { CreateConsultationInput } from '@shared/schemas/consultation.schema';

interface ConsultationFormProps {
  onSuccess: () => void;
  initialData?: Partial<CreateConsultationInput>;
}

interface FormDataState {
  name: string;
  phone: string;
  age: number;
  gender: string;
  desiredCategory: string;
  desiredLocation: string;
  investmentAmount: number;
  details: string;
  desiredTime?: Date; 
}

export default function ConsultationForm({ initialData = {}, onSuccess }: ConsultationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  
  // investmentAmount를 적절한 범위로 매핑하는 함수
  const getMatchingRangeValue = (amount: number) => {
    if (amount <= 5000) return 5000;
    if (amount <= 10000) return 10000;
    if (amount <= 20000) return 20000;
    return 20001; // 20000 초과는 2억원 이상
  };

  // 초기 상태를 함수로 설정하여 initialData를 반영
  const [formData, setFormData] = useState<FormDataState>(() => {
    // investmentAmount가 있는 경우 적절한 범위로 매핑
    const mappedInvestmentAmount = initialData.investmentAmount !== undefined
      ? getMatchingRangeValue(initialData.investmentAmount)
      : 5000;

    return {
      name: initialData.name || '',
      phone: initialData.phone || '', 
      age: initialData.age || 25, 
      gender: initialData.gender || '남성',
      desiredCategory: initialData.desiredCategory || '', 
      desiredLocation: initialData.desiredLocation || '',
      investmentAmount: mappedInvestmentAmount, 
      details: initialData.details || '',
    };
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(
    initialData?.desiredCategory || ''
  );
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // initialData의 이전 값을 추적하기 위한 ref
  const prevInitialDataRef = useRef(initialData);

  const investmentRanges = [
    { value: 5000, label: '5천만원 이하' },
    { value: 10000, label: '1억원 이하' },
    { value: 20000, label: '2억원 이하' },
    { value: 20001, label: '2억원 이상' }
  ];

  // initialData가 실제로 변경되었을 때만 상태 업데이트
  useEffect(() => {
  const prevProps = prevInitialDataRef.current;
  
  const hasChanged = 
    prevProps.desiredCategory !== initialData.desiredCategory ||
    prevProps.desiredLocation !== initialData.desiredLocation ||
    prevProps.investmentAmount !== initialData.investmentAmount ||
    prevProps.name !== initialData.name ||
    prevProps.phone !== initialData.phone ||
    prevProps.age !== initialData.age ||
    prevProps.gender !== initialData.gender ||
    prevProps.details !== initialData.details;

  if (hasChanged) {
    // setFormData의 콜백 함수를 사용하여 안전하게 상태 업데이트
    setFormData(prevState => {
      const newInvestmentAmount = initialData.investmentAmount !== undefined
        ? getMatchingRangeValue(initialData.investmentAmount)
        : prevState.investmentAmount; // ★ 수정된 부분: 현재 상태 값을 fallback으로 사용

      return {
        ...prevState,
        name: initialData.name || prevState.name,
        phone: initialData.phone || prevState.phone,
        age: initialData.age || prevState.age,
        gender: initialData.gender || prevState.gender,
        desiredCategory: initialData.desiredCategory || prevState.desiredCategory,
        desiredLocation: initialData.desiredLocation || prevState.desiredLocation,
        investmentAmount: newInvestmentAmount, // ★ 수정된 부분: 항상 number 타입을 보장
        details: initialData.details || prevState.details,
      };
    });
    
    setSelectedSubCategory(initialData.desiredCategory || '');
    prevInitialDataRef.current = initialData;
  }
}, [
  initialData.desiredCategory,
  initialData.desiredLocation,
  initialData.investmentAmount,
  initialData.name,
  initialData.phone,
  initialData.age,
  initialData.gender,
  initialData.details
]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const submissionData = {
        ...formData,
        investmentAmount: Number(formData.investmentAmount),
        age: Number(formData.age),
        desiredTime: formData.desiredTime ? formData.desiredTime.toISOString() : null,
      };
      console.log('서버로 전송될 최종 데이터:', submissionData); 

      await createConsultation(submissionData);
      alert('상담 신청이 성공적으로 접수되었습니다.');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Valid = formData.phone && formData.age;
  const isStep2Valid = formData.desiredCategory && formData.investmentAmount;

  return (
    <form 
      onSubmit={handleSubmit} 
      onKeyDown={(e) => {
        if (e.key === 'Enter' && currentStep < 3) {
          e.preventDefault();
        }
      }}
      className="max-h-[80vh] overflow-hidden flex flex-col">
      {/* 나머지 JSX는 동일하게 유지 */}
      {/* 헤더 */}
      <div className="text-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          창업 컨설팅 신청
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          당신의 결심을 성공으로 이끌겠습니다.
        </p>
      </div>

      {/* 진행 단계 표시 */}
      <div className="flex items-center justify-center mb-4 flex-shrink-0">
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  currentStep >= step
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-12 h-1 mx-1 transition-all ${
                    currentStep > step
                      ? 'bg-blue-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 폼 컨텐츠 - 스크롤 가능 영역 */}
      <div className="flex-1 overflow-y-auto px-1">
        <div className="space-y-4">
          {/* Step 1: 기본 정보 */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center mb-4">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  기본 정보
                </p>
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <svg className="w-4 h-4 mr-1.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="홍길동"
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              {/* 전화번호 */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  전화번호 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="010-1234-5678"
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* 나이와 성별 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <svg className="w-4 h-4 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    나이
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="20"
                    max="80"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <svg className="w-4 h-4 mr-1.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    성별
                  </label>
                  <div className="flex space-x-2">
                    {['남성', '여성'].map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, gender }))}
                        className={`flex-1 py-2.5 px-3 rounded-lg font-medium transition-all ${
                          formData.gender === gender
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: 창업 정보 */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center mb-4">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  창업 정보
                </p>
              </div>

              {/* 희망 업종 */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <svg className="w-4 h-4 mr-1.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  희망 업종 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.desiredCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, desiredCategory: e.target.value }))}
                  placeholder="예: 카페, 치킨집, 편의점 등 (특별히 원하는 업종이 없다면 '없음')"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  원하시는 업종을 자유롭게 작성해주세요. 여러 개인 경우 쉼표로 구분해주세요.
                </p>
              </div>

              {/* 예상 투자금 */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <svg className="w-4 h-4 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  예상 투자금 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {investmentRanges.map((range) => (
                    <button
                      key={range.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, investmentAmount: range.value }))}
                      className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                        formData.investmentAmount === range.value
                          ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 희망 지역 */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <svg className="w-4 h-4 mr-1.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  희망 지역
                </label>
                <input
                  type="text"
                  name="desiredLocation"
                  value={formData.desiredLocation}
                  onChange={handleChange}
                  placeholder="예: 서울 강남구, 경기도 성남시"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  상담 희망 시간
                </label>
                <DateTimePicker 
                  onChange={(date) => setFormData(prev => ({ ...prev, desiredTime: date }))}
                />
              </div>
            </div>
          )}

          {/* Step 3: 추가 정보 */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center mb-4">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  추가 정보
                </p>
              </div>

              {/* 상세 요청사항 */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <svg className="w-4 h-4 mr-1.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  상세 요청사항
                  <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">(선택)</span>
                </label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  maxLength={200}
                  rows={4}
                  placeholder="창업 관련 궁금한 점이나 특별히 원하시는 조건을 자유롭게 작성해주세요"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                  {formData.details.length}/200자
                </p>
              </div>

              {/* 상담 안내 메시지 */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">
                      상담 전 안내사항
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed space-y-1">
                      <span className="block">
                        <span className="font-bold text-amber-900 dark:text-amber-100">안정</span>적인 사업을 지속할 수 있도록,
                      </span>
                      <span className="block">
                        <span className="font-bold text-amber-900 dark:text-amber-100">도전</span>을 계속해서 하실 수 있도록,
                      </span>
                      <span className="block">
                        <span className="font-bold text-amber-900 dark:text-amber-100">성공</span>한 사업가가 될 수 있도록
                      </span>
                      <span className="block">
                        수단과 방법을 가리지 않고 도와드리겠습니다.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* 개인정보 동의 */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 inline mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  위 내용을 확인했으며, 개인정보 수집 및 이용에 동의합니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mx-1 mt-2">
          <p className="text-red-600 dark:text-red-400 text-sm flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* 하단 버튼 영역 - 고정 */}
      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="flex-1 py-3 px-4 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
          >
            이전
          </button>
        )}
        
        {currentStep < 3 ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setCurrentStep(prev => prev + 1);
            }}
            disabled={currentStep === 1 ? !isStep1Valid : !isStep2Valid}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              (currentStep === 1 && isStep1Valid) || (currentStep === 2 && isStep2Valid)
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            다음
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting || !isStep1Valid || !isStep2Valid}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              isSubmitting || !isStep1Valid || !isStep2Valid
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                신청 중...
              </span>
            ) : (
              '상담 신청하기'
            )}
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </form>
  );
}