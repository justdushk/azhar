import { Suspense, useEffect } from "react";
import { useContentStore } from "./cms/contentStore";
import Header from "./components/Header.tsx";
import Hero from "./components/Hero.tsx";
import About from "./components/About.tsx";
import Services from "./components/Services.tsx";
import Values from "./components/Values.tsx";
import Contacts from "./components/Contact.tsx";
import Footer from "./components/Footer.tsx";
import { loadTranslations } from "./cms/loadTranslation";

import "./style.css";

function App() {
  useEffect(() => {
    const savedLang = (localStorage.getItem("language") as "ru" | "kz") || "ru";
    loadTranslations(savedLang);
  }, []);
  useEffect(() => {
    const anchors = document.querySelectorAll('a[href^="#"]');
    const handleClick = (e: any) => {
      e.preventDefault();
      const href = e.currentTarget.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      const header = document.querySelector("header");
      const headerHeight = header ? header.offsetHeight : 0;
      const top = (target as HTMLElement).offsetTop - headerHeight;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    };

    anchors.forEach((a) => a.addEventListener("click", handleClick));

    const observerOptions = { 
      threshold: 0.1, 
      rootMargin: "0px 0px -50px 0px" 
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = '1';
          (entry.target as HTMLElement).style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(".service-card, .value-item, .feature");
    elements.forEach((el) => {
      const element = el as HTMLElement;
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(element);
    });

    return () => {
      anchors.forEach((a) => a.removeEventListener("click", handleClick));
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  const isReady = useContentStore((s) => s.isReady);

  useEffect(() => {
    const savedLang = (localStorage.getItem("language") as "ru" | "kz") || "ru";
    loadTranslations(savedLang);
  }, []);

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
