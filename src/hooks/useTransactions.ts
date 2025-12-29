import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { ok, err } from '../lib/result';
import type { Result } from '../lib/result';
import type { Transaction, TransactionType } from '../types';
import type { TransactionInput } from '../lib/validation';

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

/**
 * Update an existing transaction
 * Returns Result type for functional error handling
 * [Source: Story 2.3 - Edit Existing Transaction]
 */
export const updateTransaction = async (
  id: string,
  data: TransactionInput
): Promise<Result<void, string>> => {
  try {
    const updated = await db.transactions.update(id, {
      ...data,
      updatedAt: new Date(),
    });

    if (updated === 0) {
      return err('Transaction not found');
    }

    return ok(undefined);
  } catch (error) {
    console.error('Failed to update transaction:', error);
    return err(`Failed to update transaction: ${(error as Error).message}`);
  }
};
