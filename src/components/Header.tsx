import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Скролл для добавления класса "scrolled" шапке
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.pageYOffset > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Overlay */}
      <div
        id="overlay"
        className={menuOpen ? "active overlay" : "overlay"}
        onClick={closeMenu}
      ></div>

      <header id="header" className={scrolled ? "scrolled" : ""}>
        <div className="nav-container">
          <a href="#top" className="logo">
            <div className="logo-mark">
              <img src={logo} alt="Логотип" />
            </div>
            <span>КГП на ПХВ "Областной реабилитационный центр"</span>
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

          <nav id="mainNav" className={menuOpen ? "active" : ""}>
            <a href="#about" onClick={closeMenu}>О центре</a>
            <a href="#services" onClick={closeMenu}>Услуги</a>
            <a href="#values" onClick={closeMenu}>Ценности</a>
            <a href="#contact" onClick={closeMenu}>Контакты</a>
          </nav>
        </div>
      </header>
    </>
  );
}

export default Header;
