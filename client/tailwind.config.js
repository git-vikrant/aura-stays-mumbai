/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fbf9f1',
          100: '#f7f1dd',
          200: '#eddcb3',
          300: '#e2c384',
          400: '#d7ab56',
          500: '#c59132',
          600: '#b07728',
          700: '#8e5b22',
          800: '#754922',
          900: '#623d21',
        },
        navy: {
          900: '#0b1329',
          950: '#060a17',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
