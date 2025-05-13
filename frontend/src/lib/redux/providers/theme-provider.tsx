'use client';

import { useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useAppDispatch } from '@/lib/redux/hooks/useTheme';
import { setTheme } from '@/lib/redux/slices/themeSlice';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);
  
  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // This handles syncing the next-themes provider's theme with Redux
  const handleThemeChange = (theme: string) => {
    // Only dispatch after component is mounted
    if (mounted) {
      dispatch(setTheme(theme as 'light' | 'dark' | 'system'));
    }
  };

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      onValueChange={handleThemeChange}
    >
      {children}
    </NextThemesProvider>
  );
}