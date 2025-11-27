function Header() {
  return (
    <section className="section" id="contact">
        <div className="contact-wrapper">
            <div className="contact-grid">
                <div className="contact-info">
                    <h2>Свяжитесь с нами</h2>
                    <p>Запишитесь на приём или получите консультацию. Мы принимаем детей от 1 года до 18 лет по направлению врача и ОСМС.</p>
                    <div className="contact-items">
                        <div className="contact-item">
                            <div className="contact-icon">📍</div>
                            <div className="contact-details">
                                <h4>Адрес</h4>
                                <p>г. Павлодар, улица Лермонтова, 59</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <div className="contact-icon">💳</div>
                            <div className="contact-details">
                                <h4>Приём по ОСМС</h4>
                                <p>По направлению специалистов первичной медико-санитарной помощи</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="contact-items">
                    <div className="contact-item">
                        <div className="contact-icon">📞</div>
                        <div className="contact-details">
                            <h4>Регистратура</h4>
                            <p><a href="tel:555210">55-52-10</a></p>
                            <p><a href="tel:+77084665715">8 (708) 466-57-15</a></p>
                        </div>
                    </div>
                    <div className="contact-item">
                        <div className="contact-icon">☎</div>
                        <div className="contact-details">
                            <h4>Телефон доверия</h4>
                            <p><a href="tel:553204">55-32-04</a></p>
                        </div>
                    </div>
                    <div className="contact-item">
                        <div className="contact-icon">⏰</div>
                        <div className="contact-details">
                            <h4>Режим работы</h4>
                            <p>Пн-Пт: 8:00 - 18:00</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}

export default Header;
