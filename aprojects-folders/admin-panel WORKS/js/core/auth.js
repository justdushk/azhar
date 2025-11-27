// Authentication module using Supabase Auth
const Auth = {
  supabaseClient: null,
  SESSION_KEY: 'admin_auth_session',
  
  // Initialize Supabase client
  init() {
    if (this.supabaseClient) return this.supabaseClient;
    
    if (typeof supabase === 'undefined') {
      console.error('Supabase library not loaded');
      return null;
    }
    
    const config = window.APP_CONFIG.supabase;
    
    try {
      this.supabaseClient = supabase.createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false
        }
      });
      
      return this.supabaseClient;
    } catch (error) {
      console.error('Failed to initialize Supabase:', error);
      return null;
    }
  },
  
  // Check if user is authenticated
  async isAuthenticated() {
    const client = this.init();
    if (!client) return false;
    
    try {
      const { data: { session }, error } = await client.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
        return false;
      }
      
      return session !== null;
    } catch (error) {
      console.error('Authentication check failed:', error);
      return false;
    }
  },
  
  // Get current user
  async getCurrentUser() {
    const client = this.init();
    if (!client) return null;
    
    try {
      const { data: { user }, error } = await client.auth.getUser();
      
      if (error) {
        console.error('Get user error:', error);
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  },
  
  // Login with email and password
  async login(email, password) {
    const client = this.init();
    if (!client) {
      return { success: false, error: 'Supabase клиент не инициализирован' };
    }
    
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      if (error) {
        console.error('Login error:', error);
        
        // Translate common errors to Russian
        let errorMessage = 'Ошибка входа';
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Неверный email или пароль';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email не подтвержден';
        } else {
          errorMessage = error.message;
        }
        
        return { success: false, error: errorMessage };
      }
      
      if (data.session) {
        console.log('✅ Login successful');
        return { success: true, user: data.user };
      }
      
      return { success: false, error: 'Не удалось создать сессию' };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message || 'Ошибка при входе' };
    }
  },
  
  // Logout
  async logout() {
    const client = this.init();
    if (!client) {
      window.location.href = 'login.html?logout=true';
      return;
    }
    
    try {
      const { error } = await client.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      window.location.href = 'login.html?logout=true';
    }
  },
  
  // Redirect to login if not authenticated
  async requireAuth() {
    const isAuth = await this.isAuthenticated();
    
    if (!isAuth) {
      window.location.href = 'login.html';
      return false;
    }
    
    return true;
  }
};

// Make Auth globally available
window.Auth = Auth;
