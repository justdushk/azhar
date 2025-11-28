import { useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.png";

export default function Header() {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const switchLang = (lang: "ru" | "kz") => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

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
            <span>{t("header.title")}</span>
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
            <a href="#about" onClick={() => setMenuOpen(false)}>{t("header.nav.about")}</a>
            <a href="#services" onClick={() => setMenuOpen(false)}>{t("header.nav.services")}</a>
            <a href="#values" onClick={() => setMenuOpen(false)}>{t("header.nav.values")}</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>{t("header.nav.contact")}</a>

            <div className="lang-switcher">
              <span
                id="langRu"
                className={i18n.language === "ru" ? "lang-option active" : "lang-option"}
                onClick={() => switchLang("ru")}
              >
                RUS
              </span>
              <span
                id="langKz"
                className={i18n.language === "kz" ? "lang-option active" : "lang-option"}
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
