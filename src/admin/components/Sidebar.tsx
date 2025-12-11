import { NavLink } from "react-router-dom";

const translations = {
  ru: {
    adminPanel: "Админ-панель",
    translations: "Переводы",
    menu: "Меню",
    sections: "Секции",
    pages: "Страницы",
  },
  kz: {
    adminPanel: "Админ-панель",
    translations: "Аудармалар",
    menu: "Мәзір",
    sections: "Секциялар",
    pages: "Беттер",
  },
};

interface SidebarProps {
  systemLang: "ru" | "kz";
}

export default function Sidebar({ systemLang }: SidebarProps) {
  const t = translations[systemLang];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>{t.adminPanel}</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink
          to="/azhar/admin/translations"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          🌐 {t.translations}
        </NavLink>
        <NavLink
          to="/azhar/admin/menu"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          📝 {t.menu}
        </NavLink>
        <NavLink
          to="/azhar/admin/sections"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          📄 {t.sections}
        </NavLink>
        <NavLink
          to="/azhar/admin/pages"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          📑 {t.pages}
        </NavLink>
      </nav>
    </aside>
  );
}