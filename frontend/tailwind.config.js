/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F3E9DC',
          light: '#FDFBF7',
          dark: '#EAD7BF',
        },
        caramel: {
          DEFAULT: '#C08552',
          light: '#D3A37C',
          dark: '#AC6F3E',
        },
        brownie: {
          DEFAULT: '#5E3023',
          light: '#7D4333',
          dark: '#3F1F15',
        },
        coffee: {
          DEFAULT: '#895737',
          light: '#A57351',
          dark: '#6F4324',
        }
      },
      fontFamily: {
        estetika: ['Estetika', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
