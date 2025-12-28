import Dexie, { type Table } from 'dexie';
import type { Transaction } from '../types';

/**
 * SantaBudgetDB - IndexedDB database for Santa's Smart Budget App
 *
 * Schema:
 * - Database Name: SantaBudgetDB
 * - Version: 1 (initial schema)
 * - Table: transactions
 *
 * Indices:
 * - ++id: Auto-incrementing primary key (Dexie manages internal ID)
 * - type: Income/Expense (enables fast filtering)
 * - category: One of 6 predefined categories (enables aggregations)
 * - date: Transaction date (enables date-range queries and sorting)
 * - amount: Transaction amount (enables amount-based sorting)
 * - createdAt: Creation timestamp (audit trail)
 *
 * Note: This is the ONLY acceptable class in the project (Dexie technical requirement).
 * All business logic around the database must use functional helpers/hooks.
 */
export class SantaBudgetDB extends Dexie {
  transactions!: Table<Transaction, string>;

  constructor() {
    super('SantaBudgetDB');
    this.version(1).stores({
      transactions: '++id, type, category, date, amount, createdAt',
    });
  }
}

/**
 * Singleton database instance
 * Import this in components/hooks to interact with the database
 *
 * Example:
 * ```typescript
 * import { db } from './lib/db';
 * const transactions = await db.transactions.toArray();
 * ```
 */
export const db = new SantaBudgetDB();
