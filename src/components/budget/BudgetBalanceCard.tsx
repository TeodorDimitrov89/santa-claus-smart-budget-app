import { useBudget } from '../../hooks/useBudget';
import { formatCurrency } from '../../lib/format';
import { getBalanceStatus } from '../../lib/budget-status';
import { STATUS_CONFIG } from './budget-status-config';

/**
 * Budget Balance Card Component
 * Displays real-time budget summary with festive styling and color-coded status indicators
 * [FR-007: Budget Balance Display with color-coded indicators]
 */
export const BudgetBalanceCard = () => {
  const { totalIncome, totalExpense, balance } = useBudget();
  const status = getBalanceStatus(balance);
  const statusConfig = STATUS_CONFIG[status];
  const StatusIcon = statusConfig.icon;

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

        {/* Current Balance - Color-coded status */}
        <div className={`text-center p-4 rounded ${statusConfig.bgColor}`}>
          <p className="text-sm text-gray-600 mb-1">Current Balance</p>

          <div className="flex items-center justify-center gap-2 mb-1">
            <StatusIcon className={`w-6 h-6 ${statusConfig.textColor}`} />
            <p className={`text-3xl font-bold ${statusConfig.textColor}`}>
              {formatCurrency(balance)}
            </p>
          </div>

          <p className={`text-xs ${statusConfig.textColor} mt-2`} aria-live="polite">
            {statusConfig.message}
          </p>
        </div>
      </div>
    </div>
  );
};
