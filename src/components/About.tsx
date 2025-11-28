import React from "react";
import { useTranslation } from "react-i18next";
import orig from "../assets/orig.jpeg";

export default function About() {
  const { t } = useTranslation();

  return (
    <section className="section" id="about">
        <div className="section-header">
            <span className="section-badge">{t("about.badge")}</span>
            <h2 className="section-title">{t("about.title")}</h2>
            <p className="section-description">
                {t("about.description")}
            </p>
        </div>
        <div className="about-grid">
            <div className="about-image"><img src={orig} alt="Фото-реабилитационного-центра" /></div>
            <div className="feature-list">
                <div className="feature">
                    <div className="feature-icon">01</div>
                    <div className="feature-content">
                        <h3>{t("about.mission.title")}</h3>
                        <p>{t("about.mission.text")}</p>
                    </div>
                </div>
                <div className="feature">
                    <div className="feature-icon">02</div>
                    <div className="feature-content">
                        <h3>{t("about.goal.title")}</h3>
                        <p>{t("about.goal.text")}</p>
                    </div>
                </div>
                <div className="feature">
                    <div className="feature-icon">03</div>
                    <div className="feature-content">
                        <h3>{t("about.approach.title")}</h3>
                        <p>{t("about.approach.text")}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}