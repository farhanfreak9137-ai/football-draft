/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Exact 6-Color Palette from Uxintace
        ocean: {
          abyss: '#031716',    // Deep Abyssal Teal / Pitch Dark Canvas
          pine: '#032F30',     // Midnight Pine / Surface Container Fill
          deep: '#0A7075',     // Ocean Teal / Deep Emerald Borders & Buttons
          teal: '#0C969C',     // Seafoam Turquoise / Glowing Highlights & CTAs
          ice: '#6BA3BE',      // Glacial Sky Cyan / Text & Subtle Labels
          petrol: '#274D60',   // Steel Petrol Slate / Dividers & Outlines
        },
        pitch: {
          night: '#000000',
          dark: '#030806',
          DEFAULT: '#051109',
          light: '#0A7075',
          mow: '#063a3b',
          line: 'rgba(107, 163, 190, 0.45)',
          'line-solid': '#0C969C',
          accent: '#0C969C',
          glow: '#0C969C',
        },
        azure: {
          300: '#8ec0d6',
          400: '#6BA3BE',
          500: '#0C969C',
          600: '#0A7075',
          700: '#000000',
          800: '#000000',
          glow: '#0C969C',
        },
        tactical: {
          950: '#000000',      // Pure pitch black canvas
          900: '#030606',      // Pitch black container
          850: '#070c0c',      // Pitch card container
          800: '#0e1717',      // Pitch sub-container
          750: '#142020',      // Pitch border
          700: '#274D60',      // Steel petrol outline
          650: '#1e5768',
          600: '#0A7075',      // Deep ocean emerald
          500: '#0C969C',      // Seafoam turquoise glow
          400: '#46a5b6',
          300: '#6BA3BE',      // Glacial ice text
          200: '#cbd5e1',
          100: '#ffffff',
        },
        gold: {
          300: '#fde047',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        }
      },
      fontFamily: {
        display: ['Rajdhani', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

