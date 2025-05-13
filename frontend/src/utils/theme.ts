// src/utils/theme
export const COLORS = {
  // Primary (Purple)
  primaryLight: '#a78bfa', // primary-400
  primary: '#7c3aed',      // primary-600
  primaryDark: '#5b21b6',  // primary-800
  
  // Secondary (Blue)
  secondaryLight: '#60a5fa', // secondary-400
  secondary: '#2563eb',      // secondary-600
  secondaryDark: '#1e40af',  // secondary-800
  
  // Accent
  accent: '#8b5cf6', // primary-500
  
  // Gradients
  primaryGradient: 'linear-gradient(to right, #7c3aed, #2563eb)', // primary-600 to secondary-600
  primaryHoverGradient: 'linear-gradient(to right, #6d28d9, #1d4ed8)', // primary-700 to secondary-700
  
  // Text
  textLight: '#f9fafb',
  textDark: '#111827',
  
  // Backgrounds
  bgLight: '#f9fafb',
  bgDark: '#111827',
};

export type Theme = 'light' | 'dark' | 'system';

export const getThemeFromLocalStorage = (): Theme => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'system';
  }
  return 'system';
};

export const setThemeInLocalStorage = (theme: Theme): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', theme);
  }
};

export const applyTheme = (theme: Theme): void => {
  if (typeof window !== 'undefined') {
    const root = window.document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Apply the appropriate theme class
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }
};