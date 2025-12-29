import { describe, it, expect } from 'vitest';
import { calculateBalance, calculateTotalByType } from './budget';
import type { Transaction } from '../types';

describe('calculateTotalByType', () => {
  it('should return 0 for empty array', () => {
    expect(calculateTotalByType([], 'Income')).toBe(0);
    expect(calculateTotalByType([], 'Expense')).toBe(0);
  });

  it('should calculate total for Income transactions only', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        amount: 100,
        type: 'Income',
        category: 'Gifts',
        date: new Date(),
        description: 'Test',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        amount: 50,
        type: 'Income',
        category: 'Charity',
        date: new Date(),
        description: 'Test',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        amount: 25,
        type: 'Expense',
        category: 'Food & Dinner',
        date: new Date(),
        description: 'Test',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    expect(calculateTotalByType(transactions, 'Income')).toBe(150);
  });

  it('should calculate total for Expense transactions only', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        amount: 75,
        type: 'Expense',
        category: 'Food & Dinner',
        date: new Date(),
        description: 'Test',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        amount: 25,
        type: 'Expense',
        category: 'Travel',
        date: new Date(),
        description: 'Test',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        amount: 100,
        type: 'Income',
        category: 'Gifts',
        date: new Date(),
        description: 'Test',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    expect(calculateTotalByType(transactions, 'Expense')).toBe(100);
  });

  it('should ignore opposite type', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        amount: 100,
        type: 'Income',
        category: 'Gifts',
        date: new Date(),
        description: 'Test',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    expect(calculateTotalByType(transactions, 'Expense')).toBe(0);
  });
});

describe('calculateBalance', () => {
  it('should return 0 for empty transaction array', () => {
    const result = calculateBalance([]);
    expect(result).toBe(0);
  });

  it('should calculate balance with only income transactions', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        amount: 100,
        type: 'Income',
        category: 'Gifts',
        date: new Date(),
        description: 'Test',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        amount: 50,
        type: 'Income',
        category: 'Charity',
        date: new Date(),
        description: 'Test',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const result = calculateBalance(transactions);
    expect(result).toBe(150);
  });

  it('should calculate balance with only expense transactions', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        amount: 75,
        type: 'Expense',
        category: 'Food & Dinner',
        date: new Date(),
        description: 'Test',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        amount: 25,
        type: 'Expense',
        category: 'Travel',
        date: new Date(),
        description: 'Test',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const result = calculateBalance(transactions);
    expect(result).toBe(-100);
  });

  it('should calculate balance with mixed income and expense transactions', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        amount: 200,
        type: 'Income',
        category: 'Gifts',
        date: new Date(),
        description: 'Test',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        amount: 80,
        type: 'Expense',
        category: 'Decorations',
        date: new Date(),
        description: 'Test',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        amount: 50,
        type: 'Expense',
        category: 'Food & Dinner',
        date: new Date(),
        description: 'Test',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const result = calculateBalance(transactions);
    expect(result).toBe(70); // 200 - 80 - 50
  });
});
