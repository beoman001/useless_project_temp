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
        darkbg: '#0B0B0C',
        darktext: '#F7F7F5',
        lightbg: '#F7F7F5',
        lighttext: '#151515',
        kashandi: {
          red: '#EF4444',
          darkred: '#DC2626',
          gold: '#F59E0B',
          dark: '#18181B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'scan-line': 'scan 2s ease-in-out infinite',
        'pulse-alarm': 'pulseAlarm 1.5s infinite alternate'
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(100%)' }
        },
        pulseAlarm: {
          '0%': { boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)' },
          '100%': { boxShadow: '0 0 30px rgba(239, 68, 68, 0.8)' }
        }
      }
    },
  },
  plugins: [],
}
