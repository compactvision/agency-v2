import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n.use(HttpBackend) // Charge les traductions depuis les fichiers JSON
    .use(LanguageDetector) // Détecte automatiquement la langue
    .use(initReactI18next) // Initialise avec React
    .init({
        fallbackLng: 'en',
        supportedLngs: ['en', 'fr'], // Définissez les langues supportées
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json', // Chemin des fichiers JSON
        },
        interpolation: {
            escapeValue: false, // React gère déjà l'échappement
        },
        debug: false, // Pour déboguer
    });

export default i18n;
