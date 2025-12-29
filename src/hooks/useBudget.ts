import { useMemo } from 'react';
import { calculateTotalByType } from '../lib/budget';
import { useTransactions } from './useTransactions';
import { CATEGORIES } from '../lib/constants';
import type { BudgetSummary, Category } from '../types';

/**
 * Custom hook to calculate real-time budget summary
 * Leverages useLiveQuery via useTransactions for real-time reactivity
 * Memoizes calculations to prevent unnecessary recalculations
 * [FR-007: Budget Balance Display]
 */
export const useBudget = (): BudgetSummary => {
  const { transactions } = useTransactions();

  return useMemo(() => {
    const totalIncome = calculateTotalByType(transactions, 'Income');
    const totalExpense = calculateTotalByType(transactions, 'Expense');

    // Initialize categoryTotals with proper empty structure instead of unsafe type cast
    const categoryTotals = CATEGORIES.reduce((acc, cat) => {
      acc[cat.name as Category] = { income: 0, expense: 0, net: 0 };
      return acc;
    }, {} as Record<Category, { income: number; expense: number; net: number }>);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      categoryTotals,
    };
  }, [transactions]);
};
