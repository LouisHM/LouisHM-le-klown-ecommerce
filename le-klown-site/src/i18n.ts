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
      section1Title: "Total Immersion",
      section1Text: "THE KLOWN presents his immersive 3D show during the \"Cirkus\" dates.",
      errorVideo: "Your browser does not support HTML5 videos.",

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
    form: {
      titles: {
        contact: "Contact LE KLOWN",
        booking: "Book LE KLOWN"
      },
      labels: {
        name: "Name",
        email: "Email",
        subject: "Subject",
        message: "Message"
      },
      placeholders: {
        yourName: "Your name",
        yourEmail: "Your email",
        yourSubject: "Your subject",
        yourMessage: "Your message"
      },
      button: "Send message",
      loading: "Sending...",
      success: "Message sent successfully!",
      error: "An error occurred. Please try again."
    },
    footer: {
      listenMe: "Listen to me on",
      followUs: "Follow me on",
      allRightsReserved: "All rights reserved",
      contact: "Contact",
      contactMe: "Contact me",
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
      section1Title: "Immersion Totale",
      section1Text: "Le KLOWN présente son show 3D immersif lors des dates \"Cirkus\".",
      errorVideo: "Votre navigateur ne supporte pas les vidéos HTML5.",
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
    form: {
      titles: {
        contact: "Contact LE KLOWN",
        booking: "Book LE KLOWN"
      },
      labels: {
        name: "Nom",
        email: "Email",
        subject: "Sujet",
        message: "Message"
      },
      placeholders: {
        yourName: "Votre nom",
        yourEmail: "Votre email",
        yourSubject: "Votre sujet",
        yourMessage: "Votre message"
      },
      button: "Envoyer le message",
      loading: "Envoi en cours...",
      success: "Message envoyé avec succès !",
      error: "Une erreur est survenue. Veuillez réessayer."
    },
    footer: {
      listenMe: "Écoutez-moi sur",
      followUs: "Suivez-moi sur",
      allRightsReserved: "Tous droits réservés",
      contact: "Contact",
      contactMe: "Contactez-moi",

    },
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'en',
  messages
})
