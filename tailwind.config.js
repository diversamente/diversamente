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
        sage: {
          50:  '#f4f8f3',
          100: '#e8f0e6',
          200: '#c8dcc4',
          300: '#a0c09a',
          400: '#6b8f62',
          500: '#4a6741',
          600: '#3d5c38',
          700: '#2e4729',
          800: '#1e321a',
          900: '#101d0e',
        },
        accent: '#c8a96e',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
