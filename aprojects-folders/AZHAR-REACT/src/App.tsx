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

function App() {
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
