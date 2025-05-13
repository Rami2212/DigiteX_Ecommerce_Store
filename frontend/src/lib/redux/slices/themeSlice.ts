// 📄 src/lib/redux/slices/themeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Theme, getThemeFromLocalStorage, setThemeInLocalStorage, applyTheme } from '@/utils/theme';

interface ThemeState {
  mode: Theme;
}

const initialState: ThemeState = {
  mode: 'system', // Default value; real theme applied via useEffect/init
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.mode = action.payload;
      setThemeInLocalStorage(action.payload);
      applyTheme(action.payload);
    },
    initTheme: (state) => {
      const savedTheme = getThemeFromLocalStorage();
      state.mode = savedTheme;
      applyTheme(savedTheme);
    },
  },
});

export const { setTheme, initTheme } = themeSlice.actions;
export default themeSlice.reducer;
