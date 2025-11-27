import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

export default function NavigationForm({ item, parentItem, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    label: '',
    url: '',
    order_index: 0,
    parent_id: null
  });

  useEffect(() => {
    if (item) {
      setFormData({
        label: item.label || '',
        url: item.url || '',
        order_index: item.order_index || 0,
        parent_id: item.parent_id || null
      });
    } else if (parentItem) {
      setFormData(prev => ({
        ...prev,
        parent_id: parentItem.id
      }));
    }
  }, [item, parentItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="border-2 border-indigo-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">
          {item ? 'Редактировать пункт' : parentItem ? 'Добавить подпункт' : 'Новый пункт меню'}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {parentItem && (
            <div className="p-3 bg-slate-50 rounded-lg text-sm">
              Родительский элемент: <span className="font-medium">{parentItem.label}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="label">Название</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="Например: О компании"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="/about"
            />
            <p className="text-xs text-slate-500">
              Оставьте пустым, если у пункта будут подпункты
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Порядок</Label>
            <Input
              id="order"
              type="number"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
            />
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
            {item ? 'Сохранить' : 'Создать'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}