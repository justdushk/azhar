import orig from "../assets/orig.jpeg"; // если положишь orig.jpeg в src/assets

function Header() {
  return (
    <section className="section" id="about">
        <div className="section-header">
            <span className="section-badge">О центре</span>
            <h2 className="section-title">Забота о здоровье детей с 1998 года</h2>
            <p className="section-description">
                Мы обеспечиваем доступную и качественную медицинскую помощь для восстановления и развития детей Павлодарской области
            </p>
        </div>
        <div className="about-grid">
            <div className="about-image"><img src={orig} alt="Фото-реабилитационного-центра" /></div>
            <div className="feature-list">
                <div className="feature">
                    <div className="feature-icon">01</div>
                    <div className="feature-content">
                        <h3>Наша миссия</h3>
                        <p>Оказание доступной, качественной и эффективной медицинской помощи по восстановительному лечению и реабилитации детей</p>
                    </div>
                </div>
                <div className="feature">
                    <div className="feature-icon">02</div>
                    <div className="feature-content">
                        <h3>Наша цель</h3>
                        <p>Развитие, совершенствование и улучшение качества оказания восстановительного лечения и медицинской реабилитации</p>
                    </div>
                </div>
                <div className="feature">
                    <div className="feature-icon">03</div>
                    <div className="feature-content">
                        <h3>Комплексный подход</h3>
                        <p>Мультидисциплинарная бригада специалистов: невролог, врач ЛФК, ортопед-травматолог, физиотерапевт, психолог, логопед</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}

export default Header;
