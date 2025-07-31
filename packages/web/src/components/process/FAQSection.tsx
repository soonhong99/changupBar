'use client';

// packages/web/src/components/process/FAQSection.tsx
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  category: string;
  questions: FAQItem[];
}

interface FAQSectionProps {
  faqData: FAQCategory[];
}

// FAQ 아코디언 컴포넌트
function FAQAccordion({ category, questions }: { category: string; questions: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <span className="w-2 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full mr-3"></span>
        {category}
      </h3>
      <div className="space-y-3">
        {questions.map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="font-medium text-gray-900 dark:text-white pr-4">{item.q}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FAQSection({ faqData }: FAQSectionProps) {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            자주 묻는 질문
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            궁금하신 내용을 카테고리별로 정리했습니다
          </p>
        </div>

        <div className="space-y-8">
          {faqData.map((category, index) => (
            <FAQAccordion key={index} category={category.category} questions={category.questions} />
          ))}
        </div>
      </div>
    </section>
  );
}