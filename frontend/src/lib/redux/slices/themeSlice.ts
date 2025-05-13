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
      // The actual theme application happens in the ThemeSwitcher component
      // This action is here to indicate theme initialization
    },
  },
});

export const { setTheme, initTheme } = themeSlice.actions;
export default themeSlice.reducer;