export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#005994',
          light: '#1a6ea8',
          dark: '#004d7c',
        },
        accent: {
          DEFAULT: '#87c71f',
          light: '#9ad43c',
          dark: '#76ad17',
        },
        secondary: {
          DEFAULT: '#f5f5f5',
          dark: '#e0e0e0',
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },
    },
  },
  plugins: [],
}
