import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="hero">
        <div className="hero-container">
            <div className="hero-content">
                <h1>{t("hero.title")}</h1>
                <p>{t("hero.description")}</p>
                <div className="hero-actions">
                    <a href="#contact" className="btn btn-primary">
                        {t("hero.btnPrimary")}
                    </a>
                    <a href="#services" className="btn btn-outline">
                        {t("hero.btnSecondary")}
                    </a>
                </div>
            </div>
            <div className="hero-visual">
                <div className="floating-card card-1">
                    <div className="card-icon">100+</div>
                    <p>{t("hero.card1")}</p>
                </div>
                <div className="floating-card card-2">
                    <div className="card-icon">25+</div>
                    <p>{t("hero.card2")}</p>
                </div>
                <div className="floating-card card-3">
                    <div className="card-icon">10K+</div>
                    <p>{t("hero.card3")}</p>
                </div>
            </div>
        </div>
    </section>
  );
}