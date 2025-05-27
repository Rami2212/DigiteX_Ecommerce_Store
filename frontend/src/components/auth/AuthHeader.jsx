import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';

const AuthHeader = () => {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <header className="w-full mb-8">
      <div className="w-full mx-auto">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={handleBackClick}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <FiArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </button>

            <button
              onClick={toggle}
              className="relative inline-flex items-center justify-center w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <span
                className={`inline-block w-5 h-5 rounded-full bg-white dark:bg-gray-300 shadow-lg transform transition-transform duration-200 ${
                  theme === 'dark' ? 'translate-x-3' : '-translate-x-3'
                }`}
              />
              <span className="sr-only">Toggle theme</span>
              <FiSun className={`absolute left-1 h-3 w-3 text-yellow-500 transition-opacity ${theme === 'dark' ? 'opacity-0' : 'opacity-100'}`} />
              <FiMoon className={`absolute right-1 h-3 w-3 text-gray-400 transition-opacity ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
