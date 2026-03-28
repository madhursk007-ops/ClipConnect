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
        primary: {
          50: '#f0f0ff',
          100: '#e0e0ff',
          200: '#c0c0ff',
          300: '#a0a0ff',
          400: '#8080ff',
          500: '#7F5AF0',
          600: '#6040d0',
          700: '#4030b0',
          800: '#302090',
          900: '#201070',
        },
        accent: {
          50: '#e0f7ff',
          100: '#b3ecff',
          200: '#80dfff',
          300: '#4dd2ff',
          400: '#2CB9FF',
          500: '#1a9fdf',
          600: '#1586bf',
          700: '#0f6d9f',
          800: '#0a547f',
          900: '#053b5f',
        },
        dark: {
          50: '#f8f8fb',
          100: '#f0f0f5',
          200: '#e0e0ef',
          300: '#d0d0df',
          400: '#b0b0bf',
          500: '#0B0B0F',
          600: '#1a1a1f',
          700: '#151520',
          800: '#101015',
          900: '#05050a',
        },
        success: '#4CAF50',
        warning: '#ff9800',
        error: '#f44336',
      },
      fontFamily: {
        heading: ['Sora', 'Space Grotesk', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7F5AF0 0%, #2CB9FF 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #FF2E63 0%, #7F5AF0 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0B0B0F 0%, #1a1a1f 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(127, 90, 240, 0.3)',
        'glow-blue': '0 0 20px rgba(44, 185, 255, 0.3)',
        'glow-pink': '0 0 20px rgba(255, 46, 99, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(127, 90, 240, 0.1)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'gradient': 'gradient 15s ease infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'fade-up': 'fadeInUp 0.6s ease-out',
        'fade-down': 'fadeInDown 0.6s ease-out',
        'fade-left': 'fadeInLeft 0.6s ease-out',
        'fade-right': 'fadeInRight 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'scale-out': 'scaleOut 0.5s ease-out',
        'typewriter': 'typewriter 3.5s steps(40, end)',
        'shimmer': 'shimmer 2s infinite',
        'ripple': 'ripple 0.6s ease-out',
        'tilt': 'tilt 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeInDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeInLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeInRight: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0)', opacity: '0' },
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        tilt: {
          '0%': { transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' },
          '50%': { transform: 'perspective(1000px) rotateX(5deg) rotateY(5deg)' },
          '100%': { transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(127, 90, 240, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(127, 90, 240, 0.8), 0 0 30px rgba(127, 90, 240, 0.4)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      fontSize: {
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
