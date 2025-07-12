"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Mail, Link as LinkIcon, Sparkles, HeartHandshake, Clock, Shield } from 'lucide-react';
import ConsultationForm from '@/components/forms/ConsultationForm';

export default function ContactPage() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 섹션 */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>언제든 편하게 문의하세요</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 mb-6">
              함께 시작해요
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              여러분의 이야기를 듣고 싶어요. 작은 고민이라도 함께 나누면<br className="hidden sm:block" />
              더 나은 해결책을 찾을 수 있습니다. 🌟
            </p>
          </div>

          {/* 신뢰 지표 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">24시간 이내 답변</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">100% 비밀보장</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <HeartHandshake className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">진심을 담은 상담</span>
            </div>
          </div>

          {/* 메인 컨텐츠 */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            
            {/* 왼쪽: 폼 (3/5 너비) */}
            <div className="lg:col-span-3">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    맞춤 상담 신청하기 ✨
                  </h2>
                  <p className="text-white/90 text-lg">
                    당신의 이야기를 들려주세요. 전문가가 최선의 답을 찾아드릴게요.
                  </p>
                </div>
                
                <div className="p-8">
                  <ConsultationForm 
                    onSuccess={() => {
                      router.push('/consultation-complete');
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 오른쪽: 다른 방법들 (2/5 너비) */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                더 빠른 방법을 원하시나요? 💬
              </h3>

              {/* 카카오톡 카드 */}
              <div 
                className={`group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 cursor-pointer ${
                  hoveredCard === 'kakao' 
                    ? 'border-yellow-400 scale-105 shadow-yellow-200/50' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-yellow-300'
                }`}
                onMouseEnter={() => setHoveredCard('kakao')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute -top-3 -right-3 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                  가장 빠른 답변
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <MessageSquare className="w-7 h-7 text-gray-900" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                      카카오톡 상담
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">
                      @hoya110514
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      친구 추가하고 편하게 물어보세요!
                    </p>
                  </div>
                </div>
              </div>

              {/* 오픈채팅 카드 */}
              <a 
                href="https://open.kakao.com/o/sLuMTAGh" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <div 
                  className={`group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 ${
                    hoveredCard === 'openchat' 
                      ? 'border-green-500 scale-105 shadow-green-200/50' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-green-400'
                  }`}
                  onMouseEnter={() => setHoveredCard('openchat')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    익명 상담 가능
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <LinkIcon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                        1:1 오픈채팅
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        바로 시작하기 →
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        클릭 한 번으로 상담 시작!
                      </p>
                    </div>
                  </div>
                </div>
              </a>

              {/* 이메일 카드 */}
              <div 
                className={`group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 cursor-pointer ${
                  hoveredCard === 'email' 
                    ? 'border-blue-500 scale-105 shadow-blue-200/50' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                }`}
                onMouseEnter={() => setHoveredCard('email')}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => window.location.href = 'mailto:changupsmart@gmail.com'}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                      이메일 문의
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                      changupsmart@gmail.com
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      자세한 내용을 보내주세요
                    </p>
                  </div>
                </div>
              </div>

              {/* 응원 메시지 */}
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="text-2xl mb-2 block">💜</span>
                  가장 편한 방법을 선택해주세요.<br />
                  스마트창업은 당신의 성장을 응원합니다!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}