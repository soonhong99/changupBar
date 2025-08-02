"use client";

import { useState } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';

// 답변 타입 정의
type AnswerType = '🧘' | '🚀' | '💼';

// 질문 데이터 타입
interface Question {
  id: number;
  question: string;
  answers: {
    type: AnswerType;
    text: string;
  }[];
}

// 결과 타입 정의
interface Result {
  type: AnswerType;
  title: string;
  description: string;
}

// 질문 데이터
const questions: Question[] = [
  {
    id: 1,
    question: "내가 창업을 결심한 가장 결정적인 이유는 무엇인가요?",
    answers: [
      {
        type: '🧘',
        text: "큰돈을 벌기보다는, 내가 좋아하는 일을 하면서 스트레스 없이 안정적인 삶을 꾸리고 싶어서"
      },
      {
        type: '🚀',
        text: "나의 브랜드를 만들고 사업을 계속 키워서, 이 분야에 큰 획을 긋는 사람이 되고 싶어서"
      },
      {
        type: '💼',
        text: "매일 반복되는 직장 생활에서 벗어나, 월급 이상의 수익으로 경제적 자유를 얻고 싶어서"
      }
    ]
  },
  {
    id: 2,
    question: "내가 꿈꾸는 가게(사업)의 10년 후 모습은 어떤 모습에 가까운가요?",
    answers: [
      {
        type: '🚀',
        text: "전국, 나아가 해외까지 진출한 거대한 프랜차이즈의 대표가 되어있는 모습"
      },
      {
        type: '💼',
        text: "가게는 똑똑한 시스템으로 자동 운영되고, 나는 여유롭게 시간을 즐기는 모습"
      },
      {
        type: '🧘',
        text: "단골들과 오순도순 소통하며, 동네에서 없어서는 안 될 따뜻한 공간으로 사랑받는 모습"
      }
    ]
  },
  {
    id: 3,
    question: "나에게 '성공적인 창업'이란 무엇을 의미하나요?",
    answers: [
      {
        type: '💼',
        text: "더 이상 돈 때문에 무언가를 포기하지 않아도 될 만큼, 충분한 부를 쌓는 것"
      },
      {
        type: '🧘',
        text: "일과 삶의 균형을 완벽하게 맞춰, 매일이 행복하고 여유로운 상태를 만드는 것"
      },
      {
        type: '🚀',
        text: "업계 1위가 되거나, 아무도 시도하지 않았던 혁신을 이뤄내 시장을 선도하는 것"
      }
    ]
  },
  {
    id: 4,
    question: "사업이 예상보다 잘 되어 큰돈을 벌게 되었다면, 가장 먼저 무엇을 하고 싶나요?",
    answers: [
      {
        type: '🧘',
        text: "가장 먼저 대출금을 갚고, 가게를 더 안정적으로 운영할 수 있는 기반을 다진다."
      },
      {
        type: '💼',
        text: "가게 운영은 다른 사람에게 맡기고, 나는 또 다른 수익 파이프라인을 찾아 나선다."
      },
      {
        type: '🚀',
        text: "벌어들인 돈을 전부 재투자해서, 사업 규모를 지금의 몇 배로 빠르게 키운다."
      }
    ]
  },
  {
    id: 5,
    question: "만약 사업이 어려워져서, 딱 한 가지만 지킬 수 있다면 무엇을 선택하겠어요?",
    answers: [
      {
        type: '🚀',
        text: "미래의 성공 가능성 (지금은 힘들어도, 이 사업은 분명 더 크게 성장할 잠재력이 있어!)"
      },
      {
        type: '🧘',
        text: "현재의 안정적인 생활 (가게 규모가 줄더라도, 내 삶의 균형은 절대 포기 못해!)"
      },
      {
        type: '💼',
        text: "꾸준한 현금 흐름 (수익이 줄어드는 건 절대 안돼! 어떻게든 수익성을 유지해야 해!)"
      }
    ]
  },
  {
    id: 6,
    question: "가게 운영 외에, 나의 시간과 에너지를 주로 어디에 사용하고 싶으신가요?",
    answers: [
      {
        type: '🧘',
        text: "취미, 운동, 여행 등 내 개인적인 삶의 만족도를 높이는 데 사용하고 싶어요."
      },
      {
        type: '🚀',
        text: "시장 트렌드 분석, 경쟁사 연구 등 사업 확장을 위한 전략 구상에 사용하고 싶어요."
      },
      {
        type: '💼',
        text: "부동산, 주식 투자 등 나의 자산을 더 불릴 수 있는 새로운 방법을 공부하는 데 사용하고 싶어요."
      }
    ]
  },
  {
    id: 7,
    question: "나에게 10억 원의 투자금이 생긴다면 어떻게 활용하고 싶으신가요?",
    answers: [
      {
        type: '🚀',
        text: "사업을 공격적으로 확장하고 마케팅에 투자해, 시장 점유율을 단숨에 높일 거예요."
      },
      {
        type: '🧘',
        text: "가게 시설을 개선하고 직원 복지를 늘려서, 지금 이 공간을 더 완벽하게 만들 거예요."
      },
      {
        type: '💼',
        text: "안정적인 상가나 부동산에 투자해서, 제2의 월급 통장을 하나 더 만들 거예요."
      }
    ]
  }
];

// 결과 데이터
const results: Record<AnswerType, Result> = {
  '🧘': {
    type: '🧘',
    title: '워라밸 추구형(안정)',
    description: '안정적인 시스템 속에서 편안하게, 삶의 질을 높이며 가게를 운영하고 싶어 하는 분.\n\n당신에게 창업은 \'대박\'이나 \'성공\'보다는, 행복한 삶을 완성하기 위한 \'수단\'에 가깝습니다. 무리한 확장으로 스트레스를 받기보다는, 내가 사랑하는 공간을 안정적으로 운영하며 일과 삶의 완벽한 균형을 이루는 것에서 가장 큰 만족을 느끼는 유형입니다.\n\n소소하지만 확실한 행복을 추구하는 당신이 멋있습니다!'
  },
  '🚀': {
    type: '🚀',
    title: '성장 발판 추구형(성장)',
    description: '현재의 투자를 발판 삼아 더 큰 성공과 확장을 꿈꾸는 야심가.\n\n당신은 현실에 안주하지 않고, 끊임없이 더 높은 목표를 향해 달려가는 뜨거운 심장을 가진 분입니다. 창업은 당신에게 세상을 무대로 자신의 능력을 증명하고, 업계에 새로운 역사를 쓸 기회입니다. 리스크를 두려워하지 않는 과감한 도전 정신과 강력한 추진력으로, 결국에는 정상에 오를 수밖에 없는 유형입니다.\n\n당신의 성공 스토리가 벌써부터 기대되네요!'
  },
  '💼': {
    type: '💼',
    title: '탈(脫)직장인 추구형(도전)',
    description: '직장인 월급 이상의 꾸준한 수익을 통해 경제적 자유와 여유로운 삶, 두 마리 토끼를 잡고 싶어 하는 분.\n\n당신은 \'노동\'에서 벗어나 \'시스템\'이 돈을 버는 구조를 만들고 싶어 합니다. 창업은 그 목표를 이루기 위한 가장 현실적이고 효과적인 방법이라고 생각하는 유형입니다. 최소한의 노력으로 최대한의 효율을 뽑아내는 것에 특화되어 있으며, 안정적인 수익 구조를 완성해 경제적 자유를 얻고 유유자적한 삶을 즐기는 것을 최종 목표로 삼습니다.\n\n아주 스마트하게 살고 계시는군요!'
  }
};

export default function FitPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AnswerType[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (answerType: AnswerType) => {
    const newAnswers = [...answers, answerType];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  const calculateResult = (): Result => {
    const counts = {
      '🧘': 0,
      '🚀': 0,
      '💼': 0
    };

    answers.forEach(answer => {
      counts[answer]++;
    });

    const mostSelected = Object.entries(counts).reduce((a, b) => 
      counts[a[0] as AnswerType] > counts[b[0] as AnswerType] ? a : b
    )[0] as AnswerType;

    return results[mostSelected];
  };

  return (
    <AuthGuard requireLogin={true}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">🤔 나의 창업 유형은?</h1>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-2">FIT이란?</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Founder's Identity Test (FIT / 창업가 정체성 검사) 입니다.<br />
              스마트창업이 제시한 총 3가지 유형 중 어떤 유형에 속하는지 확인해보세요!
            </p>
          </div>
        </div>

        {!showResult ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">📝 FIT 창업 유형 검사</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {currentQuestion + 1} / {questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                각 질문에 대해 가장 마음이 끌리는 답변 하나를 선택해 주세요.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium mb-6">
                Q{questions[currentQuestion].id}. {questions[currentQuestion].question}
              </h3>
              
              <div className="space-y-4">
                {questions[currentQuestion].answers.map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(answer.type)}
                    className="w-full text-left p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 hover:border-blue-500 dark:hover:border-blue-400"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{answer.type}</span>
                      <span className="text-gray-700 dark:text-gray-300">{answer.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">📊 FIT 검사 결과</h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
                <div className="text-4xl mb-4">{calculateResult().type}</div>
                <h3 className="text-xl font-semibold mb-4">{calculateResult().title}</h3>
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {calculateResult().description}
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={resetTest}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                다시 검사하기
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}