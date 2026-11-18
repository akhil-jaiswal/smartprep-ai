/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/js/**/*.js'
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af'
        },
        surface: {
          canvas: '#f8fafc',
          sidebar: '#f1f5f9',
          card: '#ffffff'
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      fontSize: {
        base: ['1rem', { lineHeight: '1.65' }],
        lg: ['1.125rem', { lineHeight: '1.6' }],
        xl: ['1.375rem', { lineHeight: '1.45' }],
        '2xl': ['1.625rem', { lineHeight: '1.35' }]
      },
      borderRadius: {
        card: '12px',
        control: '8px'
      }
    }
  },
  plugins: []
};
