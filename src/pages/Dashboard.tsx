import { useTransactions } from '../hooks/useTransactions';
import { BudgetBalanceCard } from '../components/budget/BudgetBalanceCard';
import { SpendingPieChart } from '../components/charts/SpendingPieChart';
import { CategoryBarChart } from '../components/charts/CategoryBarChart';

/**
 * Dashboard Page
 * Main overview with budget balance and spending charts
 * [FR-007: Budget Balance Display]
 * [FR-008: Visual Charts - Pie Chart & Bar Chart]
 */
export default function Dashboard() {
  const { transactions } = useTransactions();

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-heading text-christmas-red text-center">
        🎅 Dashboard
      </h1>

      {/* Budget Balance - Prominent Top Placement */}
      <BudgetBalanceCard />

      {/* Spending Distribution Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-heading text-christmas-red mb-4">
          📊 Spending Distribution
        </h2>
        <SpendingPieChart transactions={transactions || []} />
      </div>

      {/* Category Comparison Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-heading text-christmas-red mb-4">
          📊 Category Comparison
        </h2>
        <CategoryBarChart transactions={transactions || []} />
      </div>
    </div>
  );
}
