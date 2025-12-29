import { useBudget } from '../../hooks/useBudget';
import { formatCurrency } from '../../lib/format';

/**
 * Budget Balance Card Component
 * Displays real-time budget summary with festive styling
 * [FR-007: Budget Balance Display]
 */
export const BudgetBalanceCard = () => {
  const { totalIncome, totalExpense, balance } = useBudget();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-heading text-christmas-red mb-4">
        Budget Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Income */}
        <div className="text-center p-4 bg-green-50 rounded">
          <p className="text-sm text-gray-600 mb-1">Total Income</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(totalIncome)}
          </p>
        </div>

        {/* Total Expenses */}
        <div className="text-center p-4 bg-red-50 rounded">
          <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(totalExpense)}
          </p>
        </div>

        {/* Current Balance */}
        <div className="text-center p-4 bg-christmas-gold/20 rounded">
          <p className="text-sm text-gray-600 mb-1">Current Balance</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(balance)}
          </p>
        </div>
      </div>
    </div>
  );
};
