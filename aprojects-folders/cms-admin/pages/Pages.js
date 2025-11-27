import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageForm from '../components/pages/PageForm';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function Pages() {
  const [editingPage, setEditingPage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: () => base44.entities.Page.list('order_index')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Page.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      setShowForm(false);
      setEditingPage(null);
      toast.success('Страница создана');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Page.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      setShowForm(false);
      setEditingPage(null);
      toast.success('Страница обновлена');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const sections = await base44.entities.Section.filter({ page_id: id });
      for (const section of sections) {
        await base44.entities.Section.delete(section.id);
      }
      await base44.entities.Page.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      toast.success('Страница и её секции удалены');
    }
  });

  const handleSave = (data) => {
    if (editingPage) {
      updateMutation.mutate({ id: editingPage.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setShowForm(true);
  };

  const handleDelete = (page) => {
    if (confirm(`Удалить страницу "${page.title}" и все её секции?`)) {
      deleteMutation.mutate(page.id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPage(null);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Страницы</h1>
          <p className="text-slate-600">Управление страницами сайта</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Добавить страницу
        </Button>
      </div>

      {showForm && (
        <div className="mb-6">
          <PageForm
            page={editingPage}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : pages.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">Нет созданных страниц</p>
          <Button onClick={() => setShowForm(true)} variant="outline">
            Создать первую страницу
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <Card key={page.id} className="hover:shadow-lg transition-shadow group">
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-slate-900 mb-1">
                    {page.title}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {page.slug}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(page)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(page)}
                    className="hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500">
                  Порядок: {page.order_index}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}