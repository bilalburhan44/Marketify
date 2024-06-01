import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from '../locales/en/en.json';
import ar from '../locales/ar/ar.json';
import ku from '../locales/ku/ku.json';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        translation: en,
      },
      ku: {
        translation: ku,
      },
      ar: {
        translation: ar,
      }
    },
    
    fallbackLng: 'en',
    detection : {
      order: ['htmlTag','localStorage', 'cookie' , 'path' , 'subdomain'],
      caches: ['localStorage' , 'cookie']
    },
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;