import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Menu, FileText, Layout, Layers } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { data: navigation = [], isLoading: loadingNav } = useQuery({
    queryKey: ['navigation'],
    queryFn: () => base44.entities.Navigation.list()
  });

  const { data: pages = [], isLoading: loadingPages } = useQuery({
    queryKey: ['pages'],
    queryFn: () => base44.entities.Page.list()
  });

  const { data: sections = [], isLoading: loadingSections } = useQuery({
    queryKey: ['sections'],
    queryFn: () => base44.entities.Section.list()
  });

  const menuItems = navigation.filter(item => !item.parent_id);
  const subMenuItems = navigation.filter(item => item.parent_id);

  const isLoading = loadingNav || loadingPages || loadingSections;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Обзор системы управления контентом</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Пункты меню"
            value={menuItems.length}
            icon={Menu}
            color="bg-blue-500"
          />
          <StatCard
            title="Подпункты меню"
            value={subMenuItems.length}
            icon={Layers}
            color="bg-green-500"
          />
          <StatCard
            title="Страницы"
            value={pages.length}
            icon={FileText}
            color="bg-purple-500"
          />
          <StatCard
            title="Секции"
            value={sections.length}
            icon={Layout}
            color="bg-orange-500"
          />
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Последние страницы</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : pages.length === 0 ? (
            <p className="text-slate-500 text-sm">Нет созданных страниц</p>
          ) : (
            <div className="space-y-2">
              {pages.slice(0, 5).map((page) => (
                <div key={page.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50">
                  <div>
                    <p className="font-medium text-slate-900">{page.title}</p>
                    <p className="text-sm text-slate-500">{page.slug}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Структура навигации</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : navigation.length === 0 ? (
            <p className="text-slate-500 text-sm">Навигация не создана</p>
          ) : (
            <div className="space-y-2">
              {menuItems.slice(0, 5).map((item) => {
                const children = navigation.filter(n => n.parent_id === item.id);
                return (
                  <div key={item.id} className="p-3 rounded-lg hover:bg-slate-50">
                    <p className="font-medium text-slate-900">{item.label}</p>
                    {children.length > 0 && (
                      <p className="text-sm text-slate-500 mt-1">
                        {children.length} подпунктов
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}