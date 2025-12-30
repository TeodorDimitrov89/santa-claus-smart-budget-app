import { describe, it, expect } from 'vitest';
import { transformToPieChartData } from './chart-data';
import type { Transaction } from '../types';

describe('transformToPieChartData', () => {
  it('should return empty array for empty transactions', () => {
    const result = transformToPieChartData([]);
    expect(result).toEqual([]);
  });

  it('should return empty array for income-only transactions', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        amount: 100,
        type: 'Income',
        category: 'Gifts',
        date: new Date(),
        description: 'Test income',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const result = transformToPieChartData(transactions);
    expect(result).toEqual([]);
  });

  it('should transform expense-only transactions to chart data', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        amount: 100,
        type: 'Expense',
        category: 'Gifts',
        date: new Date(),
        description: 'Gift purchase',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        amount: 50,
        type: 'Expense',
        category: 'Food & Dinner',
        date: new Date(),
        description: 'Dinner',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const result = transformToPieChartData(transactions);

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Gifts');
    expect(result[0].value).toBe(100);
    expect(result[0].percentage).toBe(67); // 100 / 150 * 100 rounded
    expect(result[0].color).toBeDefined();

    expect(result[1].name).toBe('Food & Dinner');
    expect(result[1].value).toBe(50);
    expect(result[1].percentage).toBe(33); // 50 / 150 * 100 rounded
  });

  it('should filter out categories with 0% expenses (mixed income/expense)', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        amount: 100,
        type: 'Expense',
        category: 'Gifts',
        date: new Date(),
        description: 'Gift',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        amount: 50,
        type: 'Income',
        category: 'Charity',
        date: new Date(),
        description: 'Donation received',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const result = transformToPieChartData(transactions);

    // Only Gifts should appear (has expenses)
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Gifts');
    expect(result[0].percentage).toBe(100);
  });

  it('should exclude categories with 0 expenses from chart data', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        amount: 100,
        type: 'Expense',
        category: 'Gifts',
        date: new Date(),
        description: 'Gift',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const result = transformToPieChartData(transactions);

    // Only 1 category with expenses, others should be excluded
    expect(result).toHaveLength(1);
    expect(result.every(item => item.value > 0)).toBe(true);
  });

  it('should calculate percentages accurately', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        amount: 60,
        type: 'Expense',
        category: 'Gifts',
        date: new Date(),
        description: 'Gift 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        amount: 30,
        type: 'Expense',
        category: 'Food & Dinner',
        date: new Date(),
        description: 'Food',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        amount: 10,
        type: 'Expense',
        category: 'Decorations',
        date: new Date(),
        description: 'Decor',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const result = transformToPieChartData(transactions);

    const total = result.reduce((sum, item) => sum + item.percentage, 0);
    // Percentages should sum to approximately 100 (with rounding)
    expect(total).toBeGreaterThanOrEqual(99);
    expect(total).toBeLessThanOrEqual(101);

    // Verify individual percentages
    expect(result[0].percentage).toBe(60); // 60/100
    expect(result[1].percentage).toBe(30); // 30/100
    expect(result[2].percentage).toBe(10); // 10/100
  });
});
