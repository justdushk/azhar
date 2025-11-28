import React from "react";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="section" id="values">
        <div className="section-header">
            <span className="section-badge">{t("values.badge")}</span>
            <h2 className="section-title">{t("values.title")}</h2>
            <p className="section-description">
                {t("values.description")}
            </p>
        </div>
        <div className="values-compact">
            <div className="values-grid-compact">
                <div className="value-item">
                    <div className="value-icon">01</div>
                    <h3>{t("values.items.v1.title")}</h3>
                    <p>{t("values.items.v1.text")}</p>
                </div>
                <div className="value-item">
                    <div className="value-icon">02</div>
                    <h3>{t("values.items.v2.title")}</h3>
                    <p>{t("values.items.v2.text")}</p>
                </div>
                <div className="value-item">
                    <div className="value-icon">03</div>
                    <h3>{t("values.items.v3.title")}</h3>
                    <p>{t("values.items.v3.text")}</p>
                </div>
                <div className="value-item">
                    <div className="value-icon">04</div>
                    <h3>{t("values.items.v4.title")}</h3>
                    <p>{t("values.items.v4.text")}</p>
                </div>
                <div className="value-item">
                    <div className="value-icon">05</div>
                    <h3>{t("values.items.v5.title")}</h3>
                    <p>{t("values.items.v5.text")}</p>
                </div>
                <div className="value-item">
                    <div className="value-icon">06</div>
                    <h3>{t("values.items.v6.title")}</h3>
                    <p>{t("values.items.v6.text")}</p>
                </div>
            </div>
        </div>
    </section>
  );
}