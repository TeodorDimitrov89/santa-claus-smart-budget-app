import { CATEGORIES } from './constants';
import type { Transaction, CategorySummary, Category } from '../types';

/**
 * Category aggregation and analysis utilities
 * [Source: Story 3.3 - Category Aggregations and Analysis]
 * [FR-006: Category-Based Analysis]
 *
 * Pure functional implementation for aggregating transaction data by category.
 * All functions are stateless and side-effect free for predictable behavior.
 */

/**
 * Calculate percentage of total expenses for a category
 * @param categoryExpense - Total expenses for the category
 * @param totalExpenses - Grand total of all expenses across all categories
 * @returns Percentage (0-100), or 0 if totalExpenses is 0
 *
 * @example
 * calculateCategoryPercentage(50, 200) // Returns 25
 * calculateCategoryPercentage(0, 0) // Returns 0 (division by zero protection)
 */
export const calculateCategoryPercentage = (
  categoryExpense: number,
  totalExpenses: number
): number => {
  if (totalExpenses === 0) return 0;
  return (categoryExpense / totalExpenses) * 100;
};

/**
 * Aggregate transactions by category
 * Returns summary data for all 6 predefined categories.
 * Categories with no transactions will show zero values.
 *
 * [FR-006: Category-Based Analysis]
 * @param transactions - Array of all transactions to aggregate
 * @returns Array of CategorySummary objects (one per category, always 6 items)
 *
 * @example
 * const transactions = [
 *   { type: 'Expense', category: 'Gifts', amount: 100, ... },
 *   { type: 'Income', category: 'Gifts', amount: 50, ... }
 * ];
 * const summary = aggregateByCategory(transactions);
 * // Returns 6 categories with Gifts showing:
 * // { totalExpense: 100, totalIncome: 50, netAmount: -50, percentage: 100, ... }
 */
export const aggregateByCategory = (
  transactions: Transaction[]
): CategorySummary[] => {
  // Calculate grand total expenses for percentage calculations
  // Only expense transactions count toward percentage calculation
  const grandTotalExpenses = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Map each category to its aggregated summary
  return CATEGORIES.map(categoryData => {
    // Filter transactions for this specific category
    const categoryTransactions = transactions.filter(
      t => t.category === categoryData.name
    );

    // Calculate total income for this category
    const totalIncome = categoryTransactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate total expenses for this category
    const totalExpense = categoryTransactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Build the category summary
    return {
      category: categoryData.name as Category,
      totalIncome,
      totalExpense,
      netAmount: totalIncome - totalExpense,
      percentage: calculateCategoryPercentage(totalExpense, grandTotalExpenses),
      transactionCount: categoryTransactions.length,
    };
  });
};
