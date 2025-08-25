/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        'typewriter': ['var(--font-typewriter)', 'Courier New', 'monospace'],
        'serif': ['var(--font-serif)', 'Georgia', 'serif'],
        'vintage': ['Courier New', 'monospace'],
      },
      animation: {
        'grid-blur': 'grid-blur 3s ease-in-out infinite',
        'color-shift': 'color-shift 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'grid-blur': {
          '0%, 100%': { filter: 'blur(0px)' },
          '50%': { filter: 'blur(2px)' },
        },
        'color-shift': {
          '0%': { backgroundColor: '#ff6b6b' },
          '25%': { backgroundColor: '#4ecdc4' },
          '50%': { backgroundColor: '#45b7d1' },
          '75%': { backgroundColor: '#96ceb4' },
          '100%': { backgroundColor: '#ff6b6b' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}

