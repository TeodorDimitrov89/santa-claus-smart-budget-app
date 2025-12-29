import type { Transaction } from '../types';

/**
 * Calculate total budget balance
 * Formula: Total Income - Total Expense
 * [FR-007: Budget Balance Display]
 */
export const calculateBalance = (transactions: Transaction[]): number => {
  const totalIncome = transactions
    .filter((t) => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return totalIncome - totalExpense;
};
