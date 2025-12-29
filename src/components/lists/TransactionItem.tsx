import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { getCategoryInfo } from '../../lib/constants';
import type { Transaction } from '../../types';

type TransactionItemProps = {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
};

export const TransactionItem = ({ transaction, onEdit, onDelete }: TransactionItemProps) => {
  const { amount, type, category, date, description } = transaction;
  const categoryInfo = getCategoryInfo(category);

  const isIncome = type === 'Income';
  const amountClass = isIncome ? 'text-green-600' : 'text-red-600';
  const prefix = isIncome ? '+' : '-';

  const formattedDate = format(date, 'MMM dd, yyyy');
  const formattedAmount = `${prefix}$${amount.toFixed(2)}`;

  // Truncate description if > 50 chars
  const displayDescription =
    description.length > 50
      ? `${description.substring(0, 50)}...`
      : description;

  const CategoryIcon = categoryInfo?.icon;

  return (
    <div
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-center"
      role="article"
      aria-label={`Transaction: ${description}`}
    >
      {/* Date */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">{formattedDate}</span>
      </div>

      {/* Description */}
      <div className="flex flex-col" title={description}>
        <p className="text-gray-900">{displayDescription}</p>
      </div>

      {/* Category Badge */}
      <div className="flex items-center gap-2">
        {CategoryIcon && (
          <CategoryIcon className="w-4 h-4 text-gray-500" aria-hidden="true" />
        )}
        <span className="text-sm font-medium text-gray-700">{category}</span>
      </div>

      {/* Amount */}
      <div className="flex justify-end">
        <span className={`font-semibold text-lg ${amountClass}`}>
          {formattedAmount}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => onEdit?.(transaction)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Edit transaction"
          disabled={!onEdit}
          title={onEdit ? "Edit transaction" : "Edit (Coming in Story 2.3)"}
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete?.(transaction)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Delete transaction"
          disabled={!onDelete}
          title={onDelete ? "Delete transaction" : "Delete (Coming in Story 2.4)"}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
