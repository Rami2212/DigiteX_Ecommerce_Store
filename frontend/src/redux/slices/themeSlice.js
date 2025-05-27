import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: localStorage.getItem('theme') || 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      localStorage.setItem('theme', newTheme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;