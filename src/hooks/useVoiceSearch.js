import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const recognitionLanguages = {
  en: "en-IN",
  kn: "kn-IN",
  hi: "hi-IN",
  te: "te-IN",
  ta: "ta-IN",
  ml: "ml-IN",
};

function getRecognitionConstructor() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function useVoiceSearch(language, onResult) {
  const { t } = useTranslation();
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");
  const Recognition = getRecognitionConstructor();

  useEffect(() => () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  }, [language]);

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const startListening = () => {
    if (!Recognition) {
      setError(t("nav.voiceUnsupported"));
      return;
    }

    setError("");
    const recognition = new Recognition();
    recognition.lang = recognitionLanguages[language?.split("-")[0]] || "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();
      if (transcript) onResult(transcript);
      else setError(t("nav.voiceNoSpeech"));
    };
    recognition.onerror = (event) => {
      const errorMessages = {
        "not-allowed": "nav.voicePermission",
        "service-not-allowed": "nav.voicePermission",
        "no-speech": "nav.voiceNoSpeech",
        network: "nav.voiceNetwork",
      };
      setError(t(errorMessages[event.error] || "nav.voiceError"));
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setError(t("nav.voiceError"));
      setIsListening(false);
      recognitionRef.current = null;
    }
  };

  const toggleListening = () => {
    if (isListening) stopListening();
    else startListening();
  };

  return { isListening, error, toggleListening };
}

export default useVoiceSearch;
