import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    navbar: {
      home: 'Home',
      shop: 'Shop',
      admin: 'Admin',
      events: 'Events'
    },
    home: {
      welcome: "Welcome to the KLOWN universe",
      intro: "Straight out of a horror movie, the Klown creates a dark universe on the border of Techno, Trance, and Rave, mixing distressing clusters and chilling bass kicks. Started in 2019, his red nose and balloons have traveled the globe with dates all over France as well as the United States, Italy, Turkey, Poland, and Spain. The Klown has established himself as a true showman, as technically talented as he is dynamic on stage. So? Do you also want a balloon?",
      bookMe: "Book me",
      seeLive: "See me live",
      section1Title: "A Unique Style",
      section1Text: "THE KLOWN blends underground rap, circus performances, and extravagant visuals.",
      section2Title: "An Unforgettable Show",
      section2Text: "Come see the show and experience something out of the ordinary!"
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
      events: {
        title: "Events",
        upcoming: "Upcoming",
        past: "Past"
      },
    footer: {
      reservation: "Reservation",
      followUs: "Follow me on",
      allRightsReserved: "All rights reserved",
      contact: "Contact",
    },

  },
  // French translations
  fr: {
    navbar: {
      home: 'Accueil',
      shop: 'Boutique',
      admin: 'Admin',
      events: 'Événements'
    },
    home: {
      welcome: "Bienvenue dans l’univers du KLOWN",
      intro: "Tout droit sorti d’un film d’horreur, le KLOWN crée un univers sombre à la frontière de la Techno, de la Trance et du Rave, mêlant clusters angoissants et basses percutantes. Lancé en 2019, son nez rouge et ses ballons ont voyagé à travers le monde avec des dates partout en France ainsi qu’aux États-Unis, en Italie, en Turquie, en Pologne et en Espagne. Le KLOWN s’est imposé comme un véritable showman, aussi talentueux techniquement que dynamique sur scène. Alors ? Vous voulez aussi un ballon ?",
      bookMe: "Me booker",
      seeLive: "Me voir en live",
      section1Title: "Un style unique",
      section1Text: "Le KLOWN mélange rap underground, performances de cirque et visuels extravagants.",
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
    events: {
        title: "Événements",
        upcoming: "À venir",
        past: "Passés"
      },
    footer: {
      reservation: "Réservation",
      followUs: "Suivez-moi sur",
      allRightsReserved: "Tous droits réservés",
      contact: "Contact",
    },
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'en',
  messages
})
