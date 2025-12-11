import { useEffect, useState } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../cms/supabaseClient';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

export default function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [systemLang, setSystemLang] = useState<"ru" | "kz">("ru");
  const [contentLang, setContentLang] = useState<"ru" | "kz">("ru");
  const [totalKeys, setTotalKeys] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем текущую сессию
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Слушаем изменения авторизации
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Загружаем общее количество ключей переводов
  useEffect(() => {
    if (user) {
      loadTotalKeys();
    }
  }, [user]);

  // Загружаем сохраненные языки из localStorage
  useEffect(() => {
    const savedSystemLang = localStorage.getItem('adminSystemLang') as "ru" | "kz";
    const savedContentLang = localStorage.getItem('adminContentLang') as "ru" | "kz";
    
    if (savedSystemLang) setSystemLang(savedSystemLang);
    if (savedContentLang) setContentLang(savedContentLang);
  }, []);

  const loadTotalKeys = async () => {
    const { count } = await supabase
      .from('translations')
      .select('*', { count: 'exact', head: true });
    
    setTotalKeys(count || 0);
  };

  const handleSystemLangChange = (lang: "ru" | "kz") => {
    setSystemLang(lang);
    localStorage.setItem('adminSystemLang', lang);
  };

  const handleContentLangChange = (lang: "ru" | "kz") => {
    setContentLang(lang);
    localStorage.setItem('adminContentLang', lang);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/azhar/admin');
  };

  if (loading) {
    return (
      <div style={{ 
        width: "100vw", 
        height: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "#f3f4f6"
      }}>
        <div style={{ fontSize: "1.25rem" }}>Загрузка...</div>
      </div>
    );
  }

  // Если не авторизован - редирект на страницу логина
  if (!user) {
    return <Navigate to="/azhar/admin" replace />;
  }

  return (
    <div className="admin-container">
      <Sidebar systemLang={systemLang} />
      
      <div className="main-content-full">
        <Header 
          systemLang={systemLang}
          setSystemLang={handleSystemLangChange}
          contentLang={contentLang}
          setContentLang={handleContentLangChange}
          onLogout={handleLogout}
          totalKeys={totalKeys}
        />
        
        <Outlet context={{ contentLang, systemLang, setTotalKeys }} />
      </div>
    </div>
  );
}