import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        terracota: '#C74A27',
        mostaza: '#F8C440',
        beige: '#F5D9B0',
        naranja: '#F4A259',
        marron: '#5C3B28',
      },
      fontFamily: {
        title: ['Caladea', 'Georgia', 'serif'],
        body: ['Carlito', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
