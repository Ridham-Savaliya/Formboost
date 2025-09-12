/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0080FF",
          50: "#EBF5FF",
          100: "#D6ECFF",
          200: "#ADD6FF",
          600: "#0080FF",
          700: "#0074E6",
        },
      },
      keyframes: {
        progress: {
          '0%': { transform: 'scaleX(0)', transformOrigin: '0% 50%' },
          '60%': { transform: 'scaleX(0.7)', transformOrigin: '0% 50%' },
          '100%': { transform: 'scaleX(1)', transformOrigin: '0% 50%' },
        },
      },
      animation: {
        progress: 'progress 1.2s ease-out',
      },
    },
  },
  plugins: [],
};
