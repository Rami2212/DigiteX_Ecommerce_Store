'use client';

import { store } from '@/lib/redux/store';
import { Provider } from 'react-redux';
import { ThemeProvider as CustomThemeProvider } from './theme-provider';

export function Providers({ children }: { readonly children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <CustomThemeProvider>
        {children}
      </CustomThemeProvider>
    </Provider>
  );
}