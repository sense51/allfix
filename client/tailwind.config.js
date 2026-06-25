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
          500: '#f97316',
          600: '#ea6b0a',
          700: '#c05208',
          800: '#9a3f08',
          900: '#7c300a',
        },
        surface: {
          DEFAULT: '#131313',
          50: '#1a1a1a',
          100: '#1e1e1e',
          200: '#252525',
          300: '#2a2a2a',
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
        'grid-scan':     'gridScan 8s linear infinite',
        'ambient-drift': 'ambientDrift 15s ease-in-out infinite',
        'ambient-drift-reverse': 'ambientDrift 18s ease-in-out infinite reverse',
        'line-sweep':    'lineSweep 4s ease-in-out infinite',
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
        gridScan: {
          '0%':   { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(40px)' },
        },
        ambientDrift: {
          '0%':   { transform: 'translate(0, 0) scale(1)', opacity: '0.3' },
          '33%':  { transform: 'translate(40px, -30px) scale(1.2)', opacity: '0.5' },
          '66%':  { transform: 'translate(-20px, 25px) scale(0.9)', opacity: '0.2' },
          '100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.3' },
        },
        lineSweep: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backgroundImage: {
        'grid-blueprint':
          "linear-gradient(rgba(249,115,22,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px)",
        'radial-glow': "radial-gradient(ellipse at center, rgba(249,115,22,0.12) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};
