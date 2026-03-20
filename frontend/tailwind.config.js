/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nexus: {
          50: '#f0f4ff',
          100: '#d9e2ff',
          200: '#99b2ff',
          300: '#668cff',
          400: '#3366ff',
          500: '#0040ff',
          600: '#0033cc',
          700: '#002699',
          800: '#001a66',
          900: '#000d33',
        },
      },
    },
  },
  plugins: [],
}
