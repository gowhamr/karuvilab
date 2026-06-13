import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { LineItem } from '../types';

interface LineItemsSectionProps {
  items: LineItem[];
  currency: string;
  addItem: () => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, field: keyof LineItem, value: any) => void;
}

export const LineItemsSection = ({ items, currency, addItem, removeItem, updateItem }: LineItemsSectionProps) => {
  return (
    <div className="bg-surface border border-border p-8 rounded-4xl shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-blue" />
           Line Items
        </h2>
        <button 
          onClick={addItem}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue/5 text-blue text-xs font-black uppercase tracking-widest hover:bg-blue/10 transition-all active:scale-95"
          aria-label="Add Item"
        >
          <Plus className="w-3.5 h-3.5" /> Add Item
        </button>
      </div>
      
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={item.id} className="grid grid-cols-12 gap-3 items-start p-4 bg-bg border border-border rounded-2xl group transition-all hover:border-blue/30">
            <div className="col-span-6 space-y-1">
              <label htmlFor={'desc-' + item.id} className="text-tiny font-bold text-text-4 uppercase tracking-tighter">Description</label>
              <input 
                id={'desc-' + item.id}
                placeholder="e.g. Design Consulting" 
                value={item.desc} 
                onChange={(e) => updateItem(item.id, 'desc', e.target.value)} 
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-text placeholder:text-text-4 outline-none"
              />
            </div>
            <div className="col-span-2 space-y-1">
              <label htmlFor={'qty-' + item.id} className="text-tiny font-bold text-text-4 uppercase tracking-tighter">Qty</label>
              <input 
                id={'qty-' + item.id}
                type="number" 
                value={item.qty} 
                onChange={(e) => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)} 
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-black tabular-nums outline-none"
              />
            </div>
            <div className="col-span-3 space-y-1">
              <label htmlFor={'price-' + item.id} className="text-tiny font-bold text-text-4 uppercase tracking-tighter">Price</label>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold opacity-40" aria-hidden="true">{currency}</span>
                <input 
                  id={'price-' + item.id}
                  type="number" 
                  value={item.price} 
                  onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} 
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-black tabular-nums outline-none"
                  aria-label={'Price in ' + currency}
                />
              </div>
            </div>
            <div className="col-span-1 pt-4 text-right">
              <button 
                onClick={() => removeItem(item.id)} 
                aria-label={'Delete Item ' + (item.desc || i + 1)}
                className="text-text-4 hover:text-error transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
