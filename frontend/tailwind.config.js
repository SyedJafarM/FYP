/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",         // Agar index.html hai to yeh add kar lo
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2C3E50", // Dark Blue Shade (Header/Footer)
        accent: "#E74C3C",  // Red Accent (Buttons, Highlights)
        background: "#F5F5F5", // Light Background
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
