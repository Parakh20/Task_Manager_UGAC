// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        // Soft, floating neumorphic shadows
        'neumorph': '0 4px 24px 0 rgba(0,0,0,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.06)',
        'neumorph-hover': '0 8px 32px 0 rgba(0,0,0,0.14), 0 2px 8px 0 rgba(0,0,0,0.10)',
        'neumorph-inner': 'inset 2px 2px 8px 0 rgba(0,0,0,0.08), inset -2px -2px 8px 0 rgba(255,255,255,0.10)',
        // Extra for drag/active states if you want
        'neumorph-active': '0 12px 40px 0 rgba(59,130,246,0.18), 0 4px 16px 0 rgba(59,130,246,0.10)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e293b',
        },
        // Add your own accent or pastel colors if needed
      },
      transitionProperty: {
        'shadow': 'box-shadow',
        'scale': 'transform',
      },
      // Optionally, add more spacing or fontSize if you want
    },
  },
  plugins: [],
}
