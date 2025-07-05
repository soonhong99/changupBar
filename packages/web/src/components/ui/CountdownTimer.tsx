// packages/web/src/components/ui/CountdownTimer.tsx
"use client";

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
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

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="text-center font-mono" suppressHydrationWarning>
      <span className="text-2xl font-bold text-red-500">{String(timeLeft.days).padStart(2, '0')}</span>일&nbsp;
      <span className="text-2xl font-bold text-red-500">{String(timeLeft.hours).padStart(2, '0')}</span>시간&nbsp;
      <span className="text-2xl font-bold text-red-500">{String(timeLeft.minutes).padStart(2, '0')}</span>분&nbsp;
      <span className="text-2xl font-bold text-red-500">{String(timeLeft.seconds).padStart(2, '0')}</span>초
    </div>
  );
}