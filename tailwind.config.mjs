/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Outfit"', '"Nunito"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'blob': 'blob 10s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'mesh-1': 'mesh-1 15s ease-in-out infinite alternate',
        'mesh-2': 'mesh-2 20s ease-in-out infinite alternate',
        'mesh-3': 'mesh-3 18s ease-in-out infinite alternate',
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
        'brutal': '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'mesh-1': {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(10%, -10%) scale(1.1)' }
        },
        'mesh-2': {
          '0%': { transform: 'translate(0, 0) scale(1.1)' },
          '100%': { transform: 'translate(-10%, 10%) scale(1.2)' }
        },
        'mesh-3': {
          '0%': { transform: 'translate(0, 0) scale(1.2)' },
          '100%': { transform: 'translate(5%, 15%) scale(1.1)' }
        }
      }
    },
  },
  plugins: [],
}