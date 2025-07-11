import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    navbar: {
      home: 'Home',
      shop: 'Shop',
      admin: 'Admin'
    },
    home: {
      welcome: "Bienvenue dans l'univers de LE KLOWN 🎪",
      intro: "Plongez dans l'univers circassien de LE KLOWN, entre rires, folie et musique.",
      section1Title: "Un style unique",
      section1Text: "LE KLOWN mélange rap underground, performances de cirque et visuels extravagants.",
      section2Title: "Un show inoubliable",
      section2Text: "Venez voir le spectacle et vivez une expérience hors du commun !"
    },
    shop: {
      title: 'Shop',
      subtitle: 'Find t-shirts, grinders, and other merch signed by LE KLOWN.'
    },
    admin: {
      title: 'Back Office',
      subtitle: 'Manage dates and shop items here.'
    },
    auth: {
      login: 'Sign in with Google',
      logoutTitle: 'Sign out?',
      logout: 'Sign out',
      cancel: 'Cancel'
    },
    
  },
  fr: {
    navbar: {
      home: 'Accueil',
      shop: 'Boutique',
      admin: 'Admin'
    },
    home: {
      welcome: "Bienvenue dans l'univers LE KLOWN 🎪",
      intro: "Plongez dans l'univers circassien de LE KLOWN, entre rires, folie et musique.",
      section1Title: "Un style unique",
      section1Text: "LE KLOWN mélange rap underground, performances de cirque et visuels extravagants.",
      section2Title: "Un show inoubliable",
      section2Text: "Venez voir le spectacle et vivez une expérience hors du commun !"
    },
    shop: {
      title: 'Boutique',
      subtitle: 'Retrouvez ici les t-shirts, grinders et autres articles signés LE KLOWN.'
    },
    admin: {
      title: 'Back Office',
      subtitle: 'Gérez les dates et les articles du shop ici.'
    },
    auth: {
      login: 'Se connecter',
      logoutTitle: 'Se déconnecter ?',
      logout: 'Déconnexion',
      cancel: 'Annuler'
    },
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'en',
  messages
})
