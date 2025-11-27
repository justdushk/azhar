import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const sectionTypeLabels = {
  hero: 'Герой',
  text: 'Текст',
  image: 'Изображение',
  gallery: 'Галерея',
  cta: 'Призыв',
  columns: 'Колонки',
  custom: 'Кастомная'
};

const typeColors = {
  hero: 'bg-purple-100 text-purple-800 border-purple-200',
  text: 'bg-blue-100 text-blue-800 border-blue-200',
  image: 'bg-green-100 text-green-800 border-green-200',
  gallery: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  cta: 'bg-red-100 text-red-800 border-red-200',
  columns: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  custom: 'bg-gray-100 text-gray-800 border-gray-200'
};

export default function SectionCard({ section, pageName, onEdit, onDelete }) {
  return (
    <Card className="hover:shadow-md transition-shadow group">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-3">
          <GripVertical className="w-5 h-5 text-slate-400 cursor-move" />
          <div>
            <Badge className={`${typeColors[section.type]} border`}>
              {sectionTypeLabels[section.type]}
            </Badge>
            <p className="text-sm text-slate-500 mt-1">
              Порядок: {section.order_index}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="ghost" onClick={() => onEdit(section)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(section)}
            className="hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">
          Страница: <span className="font-medium">{pageName}</span>
        </p>
      </CardContent>
    </Card>
  );
}