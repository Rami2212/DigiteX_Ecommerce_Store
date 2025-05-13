'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';

// Keep the original ReduxProvider for backward compatibility
export function ReduxProvider({ children }: { readonly children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}