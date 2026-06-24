import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          bg: '#FAF7F4',
          card: '#FFFFFF',
          border: '#E8DDD5',
          cream: '#F0EAE2',
          tan: '#C4956A',
          'tan-dark': '#A87A52',
          text: '#1C1917',
          muted: '#6B5E52',
          light: '#A89888',
          deep: '#2C1810',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        kenburns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        kenburns: 'kenburns 22s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config
