import { describe, it, expect, beforeEach, vi } from 'vitest';
import { updateTransaction } from './useTransactions';
import { db } from '../lib/db';
import type { TransactionInput } from '../lib/validation';

// Mock the database
vi.mock('../lib/db', () => ({
  db: {
    transactions: {
      update: vi.fn(),
    },
  },
}));

describe('useTransactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateTransaction', () => {
    const validTransactionInput: TransactionInput = {
      amount: 100,
      type: 'Income',
      category: 'Gifts',
      date: new Date('2025-12-25'),
      description: 'Christmas gift',
    };

    it('should update transaction and return ok result', async () => {
      vi.mocked(db.transactions.update).mockResolvedValue(1);

      const result = await updateTransaction('test-id', validTransactionInput);

      expect(result.ok).toBe(true);
      expect(db.transactions.update).toHaveBeenCalledWith('test-id', {
        ...validTransactionInput,
        updatedAt: expect.any(Date),
      });
    });

    it('should set updatedAt timestamp to current time', async () => {
      const beforeCall = new Date();
      vi.mocked(db.transactions.update).mockResolvedValue(1);

      await updateTransaction('test-id', validTransactionInput);

      const callArgs = vi.mocked(db.transactions.update).mock.calls[0][1] as any;
      const updatedAt = callArgs.updatedAt as Date;

      expect(updatedAt).toBeInstanceOf(Date);
      expect(updatedAt.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime());
    });

    it('should return error when transaction not found', async () => {
      vi.mocked(db.transactions.update).mockResolvedValue(0);

      const result = await updateTransaction('non-existent-id', validTransactionInput);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('Transaction not found');
      }
    });

    it('should return error when database operation fails', async () => {
      const dbError = new Error('Database connection failed');
      vi.mocked(db.transactions.update).mockRejectedValue(dbError);

      const result = await updateTransaction('test-id', validTransactionInput);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Failed to update transaction');
        expect(result.error).toContain('Database connection failed');
      }
    });

    it('should preserve original data and only add updatedAt', async () => {
      vi.mocked(db.transactions.update).mockResolvedValue(1);

      await updateTransaction('test-id', validTransactionInput);

      const callArgs = vi.mocked(db.transactions.update).mock.calls[0][1] as any;

      expect(callArgs).toEqual({
        amount: validTransactionInput.amount,
        type: validTransactionInput.type,
        category: validTransactionInput.category,
        date: validTransactionInput.date,
        description: validTransactionInput.description,
        updatedAt: expect.any(Date),
      });
    });
  });
});
