import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff5f0', 100: '#ffe8db', 200: '#ffd1b8', 300: '#ffb38a',
          400: '#ff8c5a', 500: '#ff6b35', 600: '#e85d26', 700: '#c44a1f',
          800: '#9e3b1c', 900: '#7d321b',
        },
        accent: {
          green: '#06d6a0',
          blue: '#118ab2',
          pink: '#ef476f',
        },
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.1)',
        'float': '0 8px 30px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        'card': '16px',
        'btn': '12px',
        'modal': '24px',
      },
      animation: {
        'slide-up': 'slideUp 0.25s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 0.5s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
