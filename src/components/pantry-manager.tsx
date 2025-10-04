'use client';

import { useAppState } from '@/context/app-provider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function PantryManager() {
  const { pantryItems, addPantryItem, removePantryItem } = useAppState();
  const [newItem, setNewItem] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      addPantryItem(newItem.trim());
      setNewItem('');
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddItem} className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add an ingredient..."
        />
        <Button type="submit" size="icon">
          <Plus />
          <span className="sr-only">Add Item</span>
        </Button>
      </form>

      {pantryItems.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {pantryItems.map((item) => (
            <Badge key={item.id} variant="secondary" className="text-base py-1 pl-3 pr-1 group">
              {item.name}
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 ml-1 opacity-50 group-hover:opacity-100"
                onClick={() => removePantryItem(item.id)}
              >
                <Trash2 className="h-3 w-3" />
                <span className="sr-only">Remove {item.name}</span>
              </Button>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">
          Your pantry is empty. Add some ingredients to get started!
        </p>
      )}
    </div>
  );
}
