import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { 
  LayoutDashboard, 
  Menu, 
  FileText, 
  Layout as LayoutIcon,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function Layout({ children, currentPageName }) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: 'Dashboard', icon: LayoutDashboard },
    { name: 'Навигация', path: 'Navigation', icon: Menu },
    { name: 'Страницы', path: 'Pages', icon: FileText },
    { name: 'Секции', path: 'Sections', icon: LayoutIcon },
  ];

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          {!collapsed && (
            <h1 className="text-xl font-semibold text-slate-800">CMS Admin</h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-slate-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPageName === item.path;
            
            return (
              <Link
                key={item.path}
                to={createPageUrl(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Выход</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}