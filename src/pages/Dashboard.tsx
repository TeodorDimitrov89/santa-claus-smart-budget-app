import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { BudgetBalanceCard } from '../components/budget/BudgetBalanceCard';
import { SpendingPieChart } from '../components/charts/SpendingPieChart';
import { CategoryBarChart } from '../components/charts/CategoryBarChart';
import { ChartViewToggle } from '../components/charts/ChartViewToggle';
import { CategorySortToggle } from '../components/charts/CategorySortToggle';
import type { Category } from '../types';

/**
 * Dashboard Page
 * Main overview with budget balance and spending charts
 * [FR-007: Budget Balance Display]
 * [FR-008: Visual Charts - Pie Chart & Bar Chart]
 * [Story 3.6: Interactive chart toggles for Income/Expense view and sorting]
 */
export default function Dashboard() {
  const { transactions } = useTransactions();
  const [chartView, setChartView] = useState<'income' | 'expense'>('expense');
  const [sortByAmount, setSortByAmount] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-heading text-christmas-red text-center">
        🎅 Dashboard
      </h1>

      {/* Screen reader announcement for view changes */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        Now showing {chartView} data
      </div>

      {/* Budget Balance - Prominent Top Placement */}
      <BudgetBalanceCard />

      {/* Chart Controls Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-2 border-christmas-gold/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <ChartViewToggle view={chartView} onChange={setChartView} />
          <CategorySortToggle sortByAmount={sortByAmount} onChange={setSortByAmount} />
        </div>
      </div>

      {/* Spending Distribution Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-heading text-christmas-red mb-4">
          📊 {chartView === 'expense' ? 'Spending' : 'Income'} Distribution
        </h2>
        <SpendingPieChart transactions={transactions || []} view={chartView} />
      </div>

      {/* Category Comparison Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-heading text-christmas-red">
            📊 Category Comparison
          </h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="px-4 py-2 bg-christmas-red text-white rounded-full font-heading text-sm hover:bg-christmas-red/90 transition-colors"
            >
              Clear Filter
            </button>
          )}
        </div>
        <CategoryBarChart
          transactions={transactions || []}
          view={chartView}
          sortByAmount={sortByAmount}
          onCategoryClick={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
      </div>
    </div>
  );
}
