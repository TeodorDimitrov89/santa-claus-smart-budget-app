import { aggregateByCategory } from './categories';
import { getCategoryColor } from './category-helpers';
import { CATEGORIES } from './constants';
import type { Transaction, PieChartData, BarChartData, Category } from '../types';

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

/**
 * Transform transactions into bar chart data format
 * Includes ALL 6 categories even if they have $0 expenses
 * [FR-008: Visual Charts - Bar Chart]
 * @param transactions - Array of transactions
 * @param sortByAmount - Optional: sort by amount descending (default: original order)
 * @returns Array of bar chart data with category, amount, color, fill
 */
export const transformToBarChartData = (
  transactions: Transaction[],
  sortByAmount = false
): BarChartData[] => {
  // Reuse existing aggregation logic from Story 3.3
  const aggregated = aggregateByCategory(transactions);

  // Create map for quick lookup
  const expenseMap = new Map(
    aggregated.map((cat) => [cat.category, cat.totalExpense])
  );

  // Transform all 6 categories to bar chart format
  let barData: BarChartData[] = CATEGORIES.map((cat) => {
    const amount = expenseMap.get(cat.name as Category) || 0;
    const color = getCategoryColor(cat.name as Category);
    return {
      category: cat.name as Category,
      amount,
      color,
      fill: color, // Recharts uses 'fill' property
    };
  });

  // Sort by amount if requested
  if (sortByAmount) {
    barData = barData.sort((a, b) => b.amount - a.amount);
  }

  return barData;
};
