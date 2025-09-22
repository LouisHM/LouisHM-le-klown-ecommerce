import { createI18n } from 'vue-i18n'

/**
 * i18n messages
 * - Keep namespaces consistent across locales
 * - Prefer sentence case for labels, title case where appropriate
 */
const messages = {
  // English
  en: {
    common: {
      close: 'Close',
      cancel: 'Cancel',
    },

    navbar: {
      home: 'Home',
      shop: 'Shop',
      admin: 'Admin',
      events: 'Events',
    },

    home: {
      welcome: 'Welcome to the KLOWN universe',
      intro:
        'Straight out of a horror movie, the Klown creates a dark universe on the border of Techno, Trance, and Rave, mixing distressing clusters and chilling bass kicks. Started in 2019, his red nose and balloons have traveled the globe with dates all over France as well as the United States, Italy, Turkey, Poland, and Spain. The Klown has established himself as a true showman, as technically talented as he is dynamic on stage. So? Do you also want a balloon?',
      bookMe: 'Booking',
      seeLive: 'Next shows',
      section1Title: 'Total Immersion',
      section1Text: 'THE KLOWN presents his immersive 3D show during the "Cirkus" dates.',
      errorVideo: 'Your browser does not support HTML5 videos.',
    },

    shop: {
      title: 'Shop',
      details: 'View details',
      stockLeft: 'Stock left',
      stock: {
        inStock: 'In stock',
        lowStock: 'Low stock',
        outOfStock: 'Out of stock',
      },
    },

    cart: {
      title: 'Your Cart',
      items: "items",
      open: "Open cart",
      empty: 'Your cart is empty.',
      remove: 'Remove',
      total: 'Total',
      checkout: 'Checkout',
      thankYou: 'Thank you for your order!',
      addToCart: 'Add to cart',
      chooseSize: 'Choose a size',
      mustChooseSize: 'Please choose a size before adding to cart',
      quantity: 'Quantity',
      clear: 'Clear cart',
      subtotal: 'Subtotal',
    },

    checkout: {
      title: 'Place order',
      cartTitle: 'Your cart',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      total: 'Total',
      freeShippingNote: 'Free shipping from {amount} €.',

      lastName: 'Last name',
      lastName_ph: 'Smith',
      firstName: 'First name',
      firstName_ph: 'Anna',
      address: 'Full address',
      address_ph: 'Street and number, apt, ZIP, city, country',
      email: 'Email',
      email_ph: "Your email",
      instagram_ph: "Your account",   
      phone: 'Phone',
      phone_ph: '+33…',
      instagram: 'Instagram',
      notes: 'Order notes',
      notes_ph: 'Delivery info, preferences, etc.',

      confirm: 'Confirm order',
      sending: 'Sending…',
    },

    admin: {
      tabEvents: 'Events',
      tabProducts: 'Products',
      products: 'Product Management',
      addProduct: 'Add Product',
      editProduct: 'Edit Product',
      addEvent: 'Add Event',
      editEvent: 'Edit Event',
      name: 'Name',
      description: 'Description',
      price: 'Price (€)',
      hasSizes: 'Has sizes',
      sizes: 'Sizes (comma-separated)',
      sizesHelp: 'E.g.: S,M,L,XL',
      stock: 'Stock',
      images: 'Images (comma-separated URLs)',
      imagesHelp: 'E.g.: https://…,https://…',
      date: 'Date',
      location: 'Location',
      imageUrl: 'Image URL',
      ticketUrl: 'Ticket URL',
      instaUrl: 'Instagram URL',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      confirmDelete: 'Are you sure you want to delete this product?',
      confirm: 'Confirm',
      required: 'Required',
      optional: 'Optional',
      add: 'Add',
      reset: 'Reset',
    },

    auth: {
      login: 'Sign in with Google',
      logoutTitle: 'Sign out?',
      logout: 'Sign out',
      cancel: 'Cancel',
    },

    events: {
      title: 'Events',
      upcoming: 'Upcoming',
      past: 'Past',
    },

    form: {
      title: 'Contact LE KLOWN',
      labels: {
        name: 'Name',
        email: 'Email',
        subject: 'Subject',
        message: 'Message',
      },
      placeholders: {
        yourName: 'Your name',
        yourEmail: 'Your email',
        yourSubject: 'Your subject',
        yourMessage: 'Your message',
      },
      button: 'Send message',
      loading: 'Sending...',
      success: 'Message sent successfully!',
      error: 'An error occurred. Please try again.',
    },

    footer: {
      listenMe: 'Listen to me',
      followUs: 'Follow me',
      allRightsReserved: 'All rights reserved',
      contact: 'Contact',
      contactMe: 'Contact me',
    },
  },

  // French
  fr: {
    common: {
      close: 'Fermer',
      cancel: 'Annuler',
    },

    navbar: {
      home: 'Accueil',
      shop: 'Boutique',
      admin: 'Admin',
      events: 'Événements',
    },

    home: {
      welcome: "Bienvenue dans l’univers du KLOWN",
      intro:
        "Tout droit sorti d’un film d’horreur, le KLOWN crée un univers sombre à la frontière de la Techno, de la Trance et du Rave, mêlant clusters angoissants et basses percutantes. Lancé en 2019, son nez rouge et ses ballons ont voyagé à travers le monde avec des dates partout en France ainsi qu’aux États-Unis, en Italie, en Turquie, en Pologne et en Espagne. Le KLOWN s’est imposé comme un véritable showman, aussi talentueux techniquement que dynamique sur scène. Alors ? Vous voulez aussi un ballon ?",
      bookMe: 'Booking',
      seeLive: 'Prochains shows',
      section1Title: 'Immersion Totale',
      section1Text: 'Le KLOWN présente son show 3D immersif lors des dates "Cirkus".',
      errorVideo: 'Votre navigateur ne supporte pas les vidéos HTML5.',
    },

    shop: {
      title: 'Boutique',
      details: 'Voir détails',
      stockLeft: 'Stock restant',
      stock: {
        inStock: 'En stock',
        lowStock: 'Bientôt épuisé',
        outOfStock: 'Épuisé',
      },
    },

    cart: {
      title: 'Votre Panier',
      items: "articles",
      open: "Ouvrir le panier",
      empty: 'Votre panier est vide.',
      remove: 'Retirer',
      total: 'Total',
      checkout: 'Passer la commande',
      thankYou: 'Merci pour votre commande !',
      addToCart: 'Ajouter au panier',
      chooseSize: 'Choisissez une taille',
      mustChooseSize: 'Veuillez choisir une taille avant d’ajouter au panier',
      quantity: 'Quantité',
      clear: 'Vider le panier',
      subtotal: 'Sous-total',
    },

    checkout: {
      title: 'Passer la commande',
      cartTitle: 'Ton panier',
      subtotal: 'Sous-total',
      shipping: 'Frais de port',
      total: 'Total',
      freeShippingNote: 'Frais de port offerts dès {amount} €.',

      lastName: 'Nom',
      lastName_ph: 'Dupont',
      firstName: 'Prénom',
      firstName_ph: 'Marie',
      address: 'Adresse complète',
      address_ph: 'Numéro, rue, complément, code postal, ville, pays',
      email: 'Email',
      email_ph: "Your email",
      instagram_ph: "Your account",
      phone: 'Téléphone',
      phone_ph: '+33…',
      instagram: 'Instagram',
      notes: 'Précisions pour la commande',
      notes_ph: 'Infos de livraison, préférences, etc.',

      confirm: 'Confirmer la commande',
      sending: 'Envoi…',
    },

    admin: {
      tabEvents: 'Événements',
      tabProducts: 'Produits',
      products: 'Gestion des produits',
      addProduct: 'Ajouter un produit',
      editProduct: 'Modifier le produit',
      addEvent: 'Ajouter un Événement',
      editEvent: "Modifier l'Événement",
      name: 'Nom',
      description: 'Description',
      price: 'Prix (€)',
      hasSizes: 'Propose des tailles',
      sizes: 'Tailles (séparées par des virgules)',
      sizesHelp: 'Ex : S,M,L,XL',
      stock: 'Stock',
      required: 'Requis',
      confirm: 'Confirmer',
      optional: 'Optionnel',
      add: 'Ajouter',
      reset: 'Réinitialiser',
      images: 'Images (URLs séparées par virgules)',
      imagesHelp: 'Ex : https://…,https://…',
      date: 'Date',
      location: 'Lieu',
      imageUrl: "URL de l'image",
      ticketUrl: 'URL du billet',
      instaUrl: 'URL Instagram',
      save: 'Enregistrer',
      cancel: 'Annuler',
      edit: 'Modifier',
      delete: 'Supprimer',
      confirmDelete: 'Voulez-vous vraiment supprimer ce produit ?',
    },

    auth: {
      login: 'Se connecter',
      logoutTitle: 'Se déconnecter ?',
      logout: 'Déconnexion',
      cancel: 'Annuler',
    },

    events: {
      title: 'Événements',
      upcoming: 'À venir',
      past: 'Passés',
    },

    form: {
      title: 'Contacte LE KLOWN',
      labels: {
        name: 'Nom',
        email: 'Email',
        subject: 'Sujet',
        message: 'Message',
      },
      placeholders: {
        yourName: 'Ton nom',
        yourEmail: 'Ton email',
        yourSubject: 'Ton sujet',
        yourMessage: 'Ton message',
      },
      button: 'Envoyer le message',
      loading: 'Envoi en cours...',
      success: 'Message envoyé avec succès !',
      error: 'Une erreur est survenue. Veuillez réessayer.',
    },

    footer: {
      listenMe: 'Écoutes-moi',
      followUs: 'Suis-moi',
      allRightsReserved: 'Tous droits réservés',
      contact: 'Contact',
      contactMe: 'Contactes-moi',
    },
  },
}

export const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'en',
  messages,
})

