/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
    },
    extend: {
      colors: {
        primary: {
          50: '#F0F7F9',
          100: '#D6E9EF',
          200: '#ACD3DE',
          300: '#83BDCE',
          400: '#59A7BD',
          500: '#3091AD',
          600: '#1A5F7A',
          700: '#13475B',
          800: '#0D3040',
          900: '#061820',
        },
        accent: {
          50: '#FFF3EB',
          100: '#FFE0CC',
          200: '#FFC199',
          300: '#FFA366',
          400: '#FF8433',
          500: '#FF8C42',
          600: '#E6721F',
          700: '#B35918',
          800: '#804010',
          900: '#4D260A',
        },
        warning: {
          50: '#FDECEA',
          100: '#FBD5D0',
          200: '#F7AAA1',
          300: '#F38072',
          400: '#EF5643',
          500: '#E74C3C',
          600: '#C0392B',
          700: '#922B20',
          800: '#611D16',
          900: '#310E0B',
        },
        gentle: {
          50: '#F0F9F0',
          100: '#D1EDD2',
          200: '#A3DBA5',
          300: '#75C978',
          400: '#47B74B',
          500: '#38A169',
          600: '#2D8154',
          700: '#22613F',
          800: '#16402A',
          900: '#0B2015',
        },
        cream: '#FAF8F5',
        ink: '#2C3E50',
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        sans: ['"Noto Sans SC"', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(26, 95, 122, 0.08)',
        'card-hover': '0 8px 30px rgba(26, 95, 122, 0.15)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'slide-in-left': 'slide-in-left 0.4s ease-out',
      },
    },
  },
  plugins: [],
};
