import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus, Trash2 } from 'lucide-react';

const sectionTypes = [
  { value: 'hero', label: 'Герой-секция' },
  { value: 'text', label: 'Текстовая секция' },
  { value: 'image', label: 'Изображение' },
  { value: 'gallery', label: 'Галерея' },
  { value: 'cta', label: 'Призыв к действию' },
  { value: 'columns', label: 'Колонки' },
  { value: 'custom', label: 'Кастомная' }
];

export default function SectionForm({ section, pages, onSave, onCancel, defaultPageId }) {
  const [formData, setFormData] = useState({
    page_id: defaultPageId || '',
    type: 'text',
    order_index: 0
  });

  const [contentFields, setContentFields] = useState([
    { key: '', value: { content: '', styles: {} } }
  ]);

  useEffect(() => {
    if (section) {
      setFormData({
        page_id: section.page_id || '',
        type: section.type || 'text',
        order_index: section.order_index || 0
      });
    }
  }, [section]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ formData, contentFields });
  };

  const addContentField = () => {
    setContentFields([...contentFields, { key: '', value: { content: '', styles: {} } }]);
  };

  const removeContentField = (index) => {
    setContentFields(contentFields.filter((_, i) => i !== index));
  };

  const updateContentField = (index, field, value) => {
    const newFields = [...contentFields];
    if (field === 'key') {
      newFields[index].key = value;
    } else if (field === 'content') {
      newFields[index].value.content = value;
    } else if (field.startsWith('style.')) {
      const styleKey = field.replace('style.', '');
      newFields[index].value.styles[styleKey] = value;
    }
    setContentFields(newFields);
  };

  return (
    <Card className="border-2 border-indigo-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">
          {section ? 'Редактировать секцию' : 'Новая секция'}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="page">Страница</Label>
            <Select
              value={formData.page_id}
              onValueChange={(value) => setFormData({ ...formData, page_id: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите страницу" />
              </SelectTrigger>
              <SelectContent>
                {pages.map((page) => (
                  <SelectItem key={page.id} value={page.id}>
                    {page.title} ({page.slug})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Тип секции</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sectionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Контент секции</Label>
              <Button type="button" size="sm" onClick={addContentField} variant="outline">
                <Plus className="w-4 h-4 mr-1" /> Добавить поле
              </Button>
            </div>

            {contentFields.map((field, index) => (
              <Card key={index} className="p-4 bg-slate-50">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Ключ (title, text, image_url)"
                        value={field.key}
                        onChange={(e) => updateContentField(index, 'key', e.target.value)}
                      />
                      <Textarea
                        placeholder="Содержимое"
                        value={field.value.content}
                        onChange={(e) => updateContentField(index, 'content', e.target.value)}
                        rows={3}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Размер (24)"
                          value={field.value.styles.size || ''}
                          onChange={(e) => updateContentField(index, 'style.size', e.target.value)}
                        />
                        <Input
                          placeholder="Цвет (#000)"
                          value={field.value.styles.color || ''}
                          onChange={(e) => updateContentField(index, 'style.color', e.target.value)}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeContentField(index)}
                      className="hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
            {section ? 'Сохранить' : 'Создать'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}