"use client";

export default function NoticesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">📢 공지사항</h1>
        <p className="text-gray-600 dark:text-gray-400">
          스마트창업의 새로운 소식과 중요한 공지사항을 확인하세요
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <div className="text-6xl mb-6">📋</div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
          아직 공지사항이 없습니다
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          새로운 공지사항이 등록되면 이곳에서 확인하실 수 있습니다.<br />
          중요한 업데이트와 이벤트 소식을 놓치지 마세요!
        </p>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-left">
          <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
            📌 앞으로 이런 내용들이 공지될 예정입니다:
          </h3>
          <ul className="space-y-2 text-blue-700 dark:text-blue-400">
            <li>• 새로운 기능 출시 소식</li>
            <li>• 시스템 점검 및 업데이트 안내</li>
            <li>• 특별 이벤트 및 프로모션</li>
            <li>• 서비스 이용 관련 중요 변경사항</li>
            <li>• 창업 관련 유용한 정보와 팁</li>
          </ul>
        </div>
      </div>
    </div>
  );
}