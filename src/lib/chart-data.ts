import { aggregateByCategory } from './categories';
import { getCategoryColor } from './category-helpers';
import { CATEGORIES } from './constants';
import type { Transaction, PieChartData, BarChartData, Category } from '../types';

/**
 * Transform transactions into pie chart data format
 * Filters out categories with 0 expenses or income
 * [FR-008: Visual Charts - Pie Chart]
 * [Story 3.6: Extended to support income view]
 * @param transactions - Array of transactions
 * @param type - Transaction type to display (default: 'expense' for backward compatibility)
 * @returns Array of pie chart data with name, value, color, percentage
 */
export const transformToPieChartData = (
  transactions: Transaction[],
  type: 'income' | 'expense' = 'expense'
): PieChartData[] => {
  // Reuse existing aggregation logic from Story 3.3
  const aggregated = aggregateByCategory(transactions);

  // Calculate total based on type
  const total = aggregated.reduce(
    (sum, cat) => sum + (type === 'income' ? cat.totalIncome : cat.totalExpense),
    0
  );

  if (total === 0) return [];

  // Filter categories with non-zero amounts and transform to chart format
  return aggregated
    .filter((cat) => {
      const amount = type === 'income' ? cat.totalIncome : cat.totalExpense;
      return amount > 0;
    })
    .map((cat) => {
      const amount = type === 'income' ? cat.totalIncome : cat.totalExpense;
      return {
        name: cat.category,
        value: amount,
        color: getCategoryColor(cat.category), // Use existing color helper
        percentage: Math.round((amount / total) * 100),
      };
    });
};

/**
 * Transform transactions into bar chart data format
 * Includes ALL 6 categories even if they have $0 expenses or income
 * [FR-008: Visual Charts - Bar Chart]
 * [Story 3.6: Extended to support income view]
 * @param transactions - Array of transactions
 * @param sortByAmount - Optional: sort by amount descending (default: original order)
 * @param type - Transaction type to display (default: 'expense' for backward compatibility)
 * @returns Array of bar chart data with category, amount, color, fill
 */
export const transformToBarChartData = (
  transactions: Transaction[],
  sortByAmount = false,
  type: 'income' | 'expense' = 'expense'
): BarChartData[] => {
  // Reuse existing aggregation logic from Story 3.3
  const aggregated = aggregateByCategory(transactions);

  // Create map for quick lookup based on type
  const amountMap = new Map(
    aggregated.map((cat) => [
      cat.category,
      type === 'income' ? cat.totalIncome : cat.totalExpense,
    ])
  );

  // Transform all 6 categories to bar chart format
  let barData: BarChartData[] = CATEGORIES.map((cat) => {
    const amount = amountMap.get(cat.name as Category) || 0;
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
