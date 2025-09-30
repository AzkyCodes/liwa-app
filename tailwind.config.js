/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a3d62', // biru tua
        accent: '#f1c40f',  // emas
        success: '#27ae60', // hijau
      },
    },
  },
  plugins: [],
}
