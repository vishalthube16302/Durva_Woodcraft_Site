/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Royal Craft — Primary Palette
        royal: {
          bg:        '#FAF7F0', // Antique White — page background
          surface:   '#F0E8D8', // Warm Beige — card surfaces
          mahogany:  '#4A1C0A', // Mahogany — primary text & headings
          saffron:   '#E8751A', // Deep Saffron — CTA buttons
          navy:      '#1B2D4F', // Navy — badges, footer, secondary text
          gold:      '#C9973A', // Gold — accent borders, highlights
          amber:     '#E8B45A', // Amber — hover states
          cream:     '#FDF8F0', // Cream — input backgrounds
          border:    '#D4B896', // Tan — borders
        },
      },
      fontFamily: {
        display: ['"Libre Baskerville"', 'Georgia', 'serif'],
        body:    ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'royal-sm': '0 2px 8px rgba(74,28,10,0.08)',
        'royal-md': '0 4px 20px rgba(74,28,10,0.12)',
        'royal-lg': '0 8px 40px rgba(74,28,10,0.18)',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%23FAF7F0'/%3E%3Ccircle cx='1' cy='1' r='0.5' fill='%23D4B896' opacity='0.3'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
