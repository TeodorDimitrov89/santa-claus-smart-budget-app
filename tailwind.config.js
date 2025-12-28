/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'christmas-red': {
          light: '#E85370',
          DEFAULT: '#C41E3A',
          dark: '#9A1829',
        },
        'christmas-green': {
          light: '#2D8659',
          DEFAULT: '#165B33',
          dark: '#0E3D22',
        },
        'christmas-gold': {
          light: '#FFE55C',
          DEFAULT: '#FFD700',
          dark: '#CCB200',
        },
      },
      fontFamily: {
        heading: ['"Mountains of Christmas"', 'cursive'],
        body: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
