import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import kn from "./locales/kn.json";
import hi from "./locales/hi.json";
import te from "./locales/te.json";
import ta from "./locales/ta.json";
import ml from "./locales/ml.json";

const resources = { en: { translation: en }, kn: { translation: kn }, hi: { translation: hi }, te: { translation: te }, ta: { translation: ta }, ml: { translation: ml } };

const savedLanguage = localStorage.getItem("shopeasy-language") || "en";

void i18n.use(initReactI18next).init({
  resources,
  lng: resources[savedLanguage] ? savedLanguage : "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (language) => {
  localStorage.setItem("shopeasy-language", language);
});

export default i18n;
