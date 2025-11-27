// Admin Panel Configuration
const CONFIG = {
  // Supabase configuration
  supabase: {
    url: 'https://ckihknmprthfnsztmgza.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNraWhrbm1wcnRoZm5zenRtZ3phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMjY0MjMsImV4cCI6MjA3OTgwMjQyM30.S0SsJcYbRhWZFtCKw5eJw2M1s0t6THUIVltGvSmfhSM'
  },
  
  // UI settings
  ui: {
    appName: 'Universal Admin Panel',
    itemsPerPage: 20
  }
};

// Make config globally available
window.APP_CONFIG = CONFIG;
