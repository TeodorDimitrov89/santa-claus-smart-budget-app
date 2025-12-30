import { aggregateByCategory } from './categories';
import { getCategoryColor } from './category-helpers';
import type { Transaction, PieChartData } from '../types';

/**
 * Transform transactions into pie chart data format
 * Filters out categories with 0 expenses
 * [FR-008: Visual Charts - Pie Chart]
 * @param transactions - Array of transactions
 * @returns Array of pie chart data with name, value, color, percentage
 */
export const transformToPieChartData = (
  transactions: Transaction[]
): PieChartData[] => {
  // Reuse existing aggregation logic from Story 3.3
  const aggregated = aggregateByCategory(transactions);

  // Calculate total expenses across all categories
  const totalExpenses = aggregated.reduce(
    (sum, cat) => sum + cat.totalExpense,
    0
  );

  // Filter expense-only categories and transform to chart format
  return aggregated
    .filter((cat) => cat.totalExpense > 0) // Exclude 0% categories (AC requirement)
    .map((cat) => ({
      name: cat.category,
      value: cat.totalExpense,
      color: getCategoryColor(cat.category), // Use existing color helper
      percentage:
        totalExpenses > 0
          ? Math.round((cat.totalExpense / totalExpenses) * 100)
          : 0,
    }));
};
