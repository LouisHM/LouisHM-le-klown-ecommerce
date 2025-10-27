import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    common: {
      // UI
      close: 'Close',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
      required: 'Required',
      optional: 'Optional',
      add: 'Add',
      reset: 'Reset',
      loading: 'Loading…',
      success: 'Success',
      error: 'Error',
      or: 'or',
      contactModal: 'Contact form',

      // Fields
      name: 'Name',
      email: 'Email',
      password: 'Password',
      passwordConfirm: 'Confirm password',
      subject: 'Subject',
      message: 'Message',
      quantity: 'Quantity',
      address: 'Address',
      phone: 'Phone',
      instagram: 'Instagram',

      // Placeholders
      ph: {
        yourName: 'Your name',
        yourEmail: 'Your email',
        yourSubject: 'Your subject',
        yourMessage: 'Your message',
        phone: '+33…',
        address: 'Street and number, apt, ZIP, city, country',
        lastName: 'Smith',
        firstName: 'Anna',
        instagram: 'Your account',
      },

      // Commerce
      total: 'Total',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      stock: {
        in: 'In stock',
        low: 'Low stock',
        out: 'Out of stock',
      },

      // Auth
      login: 'Login',
      logout: 'Logout',
      signIn: 'Sign in',
      signUp: 'Sign up',
      createAccount: 'Create account',
      continueWithGoogle: 'Continue with Google',

      // Generic statuses/messages
      signedIn: 'Signed in!',
      signingIn: 'Signing you in…',
      wait: 'Please wait.',
      checkInbox: 'Check your inbox to confirm your email.',
      passwordMismatch: 'Passwords do not match',

      // Sections
      contact: 'Contact',
      backHome: 'Back to home',
      forbiddenMessage: 'You do not have the required permissions to view this page.',
    },

    navbar: {
      home: 'Home',
      shop: 'Shop',
      admin: 'Admin',
      events: 'Events',
    },

    home: {
      welcome: 'Welcome to the KLOWN universe',
      intro: 'Straight out of a horror film, KLOWN creates a dark universe on the border between Techno, Trance, and Rave, mixing eerie staging and percussive bass. Launched in 2019, its red nose and balloons have traveled the world with dates throughout France and internationally. KLOWN has established itself as a true showman, as technically talented as it is dynamic on stage. So? Do you want a balloon?',
      bookMe: 'Booking',
      seeLive: 'Next shows',
      section1Title: 'Total Immersion',
      section1Text: 'THE KLOWN presents his immersive 3D show.',
      errorVideo: 'Your browser does not support HTML5 videos.',
    },

    shop: {
      title: 'Shop',
      bundleTitle: 'Exclusive bundles',
      productsTitle: 'Products',
      empty: 'No products available at the moment.',
      details: 'View details',
      stockLeft: 'Stock left',
      stock: {
        inStock: '@:common.stock.in',
        lowStock: '@:common.stock.low',
        outOfStock: '@:common.stock.out',
      },
      promo: {
        default: '🎪 Welcome to the shop!',
        freeShipping: '🚚 Free shipping on orders over 25€ 🚚',
        discount10: '🔥 10% off all T-shirts this week',
      },
    },

    cart: {
      title: 'Your Cart',
      items: 'items',
      open: 'Open cart',
      empty: 'Your cart is empty.',
      remove: 'Remove',
      total: '@:common.total',
      checkout: 'Checkout',
      thankYou: 'Thank you for your order!',
      addToCart: 'Add to cart',
      chooseSize: 'Choose a size',
      mustChooseSize: 'Please choose a size before adding to cart',
      quantity: '@:common.quantity',
      clear: 'Clear cart',
      subtotal: '@:common.subtotal',
      selectionRequired: 'Please select the available options.',
      singleSize: 'One size only',
      stockUnavailable: 'Some items are no longer available. Please refresh your cart.',
      stockUnavailableItem: '{item} is no longer available. Please update your cart.',
    },

    checkout: {
      title: 'Place order',
      cartTitle: 'Your cart',
      subtotal: '@:common.subtotal',
      shipping: '@:common.shipping',
      total: '@:common.total',
      freeShippingNote: 'Free shipping from {amount} €.',

      lastName: 'Last name',
      lastName_ph: '@:common.ph.lastName',
      firstName: 'First name',
      firstName_ph: '@:common.ph.firstName',
      address: 'Full address',
      address_ph: '@:common.ph.address',
      email: '@:common.email',
      email_ph: '@:common.ph.yourEmail',
      instagram: '@:common.instagram',
      instagram_ph: '@:common.ph.instagram',
      phone: '@:common.phone',
      phone_ph: '@:common.ph.phone',
      notes: 'Order notes',
      notes_ph: 'Delivery info, preferences, etc.',

      confirm: '@:common.confirm',
      sending: 'Sending…',
    },

    admin: {
      tabEvents: 'Events',
      tabProducts: 'Products',
      tabPacks: 'Packs',
      tabOrders: 'Orders',
      ordersTitle: 'Order tracking',
      ordersHint: 'Orders automatically move to “Deleted” if they are not marked as Paid within 48 hours.',
      showDeletedOrders: 'Show deleted orders',
      showActiveOrders: 'Show active orders',
      refresh: 'Refresh',
      statusFilterLabel: 'Filter',
      statusAll: 'All statuses',
      noOrders: 'No orders to display',
      noDeletedOrders: 'No deleted orders',
      advanceStatus: 'Mark as {status}',
      revertStatus: 'Back to {status}',
      deleteOrder: 'Delete',
      restoreOrder: 'Restore',
      customer: 'Customer',
      statusTimeline: 'Status timeline',
      items: 'Items',
      inStock: '@:common.stock.in',
      products: 'Product Management',
      packsTitle: 'Available packs',
      addProduct: 'Add product',
      editProduct: 'Edit product',
      addPack: 'Add a pack',
      editPack: 'Edit pack',
      addEvent: 'Add Event',
      editEvent: 'Edit Event',
      name: '@:common.name',
      description: 'Description',
      price: 'Price (€)',
      productInfos: 'Product details',
      productFormHint: 'Configure a simple product with optional sizes and colours.',
      packFormHint: 'Compose a bundle by selecting existing products.',
      packInfos: 'Pack details',
      packItems: 'Pack content',
      product: 'Product',
      quantity: '@:common.quantity',
      details: 'Details',
      packItemsShort: 'items',
      packItemsCount: '{count} products',
      packItemHint: 'Choose a product from the catalogue.',
      chooseProduct: 'Select a product',
      options: 'Options',
      sizeHint: 'Leave empty if the product has a single size.',
      colorHint: 'Leave empty if the product has a single colour.',
      sizes: 'Sizes',
      colors: 'Colours',
      size: 'Size',
      color: 'Colour',
      stock: 'Stock',
      stocks: 'Stock rows',
      generateVariants: 'Generate combinations',
      addValue: 'Add value',
      chooseValue: 'Pick a value',
      addVariant: 'Add row',
      totalStock: 'Total stock',
      addImage: 'Add image',
      removeImage: 'Remove',
      imageRequired: 'Add at least one image.',
      imageUrlHint: 'Enter each image URL separately.',
      uploadImageLabel: 'Upload an image (JPG/PNG)',
      uploadImageHelp: 'Files are stored in {bucket}.',
      uploadingImage: 'Uploading…',
      images: 'Images',
      noImage: 'No image',
      saving: '@:common.save',
      save: '@:common.save',
      cancel: '@:common.cancel',
      edit: '@:common.edit',
      delete: '@:common.delete',
      confirmDelete: 'Are you sure you want to delete this item?',
      confirm: '@:common.confirm',
      required: '@:common.required',
      optional: '@:common.optional',
      add: '@:common.add',
      reset: '@:common.reset',
      validationName: 'A name is required.',
      validationPackItems: 'Add at least one product to the pack.',
    },

    auth: {
      modalTitle: 'Authentication',
      signIn: '@:common.signIn',
      signUp: '@:common.signUp',
      createAccount: '@:common.createAccount',
      firstName: '@:checkout.firstName',
      lastName: '@:checkout.lastName',
      firstNamePlaceholder: '@:common.ph.firstName',
      lastNamePlaceholder: '@:common.ph.lastName',
      email: '@:common.email',
      password: '@:common.password',
      passwordConfirm: '@:common.passwordConfirm',
      passwordMismatch: '@:common.passwordMismatch',
      or: '@:common.or',
      continueWithGoogle: '@:common.continueWithGoogle',
      checkInbox: '@:common.checkInbox',
      signedIn: '@:common.signedIn',
      signingIn: '@:common.signingIn',
      wait: '@:common.wait',
      login: '@:common.login',
      logoutTitle: 'Sign out?',
      logout: '@:common.logout',
      cancel: '@:common.cancel',
    },

    events: {
      title: 'Events',
      upcoming: 'Upcoming',
      past: 'Past',
    },

    form: {
      title: 'Contact LE KLOWN',
      labels: {
        name: '@:common.name',
        email: '@:common.email',
        subject: '@:common.subject',
        message: '@:common.message',
      },
      placeholders: {
        yourName: '@:common.ph.yourName',
        yourEmail: '@:common.ph.yourEmail',
        yourSubject: '@:common.ph.yourSubject',
        yourMessage: '@:common.ph.yourMessage',
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
      contact: '@:common.contact',
      contactMe: 'Contact me',
    },

    legal: {
      tos: {
        title: "Terms of Use — {appName}",
        lastUpdated: "Last updated: {date}",
        toc: {
          acceptation: "1. Acceptance of Terms",
          eligibilite: "2. Eligibility",
          compte: "3. User Accounts",
          evenements: "4. Events & Booking",
          boutique: "5. Shop & Orders",
          promotions: "6. Promotions",
          contactForm: "7. Contact Form",
          propriete: "8. Intellectual Property",
          retractation: "9. Right of Withdrawal (Distance sales)",
          garanties: "10. Statutory Warranties",
          prix: "11. Prices, Taxes & Invoicing",
          donnees: "12. Personal Data",
          responsabilite: "13. Liability Limitations",
          resiliation: "14. Suspension & Termination",
          modifs: "15. Changes to Terms",
          droitApplicable: "16. Governing Law & Disputes",
          contact: "17. Contact"
        },
        sections: {
          acceptation: {
            p1: "By accessing or using {appName} (the “App”), you agree to be bound by these Terms of Use. If you do not agree, please do not use the App."
          },
          eligibilite: {
            l1: "You must be at least 13 years old to use the App.",
            l2: "If you are under 18, you may use the App only under the supervision of a parent or legal guardian."
          },
          compte: {
            l1: "Some features (booking, contact, order history) require you to be logged in.",
            l2: "You are responsible for keeping your credentials secure and for all activity under your account.",
            l3: "Provide accurate information and keep it up to date."
          },
          evenements: {
            l1: "Event information (dates, venues, content) is provided for reference and may change.",
            l2: "Booking requests via the App are expressions of interest and subject to written confirmation from us.",
            l3: "Abusive use (spam, offensive content, repeated submissions) may lead to account suspension."
          },
          boutique: {
            l1: "Products are offered subject to availability.",
            l2: "Prices are shown in euros (EUR), all taxes included (TTC), unless stated otherwise.",
            l3: "An order becomes final only after payment confirmation.",
            l4: "Delivery times vary by carrier and destination; delays beyond our control do not incur liability.",
            l5: "Check your shipping address; additional fees may apply in case of error."
          },
          promotions: {
            l1: "Promotions (e.g., free shipping, discount codes) may be offered and can be changed or withdrawn at any time.",
            l2: "Specific promotion terms (period, combinations, exclusions) prevail."
          },
          contactForm: {
            l1: "Access to the form (contact, booking, shop inquiries) may be limited to logged-in users.",
            l2: "A reasonable number of submissions per user is allowed; bulk or automated submissions are prohibited.",
            l3: "Messages may be logged for tracking, security, and anti-abuse purposes."
          },
          propriete: {
            l1: "All App content (text, visuals, logos, design elements, code) is protected and owned by {appName} or its licensors.",
            l2: "Unauthorized reproduction, adaptation, or distribution is prohibited.",
            l3: "User-submitted content remains your responsibility; you grant us a non-exclusive license for App operation purposes."
          },
          retractation: {
            p1: "Under French Consumer Code articles L221-18 et seq., you have a 14-day right of withdrawal from receipt of the goods without providing reasons. Legal exceptions apply (e.g., customized goods, unsealed items for hygiene reasons, digital content delivered after express consent and waiver).",
            p2: "To exercise your right, contact us within the legal timeframe. Goods must be returned in good condition and, where possible, in original packaging. Unless we are at fault, return shipping costs are your responsibility. Refunds are processed according to the law using the original payment method once we receive the return or proof of dispatch."
          },
          garanties: {
            l1: "Legal conformity warranty (French Consumer Code L217-3 et seq.): 2 years from delivery within the EU.",
            l2: "Hidden defects warranty (French Civil Code 1641 et seq.).",
            l3: "These statutory warranties apply independently of any commercial warranty."
          },
          prix: {
            l1: "Prices are in EUR and, unless otherwise stated, tax-inclusive (TTC).",
            l2: "Shipping and any additional fees are displayed before checkout.",
            l3: "An invoice or order summary is provided electronically."
          },
          donnees: {
            p1: "Your use of the App is governed by our Privacy Policy (GDPR), detailing data collection, use, retention, and your rights."
          },
          responsabilite: {
            l1: "The App is provided “as is” and “as available.” We do not guarantee error-free or uninterrupted access.",
            l2: "To the extent permitted by law, we disclaim liability for indirect or non-material damages arising from App use."
          },
          resiliation: {
            l1: "We may suspend or terminate access in case of violations or abusive use.",
            l2: "You may stop using the App at any time; termination does not remove prior obligations (amounts due, etc.)."
          },
          modifs: {
            p1: "We may update these Terms. Continued use after publication constitutes acceptance of the revised Terms."
          },
          droitApplicable: {
            p1: "These Terms are governed by French law. In case of dispute and after attempting amicable resolution, you may use a consumer mediator (French Consumer Code L612-1). French courts have jurisdiction, subject to mandatory consumer protection rules.",
            p2: "Consumer mediation: we subscribe to a mediation scheme. Mediator details: to be completed."
          },
          contact: {
            p1: "For questions about these Terms, after-sales service, withdrawal, or your GDPR rights:"
          }
        }
      },
      privacy: {
        title: "Privacy Policy — {appName}",
        lastUpdated: "Last updated: {date}",
        toc: {
          identite: "1. Data Controller",
          donneesCollectees: "2. Data We Collect",
          finalitesBases: "3. Purposes & Legal Bases (GDPR)",
          duree: "4. Retention Periods",
          destinataires: "5. Recipients & Processors",
          transferts: "6. Transfers outside the EU",
          securite: "7. Data Security",
          vosDroits: "8. Your Rights (GDPR)",
          cookies: "9. Cookies & Trackers",
          mineurs: "10. Children’s Data",
          modifs: "11. Policy Changes",
          contact: "12. Contact"
        },
        sections: {
          identite: {
            p1: "This policy explains how {appName} (“we”) collects and processes your personal data when you use our application and website (the “App”). Data controller: {appName} — details to be completed (legal entity, address)."
          },
          donneesCollectees: {
            l1: "Account data: email, identifier, authentication metadata (via Supabase), creation date, last access.",
            l2: "Contact & booking: subject, message, request type (contact, booking, shop), timestamps, status (rate-limit/anti-spam).",
            l3: "Orders & shop: products, quantities, amounts, currency, shipping/billing address, payment method (tokens/aliases; we never store full card numbers), order status.",
            l4: "Technical logs: IP addresses, device/OS, error and security events, access logs (debugging and fraud prevention).",
            l5: "Preferences: cookie consent, language, theme, communication preferences.",
            note: "Some data is required to deliver the service (e.g., email to create an account). Without it, some features may be unavailable."
          },
          finalitesBases: {
            l1: "Service delivery (contract): account creation/management, order handling, tracking, support, booking.",
            l2: "Legitimate interest: App security, anti-fraud/abuse, continuous improvement (aggregated stats), email rate-limiting.",
            l3: "Legal obligation: accounting/invoicing retention, warranties management, withdrawal right.",
            l4: "Consent: non-essential cookies (analytics/marketing), newsletters, promotional communications (can be withdrawn at any time)."
          },
          duree: {
            l1: "Account: time of use + 2 years of inactivity (then anonymization/deletion unless otherwise required).",
            l2: "Orders & invoicing: 10 years (legal accounting obligation).",
            l3: "Messages (contact/booking): 24 months (tracking, evidence, security).",
            l4: "Technical logs: up to 12 months (security/defense of rights).",
            l5: "Cookies: per type (see cookies section), up to 13 months for consent-based trackers."
          },
          destinataires: {
            p1: "Access is limited to authorized staff and processors strictly necessary to provide the service, including:",
            l1: "Supabase (authentication, database, storage).",
            l2: "Payment gateway (e.g., Stripe/to be completed) — we do not store card numbers.",
            l3: "Logistics providers (shipping/delivery).",
            l4: "Email/messaging tools for transactional emails, if used (to be completed).",
            note: "Data Processing Agreements (DPAs) and instructions are required from processors (GDPR Art. 28)."
          },
          transferts: {
            p1: "When some processors handle data outside the EU/EEA, we apply appropriate safeguards (adequacy decisions, SCCs, additional measures) under GDPR Arts. 44 et seq."
          },
          securite: {
            l1: "Access controls, secure authentication (Supabase), encryption in transit (HTTPS), platform hardening.",
            l2: "Logging of sensitive access, abuse detection, rate-limiting for the contact form.",
            l3: "Secure development practices and periodic review of roles and permissions."
          },
          vosDroits: {
            p1: "You have the rights of access, rectification, erasure, restriction, objection, portability, and the right to withdraw consent at any time for consent-based processing. You may also lodge a complaint with the CNIL (cnil.fr).",
            note: "We may request proof of identity where reasonably necessary. Response within one month (extendable by two months for complex requests)."
          },
          cookies: {
            l1: "Necessary: authentication, cart, security — consent-exempt.",
            l2: "Audience measurement (optional): e.g., self-hosted Matomo or other — subject to consent if not exempt.",
            l3: "Marketing: promotional banners and ad tracking — consent-based.",
            p1: "A banner lets you accept/refuse by category and change preferences at any time from the “Cookies” page or footer.",
            p2: "Indicative retention: preferences (6–12 months), analytics/marketing (up to 13 months), consent logs (evidence) 24 months."
          },
          mineurs: {
            p1: "The App is not intended for children under 13. If you are under 18, use the App under parental/guardian supervision. If data is collected inadvertently, we will delete it upon verified request."
          },
          modifs: {
            p1: "We may update this policy to reflect legal or technical changes. For major changes, we may notify you in the App."
          },
          contact: {
            p1: "For privacy questions, GDPR rights requests, or complaints:"
          }
        }
      }
    }
  
  },

  fr: {
    common: {
      // UI
      close: 'Fermer',
      cancel: 'Annuler',
      save: 'Enregistrer',
      edit: 'Modifier',
      delete: 'Supprimer',
      confirm: 'Confirmer',
      required: 'Requis',
      optional: 'Optionnel',
      add: 'Ajouter',
      reset: 'Réinitialiser',
      loading: 'Chargement…',
      success: 'Succès',
      error: 'Erreur',
      or: 'ou',
      contactModal: 'Formulaire de contact',

      // Fields
      name: 'Nom',
      email: 'Email',
      password: 'Mot de passe',
      passwordConfirm: 'Confirmer le mot de passe',
      subject: 'Sujet',
      message: 'Message',
      quantity: 'Quantité',
      address: 'Adresse complète',
      phone: 'Téléphone',
      instagram: 'Instagram',

      // Placeholders
      ph: {
        yourName: 'Ton nom',
        yourEmail: 'Ton email',
        yourSubject: 'Ton sujet',
        yourMessage: 'Ton message',
        phone: '+33…',
        address: 'Numéro, rue, complément, code postal, ville, pays',
        lastName: 'Dupont',
        firstName: 'Marie',
        instagram: 'Ton compte',
      },

      // Commerce
      total: 'Total',
      subtotal: 'Sous-total',
      shipping: 'Frais de port',
      stock: {
        in: 'En stock',
        low: 'Bientôt épuisé',
        out: 'Épuisé',
      },

      // Auth
      login: 'Se connecter',
      logout: 'Déconnexion',
      signIn: 'Se connecter',
      signUp: 'Créer un compte',
      createAccount: 'Créer un compte',
      continueWithGoogle: 'Continuer avec Google',

      // Generic statuses/messages
      signedIn: 'Connexion réussie !',
      signingIn: 'Connexion en cours…',
      wait: 'Merci de patienter.',
      checkInbox: 'Vérifie ta boîte mail pour confirmer ton compte.',
      passwordMismatch: 'Les mots de passe ne correspondent pas',

      // Sections
      contact: 'Contact',
    },

    navbar: {
      home: 'Accueil',
      shop: 'Boutique',
      admin: 'Admin',
      events: 'Événements',
    },

    home: {
      welcome: 'Bienvenue dans l’univers du KLOWN',
      intro: 'Tout droit sorti d’un film d’horreur, le KLOWN crée un univers sombre à la frontière de la Techno, de la Trance et de la Rave, mêlant mise en scène angoissantes et basses percutantes. Lancé en 2019, son nez rouge et ses ballons ont voyagé à travers le monde avec des dates partout en France et à l’international. Le KLOWN s’est imposé comme un véritable showman, aussi talentueux techniquement que dynamique sur scène. Alors ? Tu veux un ballon ?',
      bookMe: 'Booking',
      seeLive: 'Prochains shows',
      section1Title: 'Immersion Totale',
      section1Text: 'Le KLOWN présente son show 3D immersif.',
      errorVideo: 'Votre navigateur ne supporte pas les vidéos HTML5.',
    },

    shop: {
      title: 'Boutique',
      bundleTitle: 'Packs exclusifs',
      productsTitle: 'Produits',
      empty: 'Aucun produit disponible pour le moment.',
      details: 'Voir détails',
      stockLeft: 'Stock restant',
      stock: {
        inStock: '@:common.stock.in',
        lowStock: '@:common.stock.low',
        outOfStock: '@:common.stock.out',
      },
      promo: {
        default: '🎪 Bienvenue dans la boutique !',
        freeShipping: '🚚 Livraison gratuite dès 25€ d\'achat 🚚',
        discount10: '🔥 -10% sur tous les T-shirts cette semaine',
      },
    },

    cart: {
      title: 'Votre Panier',
      items: 'articles',
      open: 'Ouvrir le panier',
      empty: 'Votre panier est vide.',
      remove: 'Retirer',
      total: '@:common.total',
      checkout: 'Passer la commande',
      thankYou: 'Merci pour votre commande !',
      addToCart: 'Ajouter au panier',
      chooseSize: 'Choisissez une taille',
      mustChooseSize: 'Veuillez choisir une taille avant d’ajouter au panier',
      quantity: '@:common.quantity',
      clear: 'Vider le panier',
      subtotal: '@:common.subtotal',
      selectionRequired: 'Sélectionne les options disponibles.',
      singleSize: 'Taille unique',
      stockUnavailable: 'Certains articles ne sont plus disponibles. Rafraîchis le panier.',
      stockUnavailableItem: '{item} n’est plus disponible. Mets ton panier à jour.',
    },

    checkout: {
      title: 'Passer la commande',
      cartTitle: 'Ton panier',
      subtotal: '@:common.subtotal',
      shipping: '@:common.shipping',
      total: '@:common.total',
      freeShippingNote: 'Frais de port offerts dès {amount} €.',

      lastName: 'Nom',
      lastName_ph: '@:common.ph.lastName',
      firstName: 'Prénom',
      firstName_ph: '@:common.ph.firstName',
      address: '@:common.address',
      address_ph: '@:common.ph.address',
      email: '@:common.email',
      email_ph: '@:common.ph.yourEmail',
      instagram: '@:common.instagram',
      instagram_ph: '@:common.ph.instagram',
      phone: '@:common.phone',
      phone_ph: '@:common.ph.phone',
      notes: 'Précisions pour la commande',
      notes_ph: 'Infos de livraison, préférences, etc.',

      confirm: '@:common.confirm',
      sending: 'Envoi…',
    },

    admin: {
      tabEvents: 'Événements',
      tabProducts: 'Produits',
      tabPacks: 'Packs',
      tabOrders: 'Commandes',
      ordersTitle: 'Suivi des commandes',
      ordersHint: 'Les commandes passent automatiquement en « Supprimée » si elles ne sont pas payées sous 48 h.',
      showDeletedOrders: 'Voir les commandes supprimées',
      showActiveOrders: 'Voir les commandes actives',
      refresh: 'Rafraîchir',
      statusFilterLabel: 'Filtrer',
      statusAll: 'Tous les statuts',
      noOrders: 'Aucune commande à afficher',
      noDeletedOrders: 'Aucune commande supprimée',
      advanceStatus: 'Marquer {status}',
      revertStatus: 'Revenir à {status}',
      deleteOrder: 'Supprimer',
      restoreOrder: 'Restaurer',
      customer: 'Client',
      statusTimeline: 'Historique des statuts',
      items: 'Articles',
      inStock: '@:common.stock.in',
      products: 'Gestion des produits',
      packsTitle: 'Packs disponibles',
      addProduct: 'Ajouter un produit',
      editProduct: 'Modifier le produit',
      addPack: 'Ajouter un pack',
      editPack: 'Modifier le pack',
      addEvent: 'Ajouter un événement',
      editEvent: 'Modifier l’événement',
      name: '@:common.name',
      description: 'Description',
      price: 'Prix (€)',
      productInfos: 'Informations produit',
      productFormHint: 'Configure un produit simple avec tailles et couleurs optionnelles.',
      packFormHint: 'Compose un pack en sélectionnant les produits du catalogue.',
      packInfos: 'Informations pack',
      packItems: 'Contenu du pack',
      product: 'Produit',
      quantity: '@:common.quantity',
      details: 'Détails',
      packItemsShort: 'articles',
      packItemsCount: '{count} produits',
      packItemHint: 'Choisis un produit du catalogue.',
      chooseProduct: 'Sélectionne un produit',
      options: 'Tailles & couleurs',
      sizeHint: 'Laisse vide si le produit n’a qu’une taille.',
      colorHint: 'Laisse vide si le produit n’a qu’une couleur.',
      sizes: 'Tailles',
      colors: 'Couleurs',
      size: 'Taille',
      color: 'Couleur',
      stock: 'Stock',
      stocks: 'Lignes de stock',
      generateVariants: 'Générer les combinaisons',
      addValue: 'Ajouter une valeur',
      chooseValue: 'Choisis une valeur',
      addVariant: 'Ajouter une ligne',
      totalStock: 'Stock total',
      addImage: 'Ajouter une image',
      removeImage: 'Supprimer',
      imageRequired: 'Ajoute au moins une image.',
      imageUrlHint: 'Saisis chaque URL d’image séparément.',
      uploadImageLabel: 'Téléverser une image (JPG/PNG)',
      uploadImageHelp: 'Les fichiers sont stockés dans {bucket}.',
      uploadingImage: 'Téléversement en cours…',
      images: 'Images',
      noImage: 'Aucune image',
      saving: 'Enregistrement…',
      save: '@:common.save',
      cancel: '@:common.cancel',
      edit: '@:common.edit',
      delete: '@:common.delete',
      confirmDelete: 'Voulez-vous vraiment supprimer cet élément ?',
      confirm: '@:common.confirm',
      required: '@:common.required',
      optional: '@:common.optional',
      add: '@:common.add',
      reset: '@:common.reset',
      validationName: 'Le nom est requis.',
      validationPackItems: 'Ajoute au moins un produit au pack.',
    },

    auth: {
      modalTitle: 'Authentification',
      signIn: '@:common.signIn',
      signUp: '@:common.signUp',
      createAccount: '@:common.createAccount',
      firstName: '@:checkout.firstName',
      lastName: '@:checkout.lastName',
      firstNamePlaceholder: '@:common.ph.firstName',
      lastNamePlaceholder: '@:common.ph.lastName',
      email: '@:common.email',
      password: '@:common.password',
      passwordConfirm: '@:common.passwordConfirm',
      passwordMismatch: '@:common.passwordMismatch',
      or: '@:common.or',
      continueWithGoogle: '@:common.continueWithGoogle',
      checkInbox: '@:common.checkInbox',
      signedIn: '@:common.signedIn',
      signingIn: '@:common.signingIn',
      wait: '@:common.wait',
      login: '@:common.login',
      logoutTitle: 'Se déconnecter ?',
      logout: '@:common.logout',
      cancel: '@:common.cancel',
    },

    events: {
      title: 'Événements',
      upcoming: 'À venir',
      past: 'Passés',
    },

    form: {
      title: 'Contacte LE KLOWN',
      labels: {
        name: '@:common.name',
        email: '@:common.email',
        subject: '@:common.subject',
        message: '@:common.message',
      },
      placeholders: {
        yourName: '@:common.ph.yourName',
        yourEmail: '@:common.ph.yourEmail',
        yourSubject: '@:common.ph.yourSubject',
        yourMessage: '@:common.ph.yourMessage',
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
      contact: '@:common.contact',
      contactMe: 'Contacte-moi',
    },
    
    legal: {
      tos: {
        title: "Conditions d’utilisation — {appName}",
        lastUpdated: "Dernière mise à jour : {date}",
        toc: {
          acceptation: "1. Acceptation des Conditions",
          eligibilite: "2. Éligibilité",
          compte: "3. Comptes Utilisateur",
          evenements: "4. Événements & Booking",
          boutique: "5. Boutique & Commandes",
          promotions: "6. Promotions",
          contactForm: "7. Formulaire de Contact",
          propriete: "8. Propriété Intellectuelle",
          retractation: "9. Droit de Rétractation (Vente à distance)",
          garanties: "10. Garanties Légales",
          prix: "11. Prix, Taxes & Facturation",
          donnees: "12. Données Personnelles",
          responsabilite: "13. Limitations de Responsabilité",
          resiliation: "14. Suspension & Résiliation",
          modifs: "15. Modifications des Conditions",
          droitApplicable: "16. Droit Applicable & Litiges",
          contact: "17. Contact"
        },
        sections: {
          acceptation: {
            p1: "En accédant ou en utilisant l’application et le site {appName} (ci-après « l’App »), vous acceptez d’être lié·e par les présentes Conditions d’utilisation. Si vous n’acceptez pas ces Conditions, veuillez ne pas utiliser l’App."
          },
          eligibilite: {
            l1: "Vous devez avoir au moins 13 ans pour utiliser l’App.",
            l2: "Si vous avez moins de 18 ans, l’usage est autorisé sous la supervision d’un parent ou tuteur légal."
          },
          compte: {
            l1: "Certaines fonctionnalités (booking, contact, historique de commandes) requièrent une connexion.",
            l2: "Vous êtes responsable de la confidentialité de vos identifiants et de toute activité réalisée via votre compte.",
            l3: "Fournissez des informations exactes et tenez-les à jour."
          },
          evenements: {
            l1: "Les informations d’événements (dates, lieux, contenus) sont données à titre indicatif et susceptibles d’évoluer.",
            l2: "Les demandes de booking via l’App sont des manifestations d’intérêt soumises à confirmation écrite de notre part.",
            l3: "Toute utilisation abusive (spam, contenus injurieux, envois répétés) peut entraîner la suspension du compte."
          },
          boutique: {
            l1: "Les produits sont proposés dans la limite des stocks disponibles.",
            l2: "Les prix sont affichés en euros (EUR), toutes taxes comprises (TTC), sauf mention contraire.",
            l3: "Une commande n’est définitive qu’après confirmation de paiement.",
            l4: "Les délais de livraison varient selon le transporteur et la destination ; les retards indépendants de notre volonté ne sauraient engager notre responsabilité.",
            l5: "Vérifiez l’adresse de livraison ; en cas d’erreur, des frais supplémentaires peuvent s’appliquer."
          },
          promotions: {
            l1: "Des promotions (ex. frais de port offerts, codes de réduction) peuvent être proposées et sont susceptibles d’être modifiées ou retirées à tout moment.",
            l2: "Les conditions spécifiques d’une promotion (période, cumul, exclusions) prévalent."
          },
          contactForm: {
            l1: "L’accès au formulaire (contact, booking, questions boutique) peut être limité aux utilisateurs connectés.",
            l2: "Un nombre raisonnable d’envois par utilisateur est autorisé ; l’envoi massif ou automatisé est interdit.",
            l3: "Les messages peuvent être journalisés en base pour suivi, sécurité et lutte anti-abus."
          },
          propriete: {
            l1: "Tous les contenus de l’App (textes, visuels, logos, éléments de design, code) sont protégés et appartiennent à {appName} ou à ses concédants.",
            l2: "Toute reproduction, adaptation ou diffusion non autorisée est interdite.",
            l3: "Les contenus transmis par les utilisateurs demeurent sous leur responsabilité ; vous nous accordez une licence non exclusive pour les besoins du fonctionnement de l’App."
          },
          retractation: {
            p1: "Conformément aux articles L221-18 et suivants du Code de la consommation, vous disposez d’un droit de rétractation de 14 jours à compter de la réception du bien, sans avoir à motiver votre décision. Des exceptions légales s’appliquent (notamment : biens personnalisés, scellés ouverts pour raisons d’hygiène, contenu numérique fourni après votre accord exprès et renoncement au délai).",
            p2: "Pour exercer votre droit, contactez-nous dans le délai légal. Les produits doivent être renvoyés en bon état et, si possible, dans leur emballage d’origine. Sauf défaut de notre part, les frais de retour restent à votre charge. Le remboursement intervient selon la loi, via le moyen de paiement initial, une fois le retour reçu ou une preuve d’expédition fournie."
          },
          garanties: {
            l1: "Garantie légale de conformité (articles L217-3 et s. C. conso.) : 2 ans à compter de la délivrance du bien au sein de l’UE.",
            l2: "Garantie des vices cachés (articles 1641 et s. Code civil).",
            l3: "Ces garanties s’appliquent indépendamment d’éventuelles garanties commerciales."
          },
          prix: {
            l1: "Les prix sont indiqués en EUR et, sauf mention contraire, TTC.",
            l2: "Les frais de livraison et autres frais éventuels sont précisés avant validation de la commande.",
            l3: "Une facture ou un récapitulatif de commande est fourni électroniquement."
          },
          donnees: {
            p1: "Votre utilisation de l’App est régie par notre Politique de confidentialité (RGPD), qui précise la collecte, l’usage, la conservation et vos droits."
          },
          responsabilite: {
            l1: "L’App est fournie « en l’état » et « selon disponibilité ». Nous ne garantissons pas l’absence d’erreurs ni l’accès ininterrompu.",
            l2: "Dans la mesure permise par la loi, nous déclinons toute responsabilité pour les dommages indirects ou immatériels résultant de l’usage de l’App."
          },
          resiliation: {
            l1: "Nous pouvons suspendre ou résilier l’accès en cas de violation des présentes ou d’usage abusif.",
            l2: "Vous pouvez cesser d’utiliser l’App à tout moment ; la résiliation ne supprime pas les obligations nées antérieurement (paiements dus, etc.)."
          },
          modifs: {
            p1: "Nous pouvons mettre à jour ces Conditions. La poursuite d’utilisation après publication vaut acceptation des Conditions révisées."
          },
          droitApplicable: {
            p1: "Les présentes sont régies par le droit français. En cas de litige et après tentative de résolution amiable, vous pouvez recourir à un médiateur de la consommation (art. L612-1 C. conso.). Les juridictions françaises compétentes seront seules saisies, sous réserve des dispositions d’ordre public protectrices du consommateur.",
            p2: "Médiation de la consommation : nous adhérons à un dispositif de médiation. Coordonnées du médiateur : à compléter."
          },
          contact: {
            p1: "Pour toute question sur ces Conditions, le service après-vente, la rétractation ou vos droits RGPD :"
          }
        }
      },
      privacy: {
        title: "Politique de confidentialité — {appName}",
        lastUpdated: "Dernière mise à jour : {date}",
        toc: {
          identite: "1. Identité du responsable",
          donneesCollectees: "2. Données que nous collectons",
          finalitesBases: "3. Finalités & bases légales (RGPD)",
          duree: "4. Durées de conservation",
          destinataires: "5. Destinataires & sous-traitants",
          transferts: "6. Transferts hors UE",
          securite: "7. Sécurité des données",
          vosDroits: "8. Vos droits (RGPD)",
          cookies: "9. Cookies & traceurs",
          mineurs: "10. Données des mineurs",
          modifs: "11. Modifications de la politique",
          contact: "12. Contact"
        },
        sections: {
          identite: {
            p1: "La présente politique décrit la manière dont {appName} (ci-après « nous ») collecte et traite vos données personnelles lors de l’utilisation de notre application et site (l’« App »). Responsable du traitement : {appName} — coordonnées à compléter (raison sociale, adresse)."
          },
          donneesCollectees: {
            l1: "Données de compte : email, identifiant, métadonnées d’authentification (via Supabase), date de création, dernier accès.",
            l2: "Contact & booking : sujet, message, type de demande (contact, booking, boutique), horodatage, statut (limitation d’envois anti-spam).",
            l3: "Commandes & boutique : produits, quantités, montants, devise, adresse de livraison/facturation, moyen de paiement (jetons/pseudos ; jamais le n° de carte en clair chez nous), statut de commande.",
            l4: "Logs techniques : adresses IP, device/OS, événements d’erreur et de sécurité, journaux d’accès (débogage et prévention de la fraude).",
            l5: "Préférences : consentement cookies, langue, thème, préférences de communication.",
            note: "Certaines données sont obligatoires pour fournir le service (ex. email pour créer un compte). À défaut, l’accès à certaines fonctionnalités peut être impossible."
          },
          finalitesBases: {
            l1: "Prestation du service (contrat) : création/gestion de compte, prise en charge des commandes, suivi, service client, booking.",
            l2: "Intérêt légitime : sécurité de l’App, lutte anti-fraude/abus, amélioration continue (statistiques agrégées), limitation du nombre d’emails.",
            l3: "Obligation légale : conservation comptable/facturation, gestion des garanties, droit de rétractation.",
            l4: "Consentement : cookies non essentiels (analytics/marketing), newsletters, communications promotionnelles (retirable à tout moment)."
          },
          duree: {
            l1: "Compte : durée d’usage + 2 ans d’inactivité (puis anonymisation/suppression, sauf obligation contraire).",
            l2: "Commandes & facturation : 10 ans (obligation légale comptable).",
            l3: "Messages (contact/booking) : 24 mois (suivi, preuve, sécurité).",
            l4: "Logs techniques : 12 mois maximum (sécurité/défense des droits).",
            l5: "Cookies : durée selon type (voir section cookies), max 13 mois pour les traceurs soumis à consentement."
          },
          destinataires: {
            p1: "Accès limité au personnel habilité et à des sous-traitants strictement nécessaires à l’exécution du service, notamment :",
            l1: "Supabase (authentification, base de données, stockage).",
            l2: "Passerelle de paiement (ex. Stripe/à compléter) — nous ne stockons pas vos numéros de carte.",
            l3: "Fournisseurs logistiques (transport/livraison).",
            l4: "Outils de messagerie/envoi d’emails transactionnels, si utilisés (à compléter).",
            note: "Des clauses de protection des données (DPA) sont imposées à nos sous-traitants (art. 28 RGPD)."
          },
          transferts: {
            p1: "Lorsque certains sous-traitants traitent des données en dehors de l’UE/EEE, nous appliquons des garanties appropriées (décisions d’adéquation, SCC, mesures supplémentaires) conformément aux art. 44 et s. RGPD."
          },
          securite: {
            l1: "Contrôles d’accès, authentification sécurisée (Supabase), chiffrement en transit (HTTPS), durcissement de la plateforme.",
            l2: "Journalisation des accès sensibles, détection d’abus, limitation des envois via le formulaire.",
            l3: "Bonnes pratiques de développement et revue régulière des droits et rôles."
          },
          vosDroits: {
            p1: "Vous disposez des droits d’accès, rectification, effacement, limitation, opposition, portabilité ainsi que du droit de retirer votre consentement à tout moment pour les traitements fondés sur celui-ci. Vous pouvez également introduire une réclamation auprès de la CNIL (cnil.fr).",
            note: "Une preuve d’identité peut être demandée. Délai de réponse : 1 mois (prolongeable de 2 mois si la demande est complexe)."
          },
          cookies: {
            l1: "Nécessaires : authentification, panier, sécurité — exemptés de consentement.",
            l2: "Mesure d’audience (optionnelle) : ex. Matomo auto-hébergé ou autre — soumis à consentement si non exemptée.",
            l3: "Marketing : bannières promotionnelles et tracking publicitaire — soumis à consentement.",
            p1: "Un bandeau permet d’accepter/refuser par catégorie et de modifier vos préférences à tout moment depuis la page « Cookies » ou le pied de page.",
            p2: "Durées indicatives : préférences (6–12 mois), analytics/marketing (max 13 mois), logs de consentement (preuve) 24 mois."
          },
          mineurs: {
            p1: "L’App n’est pas destinée aux moins de 13 ans. Si vous avez moins de 18 ans, utilisez l’App sous la supervision d’un parent/tuteur. En cas de collecte involontaire, nous supprimerons les données sur demande vérifiée."
          },
          modifs: {
            p1: "Nous pouvons mettre à jour la présente politique pour refléter des évolutions légales ou techniques. En cas de changements majeurs, nous pouvons vous en informer dans l’App."
          },
          contact: {
            p1: "Pour questions, exercice de droits RGPD, réclamations ou demandes liées à la confidentialité :"
          }
        }
      }
    }
  },
}

export const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'en',
  messages,
})
