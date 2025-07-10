import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    navbar: {
      home: 'Home',
      shop: 'Shop',
      admin: 'Admin'
    },
    home: {
      welcome: 'Welcome to LE KLOWN\'s site 🎪',
      intro: 'Discover upcoming dates, the shop, and the circus universe of your favorite artist.'
    },
    shop: {
      title: 'Shop',
      subtitle: 'Find t-shirts, grinders, and other merch signed by LE KLOWN.'
    },
    admin: {
      title: 'Back Office',
      subtitle: 'Manage dates and shop items here.'
    }
  },
  fr: {
    navbar: {
      home: 'Accueil',
      shop: 'Boutique',
      admin: 'Admin'
    },
    home: {
      welcome: 'Bienvenue sur le site de LE KLOWN 🎪',
      intro: 'Découvrez les prochaines dates, la boutique et tout l’univers cirque de votre artiste préféré.'
    },
    shop: {
      title: 'Boutique',
      subtitle: 'Retrouvez ici les t-shirts, grinders et autres articles signés LE KLOWN.'
    },
    admin: {
      title: 'Back Office',
      subtitle: 'Gérez les dates et les articles du shop ici.'
    }
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'en',
  messages
})
