import { useState, useEffect } from "react";
import { useContentStore } from "../cms/contentStore";
import { loadTranslations } from "../cms/loadTranslation";
import { supabase } from "../cms/supabaseClient";
import logo from "../assets/logo.png";

interface MenuItem {
  id: string;
  key: string;
  url: string;
  order_index: number;
  parent_id: string | null;
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<"ru" | "kz">(
    () => (localStorage.getItem("language") as "ru" | "kz") || "ru"
  );
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const content = useContentStore((s) => s.content);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("is_active", true)
        .order("order_index");

      if (error) {
        console.error("Ошибка загрузки меню:", error);
        return;
      }

      if (data) {
        setMenuItems(data);
      }
    } catch (err) {
      console.error("Непредвиденная ошибка загрузки меню:", err);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const switchLang = async (lang: "ru" | "kz") => {
    await loadTranslations(lang);
    setCurrentLang(lang);
    localStorage.setItem("language", lang);
  };

  const getText = (key: string) => {
    return content[key] || key;
  };

  const headerTitle = getText("header.title");
  const mainItems = menuItems.filter(item => !item.parent_id);
  
  const getSubItems = (parentId: string) => {
    return menuItems.filter(item => item.parent_id === parentId);
  };

  // Функция плавного скролла вверх
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuOpen(false);
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
          <a href="#top" className="logo" onClick={scrollToTop}>
            <div className="logo-mark" onClick={scrollToTop}>
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

          <nav id="mainNav" className={menuOpen ? "active" : ""}>
            {mainItems.map((item) => {
              const subItems = getSubItems(item.id);
              const hasSubItems = subItems.length > 0;

              if (hasSubItems) {
                return (
                  <div 
                    key={item.id}
                    className="nav-item-wrapper has-dropdown"
                    onMouseEnter={() => setActiveDropdown(item.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <span className="nav-link">
                      {getText(item.key)}
                    </span>
                    
                    <div className={`dropdown-menu ${activeDropdown === item.id ? 'active' : ''}`}>
                      {subItems.map((subItem) => (
                        <a 
                          key={subItem.id}
                          href={subItem.url}
                          className="dropdown-item"
                          onClick={() => setMenuOpen(false)}
                        >
                          {getText(subItem.key)}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <a 
                  key={item.id}
                  href={item.url} 
                  onClick={() => setMenuOpen(false)}
                >
                  {getText(item.key)}
                </a>
              );
            })}

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