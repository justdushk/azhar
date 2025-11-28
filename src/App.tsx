import React, { Suspense } from "react";
import "./index.css";
import "./i18n";
import Header from "./components/Header.tsx";
import Hero from "./components/Hero.tsx";
import About from "./components/About.tsx";
import Services from "./components/Services.tsx";
import Values from "./components/Values.tsx";
import Contacts from "./components/Contact.tsx";
import Footer from "./components/Footer.tsx";

import "./style.css"; // твой CSS
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Smooth scroll для всех якорей
    const anchors = document.querySelectorAll('a[href^="#"]');
    const handleClick = (e: any) => {
      e.preventDefault();
      const href = e.currentTarget.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      const header = document.querySelector("header");
      const headerHeight = header ? header.offsetHeight : 0;
      const top = target.offsetTop - headerHeight;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    };

    anchors.forEach((a) => a.addEventListener("click", handleClick));

    // IntersectionObserver для анимаций
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          <div style={{ opacity: 1, transform: 'translateY(0)'}}>
            Контент
          </div>
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(".service-card, .value-item, .feature");
    elements.forEach((el) => {
      <div style={{ opacity: 1, transform: 'translateY(0)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
        Контент
      </div>
      observer.observe(el);
    });

    // Cleanup
    return () => {
      anchors.forEach((a) => a.removeEventListener("click", handleClick));
      observer.disconnect();
    };
  }, []);

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
