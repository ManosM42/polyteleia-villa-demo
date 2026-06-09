import { useTranslation } from "@/contexts/LanguageContext";

export function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();
  return (
    <div className="lang-pill" role="group" aria-label="Language">
      <button
        type="button"
        className={lang === "en" ? "active" : ""}
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <button
        type="button"
        className={lang === "el" ? "active" : ""}
        onClick={() => setLang("el")}
        aria-pressed={lang === "el"}
      >
        ΕΛ
      </button>
    </div>
  );
}
