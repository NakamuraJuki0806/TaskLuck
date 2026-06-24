/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      frontFamily: {
        sans: ['"Noto Sans JP"', 'sans-serif']
      },
      colors: {
        ink: '#0f172a',
        brand: '#0f766e',
        accent: '#f59e0b'
      }
    }
  },
  plugins: []
};
