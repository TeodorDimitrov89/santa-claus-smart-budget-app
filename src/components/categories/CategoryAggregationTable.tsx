import { useCategoryAggregations } from '../../hooks/useCategoryAggregations';
import { formatCurrency } from '../../lib/format';
import { getCategoryIcon, getCategoryColor } from '../../lib/category-helpers';
import { ChevronUp, ChevronDown, Trophy } from 'lucide-react';
import type { Transaction, Category, CategorySortField } from '../../types';

/**
 * Category Aggregation Table Component
 * Displays spending and income aggregated by category with sorting
 * [Source: Story 3.3 - Category Aggregations and Analysis]
 * [FR-006: Category-Based Analysis]
 */

interface CategoryAggregationTableProps {
  transactions: Transaction[];
  onCategoryClick?: (category: Category) => void;
}

export const CategoryAggregationTable = ({
  transactions,
  onCategoryClick,
}: CategoryAggregationTableProps) => {
  const { categories, sortField, sortDirection, handleSort } = useCategoryAggregations(transactions);

  // Find highest spending category
  const highestSpendingCategory = categories.reduce((max, cat) =>
    cat.totalExpense > max.totalExpense ? cat : max,
    categories[0]
  );

  const handleRowClick = (category: Category) => {
    if (onCategoryClick) {
      onCategoryClick(category);
    }
  };

  const handleRowKeyDown = (category: Category, e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleRowClick(category);
    }
  };

  const handleHeaderKeyDown = (field: CategorySortField, e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSort(field);
    }
  };

  // Convert sort direction to ARIA format
  const getAriaSortValue = (field: CategorySortField): 'ascending' | 'descending' | 'none' => {
    if (sortField !== field) return 'none';
    return sortDirection === 'asc' ? 'ascending' : 'descending';
  };

  const SortIcon = ({ field }: { field: CategorySortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline-block ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline-block ml-1" />
    );
  };

  // Empty state when no transactions
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🎁</div>
        <h2 className="text-3xl font-heading text-christmas-gold mb-2">
          Start your budget journey!
        </h2>
        <p className="text-gray-600 text-lg">
          Add your first transaction to see your category breakdown
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-heading text-christmas-gold mb-4">
        Category Analysis
      </h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-christmas-green/20">
              <th
                scope="col"
                role="button"
                tabIndex={0}
                aria-label="Sort by category name"
                aria-sort={getAriaSortValue('name')}
                onClick={() => handleSort('name')}
                onKeyDown={(e) => handleHeaderKeyDown('name', e)}
                className="text-left p-3 text-sm font-semibold text-christmas-green-dark cursor-pointer hover:bg-christmas-green/5 transition-colors"
              >
                Category
                <SortIcon field="name" />
              </th>
              <th
                scope="col"
                role="button"
                tabIndex={0}
                aria-label="Sort by total expenses"
                aria-sort={getAriaSortValue('expense')}
                onClick={() => handleSort('expense')}
                onKeyDown={(e) => handleHeaderKeyDown('expense', e)}
                className="text-right p-3 text-sm font-semibold text-christmas-green-dark cursor-pointer hover:bg-christmas-green/5 transition-colors"
              >
                Total Expense
                <SortIcon field="expense" />
              </th>
              <th scope="col" className="text-right p-3 text-sm font-semibold text-christmas-green-dark">
                Total Income
              </th>
              <th scope="col" className="text-right p-3 text-sm font-semibold text-christmas-green-dark">
                Net Amount
              </th>
              <th
                scope="col"
                role="button"
                tabIndex={0}
                aria-label="Sort by percentage of budget"
                aria-sort={getAriaSortValue('percentage')}
                onClick={() => handleSort('percentage')}
                onKeyDown={(e) => handleHeaderKeyDown('percentage', e)}
                className="text-right p-3 text-sm font-semibold text-christmas-green-dark cursor-pointer hover:bg-christmas-green/5 transition-colors"
              >
                % of Budget
                <SortIcon field="percentage" />
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.category);
              const color = getCategoryColor(category.category);
              const isHighest = category.category === highestSpendingCategory.category && category.totalExpense > 0;

              return (
                <tr
                  key={category.category}
                  role="button"
                  tabIndex={0}
                  aria-label={`${category.category}: ${formatCurrency(category.totalExpense)} expenses, ${formatCurrency(category.totalIncome)} income, ${category.percentage.toFixed(1)}% of budget`}
                  onClick={() => handleRowClick(category.category)}
                  onKeyDown={(e) => handleRowKeyDown(category.category, e)}
                  className={`border-b border-gray-100 hover:bg-christmas-gold/10 transition-colors cursor-pointer focus:outline-2 focus:outline-christmas-gold ${
                    isHighest ? 'bg-christmas-red/5' : ''
                  }`}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="w-5 h-5" style={{ color }} />}
                      <span className="font-medium text-gray-900">{category.category}</span>
                      {isHighest && (
                        <span className="bg-christmas-red text-white px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          Top Spending
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-right font-semibold text-red-600">
                    {formatCurrency(category.totalExpense)}
                  </td>
                  <td className="p-3 text-right font-semibold text-green-600">
                    {formatCurrency(category.totalIncome)}
                  </td>
                  <td className={`p-3 text-right font-semibold ${
                    category.netAmount >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(category.netAmount)}
                  </td>
                  <td className="p-3 text-right text-gray-700">
                    {category.percentage.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.category);
          const color = getCategoryColor(category.category);
          const isHighest = category.category === highestSpendingCategory.category && category.totalExpense > 0;

          return (
            <div
              key={category.category}
              role="button"
              tabIndex={0}
              aria-label={`${category.category}: ${formatCurrency(category.totalExpense)} expenses, ${formatCurrency(category.totalIncome)} income, ${category.percentage.toFixed(1)}% of budget`}
              onClick={() => handleRowClick(category.category)}
              onKeyDown={(e) => handleRowKeyDown(category.category, e)}
              className={`border rounded-lg p-4 hover:bg-christmas-gold/10 transition-colors cursor-pointer focus:outline-2 focus:outline-christmas-gold ${
                isHighest ? 'border-christmas-red bg-christmas-red/5' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="w-6 h-6" style={{ color }} />}
                  <h3 className="font-semibold text-gray-900">{category.category}</h3>
                </div>
                {isHighest && (
                  <span className="bg-christmas-red text-white px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    Top
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-600">Expense</p>
                  <p className="font-semibold text-red-600">{formatCurrency(category.totalExpense)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Income</p>
                  <p className="font-semibold text-green-600">{formatCurrency(category.totalIncome)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Net</p>
                  <p className={`font-semibold ${
                    category.netAmount >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(category.netAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">% Budget</p>
                  <p className="font-semibold text-gray-700">{category.percentage.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sort Controls for Mobile */}
      <div className="md:hidden mt-4 flex gap-2 justify-center">
        <button
          onClick={() => handleSort('name')}
          className={`px-3 py-1 rounded text-sm ${
            sortField === 'name'
              ? 'bg-christmas-green text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
        </button>
        <button
          onClick={() => handleSort('expense')}
          className={`px-3 py-1 rounded text-sm ${
            sortField === 'expense'
              ? 'bg-christmas-green text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Expense {sortField === 'expense' && (sortDirection === 'asc' ? '↑' : '↓')}
        </button>
        <button
          onClick={() => handleSort('percentage')}
          className={`px-3 py-1 rounded text-sm ${
            sortField === 'percentage'
              ? 'bg-christmas-green text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          % {sortField === 'percentage' && (sortDirection === 'asc' ? '↑' : '↓')}
        </button>
      </div>
    </div>
  );
};
