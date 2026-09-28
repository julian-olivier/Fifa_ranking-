/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        chess: {
          darkest: '#161512',
          bg: '#21201d',
          card: '#272522',
          elevated: '#312e2b',
          border: '#3d3934',
          subtle: '#48443e',
          text: '#f1ede4',
          muted: '#a8a39a',
          green: {
            DEFAULT: '#81b64c',
            hover: '#95c861',
            dark: '#5d8532',
            light: '#b1e078',
          },
          gold: {
            DEFAULT: '#f0c15c',
            glow: '#f3c83e',
            dark: '#c79b2a',
          },
          red: {
            DEFAULT: '#fa412d',
            hover: '#e0321f',
            bg: 'rgba(250, 65, 45, 0.15)',
          },
          blue: {
            DEFAULT: '#3692e7',
            hover: '#297cc9',
          }
        },
      },
      fontFamily: {
        chess: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'chess-btn': '0 4px 0 #588033',
        'chess-btn-active': '0 1px 0 #588033',
        'chess-card': '0 4px 12px rgba(0, 0, 0, 0.4)',
        'chess-modal': '0 16px 36px rgba(0, 0, 0, 0.65)',
        'glow-green': '0 0 20px rgba(129, 182, 76, 0.35)',
        'glow-gold': '0 0 20px rgba(240, 193, 92, 0.4)',
      },
    },
  },
  plugins: [],
};
