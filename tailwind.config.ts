import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        panel: 'var(--color-panel)',
        panel2: 'var(--color-panel-2)',
        line: 'var(--color-line)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        accent: '#6C8CFF',
        accent2: '#37C98A',
        success: '#37C98A',
        warning: '#E0A44B',
        danger: '#FF6B6B',
      },
      boxShadow: {
        soft: '0 12px 40px rgba(0, 0, 0, 0.35)',
        panel: '0 1px 0 rgba(255,255,255,0.04), 0 12px 34px rgba(0,0,0,0.28)',
      },
      borderRadius: {
        xl2: '1.125rem',
        '2xl2': '1.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
