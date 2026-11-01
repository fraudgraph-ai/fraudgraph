/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#090d16',
        surface: {
          DEFAULT: '#0d1322',
          subtle: '#11192d',
          elevated: '#15213b',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-light': 'rgba(255, 255, 255, 0.12)',
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          cyan: '#06b6d4',
          electric: '#00e5ff',
        },
        risk: {
          high: '#ef4444',
          'high-glow': 'rgba(239, 68, 68, 0.35)',
          medium: '#f59e0b',
          'medium-glow': 'rgba(245, 158, 11, 0.25)',
          low: '#06b6d4',
          safe: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-red': '0 0 25px -4px rgba(239, 68, 68, 0.5)',
        'glow-blue': '0 0 25px -4px rgba(59, 130, 246, 0.4)',
        'glow-cyan': '0 0 25px -4px rgba(6, 182, 212, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radar 4s linear infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
