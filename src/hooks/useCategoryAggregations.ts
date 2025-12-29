import { useMemo, useState } from 'react';
import { aggregateByCategory } from '../lib/categories';
import type { Transaction, CategorySortField, CategorySortDirection } from '../types';

/**
 * Custom hook for category aggregations with sorting
 * [Source: Story 3.3 - Category Aggregations and Analysis]
 *
 * Provides memoized category aggregation data with sorting capabilities.
 * Accepts transactions as a parameter (dependency injection) to support
 * filtered data from parent components.
 *
 * @param transactions - Array of transactions to aggregate
 * @returns Object containing sorted categories and sort control functions
 *
 * @example
 * // In a component
 * const { transactions } = useTransactions();
 * const { categories, sortField, sortDirection, handleSort } = useCategoryAggregations(transactions);
 */
export const useCategoryAggregations = (transactions: Transaction[]) => {
  // Local state for sorting
  const [sortField, setSortField] = useState<CategorySortField>('expense');
  const [sortDirection, setSortDirection] = useState<CategorySortDirection>('desc');

  // Memoize aggregation calculation - only recalculate when transactions change
  // This is critical for performance as aggregation involves filtering and reducing
  // across all transactions for all 6 categories
  const aggregatedData = useMemo(() => {
    return aggregateByCategory(transactions);
  }, [transactions]);

  // Memoize sorting - only recalculate when aggregated data or sort parameters change
  const sortedCategories = useMemo(() => {
    const sorted = [...aggregatedData];

    sorted.sort((a, b) => {
      let comparison = 0;

      if (sortField === 'name') {
        // Alphabetical comparison
        comparison = a.category.localeCompare(b.category);
      } else if (sortField === 'expense') {
        // Numerical comparison for expenses
        comparison = a.totalExpense - b.totalExpense;
      } else if (sortField === 'percentage') {
        // Numerical comparison for percentage
        comparison = a.percentage - b.percentage;
      }

      // Apply sort direction
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [aggregatedData, sortField, sortDirection]);

  /**
   * Handle sort field change
   * If clicking the same field, toggle direction
   * If clicking a new field, default to descending
   */
  const handleSort = (field: CategorySortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return {
    categories: sortedCategories,
    sortField,
    sortDirection,
    handleSort,
  };
};
