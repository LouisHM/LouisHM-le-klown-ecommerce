export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts}"
  ],
  theme: {
    extend: {
      keyframes: {
        underlineExpand: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        'underline-hover': 'underlineExpand 0.2s ease-out forwards',
      },
      colors: {
        primary: '#E81C25',   // rouge cirque
        secondary: '#28A4D1', // bleu accent
        secondaryLight: '#A4D1E8', // bleu clair
        accent: '#5fc163',    
        dark: '#000000',      
        light: '#ffffff',
        backgroundDark: '#1F1F1F', // gris clair
        text: '#333333',       // gris foncé      
        transparent: 'rgba(19, 18, 19, 0.9)',
      },
      fontFamily: {
        sans: ['"Poppins"', 'sans-serif'],
        // heading: ['"Lato"', 'sans-serif'], // ex: police cirque fun
        heading: ['"Special Gothic Expanded One"', 'sans-serif'], // ex: police cirque fun
      },
    },
  },
plugins: [
  function ({ addComponents }) {
    addComponents({
      '.form-input': {
        '@apply w-full p-2 rounded bg-dark border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-light': ''
      },
      '.form-textarea': {
        '@apply p-2 rounded bg-dark border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-light': ''
      }
    })
  }
  ],
}
