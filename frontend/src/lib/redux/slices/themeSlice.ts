'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: Theme;
}

const initialState: ThemeState = {
  mode: 'system', // Default value
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.mode = action.payload;
    },
    initTheme: (state) => {
      if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
          state.mode = storedTheme;
        } else {
          state.mode = 'system';
        }
      }
    },
  },
});

export const { setTheme, initTheme } = themeSlice.actions;
export default themeSlice.reducer;