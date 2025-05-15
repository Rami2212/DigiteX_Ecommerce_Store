'use client';

import React, { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks/useTheme';
import { setTheme, initTheme } from '@/lib/redux/slices/themeSlice';
import type { Theme } from '@/utils/theme';

const ThemeSwitcher: React.FC = () => {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);
  const { setTheme: setNextTheme } = useTheme();

  // Initialize theme from localStorage on first render
  useEffect(() => {
    dispatch(initTheme());
  }, [dispatch]);

  // Sync Redux theme state with next-themes
  useEffect(() => {
    if (mode) {
      setNextTheme(mode);
    }
  }, [mode, setNextTheme]);

  const handleThemeChange = (newTheme: Theme) => {
    dispatch(setTheme(newTheme));
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative inline-block">
        <select
          value={mode}
          onChange={(e) => handleThemeChange(e.target.value as Theme)}
          className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-3 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg 
            className="h-4 w-4 text-gray-500 dark:text-gray-400" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;