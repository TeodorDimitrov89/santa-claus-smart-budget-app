import type { Transaction } from '../types';

/**
 * Calculate total for a specific transaction type
 * @param transactions - Array of transactions
 * @param type - Transaction type ('Income' or 'Expense')
 * @returns Sum of amounts for the specified type
 */
export const calculateTotalByType = (
  transactions: Transaction[],
  type: 'Income' | 'Expense'
): number => {
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
};

/**
 * Calculate total budget balance
 * Formula: Total Income - Total Expense
 * [FR-007: Budget Balance Display]
 */
export const calculateBalance = (transactions: Transaction[]): number => {
  const income = calculateTotalByType(transactions, 'Income');
  const expense = calculateTotalByType(transactions, 'Expense');
  return income - expense;
};
