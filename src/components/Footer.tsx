import React from "react";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <footer>
        <div className="footer-container">
            <div className="footer-content">
                <h3 className="footer-title">{t("footer.title")}</h3>
                <p className="footer-subtitle">{t("footer.subtitle")}</p>
            </div>
            <div className="footer-divider"></div>
            <div className="footer-copyright">
                <p>{t("footer.copyright")}</p>
            </div>
        </div>
    </footer>
  );
}