/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ✅ ADD THIS SAFELIST BLOCK
  safelist: [
    'container',
  ],
  theme: {
    extend: {
      colors: {
        'theme-background': '#FDF9F8',
        'theme-surface': '#FFFFFF',
        'theme-primary': '#A97B60',
        'theme-text-primary': '#333333',
        'theme-text-secondary': '#8A8A8A',
        'theme-accent-green': '#4CAF50',
        'theme-accent-red': '#D9534F',
      },
    },
  },
  plugins: [],
}