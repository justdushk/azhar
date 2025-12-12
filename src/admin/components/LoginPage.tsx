import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../cms/supabaseClient";
import { Link } from "react-router-dom";

const translations = {
  ru: {
    title: "Вход в систему",
    subtitle: "Введите ваши учетные данные",
    email: "Email",
    password: "Пароль",
    login: "Войти",
    loginProgress: "Вход...",
    backToSite: "Вернуться на сайт",
    errorGeneric: "Произошла ошибка при входе",
  },
  kz: {
    title: "Жүйеге кіру",
    subtitle: "Есептік деректеріңізді енгізіңіз",
    email: "Email",
    password: "Құпия сөз",
    login: "Кіру",
    loginProgress: "Кіру...",
    backToSite: "Сайтқа оралу",
    errorGeneric: "Кіру кезінде қате пайда болды",
  }
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [systemLang, setSystemLang] = useState<"ru" | "kz">("ru");
  const navigate = useNavigate();
  const t = translations[systemLang];

  useEffect(() => {
    // Проверяем, авторизован ли уже пользователь
    checkSession();
  }, [navigate]);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Login page - checking session:', session?.user?.email);
    
    if (session) {
      console.log('User already logged in, redirecting...');
      navigate('/azhar/admin/translations', { replace: true });
    } else {
      setCheckingSession(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        setError(error.message);
      } else if (data.session) {
        console.log('Login successful, redirecting...');
        // Успешный логин - перенаправляем на страницу переводов
        navigate('/azhar/admin/translations', { replace: true });
      }
    } catch (err) {
      console.error('Login exception:', err);
      setError(t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  // Показываем загрузку пока проверяем сессию
  if (checkingSession) {
    return (
      <div style={{ 
        width: "100vw", 
        height: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}>
        <div style={{ fontSize: "1.25rem", color: "white" }}>Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="login-container">
      {/* Переключатель языка */}
      <div className="login-lang-switcher">
        <button
          className={systemLang === "ru" ? "lang-btn active" : "lang-btn"}
          onClick={() => setSystemLang("ru")}
        >
          RUS
        </button>
        <button
          className={systemLang === "kz" ? "lang-btn active" : "lang-btn"}
          onClick={() => setSystemLang("kz")}
        >
          QAZ
        </button>
      </div>

      <div className="login-card">
        <div className="login-header">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">{t.email}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t.password}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? t.loginProgress : t.login}
          </button>

          <div className="leave-btn-2">
            <Link to="/">
              <span>←</span>
              <span>{t.backToSite}</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}