// src/components/ui/InfoToggle.tsx

"use client";

import { useState } from 'react';

interface InfoToggleProps {
  title: string;
  children: React.ReactNode;
}

export default function InfoToggle({ title, children }: InfoToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-700/80 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75 rounded-xl"
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          <span className="mr-3">💡</span>
          {title}
        </h3>
        <svg
          className={`w-6 h-6 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 pt-2 text-gray-700 dark:text-gray-300 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}