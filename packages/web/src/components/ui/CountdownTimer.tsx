"use client";

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

// targetDate를 받아 남은 시간을 계산하는 함수
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
  // 1. 초기 상태는 항상 동일한 값으로 설정합니다.
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    // 2. 컴포넌트가 마운트된 후, 1초마다 시간을 다시 계산하여 업데이트합니다.
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    // 3. 컴포넌트가 언마운트되면 타이머를 정리합니다.
    return () => clearInterval(timer);
  }, [targetDate]);

  // 4. suppressHydrationWarning을 추가하여 미세한 차이로 인한 경고를 억제합니다.
  return (
    <div className="text-center font-mono" suppressHydrationWarning>
      <span className="text-2xl font-bold text-red-500">{String(timeLeft.days).padStart(2, '0')}</span>일&nbsp;
      <span className="text-2xl font-bold text-red-500">{String(timeLeft.hours).padStart(2, '0')}</span>시간&nbsp;
      <span className="text-2xl font-bold text-red-500">{String(timeLeft.minutes).padStart(2, '0')}</span>분&nbsp;
      <span className="text-2xl font-bold text-red-500">{String(timeLeft.seconds).padStart(2, '0')}</span>초
    </div>
  );
}