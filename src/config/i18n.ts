import enLumifi from '@/lumifi/themes/en.json';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import language files

const DEFAULT_LANGUAGE = 'en';

i18n.use(initReactI18next).init({
  resources: {
    [DEFAULT_LANGUAGE]: {
      lumifi: enLumifi,
    },
  },
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
