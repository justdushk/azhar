// Supabase client initialization
// Note: This file uses Supabase JS client loaded from CDN

let supabaseClient = null;

const SupabaseService = {
  // Initialize Supabase client
  init() {
    if (typeof supabase === 'undefined') {
      console.error('Supabase library not loaded. Make sure to include it from CDN.');
      return false;
    }
    
    const config = window.APP_CONFIG.supabase;
    
    // Check if config is set
    if (!config.url || config.url.includes('your-project') || !config.anonKey || config.anonKey.includes('your-anon-key')) {
      console.error('⚠️ Supabase not configured! Please update config.js with your Supabase credentials.');
      return false;
    }
    
    try {
      supabaseClient = supabase.createClient(config.url, config.anonKey);
      console.log('✅ Supabase client initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Supabase:', error);
      return false;
    }
  },
  
  // Get Supabase client instance
  getClient() {
    if (!supabaseClient) {
      this.init();
    }
    return supabaseClient;
  },
  
  // Navigation methods
  async getNavigation() {
    const { data, error } = await supabaseClient
      .from('navigation')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  async createNavItem(item) {
    const { data, error } = await supabaseClient
      .from('navigation')
      .insert([item])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  async updateNavItem(id, updates) {
    const { data, error } = await supabaseClient
      .from('navigation')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  async deleteNavItem(id) {
    const { error } = await supabaseClient
      .from('navigation')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
  
  // Pages methods
  async getPages() {
    const { data, error } = await supabaseClient
      .from('pages')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  async createPage(page) {
    const { data, error } = await supabaseClient
      .from('pages')
      .insert([page])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  async updatePage(id, updates) {
    const { data, error } = await supabaseClient
      .from('pages')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  async deletePage(id) {
    // First delete related sections
    await supabaseClient
      .from('sections')
      .delete()
      .eq('page_id', id);
    
    // Then delete the page
    const { error } = await supabaseClient
      .from('pages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
  
  // Sections methods
  async getSections(pageId = null) {
    let query = supabaseClient
      .from('sections')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (pageId) {
      query = query.eq('page_id', pageId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
  
  async createSection(section) {
    const { data, error } = await supabaseClient
      .from('sections')
      .insert([section])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  async updateSection(id, updates) {
    const { data, error } = await supabaseClient
      .from('sections')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  async deleteSection(id) {
    // First delete related section_content
    await supabaseClient
      .from('section_content')
      .delete()
      .eq('section_id', id);
    
    // Then delete the section
    const { error } = await supabaseClient
      .from('sections')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
  
  // Section content methods
  async getSectionContent(sectionId) {
    const { data, error } = await supabaseClient
      .from('section_content')
      .select('*')
      .eq('section_id', sectionId);
    
    if (error) throw error;
    return data;
  },
  
  async saveSectionContent(sectionId, contentArray) {
    // Delete existing content
    await supabaseClient
      .from('section_content')
      .delete()
      .eq('section_id', sectionId);
    
    // Insert new content
    const records = contentArray.map(item => ({
      section_id: sectionId,
      key: item.key,
      value: item.value
    }));
    
    const { data, error } = await supabaseClient
      .from('section_content')
      .insert(records)
      .select();
    
    if (error) throw error;
    return data;
  },
  
  // Dashboard stats
  async getStats() {
    const [pages, sections, navigation] = await Promise.all([
      supabaseClient.from('pages').select('id', { count: 'exact', head: true }),
      supabaseClient.from('sections').select('id', { count: 'exact', head: true }),
      supabaseClient.from('navigation').select('id', { count: 'exact', head: true })
    ]);
    
    return {
      pages: pages.count || 0,
      sections: sections.count || 0,
      navigation: navigation.count || 0,
      subNavigation: 0 // Will be calculated from parent_id
    };
  }
};

// Make service globally available
window.SupabaseService = SupabaseService;
