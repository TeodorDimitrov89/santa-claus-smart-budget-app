import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import type { Transaction, TransactionType } from '../types';

/**
 * Custom hook for reactive transaction queries
 * Uses Dexie's useLiveQuery for real-time updates
 * [Source: _bmad-output/solutioning/architecture.md#Data Persistence Pattern]
 */
export const useTransactions = () => {
  // useLiveQuery returns undefined initially, default to empty array
  const transactions = useLiveQuery<Transaction[]>(
    () => db.transactions.toArray(),
    []
  );

  return {
    transactions: transactions ?? [],
    isLoading: transactions === undefined,
  };
};

/**
 * Filter transactions by type
 * Real-time query with Dexie filtering
 */
export const useTransactionsByType = (
  type: TransactionType | 'All'
) => {
  const transactions = useLiveQuery(() => {
    if (type === 'All') {
      return db.transactions.toArray();
    }
    return db.transactions.where('type').equals(type).toArray();
  }, [type]);

  return {
    transactions: transactions ?? [],
    isLoading: transactions === undefined,
  };
};
