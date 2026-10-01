import type { Config } from 'tailwindcss';

/**
 * Дизайн-система Dota Guide.
 * Все цвета и шрифты проекта задаются только здесь.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#0b0e14', deep: '#07090d' },
        panel: { DEFAULT: '#151a23', raised: '#1b212c' },
        line: { DEFAULT: '#232b38', strong: '#2f3a4b' },
        ink: { DEFAULT: '#e8e3d7', muted: '#a3abb9', faint: '#828c9e' },
        blood: { DEFAULT: '#c23c2a', light: '#e0543f', dark: '#8e2a1d' },
        gold: { DEFAULT: '#c8aa6e', light: '#e6cf9c', dark: '#8f7746' },
        attr: {
          str: '#e5484d',
          agi: '#56c271',
          int: '#4aa3df',
          uni: '#c9a86d',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 10px 30px -12px rgba(0,0,0,0.7)',
        'glow-gold': '0 0 0 1px rgba(200,170,110,0.35), 0 8px 32px -8px rgba(200,170,110,0.45)',
        'glow-blood': '0 0 0 1px rgba(194,60,42,0.4), 0 8px 32px -8px rgba(194,60,42,0.55)',
        'glow-attr': '0 0 0 1px var(--attr-color), 0 14px 40px -10px var(--attr-color)',
      },
      backgroundImage: {
        'gold-sheen': 'linear-gradient(135deg, #e6cf9c 0%, #c8aa6e 45%, #8f7746 100%)',
        'blood-sheen': 'linear-gradient(135deg, #e0543f 0%, #c23c2a 50%, #8e2a1d 100%)',
        noise:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.6)', opacity: '0.9' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(2%, -3%, 0) scale(1.06)' },
        },
        ember: {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
          '10%': { opacity: '0.9' },
          '100%': { transform: 'translateY(-110vh) translateX(40px)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.2,0.6,0.4,1) infinite',
        drift: 'drift 18s ease-in-out infinite',
        ember: 'ember linear infinite',
        shimmer: 'shimmer 6s linear infinite',
        float: 'float 5s ease-in-out infinite',
      },
      maxWidth: { content: '76rem' },
    },
  },
  plugins: [],
} satisfies Config;
