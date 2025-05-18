import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, setTheme } from '../redux/slices/themeSlice';
import { useEffect } from 'react';

export const useTheme = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    // Apply theme class to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggle = () => {
    dispatch(toggleTheme());
  };

  const changeTheme = (newTheme) => {
    dispatch(setTheme(newTheme));
  };

  return { theme, toggle, changeTheme };
};