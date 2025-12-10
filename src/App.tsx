import { Suspense, useEffect, useState } from "react";
import { useContentStore } from "./cms/contentStore";
import { supabase } from "./cms/supabaseClient";
import Header from "./components/Header";
import DynamicSection from "./components/DynamicSection";
import { loadTranslations } from "./cms/loadTranslation";

import "./style.css";

interface SectionItem {
  id: string;
  item_type: string;
  content_key_badge?: string;
  content_key_title?: string;
  content_key_text?: string;
  icon_text?: string;
  order_index: number;
  metadata?: any;
}

interface Section {
  id: string;
  section_key: string;
  section_type: string;
  order_index: number;
  css_classes: string;
  grid_columns?: number;
  items: SectionItem[];
}

function App() {
  const isReady = useContentStore((s) => s.isReady);
  const [sections, setSections] = useState<Section[]>([]);
  const [sectionsLoaded, setSectionsLoaded] = useState(false);

  useEffect(() => {
    const savedLang = (localStorage.getItem("language") as "ru" | "kz") || "ru";
    loadTranslations(savedLang);
  }, []);

  useEffect(() => {
    if (isReady) {
      loadSections();
    }
  }, [isReady]);

  const loadSections = async () => {
    const { data: sectionsData } = await supabase
      .from("sections")
      .select("*")
      .eq("is_active", true)
      .order("order_index");

    if (!sectionsData) return;

    const sectionsWithItems = await Promise.all(
      sectionsData.map(async (section) => {
        const { data: items } = await supabase
          .from("section_items")
          .select("*")
          .eq("section_id", section.id)
          .order("order_index");

        return {
          ...section,
          items: items || [],
        };
      })
    );

    setSections(sectionsWithItems);
    setSectionsLoaded(true);
  };

  useEffect(() => {
    if (!sectionsLoaded) return;

    // ---- Делегирование кликов для якорей (работает с динамическими ссылками) ----
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // closest ищет родительский <a href="#...">
      const anchor = target.closest && (target.closest('a[href^="#"]') as HTMLAnchorElement | null);
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      // предотвращаем стандартный jump
      e.preventDefault();

      // ищем элемент по селектору (href — вроде "#contacts")
      const element = document.querySelector(href) as HTMLElement | null;
      if (!element) return;

      // корректный подсчёт абсолютной позиции
      const header = document.querySelector("header") as HTMLElement | null;
      const headerHeight = header ? header.offsetHeight : 0;

      const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
      const scrollTo = Math.max(0, elementTop - headerHeight);

      window.scrollTo({
        top: scrollTo,
        behavior: "smooth",
      });
    };

    document.addEventListener("click", handleDocumentClick);

    // ---- IntersectionObserver для появления элементов ----
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          element.style.opacity = "1";
          element.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(".service-card, .value-item, .feature");
      elements.forEach((el) => {
        const element = el as HTMLElement;
        element.style.opacity = "0";
        element.style.transform = "translateY(30px)";
        element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(element);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleDocumentClick);
      observer.disconnect();
    };
  }, [sectionsLoaded]);

  if (!isReady || !sectionsLoaded) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "white",
        }}
      />
    );
  }

  const mainSections = sections.filter((s) => s.section_type !== "footer");
  const footerSection = sections.find((s) => s.section_type === "footer");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Header />
      <main>
        {mainSections.map((section) => (
          // важно: DynamicSection должен ставить id секции на корневой элемент,
          // например <section id={section.section_key}> ... </section>
          <DynamicSection key={section.id} section={section} />
        ))}
      </main>
      {footerSection && <DynamicSection section={footerSection} />}
    </Suspense>
  );
}

export default App;
