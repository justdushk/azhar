import { Suspense, useEffect } from "react";
import { useContentStore } from "./cms/contentStore";
import "./i18n";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Values from "./components/Values";
import Contacts from "./components/Contact";
import Footer from "./components/Footer";
import { loadTranslations } from "./cms/loadTranslation";

import "./style.css";

function App() {
  // ====== 1. загрузка языка ======
  useEffect(() => {
    const savedLang = (localStorage.getItem("language") as "ru" | "kz") || "ru";
    loadTranslations(savedLang);
  }, []);

  // состояние загрузки CMS/переводов
  const isReady = useContentStore((s) => s.isReady);

  // ====== 2. Анимации + Smooth scroll ======
  useEffect(() => {
    if (!isReady) return; // запускаем только когда контент реально загрузился

    // ====== Smooth Scroll ======
    const anchors = document.querySelectorAll('a[href^="#"]');
    const handleClick = (e: Event) => {
      e.preventDefault();

      const targetEl = e.currentTarget as HTMLAnchorElement;
      const href = targetEl.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      const header = document.querySelector("header");
      const headerHeight = header ? (header as HTMLElement).offsetHeight : 0;

      const rect = (target as HTMLElement).getBoundingClientRect();
      const top = window.scrollY + rect.top - headerHeight;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    };

    anchors.forEach((a) => a.addEventListener("click", handleClick));

    // ====== АНИМАЦИИ IntersectionObserver ======
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated-visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const elements = document.querySelectorAll(
      ".service-card, .value-item, .feature"
    );

    elements.forEach((el) => observer.observe(el));

    // ====== Cleanup ======
    return () => {
      anchors.forEach((a) => a.removeEventListener("click", handleClick));
      observer.disconnect();
    };
  }, [isReady]);

  // Пока CMS загружается — белый экран
  if (!isReady) {
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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Values />
        <Contacts />
      </main>
      <Footer />
    </Suspense>
  );
}

export default App;
