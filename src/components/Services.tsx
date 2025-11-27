function Header() {
  return (
    <section className="section" id="services">
        <div className="section-header">
            <span className="section-badge">Услуги</span>
            <h2 className="section-title">Полный спектр медицинских услуг</h2>
            <p className="section-description">
                Современные методики восстановительного лечения и реабилитации для детей всех возрастов
            </p>
        </div>
        <div className="services-grid">
            <div className="service-card">
                <span className="service-number">01</span>
                <h3>Консультации специалистов</h3>
                <p>Физиотерапевт, врач ЛФК, невролог, травматолог-ортопед для комплексной диагностики и лечения</p>
            </div>
            <div className="service-card">
                <span className="service-number">02</span>
                <h3>Физиотерапия</h3>
                <p>Более 20 видов: лазеротерапия, магнитотерапия, электротерапия, светотерапия, теплотерапия, ультразвуковая терапия</p>
            </div>
            <div className="service-card">
                <span className="service-number">03</span>
                <h3>Массаж и ЛФК</h3>
                <p>Все виды массажа, корригирующая и дыхательная гимнастика, упражнения на фитболах</p>
            </div>
            <div className="service-card">
                <span className="service-number">04</span>
                <h3>Гидрокинезотерапия</h3>
                <p>Водные процедуры для эффективного восстановления двигательных функций организма</p>
            </div>
            <div className="service-card">
                <span className="service-number">05</span>
                <h3>Галокамера</h3>
                <p>Соляная шахта для укрепления иммунитета и органов дыхания — бесплатно для всех пациентов</p>
            </div>
            <div className="service-card">
                <span className="service-number">06</span>
                <h3>Логопедия и психология</h3>
                <p>Восстановительная терапия речи и психологическая коррекция развития ребёнка</p>
            </div>
            <div className="service-card">
                <span className="service-number">07</span>
                <h3>Стопотерапия</h3>
                <p>Специализированные методики для коррекции и укрепления стопы</p>
            </div>
            <div className="service-card">
                <span className="service-number">08</span>
                <h3>Реабилитация детей с ДЦП</h3>
                <p>Особое внимание детям до 5 лет с различными двигательными нарушениями</p>
            </div>
            <div className="service-card">
                <span className="service-number">09</span>
                <h3>Современное оборудование</h3>
                <p>Новейшие тренажёры, компенсационная техника и инновационные методики лечения</p>
            </div>
        </div>
    </section>
  );
}

export default Header;
