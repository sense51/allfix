/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        cyan: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        surface: {
          DEFAULT: '#050508',
          50:  '#0d0d14',
          100: '#111118',
          200: '#18181f',
          300: '#1e1e28',
          400: '#252533',
        },
        void: '#020204',
      },
      fontFamily: {
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
        body:    ['"Outfit"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in':       'fadeIn 0.5s ease-out forwards',
        'fade-in-up':    'fadeInUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in-down':  'fadeInDown 0.4s ease-out forwards',
        'slide-up':      'slideUp 0.4s ease-out forwards',
        'scale-in':      'scaleIn 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
        'shimmer':       'shimmer 2s infinite linear',
        'pulse-soft':    'pulseSoft 3s ease-in-out infinite',
        'float':         'float 7s ease-in-out infinite',
        'float-slow':    'float 12s ease-in-out infinite',
        'glow-pulse':    'glowPulse 3s ease-in-out infinite',
        'spin-slow':     'spin 20s linear infinite',
        'orbit':         'orbit 8s linear infinite',
        'aurora':        'aurora 12s ease-in-out infinite alternate',
        'grid-scan':     'gridScan 8s linear infinite',
        'ambient-drift': 'ambientDrift 18s ease-in-out infinite',
        'ambient-drift-reverse': 'ambientDrift 22s ease-in-out infinite reverse',
        'line-sweep':    'lineSweep 4s ease-in-out infinite',
        'border-spin':   'borderSpin 4s linear infinite',
        'tilt-enter':    'tiltEnter 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(32px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        fadeInDown: {
          '0%':   { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':      { transform: 'translateY(-20px) rotate(1deg)' },
          '66%':      { transform: 'translateY(-8px) rotate(-0.5deg)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px 4px rgba(99,102,241,0.2)' },
          '50%':      { boxShadow: '0 0 60px 16px rgba(99,102,241,0.5)' },
        },
        orbit: {
          '0%':   { transform: 'rotate(0deg) translateX(60px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(60px) rotate(-360deg)' },
        },
        aurora: {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        gridScan: {
          '0%':   { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(40px)' },
        },
        ambientDrift: {
          '0%':   { transform: 'translate(0, 0) scale(1)', opacity: '0.4' },
          '33%':  { transform: 'translate(50px, -40px) scale(1.3)', opacity: '0.6' },
          '66%':  { transform: 'translate(-30px, 30px) scale(0.85)', opacity: '0.25' },
          '100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.4' },
        },
        lineSweep: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        borderSpin: {
          '0%':   { '--border-angle': '0deg' },
          '100%': { '--border-angle': '360deg' },
        },
        tiltEnter: {
          '0%':   { opacity: '0', transform: 'perspective(800px) rotateX(12deg) translateY(20px)' },
          '100%': { opacity: '1', transform: 'perspective(800px) rotateX(0deg) translateY(0)' },
        },
      },
      backgroundImage: {
        'grid-lines':
          'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
        'grid-dots':
          'radial-gradient(circle, rgba(99,102,241,0.15) 1px, transparent 1px)',
        'radial-brand': 'radial-gradient(ellipse at center, rgba(99,102,241,0.18) 0%, transparent 70%)',
        'radial-cyan':  'radial-gradient(ellipse at center, rgba(34,211,238,0.12) 0%, transparent 70%)',
        'conic-brand':  'conic-gradient(from 0deg, #6366f1, #22d3ee, #6366f1)',
      },
      boxShadow: {
        'glow-sm':   '0 0 12px 2px rgba(99,102,241,0.25)',
        'glow-md':   '0 0 30px 6px rgba(99,102,241,0.3)',
        'glow-lg':   '0 0 60px 16px rgba(99,102,241,0.35)',
        'glow-cyan': '0 0 30px 6px rgba(34,211,238,0.3)',
        'card-glow': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card-hover-glow': '0 16px 48px rgba(0,0,0,0.5), 0 0 30px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
      },
    },
  },
  plugins: [],
};
