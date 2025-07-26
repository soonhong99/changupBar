"use client";
import { useState, FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Phone, Shield, ChevronRight, CheckCircle, AlertCircle, X } from 'lucide-react';
import { registerUser, sendSmsVerification, checkSmsVerification } from '@/lib/api';
import Link from 'next/link';
import PrivacyPolicyModal from '@/components/auth/PrivacyPolicyModal';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    passwordConfirm: '', 
    phone: '' 
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const router = useRouter();

  // 타이머 효과
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  // 개인정보처리방침 체크박스 클릭 핸들러
  const handlePrivacyCheckboxClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // 기본 체크 동작 방지
    setShowPrivacyModal(true);
  };

  // 개인정보처리방침 동의 핸들러
  const handlePrivacyAgree = () => {
    setPrivacyAgreed(true);
    setShowPrivacyModal(false);
  };

  // 개인정보처리방침 모달 닫기 핸들러
  const handlePrivacyModalClose = () => {
    setShowPrivacyModal(false);
  };

  const handlePrivacyAgreedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 체크가 해제되는 경우, 상태만 변경
    // 체크가 설정되는 경우, 모달을 띄움
    const isChecked = e.target.checked;
    if (isChecked) {
        setShowPrivacyModal(true); // 체크 시 모달 열기
    } else {
        setPrivacyAgreed(false); // 해제 시 상태 변경
    }
  };

  // 1. 인증번호 발송 핸들러
  const handleSendCode = async () => {
    // 기본 유효성 검사
    if (!formData.name || !formData.email || !formData.password) {
      setError('모든 필수 정보를 입력해주세요.');
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!formData.phone || formData.phone.length < 10) {
      setError('올바른 전화번호를 입력해주세요.');
      return;
    }
    if (!privacyAgreed) {
      setError('개인정보처리방침에 동의해주세요.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await sendSmsVerification(formData.phone);
      setCodeSent(true);
      setTimer(180); // 3분 타이머
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : '인증번호 발송에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. 최종 회원가입 핸들러
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await checkSmsVerification(formData.phone, verificationCode);
      await registerUser({ 
        name: formData.name, 
        email: formData.email, 
        password: formData.password,
        phone: formData.phone
      });
      setStep(3);
      setTimeout(() => { router.push('/login'); }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류 발생';
      setError(errorMessage);
      if (errorMessage.includes('이메일') || errorMessage.includes('인증번호')) {
        setStep(1);
        setCodeSent(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 비밀번호 강도 체크
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: '' };
    if (password.length < 6) return { strength: 1, text: '약함', color: 'bg-red-500' };
    if (password.length < 10) return { strength: 2, text: '보통', color: 'bg-yellow-500' };
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) {
      return { strength: 4, text: '매우 강함', color: 'bg-green-500' };
    }
    return { strength: 3, text: '강함', color: 'bg-blue-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // 회원가입 성공 화면
  if (step === 3) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            회원가입 완료! 🎉
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            잠시 후 로그인 페이지로 이동합니다...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4">
        {/* 배경 장식 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        <div className="relative z-10 max-w-md w-full">
          {/* 로고/헤더 영역 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              환영합니다! 👋
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              스마트창업과 함께 시작하세요
            </p>
          </div>
          
          {/* 메인 폼 */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: 기본 정보 입력 */}
              <div className={`space-y-5 ${step !== 1 ? 'opacity-50 pointer-events-none' : ''}`}>
                {/* 이름 입력 */}
                <div className="relative">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    이름
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="홍길동"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>
                </div>
                
                {/* 이메일 입력 */}
                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    이메일 (로그인 아이디)
                    <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                      * 계정 복구 시 필요합니다
                    </span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="example@email.com"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="mt-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <div className="flex items-start">
                      <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-blue-800 dark:text-blue-300">
                          <span className="font-semibold">중요:</span> 이 이메일은 로그인 아이디로 사용되며, 
                          비밀번호 분실 시 계정을 복구하는 유일한 방법입니다. 
                          <span className="font-medium">반드시 사용 가능한 이메일을 입력해주세요.</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 비밀번호 입력 */}
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    비밀번호
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="6자 이상 입력"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400">비밀번호 강도</span>
                        <span className={`text-xs font-medium ${
                          passwordStrength.strength === 1 ? 'text-red-600' :
                          passwordStrength.strength === 2 ? 'text-yellow-600' :
                          passwordStrength.strength === 3 ? 'text-blue-600' :
                          passwordStrength.strength === 4 ? 'text-green-600' : ''
                        }`}>
                          {passwordStrength.text}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color || 'bg-gray-200'}`}
                          style={{ width: `${passwordStrength.strength * 25}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* 비밀번호 확인 */}
                <div className="relative">
                  <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    비밀번호 확인
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="passwordConfirm"
                      name="passwordConfirm"
                      type="password"
                      value={formData.passwordConfirm}
                      onChange={handleChange}
                      required
                      placeholder="비밀번호를 다시 입력해주세요"
                      className={`w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 ${
                        formData.passwordConfirm && formData.password !== formData.passwordConfirm
                          ? 'border-red-500 dark:border-red-500'
                          : formData.passwordConfirm && formData.password === formData.passwordConfirm
                          ? 'border-green-500 dark:border-green-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {formData.passwordConfirm && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {formData.password === formData.passwordConfirm ? (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                    )}
                  </div>
                  {formData.passwordConfirm && formData.password !== formData.passwordConfirm && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      비밀번호가 일치하지 않습니다
                    </p>
                  )}
                </div>
                
                {/* 전화번호 입력 */}
                <div className="relative">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    휴대폰 번호
                  </label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="01012345678"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={isSubmitting || codeSent}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                        codeSent 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-700'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>전송 중...</span>
                        </>
                      ) : codeSent ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>발송 완료</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          <span>인증번호 발송</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* 개인정보처리방침 동의 */}
                <div className="flex items-start space-x-3">
                <input
                  id="privacyAgreed"
                  type="checkbox"
                  checked={privacyAgreed}
                  onChange={handlePrivacyAgreedChange} // 수정된 핸들러 사용
                  className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-400 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  aria-describedby="privacyAgreedDescription" // 접근성을 위해 설명과 연결
                />
                <div className="flex-1">
                  <label
                    htmlFor="privacyAgreed" // 체크박스와 라벨 연결
                    className="inline-flex items-center" // 라벨 내부 요소 정렬
                  >
                    <button
                      type="button"
                      onClick={() => setShowPrivacyModal(true)} // 텍스트 클릭 시 모달 열기
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline transition-colors mr-1" // 간격 추가
                      aria-label="개인정보처리방침 보기" // 버튼에 대한 설명
                    >
                      개인정보처리방침
                    </button>
                    <span id="privacyAgreedDescription" className="text-sm text-gray-600 dark:text-gray-400">
                      에 동의합니다. (필수)
                    </span>
                  </label>
                  {privacyAgreed && (
                    <div className="flex items-center mt-1">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mr-1" />
                      <span className="text-xs text-green-600 dark:text-green-400">동의 완료</span>
                    </div>
                  )}
                </div>
              </div>
              </div>
              
              {/* Step 2: 인증번호 입력 */}
              {step === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          {formData.phone}로 인증번호를 발송했습니다.
                        </p>
                        {timer > 0 && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            남은 시간: {Math.floor(timer / 60)}분 {timer % 60}초
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      인증번호 6자리
                    </label>
                    <input
                      id="verificationCode"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      required
                      placeholder="000000"
                      maxLength={6}
                      className="w-full px-4 py-3 text-center text-2xl font-mono tracking-wider bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || verificationCode.length !== 6}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>가입 처리 중...</span>
                      </>
                    ) : (
                      <>
                        <span>인증하고 회원가입 완료</span>
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              )}
              
              {/* 에러 메시지 */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 animate-shake">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                  </div>
                </div>
              )}
            </form>
            
            {/* 로그인 링크 */}
            <div className="mt-6 text-center border-t border-gray-200 dark:border-gray-700 pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                이미 계정이 있으신가요?{' '}
                <Link href="/login" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline">
                  로그인하기
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animate-fade-in { animation: fade-in 0.5s ease-out; }
          .animate-shake { animation: shake 0.5s ease-out; }
        `}</style>
      </div>
      
      {/* 개인정보처리방침 모달 */}
      <PrivacyPolicyModal 
        isOpen={showPrivacyModal}
        onClose={handlePrivacyModalClose}
        onAgree={handlePrivacyAgree}
      />
    </>
  );
}