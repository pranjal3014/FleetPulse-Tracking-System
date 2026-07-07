/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14201c',
        cream: '#f4f3ec',
        lime: '#c8f55a',
        pine: '#163c31',
        clay: '#d86f45',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Manrope', 'Inter', 'ui-sans-serif'],
      },
      boxShadow: { soft: '0 18px 50px rgba(20,32,28,.09)' },
    },
  },
  plugins: [],
}
