// packages/web/src/components/ui/DateTimePicker.tsx
"use client";

import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, parseISO, setHours, setMinutes, setSeconds } from 'date-fns';

interface DateTimePickerProps {
    value?: string | null; // string | null | undefined
    onChange: (date: Date | undefined) => void;
}

export default function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  // value 문자열을 Date 객체로 파싱, 없으면 undefined
  const initialDate = value ? parseISO(value) : undefined;
  
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(initialDate);
  const [hour, setHour] = useState<number>(initialDate ? initialDate.getHours() : 0);
  const [minute, setMinute] = useState<number>(initialDate ? initialDate.getMinutes() : 0);
  
  // 날짜, 시간 중 하나라도 바뀌면 부모 컴포넌트의 상태 업데이트
  useEffect(() => {
    if (selectedDay) {
      let newDate = setHours(selectedDay, hour);
      newDate = setMinutes(newDate, minute);
      newDate = setSeconds(newDate, 0); // 초는 0으로 고정
      onChange(newDate);
    } else {
      onChange(undefined);
    }
  }, [selectedDay, hour, minute]);

  const handleDaySelect = (date: Date | undefined) => {
    setSelectedDay(date);
  };

  const handleTimeChange = (type: 'hour' | 'minute', val: string) => {
    const numValue = parseInt(val, 10);
    if (type === 'hour') setHour(numValue);
    if (type === 'minute') setMinute(numValue);
    
    // 날짜가 선택되지 않은 상태에서 시간만 바꾸면 오늘 날짜를 기준으로 설정
    if (!selectedDay) {
      setSelectedDay(new Date());
    }
  };
  
  const selectClasses = "w-full rounded-md shadow-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition-colors";

  return (
    <div className="bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 p-3 rounded-lg">
      <DayPicker
        mode="single"
        selected={selectedDay}
        onSelect={handleDaySelect}
        // Tailwind CSS 클래스로 달력 커스텀
        classNames={{
          root: 'text-gray-800 dark:text-gray-200',
          caption: 'flex justify-center items-center h-10',
          nav_button: 'h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700',
          head_cell: 'w-10 h-10 font-semibold text-sm text-gray-600 dark:text-gray-400',
          cell: 'w-10 h-10',
          day: 'w-full h-full rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-700',
          day_today: 'font-bold text-indigo-600',
          day_selected: 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600',
        }}
        footer={
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 flex items-center justify-center gap-2">
            <select value={hour} onChange={(e) => handleTimeChange('hour', e.target.value)} className={selectClasses}>
              {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{String(i).padStart(2, '0')}</option>)}
            </select>
            <span className="font-bold">:</span>
            <select value={minute} onChange={(e) => handleTimeChange('minute', e.target.value)} className={selectClasses}>
              <option value={0}>00</option>
              <option value={30}>30</option>
            </select>
          </div>
        }
      />
    </div>
  );
}