import { createContext, useContext, useState } from "react";

const LangContext = createContext({ lang: "es", setLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const path = window.location.pathname;
    if (path === "/br" || path.startsWith("/br/")) {
      localStorage.setItem("lz_lang", "pt");
      return "pt";
    }
    return localStorage.getItem("lz_lang") || "es";
  });

  const setLang = (l) => {
    localStorage.setItem("lz_lang", l);
    setLangState(l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);