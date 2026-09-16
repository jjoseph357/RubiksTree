/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cube: {
          yellow: '#facc15',
          white: '#f8fafc',
          blue: '#2563eb',
          green: '#16a34a',
          red: '#dc2626',
          orange: '#ea580c',
          gray: '#334155'
        }
      }
    },
  },
  plugins: [],
}
