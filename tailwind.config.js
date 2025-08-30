/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'claude-bg': '#1a1a1a',
        'claude-sidebar': '#0f0f0f',
        'claude-border': '#2a2a2a',
        'claude-text': '#f0f0f0',
        'claude-text-secondary': '#a0a0a0',
        'claude-accent': '#ff6b35',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
