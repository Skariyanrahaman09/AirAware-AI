/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        aqi: {
          good: '#10B981',
          moderate: '#FBBF24',
          sensitive: '#F97316',
          unhealthy: '#EF4444',
          veryUnhealthy: '#8B5CF6',
          hazardous: '#881337',
        },
        eco: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(16, 185, 129, 0.08)',
        subtle: '0 2px 10px 0 rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
