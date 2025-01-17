const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['InterVariable', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        leafGreen: {
          50: '#f0f8eb',  // Lightest
          100: '#d9eed4',
          200: '#b3dbaa',
          300: '#8dc880',
          400: '#67b456',
          500: '#4a9c3d',  // Base color variant
          600: '#3a6b41',  // Your original color
          700: '#2f5734',  // Darker
          800: '#23412a',  // Even Darker
          900: '#162d1e',  // Darkest
        },
      },
    },
  },
  plugins: [],
};
