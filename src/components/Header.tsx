import { useState } from "react";
import { useText } from "../cms/useText";
import { loadTranslations } from "../cms/loadTranslation";
import logo from "../assets/logo.png";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<"ru" | "kz">(
    () => (localStorage.getItem("language") as "ru" | "kz") || "ru"
  );

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const switchLang = async (lang: "ru" | "kz") => {
    await loadTranslations(lang);
    setCurrentLang(lang);
    localStorage.setItem("language", lang);
  };

  // Получаем тексты из store
  const headerTitle = useText("header.title");
  const navAbout = useText("header.nav.about");
  const navServices = useText("header.nav.services");
  const navValues = useText("header.nav.values");
  const navContact = useText("header.nav.contact");

  return (
    <>
      <div
        id="overlay"
        className={menuOpen ? "active overlay" : "overlay"}
        onClick={() => setMenuOpen(false)}
      ></div>

      <header id="header">
        <div className="nav-container">
          <a href="#top" className="logo">
            <div className="logo-mark">
              <img src={logo} alt="Логотип" />
            </div>
            <span>{headerTitle}</span>
          </a>

          <button
            id="mobileToggle"
            className={menuOpen ? "active mobile-toggle" : "mobile-toggle"}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav
            id="mainNav"
            className={menuOpen ? "active" : ""}
          >
            <a href="#about" onClick={() => setMenuOpen(false)}>{navAbout}</a>
            <a href="#services" onClick={() => setMenuOpen(false)}>{navServices}</a>
            <a href="#values" onClick={() => setMenuOpen(false)}>{navValues}</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>{navContact}</a>

            <div className="lang-switcher">
              <span
                id="langRu"
                className={currentLang === "ru" ? "lang-option active" : "lang-option"}
                onClick={() => switchLang("ru")}
              >
                RUS
              </span>
              <span
                id="langKz"
                className={currentLang === "kz" ? "lang-option active" : "lang-option"}
                onClick={() => switchLang("kz")}
              >
                QAZ
              </span>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}