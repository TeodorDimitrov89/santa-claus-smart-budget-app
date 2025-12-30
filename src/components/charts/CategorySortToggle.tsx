import { ArrowDownAZ, ArrowUpDown } from 'lucide-react';

/**
 * Category Sort Toggle Component
 * Allows users to sort bar chart by original order or by amount
 * [FR-008: Visual Charts - Bar Chart Sorting]
 * [Story 3.6: Deferred from Story 3.5]
 */

interface Props {
  sortByAmount: boolean;
  onChange: (sortByAmount: boolean) => void;
}

export const CategorySortToggle = ({ sortByAmount, onChange }: Props) => {
  return (
    <div
      role="radiogroup"
      aria-label="Category sort order"
      className="flex gap-4 justify-center"
    >
      <button
        role="radio"
        aria-checked={!sortByAmount}
        onClick={() => onChange(false)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            onChange(true);
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            onChange(false);
          }
        }}
        className={`flex items-center gap-2 px-6 py-2 rounded-full font-heading text-lg transition-all transform hover:scale-105 ${
          !sortByAmount
            ? 'bg-christmas-green text-white shadow-xl ring-2 ring-christmas-gold'
            : 'bg-white text-gray-600 border-2 border-christmas-green/20 hover:bg-christmas-green/5'
        }`}
      >
        <ArrowUpDown size={20} aria-hidden="true" />
        Original Order
      </button>
      <button
        role="radio"
        aria-checked={sortByAmount}
        onClick={() => onChange(true)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            onChange(false);
          } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            onChange(true);
          }
        }}
        className={`flex items-center gap-2 px-6 py-2 rounded-full font-heading text-lg transition-all transform hover:scale-105 ${
          sortByAmount
            ? 'bg-christmas-red text-white shadow-xl ring-2 ring-christmas-gold'
            : 'bg-white text-gray-600 border-2 border-christmas-red/20 hover:bg-christmas-red/5'
        }`}
      >
        <ArrowDownAZ size={20} aria-hidden="true" />
        By Amount
      </button>
    </div>
  );
};
