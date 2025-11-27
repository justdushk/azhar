function Header() {
  return (
    <section className="section" id="values">
        <div className="section-header">
            <span className="section-badge">Ценности</span>
            <h2 className="section-title">Принципы нашей работы</h2>
            <p className="section-description">
                Мы придерживаемся высоких стандартов в заботе о здоровье каждого ребёнка
            </p>
        </div>
        <div className="values-compact">
            <div className="values-grid-compact">
                <div className="value-item">
                    <div className="value-icon">01</div>
                    <h3>Уважение</h3>
                    <p>К каждому пациенту и коллеге</p>
                </div>
                <div className="value-item">
                    <div className="value-icon">02</div>
                    <h3>Безопасность</h3>
                    <p>Здоровье превыше всего</p>
                </div>
                <div className="value-item">
                    <div className="value-icon">03</div>
                    <h3>Ответственность</h3>
                    <p>За результат каждого лечения</p>
                </div>
                <div className="value-item">
                    <div className="value-icon">04</div>
                    <h3>Коллегиальность</h3>
                    <p>Командная работа специалистов</p>
                </div>
                <div className="value-item">
                    <div className="value-icon">05</div>
                    <h3>Прозрачность</h3>
                    <p>Открытость всех процессов</p>
                </div>
                <div className="value-item">
                    <div className="value-icon">06</div>
                    <h3>Профессионализм</h3>
                    <p>Высокая квалификация команды</p>
                </div>
            </div>
        </div>
    </section>
  );
}

export default Header;
