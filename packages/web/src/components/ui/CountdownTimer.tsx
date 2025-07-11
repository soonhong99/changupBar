// packages/web/src/components/ui/CountdownTimer.tsx

"use client";

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

const calculateTimeLeft = (target: string) => {
  const difference = +new Date(target) - +new Date();
  let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return timeLeft;
};

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 이 컴포넌트가 클라이언트에서 렌더링 되었음을 표시합니다.
    setIsClient(true);
  }, []);

  useEffect(() => {
    // 클라이언트에서만 타이머를 실행합니다.
    if (!isClient) return;

    // 첫 1초 딜레이 없이 바로 시간을 계산하여 보여줍니다.
    setTimeLeft(calculateTimeLeft(targetDate));

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [isClient, targetDate]);

  return (
    <div className="text-center font-mono">
      <span className="text-2xl font-bold text-red-500">{String(timeLeft.days).padStart(2, '0')}</span>일&nbsp;
      <span className="text-2xl font-bold text-red-500">{String(timeLeft.hours).padStart(2, '0')}</span>시간&nbsp;
      <span className="text-2xl font-bold text-red-500">{String(timeLeft.minutes).padStart(2, '0')}</span>분&nbsp;
      <span className="text-2xl font-bold text-red-500">{String(timeLeft.seconds).padStart(2, '0')}</span>초
    </div>
  );
}