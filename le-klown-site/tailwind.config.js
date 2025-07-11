export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E81C25',   // rouge cirque
        secondary: '#28A4D1', // bleu accent
        secondaryLight: '#A4D1E8', // bleu clair
        accent: '#5fc163',    
        dark: '#000000',      
        light: '#ffffff',
        backgroundDark: '#1F1F1F', // gris clair
        text: '#333333',       // gris foncé      
      },
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
        heading: ['"Lato"', 'sans-serif'], // ex: police cirque fun
      },
    },
  },
  plugins: [],
}
