import { useTransactionFilters } from '../hooks/useTransactionFilters';
import { CategoryAggregationTable } from '../components/categories/CategoryAggregationTable';
import { TransactionList } from '../components/lists/TransactionList';
import type { Category } from '../types';

/**
 * Categories Page
 * Displays category aggregations and analysis
 * [Source: Story 3.3 - Category Aggregations and Analysis]
 * [FR-006: Category-Based Analysis]
 */
export default function Categories() {
  const {
    filters,
    setFilters,
    filteredTransactions,
    transactionsWithoutCategoryFilter
  } = useTransactionFilters();

  const handleCategoryClick = (category: Category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category) ? [] : [category],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-heading text-christmas-gold mb-6">
        🎁 Categories
      </h1>

      <CategoryAggregationTable
        transactions={transactionsWithoutCategoryFilter || []}
        onCategoryClick={handleCategoryClick}
      />

      {filters.categories.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-heading text-christmas-green mb-4">
            Transactions for {filters.categories[0]}
          </h2>
          <TransactionList transactions={filteredTransactions || []} />
        </div>
      )}
    </div>
  );
}
