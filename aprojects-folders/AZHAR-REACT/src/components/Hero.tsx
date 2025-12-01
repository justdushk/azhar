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
                        Записаться на приём
                    </a>
                    <a href="#services" className="btn btn-outline">
                        Узнать больше
                    </a>
                </div>
            </div>
            <div className="hero-visual">
                <div className="floating-card card-1">
                    <div className="card-icon">100+</div>
                    <p>Посещений в смену</p>
                </div>
                <div className="floating-card card-2">
                    <div className="card-icon">25+</div>
                    <p>Лет опыта</p>
                </div>
                <div className="floating-card card-3">
                    <div className="card-icon">10K+</div>
                    <p>Пациентов ежегодно</p>
                </div>
            </div>
        </div>
    </section>
  );
}