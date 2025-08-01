"use client";

import { useState, useMemo } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { format, addBusinessDays, isWeekend, isBefore, startOfDay, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';

interface DateTimePickerProps {
  onChange: (date: Date | undefined) => void;
}

export default function DateTimePicker({ onChange }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  // 5영업일 날짜 계산
  const availableDates = useMemo(() => {
    const dates: Date[] = [];
    let currentDate = new Date();
    let businessDaysAdded = 0;

    while (businessDaysAdded < 5) {
      currentDate = addDays(currentDate, 1);
      if (!isWeekend(currentDate)) {
        dates.push(currentDate);
        businessDaysAdded++;
      }
    }

    return dates;
  }, []);

  // 시간 슬롯 생성 (9:00 ~ 18:00, 15분 간격, 12:00~13:00 제외)
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        // 12시대는 점심시간이므로 제외
        if (hour === 12) continue;
        
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsDateOpen(false);
    
    // 날짜를 선택하면 시간 선택 섹션을 자동으로 열기
    if (!selectedTime) {
      setIsTimeOpen(true);
    }
    
    if (selectedTime) {
      const [hour, minute] = selectedTime.split(':').map(Number);
      const newDate = new Date(date);
      newDate.setHours(hour, minute, 0, 0);
      onChange(newDate);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setIsTimeOpen(false);
    
    if (selectedDate) {
      const [hour, minute] = time.split(':').map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hour, minute, 0, 0);
      onChange(newDate);
    }
  };

  return (
    <div className="space-y-3">
      {/* 날짜 선택 */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setIsDateOpen(!isDateOpen);
            setIsTimeOpen(false);
          }}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className={selectedDate ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}>
              {selectedDate ? format(selectedDate, 'yyyy년 MM월 dd일 (E)', { locale: ko }) : '날짜 선택'}
            </span>
          </div>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform ${isDateOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* 날짜 드롭다운 */}
        {isDateOpen && (
          <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2">
            <div className="grid grid-cols-1 gap-1">
              {availableDates.map((date) => (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => handleDateSelect(date)}
                  className={`px-4 py-3 text-left rounded-md transition-colors ${
                    selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="font-medium">
                    {format(date, 'MM월 dd일 (E)', { locale: ko })}
                  </div>
                  <div className="text-sm opacity-70">
                    {format(date, 'yyyy년', { locale: ko })}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 시간 선택 */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setIsTimeOpen(!isTimeOpen);
            setIsDateOpen(false);
          }}
          disabled={!selectedDate}
          className={`w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg transition-colors ${
            !selectedDate 
              ? 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed' 
              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className={selectedTime ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}>
              {selectedTime || '시간 선택'}
            </span>
          </div>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform ${isTimeOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* 시간 드롭다운 */}
        {isTimeOpen && selectedDate && (
          <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 max-h-64 overflow-y-auto">
            <div className="grid grid-cols-3 gap-1">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleTimeSelect(time)}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    selectedTime === time
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 선택된 일정 표시 */}
      {selectedDate && selectedTime && (
        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <span className="font-medium">선택하신 상담 시간:</span>{' '}
            {format(selectedDate, 'yyyy년 MM월 dd일 (E)', { locale: ko })} {selectedTime}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            15분간 전화 상담이 진행됩니다.
          </p>
        </div>
      )}
    </div>
  );
}