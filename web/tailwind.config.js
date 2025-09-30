/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#b4cdff',
          300: '#86acff',
          400: '#5a87ff',
          500: '#3d6bff',
          600: '#2e53db',
          700: '#253fb0',
          800: '#22368f',
          900: '#1f2f74'
        }
      }
    }
  },
  plugins: []
}


