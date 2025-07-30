// packages/web/src/app/verify-phone/page.tsx

"use client";

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { sendSmsVerification, checkSmsVerification, updateMyPhone } from '@/lib/api';
import { FiSmartphone, FiKey, FiLoader, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';

export default function VerifyPhonePage() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  const [isSending, setIsSending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  
  // 타이머 상태 추가
  const [timer, setTimer] = useState(180); // 3분 = 180초
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const { user, token, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // 타이머 로직
  useEffect(() => {
    if (!isTimerRunning || step !== 2) return;

    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else {
      // 타이머가 0이 되면
      setIsTimerRunning(false);
      setError("인증 시간이 만료되었습니다. 다시 요청해주세요.");
    }
  }, [isTimerRunning, timer, step]);

  // MM:SS 형식으로 변환하는 함수
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    // 디버깅을 위한 로그 추가
    // console.log('Verify Phone Debug:', {
    //   isAuthLoading,
    //   user: user ? {
    //     id: user.id,
    //     phone: user.phone,
    //     phoneType: typeof user.phone,
    //     phoneLength: user.phone?.length
    //   } : null
    // });
  
    if (!isAuthLoading) {
      // 사용자가 없거나, phone이 유효한 값이 있으면 홈으로
      if (!user || (user.phone && user.phone.length >= 10)) {
        console.log('Redirecting to home because:', {
          noUser: !user,
          hasValidPhone: user?.phone && user.phone.length >= 10
        });
        router.replace('/');
      }
      // phone이 없거나, 빈 문자열이거나, 유효하지 않은 경우는 페이지에 머무름
    }
  }, [user, isAuthLoading, router]);

  const handleSendCode = async (isResend = false) => {
    setError(null);
    if (!/^\d{10,11}$/.test(phone)) {
        setError('올바른 핸드폰 번호 10~11자리를 입력해주세요.');
        return;
    }
    setIsSending(true);
    try {
      // await sendSmsVerification(phone);
      console.log(`${phone}으로 인증번호 발송 요청 (재전송: ${isResend})`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStep(2);
      setTimer(180); // 타이머 초기화
      setIsTimerRunning(true); // 타이머 시작
    } catch (err) {
      setError('인증번호 발송에 실패했습니다. 잠시 후 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!token || verificationCode.length < 6) {
        setError('인증번호 6자리를 정확하게 입력해주세요.');
        return;
    }
    if (timer === 0) {
        setError("인증 시간이 만료되었습니다. '재전송' 버튼을 눌러주세요.");
        return;
    }
    setIsSubmitting(true);
    try {
    //   await checkSmsVerification(phone, verificationCode);
    //   await updateMyPhone(phone, token);
      console.log(`${phone} / ${verificationCode} 인증 시도`);
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      alert('핸드폰 인증이 완료되었습니다. 서비스를 계속 이용하실 수 있습니다.');
      router.push('/');
    } catch (err) {
      setError('인증에 실패했습니다. 인증번호를 확인하고 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || !user) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <FiLoader className="animate-spin text-4xl mb-4 text-indigo-500" />
            <p>사용자 정보를 확인 중입니다...</p>
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-md mx-4 sm:mx-0">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transform hover:scale-[1.01] transition-transform duration-300">
            <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    추가 인증 필요
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-indigo-500 dark:text-indigo-400">{user.name}</span>님, 원활한 서비스 이용을 위해<br/>핸드폰 인증을 완료해주세요.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
            {/* --- 1단계: 핸드폰 번호 입력 --- */}
            <div className={`transition-all duration-500 ${step === 1 ? 'opacity-100' : 'opacity-50'}`}>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    핸드폰 번호
                </label>
                <div className="relative">
                    <FiSmartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                        id="phone" type="tel" value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="'-' 없이 숫자만 입력" maxLength={11} required
                        disabled={step === 2 || isSending}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-70 disabled:cursor-not-allowed"
                    />
                </div>
            </div>

            {/* --- 인증번호 발송 버튼 --- */}
            {step === 1 && (
                <button
                    type="button" onClick={() => handleSendCode(false)}
                    disabled={isSending || phone.length < 10}
                    className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {isSending ? <FiLoader className="animate-spin" /> : <FiKey />}
                    {isSending ? '전송 중...' : '인증번호 발송'}
                </button>
            )}

            {/* --- 2단계: 인증번호 입력 --- */}
            <div className={`transition-all duration-500 ${step === 2 ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'} overflow-hidden space-y-2`}>
                 <div className="flex justify-between items-baseline">
                    <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        인증번호
                    </label>
                    {/* 타이머 UI */}
                    {isTimerRunning && (
                        <span className="text-sm font-mono text-indigo-500 dark:text-indigo-400">
                           유효 시간: {formatTime(timer)}
                        </span>
                    )}
                 </div>
                 <div className="relative">
                    <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                        id="verificationCode" type="text" value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="인증번호 6자리 입력" maxLength={6} required={step === 2} disabled={isSubmitting}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-70"
                    />
                </div>
            </div>
            
            {/* --- 최종 제출 및 재전송 버튼 --- */}
            {step === 2 && (
                <div className="flex gap-2">
                    {/* 재전송 버튼 */}
                    <button
                        type="button" onClick={() => handleSendCode(true)}
                        disabled={isTimerRunning || isSending}
                        className="w-1/3 flex justify-center items-center gap-2 bg-gray-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-gray-800 transition-all duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                       {isSending ? <FiLoader className="animate-spin"/> : <FiRefreshCw />}
                       <span>재전송</span>
                    </button>
                    {/* 인증하고 시작하기 버튼 */}
                    <button
                        type="submit"
                        disabled={isSubmitting || verificationCode.length < 6 || timer === 0}
                        className="w-2/3 flex justify-center items-center gap-2 bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-all duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
                        {isSubmitting ? '인증 중...' : '인증하고 시작하기'}
                    </button>
                </div>
            )}
            
            {error && <p className="text-sm text-center text-red-500 dark:text-red-400 transition-opacity duration-300">{error}</p>}
            </form>
          </div>
      </div>
    </div>
  );
}