import React, { useState } from 'react';
import { 
  X, 
  ShoppingCart, 
  Copy, 
  Check, 
  Download, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ShoppingListItem } from '../../types/mealPlanner';
import { formatShoppingListText } from '../../utils/shoppingListGenerator';
import { useToast } from '../../context/ToastContext';

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ShoppingListItem[];
  planTitle?: string;
}

export default function ShoppingListModal({
  isOpen,
  onClose,
  items: initialItems,
  planTitle = 'NutriCoach AI Meal Plan Grocery List'
}: ShoppingListModalProps) {
  const { showToast } = useToast();
  const [items, setItems] = useState<ShoppingListItem[]>(initialItems);
  const [copied, setCopied] = useState(false);

  // Sync with prop updates
  React.useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleCopy = async () => {
    const text = formatShoppingListText(items, planTitle);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('Shopping list copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const categories: ShoppingListItem['category'][] = [
    'Produce',
    'Proteins & Dairy',
    'Grains & Pulses',
    'Spices & Oils',
    'Pantry & Other'
  ];

  const checkedCount = items.filter(i => i.checked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-[32px] p-5 sm:p-8 shadow-2xl my-4 animate-fade-in max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#f0f4ee] dark:border-[#272E29]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#eef7eb] dark:bg-[#243022] border border-[#d6ebd0] dark:border-[#3A4B35] flex items-center justify-center text-[#5ba83c] dark:text-[#8BAF78] shrink-0">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#192418] dark:text-[#E8EDE7] tracking-tight">
                Consolidated Grocery List
              </h2>
              <p className="text-xs text-[#5e6f5e] dark:text-[#A2AAA1]">
                Combined ingredients across all planned meals • {checkedCount} / {items.length} items collected
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#7a8c79] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7] rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div className="py-3 flex items-center justify-between border-b border-[#f0f4ee] dark:border-[#272E29] text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setItems(items.map(i => ({ ...i, checked: true })))}
              className="text-[11px] font-bold text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7]"
            >
              Select All
            </button>
            <span className="text-[#cbd7c8] dark:text-[#394139]">•</span>
            <button
              type="button"
              onClick={() => setItems(items.map(i => ({ ...i, checked: false })))}
              className="text-[11px] font-bold text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7]"
            >
              Uncheck All
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-xl bg-[#eef7eb] dark:bg-[#243022] hover:bg-[#5ba83c] hover:text-white text-[#3b7e23] dark:text-[#8BAF78] font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Formatted List'}</span>
          </button>
        </div>

        {/* Scrollable Categorized Items */}
        <div className="flex-1 overflow-y-auto touch-scroll py-4 space-y-5 pr-1 text-xs">
          {items.length === 0 ? (
            <div className="text-center py-10 space-y-2 text-[#7a8c79] dark:text-[#A2AAA1]">
              <p>No ingredients in the current meal plan.</p>
            </div>
          ) : (
            categories.map(cat => {
              const inCat = items.filter(i => i.category === cat);
              if (inCat.length === 0) return null;

              return (
                <div key={cat} className="space-y-2">
                  <div className="flex items-center justify-between pb-1">
                    <span className="font-black text-xs uppercase tracking-wider text-[#192418] dark:text-[#E8EDE7]">
                      {cat} ({inCat.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {inCat.map(item => (
                      <div
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`p-3 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer select-none ${
                          item.checked
                            ? 'bg-[#f6f8f5] dark:bg-[#222823] border-[#e2e8df] dark:border-[#394139] opacity-60'
                            : 'bg-white dark:bg-[#272E29] border-[#e8ede6] dark:border-[#394139] hover:border-[#5ba83c]/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-[#5ba83c] border-[#cbd7c8] accent-[#5ba83c] cursor-pointer mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <span className={`block font-bold text-xs text-[#192418] dark:text-[#E8EDE7] ${item.checked ? 'line-through' : ''}`}>
                            {item.name}
                          </span>
                          <span className="text-[11px] font-bold text-[#5ba83c] dark:text-[#8BAF78] block">
                            {item.amount} {item.unit}
                          </span>
                          {item.usedInMeals.length > 0 && (
                            <span className="text-[10px] text-[#7a8c79] dark:text-[#A2AAA1] truncate block mt-0.5">
                              Used in: {item.usedInMeals.slice(0, 2).join(', ')}{item.usedInMeals.length > 2 ? '...' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#f0f4ee] dark:border-[#272E29] flex items-center justify-between text-xs text-[#7a8c79] dark:text-[#A2AAA1]">
          <span>Tip: Tap any item to check off while shopping.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#5ba83c] hover:bg-[#4d9630] text-white text-xs font-bold cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
