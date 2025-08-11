/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ✅ Add your custom color palette here
      colors: {
        'theme-background': '#FDF9F8', // A very light, warm off-white
        'theme-surface': '#FFFFFF',    // The clean white for cards
        'theme-primary': '#A97B60',   // The muted brown for buttons/accents
        'theme-text-primary': '#333333',   // A soft, dark gray for main text
        'theme-text-secondary': '#8A8A8A', // A lighter gray for subtext
        'theme-accent-green': '#4CAF50',  // A pleasant green for income
        'theme-accent-red': '#D9534F',    // A soft red for expenses
      },
    },
  },
  plugins: [],
}