import { db } from './db';
import { ok, err, type Result } from './result';
import type { Transaction } from '../types';

/**
 * Create a new transaction in IndexedDB
 * [FR-001: Create transaction with validation]
 * [Source: _bmad-output/epics/epic-2-transaction-management.md#Story 2.1]
 *
 * @param transaction - Validated transaction data
 * @returns Result with transaction ID or error
 */
export const createTransaction = async (
  transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Result<string, Error>> => {
  try {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      ...transaction,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const id = await db.transactions.add(newTransaction);
    return ok(id.toString());
  } catch (error) {
    console.error('Error creating transaction:', error);
    return err(error as Error);
  }
};

/**
 * Update an existing transaction
 * [FR-003: Update transaction]
 *
 * @param id - Transaction ID
 * @param updates - Partial transaction updates
 * @returns Result with updated count or error
 */
export const updateTransaction = async (
  id: string,
  updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>
): Promise<Result<number, Error>> => {
  try {
    const count = await db.transactions.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
    return ok(count);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return err(error as Error);
  }
};

/**
 * Delete a transaction
 * [FR-004: Delete transaction]
 *
 * @param id - Transaction ID
 * @returns Result with deletion confirmation or error
 */
export const deleteTransaction = async (
  id: string
): Promise<Result<void, Error>> => {
  try {
    await db.transactions.delete(id);
    return ok(undefined);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return err(error as Error);
  }
};
