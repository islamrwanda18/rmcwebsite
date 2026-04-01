/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rmc-green': '#059669', 
        'rmc-dark-green': '#064e3b', 
        'rmc-blue': '#1e40af', 
        'rmc-black': '#111827',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
      }
    },
  },
  plugins: [],
}
