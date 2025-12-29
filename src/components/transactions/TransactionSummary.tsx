import { format } from 'date-fns';
import { CATEGORIES } from '../../lib/constants';
import type { Transaction } from '../../types';

interface TransactionSummaryProps {
  transaction: Transaction | null;
}

export const TransactionSummary = ({ transaction }: TransactionSummaryProps) => {
  if (!transaction) return null;

  const category = CATEGORIES.find((c) => c.name === transaction.category);
  const typeColor = transaction.type === 'Income' ? 'text-green-600' : 'text-red-600';
  const amountSign = transaction.type === 'Income' ? '+' : '-';

  return (
    <div className="space-y-3 text-sm">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-medium">Amount:</span>
        <span className={`font-bold text-lg ${typeColor}`}>
          {amountSign}${transaction.amount.toFixed(2)}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-medium">Type:</span>
        <span className={`font-semibold ${typeColor}`}>{transaction.type}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-medium">Category:</span>
        <div className="flex items-center gap-2">
          {category?.icon && <category.icon className="w-4 h-4 text-gray-500" />}
          <span className="font-medium">{transaction.category}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-medium">Date:</span>
        <span className="font-medium">{format(transaction.date, 'MMM dd, yyyy')}</span>
      </div>

      {transaction.description && (
        <div className="pt-2 border-t border-red-200">
          <span className="text-gray-600 font-medium block mb-1">Description:</span>
          <span className="text-gray-800">{transaction.description}</span>
        </div>
      )}
    </div>
  );
};
