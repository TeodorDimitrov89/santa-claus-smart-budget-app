import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Chart View Toggle Component
 * Allows users to switch between Income and Expense views for charts
 * [FR-008: Visual Charts - Interactive Features]
 * [Story 3.6: Interactive Chart Features and Toggle Views]
 */

interface Props {
  view: 'income' | 'expense';
  onChange: (view: 'income' | 'expense') => void;
}

export const ChartViewToggle = ({ view, onChange }: Props) => {
  return (
    <div
      role="radiogroup"
      aria-label="Transaction type view"
      className="flex gap-4 justify-center"
    >
      <button
        role="radio"
        aria-checked={view === 'expense'}
        onClick={() => onChange('expense')}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            onChange('income');
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            onChange('expense');
          }
        }}
        className={`flex items-center gap-2 px-6 py-2 rounded-full font-heading text-lg transition-all transform hover:scale-105 ${
          view === 'expense'
            ? 'bg-christmas-red text-white shadow-xl ring-2 ring-christmas-gold'
            : 'bg-white text-gray-600 border-2 border-christmas-red/20 hover:bg-christmas-red/5'
        }`}
      >
        <TrendingDown size={20} aria-hidden="true" />
        Expenses
      </button>
      <button
        role="radio"
        aria-checked={view === 'income'}
        onClick={() => onChange('income')}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            onChange('expense');
          } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            onChange('income');
          }
        }}
        className={`flex items-center gap-2 px-6 py-2 rounded-full font-heading text-lg transition-all transform hover:scale-105 ${
          view === 'income'
            ? 'bg-christmas-green text-white shadow-xl ring-2 ring-christmas-gold'
            : 'bg-white text-gray-600 border-2 border-christmas-green/20 hover:bg-christmas-green/5'
        }`}
      >
        <TrendingUp size={20} aria-hidden="true" />
        Income
      </button>
    </div>
  );
};
