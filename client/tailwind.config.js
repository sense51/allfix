/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff4e6',
          100: '#ffe3b3',
          200: '#ffc966',
          300: '#ffae1a',
          400: '#ff9500',
          500: '#f97316',  /* vivid orange — ALLFIX primary */
          600: '#ea6b0a',
          700: '#c05208',
          800: '#9a3f08',
          900: '#7c300a',
        },
        surface: {
          50: '#faf8f5',
          100: '#f5f0ea',
        },
        neon: {
          orange: '#ff6a00',
          amber:  '#ffbe00',
          cyan:   '#00d4ff',
          violet: '#8b5cf6',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body:    ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':       'fadeIn 0.5s ease-out forwards',
        'fade-in-up':    'fadeInUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in-down':  'fadeInDown 0.4s ease-out forwards',
        'slide-up':      'slideUp 0.4s ease-out forwards',
        'scale-in':      'scaleIn 0.35s cubic-bezier(0.22,1,0.36,1) forwards',
        'shimmer':       'shimmer 2s infinite linear',
        'pulse-soft':    'pulseSoft 2s ease-in-out infinite',
        'float':         'float 6s ease-in-out infinite',
        'float-slow':    'float 10s ease-in-out infinite',
        'glow-pulse':    'glowPulse 3s ease-in-out infinite',
        'spin-slow':     'spin 12s linear infinite',
        'beam':          'beam 4s ease-in-out infinite',
        'typewriter':    'typewriter 2s steps(40) forwards',
        'cursor-blink':  'cursorBlink 0.8s step-end infinite',
        'orbit':         'orbit 8s linear infinite',
        'slide-in-left': 'slideInLeft 0.7s cubic-bezier(0.22,1,0.36,1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        fadeInDown: {
          '0%':   { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-18px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px 4px rgba(249,115,22,0.25)' },
          '50%':      { boxShadow: '0 0 40px 12px rgba(249,115,22,0.5)' },
        },
        beam: {
          '0%':   { opacity: '0', transform: 'scaleY(0)' },
          '40%':  { opacity: '1' },
          '100%': { opacity: '0', transform: 'scaleY(1)' },
        },
        cursorBlink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        orbit: {
          '0%':   { transform: 'rotate(0deg) translateX(60px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(60px) rotate(-360deg)' },
        },
      },
      backgroundImage: {
        'grid-dark': "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        'radial-glow': "radial-gradient(ellipse at center, rgba(249,115,22,0.15) 0%, transparent 70%)",
        'dot-grid': "radial-gradient(circle, #d1d5db 0.5px, transparent 0.5px), radial-gradient(circle, #d1d5db 0.5px, transparent 0.5px)",
      },
    },
  },
  plugins: [],
};
