import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function StatCard({ title, value, icon: Icon, color }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
          </div>
          <div className={`p-4 rounded-2xl ${color} bg-opacity-10`}>
            <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}