import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locals/en/translation.json';
import translationNE from './locals/np/translation.json';

// Define the resources for each language
const resources = {
  en: {
    translation: translationEN
  },
  ne: {
    translation: translationNE
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en', // If a translation is missing, fallback to English
    interpolation: {
      escapeValue: false // React already escapes strings by default
    }
  });

export default i18n;
