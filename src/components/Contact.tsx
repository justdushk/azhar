import React from "react";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="section" id="contact">
        <div className="contact-wrapper">
            <div className="contact-grid">
                <div className="contact-info">
                    <h2>{t("contact.title")}</h2>
                    <p>{t("contact.description")}</p>
                    <div className="contact-items">
                        <div className="contact-item">
                            <div className="contact-icon">📍</div>
                            <div className="contact-details">
                                <h4>{t("contact.address.title")}</h4>
                                <p>{t("contact.address.text")}</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <div className="contact-icon">💳</div>
                            <div className="contact-details">
                                <h4>{t("contact.osms.title")}</h4>
                                <p>{t("contact.osms.title")}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="contact-items">
                    <div className="contact-item">
                        <div className="contact-icon">📞</div>
                        <div className="contact-details">
                            <h4>{t("contact.registry.title")}</h4>
                            <p><a href="tel:555210">55-52-10</a></p>
                            <p><a href="tel:+77084665715">8 (708) 466-57-15</a></p>
                        </div>
                    </div>
                    <div className="contact-item">
                        <div className="contact-icon">☎</div>
                        <div className="contact-details">
                            <h4>{t("contact.hotline.title")}</h4>
                            <p><a href="tel:553204">55-32-04</a></p>
                        </div>
                    </div>
                    <div className="contact-item">
                        <div className="contact-icon">⏰</div>
                        <div className="contact-details">
                            <h4>{t("contact.schedule.title")}</h4>
                            <p>{t("contact.schedule.text")}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}
