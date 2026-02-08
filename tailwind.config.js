/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pink/Magenta Theme
        primary: '#EC4899', // Pink 500
        magenta: '#D946EF', // Fuchsia 500
        purple: '#A855F7', // Purple 500
        darkPink: '#831843', // Pink 900
        peach: '#FBBF24', // Amber 400 for accents
        void: '#020617', // Slate 950 - Dark background
        glass: 'rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'gradient-pink': 'linear-gradient(to right, #EC4899, #D946EF)',
        'gradient-purple': 'linear-gradient(to right, #D946EF, #A855F7)',
        'gradient-radial': 'radial-gradient(circle, #EC4899, #831843)',
      },
    },
  },
  plugins: [],
}
