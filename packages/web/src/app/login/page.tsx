// packages/web/src/app/login/page.tsx

"use client";

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { loginUser } from '@/lib/api';
import Link from 'next/link';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const kakaoError = searchParams.get('error');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await loginUser({ email, password });
      login(data.token);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    }
  };

  const handleKakaoLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/kakao`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          로그인
        </h2>
        {kakaoError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">카카오 로그인 실패: </strong>
            <span className="block sm:inline">잠시 후 다시 시도해주세요.</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" 
              htmlFor="email"
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow appearance-none border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
              placeholder="이메일을 입력하세요"
            />
          </div>
          <div className="mb-6">
            <label 
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" 
              htmlFor="password"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="shadow appearance-none border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 w-full transition-colors duration-300"
            >
              로그인
            </button>
          </div>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* --- 카카오 로그인 버튼 --- */}
        <button
          type="button"
          onClick={handleKakaoLogin}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-800 bg-[#FEE500] hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          카카오톡으로 로그인
        </button>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            아직 회원이 아니신가요?{' '}
            <Link 
              href="/register" 
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-300"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// 2. 페이지의 기본 export는 Suspense로 감싸는 역할을 합니다.
export default function LoginPage() {
  const loadingUI = (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <Suspense fallback={loadingUI}>
      <LoginForm />
    </Suspense>
  );
}

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();
//   const { login } = useAuth();
//   const searchParams = useSearchParams(); // ⬅️ 추가
//   const kakaoError = searchParams.get('error'); // ⬅️ 추가

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       const data = await loginUser({ email, password });
//       login(data.token); // AuthContext에 토큰 저장
//       router.push('/'); // 로그인 성공 시 홈으로 이동
//     } catch (err) {
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError('알 수 없는 오류가 발생했습니다.');
//       }
//     }
//   };

//   const handleKakaoLogin = () => {
//     // 백엔드의 카카오 로그인 시작 API로 이동시킵니다.
//     window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/kakao`;
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
//       <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
//         <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
//           로그인
//         </h2>
//         {kakaoError && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//             <strong className="font-bold">카카오 로그인 실패: </strong>
//             <span className="block sm:inline">잠시 후 다시 시도해주세요.</span>
//           </div>
//         )}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label 
//               className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" 
//               htmlFor="email"
//             >
//               이메일
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="shadow appearance-none border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
//               placeholder="이메일을 입력하세요"
//             />
//           </div>
//           <div className="mb-6">
//             <label 
//               className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" 
//               htmlFor="password"
//             >
//               비밀번호
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="shadow appearance-none border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
//               placeholder="비밀번호를 입력하세요"
//             />
//           </div>
//           {error && (
//             <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
//               <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
//             </div>
//           )}
//           <div className="flex items-center justify-between">
//             <button
//               type="submit"
//               className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 w-full transition-colors duration-300"
//             >
//               로그인
//             </button>
//           </div>
//         </form>

//         <div className="my-6 flex items-center">
//           <div className="flex-grow border-t border-gray-300"></div>
//           <span className="flex-shrink mx-4 text-gray-500">OR</span>
//           <div className="flex-grow border-t border-gray-300"></div>
//         </div>

//         {/* --- 카카오 로그인 버튼 --- */}
//         <button
//           type="button"
//           onClick={handleKakaoLogin}
//           className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-800 bg-[#FEE500] hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
//         >
//           카카오톡으로 로그인
//         </button>

//         <div className="text-center mt-6">
//           <p className="text-sm text-gray-600 dark:text-gray-400">
//             아직 회원이 아니신가요?{' '}
//             <Link 
//               href="/register" 
//               className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-300"
//             >
//               회원가입
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }