import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SectionCard from '../components/sections/SectionCard';
import SectionForm from '../components/sections/SectionForm';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function Sections() {
  const [editingSection, setEditingSection] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterPageId, setFilterPageId] = useState('all');
  const queryClient = useQueryClient();

  const { data: pages = [], isLoading: loadingPages } = useQuery({
    queryKey: ['pages'],
    queryFn: () => base44.entities.Page.list('order_index')
  });

  const { data: sections = [], isLoading: loadingSections } = useQuery({
    queryKey: ['sections'],
    queryFn: () => base44.entities.Section.list('order_index')
  });

  const createMutation = useMutation({
    mutationFn: async ({ formData, contentFields }) => {
      const section = await base44.entities.Section.create(formData);
      
      for (const field of contentFields) {
        if (field.key && field.value.content) {
          await base44.entities.SectionContent.create({
            section_id: section.id,
            key: field.key,
            value: field.value
          });
        }
      }
      return section;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      setShowForm(false);
      setEditingSection(null);
      toast.success('Секция создана');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      return base44.entities.Section.update(id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      setShowForm(false);
      setEditingSection(null);
      toast.success('Секция обновлена');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const content = await base44.entities.SectionContent.filter({ section_id: id });
      for (const item of content) {
        await base44.entities.SectionContent.delete(item.id);
      }
      await base44.entities.Section.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      toast.success('Секция удалена');
    }
  });

  const handleSave = (data) => {
    if (editingSection) {
      updateMutation.mutate({ id: editingSection.id, formData: data.formData });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setShowForm(true);
  };

  const handleDelete = (section) => {
    if (confirm('Удалить эту секцию?')) {
      deleteMutation.mutate(section.id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSection(null);
  };

  const filteredSections = filterPageId === 'all' 
    ? sections 
    : sections.filter(s => s.page_id === filterPageId);

  const getPageName = (pageId) => {
    const page = pages.find(p => p.id === pageId);
    return page ? page.title : 'Неизвестная страница';
  };

  const isLoading = loadingPages || loadingSections;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Секции</h1>
          <p className="text-slate-600">Управление контентными секциями</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700"
          disabled={pages.length === 0}
        >
          <Plus className="w-5 h-5 mr-2" />
          Добавить секцию
        </Button>
      </div>

      {pages.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-sm">
            Сначала создайте страницу, чтобы добавлять к ней секции
          </p>
        </div>
      )}

      <div className="mb-6 flex items-center gap-4">
        <label className="text-sm font-medium text-slate-700">Фильтр по странице:</label>
        <Select value={filterPageId} onValueChange={setFilterPageId}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все страницы</SelectItem>
            {pages.map((page) => (
              <SelectItem key={page.id} value={page.id}>
                {page.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showForm && (
        <div className="mb-6">
          <SectionForm
            section={editingSection}
            pages={pages}
            onSave={handleSave}
            onCancel={handleCancel}
            defaultPageId={filterPageId !== 'all' ? filterPageId : undefined}
          />
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : filteredSections.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">
            {filterPageId === 'all' ? 'Нет созданных секций' : 'Нет секций на этой странице'}
          </p>
          {pages.length > 0 && (
            <Button onClick={() => setShowForm(true)} variant="outline">
              Создать первую секцию
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              pageName={getPageName(section.page_id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}