import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

export default function PageForm({ page, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    order_index: 0
  });

  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title || '',
        slug: page.slug || '',
        order_index: page.order_index || 0
      });
    }
  }, [page]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const slugValue = formData.slug.startsWith('/') ? formData.slug : `/${formData.slug}`;
    onSave({ ...formData, slug: slugValue });
  };

  const handleSlugChange = (value) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-/]/g, '');
    setFormData({ ...formData, slug: cleaned });
  };

  return (
    <Card className="border-2 border-indigo-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">
          {page ? 'Редактировать страницу' : 'Новая страница'}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название страницы</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Например: О компании"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="about"
              required
            />
            <p className="text-xs text-slate-500">
              Будет преобразовано в URL: {formData.slug ? (formData.slug.startsWith('/') ? formData.slug : `/${formData.slug}`) : '/...'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Порядок отображения</Label>
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
            {page ? 'Сохранить' : 'Создать'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}