import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import NavigationTree from '../components/navigation/NavigationTree';
import NavigationForm from '../components/navigation/NavigationForm';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function Navigation() {
  const [editingItem, setEditingItem] = useState(null);
  const [parentItem, setParentItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['navigation'],
    queryFn: () => base44.entities.Navigation.list('order_index')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Navigation.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation'] });
      setShowForm(false);
      setEditingItem(null);
      setParentItem(null);
      toast.success('Пункт меню создан');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Navigation.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation'] });
      setShowForm(false);
      setEditingItem(null);
      setParentItem(null);
      toast.success('Пункт меню обновлен');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Navigation.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation'] });
      toast.success('Пункт меню удален');
    }
  });

  const handleSave = (data) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setParentItem(null);
    setShowForm(true);
  };

  const handleAddChild = (item) => {
    setEditingItem(null);
    setParentItem(item);
    setShowForm(true);
  };

  const handleDelete = (item) => {
    if (confirm(`Удалить "${item.label}"?`)) {
      deleteMutation.mutate(item.id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setParentItem(null);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Навигационное меню</h1>
          <p className="text-slate-600">Управление структурой меню сайта</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Добавить пункт
        </Button>
      </div>

      {showForm && (
        <div className="mb-6">
          <NavigationForm
            item={editingItem}
            parentItem={parentItem}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 mb-4">Меню пустое</p>
            <Button onClick={() => setShowForm(true)} variant="outline">
              Создать первый пункт
            </Button>
          </div>
        ) : (
          <NavigationTree
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddChild={handleAddChild}
          />
        )}
      </div>
    </div>
  );
}