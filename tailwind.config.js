/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        royal: {
          // ── Core backgrounds ──────────────────────────────
          bg:        '#FAF7F0', // Antique White — page background
          surface:   '#F0E8D8', // Warm Beige — card surfaces
          cream:     '#FDF8F0', // Cream — input backgrounds
          // ── Text & headings ───────────────────────────────
          mahogany:  '#4A1C0A', // Deep Mahogany — primary text & headings
          navy:      '#1B2D4F', // Navy — secondary text, badges, footer
          // ── Action / CTA ──────────────────────────────────
          brown:     '#8B4513', // Rich Brown — buttons, active states
          chocolate: '#6B3410', // Chocolate — hover on brown
          // ── Accent & highlights ───────────────────────────
          gold:      '#C9973A', // Gold — borders, icons, dividers
          amber:     '#E8B45A', // Amber — subtle highlights
          saffron:   '#E8751A', // Saffron — kept as accent option
          // ── Borders ───────────────────────────────────────
          border:    '#D4B896', // Tan — default borders
          // ── Utility ───────────────────────────────────────
          wood:      '#5C3317', // Dark wood — deep accents
          ivory:     '#FFFFF0', // Pure ivory — high-contrast surfaces
          forest:    '#2D5016', // Forest green — eco/natural badges
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
        // Subtle wood grain SVG texture
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%23FAF7F0'/%3E%3Ccircle cx='1' cy='1' r='0.5' fill='%23D4B896' opacity='0.3'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-up':   'slideUp 0.5s ease forwards',
        'wa-pulse':   'waPulse 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:   { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:  { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        waPulse:  {
          '0%,100%': { boxShadow: '0 4px 20px rgba(37,211,102,0.5)' },
          '50%':     { boxShadow: '0 4px 32px rgba(37,211,102,0.8)' },
        },
      },
    },
  },
  plugins: [],
};
