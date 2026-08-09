import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee', 100: '#fdedd3', 200: '#f9d7a5', 300: '#f5ba6d',
          400: '#f09432', 500: '#ec7a0f', 600: '#dd6005', 700: '#b74808',
          800: '#92390d', 900: '#76300e',
        },
      },
    },
  },
  plugins: [],
};
export default config;
