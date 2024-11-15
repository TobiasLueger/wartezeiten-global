'use client'

import { ModeToggle } from '@/components/mode-toggle';

export default function Header() {

  return (
    <header className="bg-white shadow-md dark:bg-gray-800 dark:shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full dark:bg-gray-700">
            {/* Replace with an actual SVG or Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="#FFFFFF"
              className="dark:fill-gray-100"
              viewBox="0 0 256 256"
            >
              <path d="M239.24,131.4c-22,46.8-41.4,68.6-61.2,68.6-25.1,0-40.73-33.32-57.28-68.6C107.7,103.56,92.9,72,78,72c-16.4,0-36.31,37.21-46.72,59.4a8,8,0,0,1-14.48-6.8C38.71,77.8,58.16,56,78,56c25.1,0,40.73,33.32,57.28,68.6C148.3,152.44,163.1,184,178,184c16.4,0,36.31-37.21,46.72-59.4a8,8,0,0,1,14.48,6.8Z"></path>
            </svg>
          </div>
          {/* Logo */}
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            <a
              href="/"
              className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              Wartezeiten Global
            </a>
          </h1>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}