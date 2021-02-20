import i18next from 'i18next';
// import XHR from 'i18next-xhr-backend';
import Backend from 'i18next-http-backend';
// import LanguageDetector from 'i18next-browser-languagedetector'; // 浏览器默认语言
import { initReactI18next } from 'react-i18next';
import { getLang } from './LangUtil';
// import { getBrowserLang } from '../utils/Browser';
// console.log('浏览器默认语言', getBrowserLang());
// console.log('浏览器默认语言', langList[getBrowserLang()].v);
const lang = getLang() || 'en_US';


i18next
    .use(Backend)
    // .use(XHR)
    // .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: lang,
        // resources: message,
        backend: { loadPath: `/locales/{{lng}}.json` },
        fallbackLng: lang,
        // resources: {
        //     en_US: {
        //         translation: require('../assets/locales/en_US.json'),
        //     },
        //     zh_CN: {
        //         translation: require('../assets/locales/zh_CN.json'),
        //     },
        // },
        preload: [lang],
        debug: false,
        react: { useSuspense: false, wait: true },
        interpolation: { escapeValue: false },
    });

export default i18next;
