import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Edit2, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function NavigationTree({ items, onEdit, onDelete, onAddChild }) {
  const [expandedIds, setExpandedIds] = useState(new Set());

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const buildTree = (parentId = null) => {
    return items
      .filter(item => item.parent_id === parentId)
      .sort((a, b) => a.order_index - b.order_index);
  };

  const renderItem = (item, level = 0) => {
    const children = buildTree(item.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedIds.has(item.id);

    return (
      <div key={item.id} style={{ marginLeft: `${level * 24}px` }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-lg hover:bg-slate-50 group"
        >
          {hasChildren ? (
            <button
              onClick={() => toggleExpand(item.id)}
              className="p-1 hover:bg-slate-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-600" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}

          <div className="flex-1">
            <div className="font-medium text-slate-900">{item.label}</div>
            {item.url && (
              <div className="text-sm text-slate-500">{item.url}</div>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onAddChild(item)}
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(item)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(item)}
              className="hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {children.map(child => renderItem(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const rootItems = buildTree(null);

  return (
    <div className="space-y-1">
      {rootItems.map(item => renderItem(item))}
    </div>
  );
}