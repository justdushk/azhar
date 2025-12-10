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
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("is_active", true)
      .order("order_index");

    if (!error && data) setMenuItems(data);
  };

  const switchLang = async (lang: "ru" | "kz") => {
    await loadTranslations(lang);
    setCurrentLang(lang);
    localStorage.setItem("language", lang);
  };

  const getText = (key: string) => content[key] || key;

  // верхние пункты меню
  const mainItems = menuItems.filter((item) => !item.parent_id);

  // поиск дочерних пунктов
  const getSubItems = (parentId: string) =>
    menuItems.filter((item) => item.parent_id === parentId);

  // трансформация ссылок
  const normalizeUrl = (url: string) => {
    if (!url) return "#";
    if (url.startsWith("#")) return url;
    return `#${url}`;
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
          {/* Логотип */}
          <a href="#top" className="logo">
            <div className="logo-mark">
              <img src={logo} alt="Логотип" />
            </div>
            <span>{getText("header.title")}</span>
          </a>

          {/* Мобайл кнопка */}
          <button
            id="mobileToggle"
            className={menuOpen ? "active mobile-toggle" : "mobile-toggle"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Меню */}
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

                    <div
                      className={`dropdown-menu ${
                        activeDropdown === item.id ? "active" : ""
                      }`}
                    >
                      {subItems.map((sub) => (
                        <a
                          key={sub.id}
                          href={normalizeUrl(sub.url)}
                          className="dropdown-item"
                          onClick={() => setMenuOpen(false)}
                        >
                          {getText(sub.key)}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <a
                  key={item.id}
                  href={normalizeUrl(item.url)}
                  onClick={() => setMenuOpen(false)}
                >
                  {getText(item.key)}
                </a>
              );
            })}

            {/* Переключатель языка */}
            <div className="lang-switcher">
              <span
                className={
                  currentLang === "ru"
                    ? "lang-option active"
                    : "lang-option"
                }
                onClick={() => switchLang("ru")}
              >
                RUS
              </span>
              <span
                className={
                  currentLang === "kz"
                    ? "lang-option active"
                    : "lang-option"
                }
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
