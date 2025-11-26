// ===== Конфигурация админ-панели =====

// Учетные данные для входа (hardcoded)
export const AUTH_CONFIG = {
    username: 'admin',
    password: 'admin123'
};

// Конфигурация Supabase
// ВАЖНО: Замените эти значения на ваши реальные данные из Supabase
export const SUPABASE_CONFIG = {
    url: 'https://lekfinikofmjbhkqxzkg.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxla2Zpbmlrb2ZtamJoa3F4emtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNDA0OTIsImV4cCI6MjA3OTcxNjQ5Mn0.WcfhUXDmGobTs74swdx-9z_3f6er3k8v3rwWb5BO4TM'
};

// Названия таблиц в БД
export const TABLES = {
    navigation: 'navigation',
    pages: 'pages',
    sections: 'sections',
    sectionContent: 'section_content'
};

// Ключ для localStorage
export const STORAGE_KEYS = {
    authToken: 'admin_auth_token'
};
