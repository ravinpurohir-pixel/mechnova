/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#061224',
          900: '#0B1F3B',
          800: '#102A4E',
          700: '#163868',
          600: '#1E4B8B',
        },
        primary: {
          DEFAULT: '#007BFF',
          hover: '#0062CC',
          light: '#3395FF',
          dark: '#0056B3',
        },
        cyan: {
          accent: '#4FC3FF',
          glow: '#78D2FF',
          muted: '#2794D4',
        },
        surface: {
          light: '#E8F6FF',
          card: '#FFFFFF',
          subtle: '#F4FAFF',
          border: '#D0E7FF',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Noto Sans Gujarati', 'system-ui', 'sans-serif'],
        gujarati: ['Noto Sans Gujarati', 'Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(79, 195, 255, 0.45)',
        'glow-primary': '0 0 25px -4px rgba(0, 123, 255, 0.5)',
        'card-soft': '0 10px 30px -5px rgba(11, 31, 59, 0.08), 0 4px 6px -2px rgba(11, 31, 59, 0.04)',
      }
    },
  },
  plugins: [],
}
