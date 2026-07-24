import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

// Bump this value whenever a catalog changes so shared-hosting/browser caches
// cannot serve an older JSON file alongside a newer JavaScript bundle.
const translationCatalogVersion = '2026-07-24.8';

i18n.use(HttpBackend) // Charge les traductions depuis les fichiers JSON
    .use(LanguageDetector) // Détecte automatiquement la langue
    .use(initReactI18next) // Initialise avec React
    .init({
        fallbackLng: 'fr',
        supportedLngs: ['en', 'fr'], // Définissez les langues supportées
        backend: {
            loadPath: `/locales/{{lng}}/{{ns}}.json?v=${translationCatalogVersion}`,
            requestOptions: {
                cache: 'no-store',
            },
        },
        interpolation: {
            escapeValue: false, // React gère déjà l'échappement
        },
        debug: false, // Pour déboguer
    });

if (typeof document !== 'undefined') {
    const updateDocumentLanguage = (language) => {
        document.documentElement.lang = language.startsWith('fr') ? 'fr' : 'en';
    };

    updateDocumentLanguage(i18n.resolvedLanguage ?? i18n.language ?? 'fr');
    i18n.on('languageChanged', updateDocumentLanguage);
}

export default i18n;
