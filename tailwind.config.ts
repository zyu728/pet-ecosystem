import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        surface: {
          bg: '#fafafa',
          card: '#ffffff',
          subtle: '#f4f4f5',
        },
        ink: {
          primary: '#18181b',
          secondary: '#52525b',
          muted: '#a1a1aa',
          faint: '#d4d4d8',
        },
        line: {
          hairline: '#e4e4e7',
          strong: '#d4d4d8',
        },
        status: {
          success: '#10b981',
          info: '#3b82f6',
          warning: '#f59e0b',
          danger: '#ef4444',
        },
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
        modal: '16px',
      },
      boxShadow: {
        hairline: '0 0 0 1px rgba(0,0,0,0.04)',
        float: '0 4px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)',
        'float-lg': '0 12px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.03)',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'slide-up': 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.15s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
