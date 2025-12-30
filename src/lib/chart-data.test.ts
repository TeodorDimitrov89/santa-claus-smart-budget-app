import { describe, it, expect } from 'vitest';
import { transformToPieChartData, transformToBarChartData } from './chart-data';
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

describe('transformToBarChartData', () => {
  it('should return 6 categories with $0 for empty transactions', () => {
    const result = transformToBarChartData([]);

    expect(result).toHaveLength(6);
    expect(result.every(item => item.amount === 0)).toBe(true);
    expect(result.every(item => item.color)).toBeDefined();
    expect(result.every(item => item.fill)).toBeDefined();

    // Verify all 6 categories are present
    const categories = result.map(item => item.category);
    expect(categories).toContain('Gifts');
    expect(categories).toContain('Food & Dinner');
    expect(categories).toContain('Decorations');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Charity');
    expect(categories).toContain("Santa's Workshop");
  });

  it('should return 6 categories with $0 expenses for income-only transactions', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        amount: 100,
        type: 'Income',
        category: 'Gifts',
        date: new Date(),
        description: 'Gift income',
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
    const result = transformToBarChartData(transactions);

    expect(result).toHaveLength(6);
    expect(result.every(item => item.amount === 0)).toBe(true);
  });

  it('should show correct amounts per category for expenses-only', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        amount: 100,
        type: 'Expense',
        category: 'Gifts',
        date: new Date(),
        description: 'Gift 1',
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
      {
        id: '3',
        amount: 75,
        type: 'Expense',
        category: 'Gifts',
        date: new Date(),
        description: 'Gift 2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const result = transformToBarChartData(transactions);

    expect(result).toHaveLength(6);

    const gifts = result.find(item => item.category === 'Gifts');
    expect(gifts?.amount).toBe(175); // 100 + 75

    const food = result.find(item => item.category === 'Food & Dinner');
    expect(food?.amount).toBe(50);

    const decorations = result.find(item => item.category === 'Decorations');
    expect(decorations?.amount).toBe(0);
  });

  it('should filter expenses correctly for mixed transactions', () => {
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
        amount: 200,
        type: 'Income',
        category: 'Gifts',
        date: new Date(),
        description: 'Gift income',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        amount: 50,
        type: 'Expense',
        category: 'Food & Dinner',
        date: new Date(),
        description: 'Dinner',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const result = transformToBarChartData(transactions);

    expect(result).toHaveLength(6);

    const gifts = result.find(item => item.category === 'Gifts');
    expect(gifts?.amount).toBe(100); // Only expense, not income

    const food = result.find(item => item.category === 'Food & Dinner');
    expect(food?.amount).toBe(50);
  });

  it('should preserve original order when sortByAmount is false', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        amount: 10,
        type: 'Expense',
        category: 'Gifts',
        date: new Date(),
        description: 'Small gift',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        amount: 100,
        type: 'Expense',
        category: 'Charity',
        date: new Date(),
        description: 'Large donation',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const result = transformToBarChartData(transactions, false);

    expect(result).toHaveLength(6);

    // Verify order matches CATEGORIES constant order
    expect(result[0].category).toBe('Gifts');
    expect(result[1].category).toBe('Food & Dinner');
    expect(result[2].category).toBe('Decorations');
    expect(result[3].category).toBe('Travel');
    expect(result[4].category).toBe('Charity');
    expect(result[5].category).toBe("Santa's Workshop");
  });

  it('should sort by amount descending when sortByAmount is true', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        amount: 10,
        type: 'Expense',
        category: 'Gifts',
        date: new Date(),
        description: 'Small gift',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        amount: 100,
        type: 'Expense',
        category: 'Charity',
        date: new Date(),
        description: 'Large donation',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        amount: 50,
        type: 'Expense',
        category: 'Food & Dinner',
        date: new Date(),
        description: 'Dinner',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const result = transformToBarChartData(transactions, true);

    expect(result).toHaveLength(6);

    // Verify descending order by amount
    expect(result[0].category).toBe('Charity');
    expect(result[0].amount).toBe(100);
    expect(result[1].category).toBe('Food & Dinner');
    expect(result[1].amount).toBe(50);
    expect(result[2].category).toBe('Gifts');
    expect(result[2].amount).toBe(10);

    // Remaining categories should have $0
    expect(result[3].amount).toBe(0);
    expect(result[4].amount).toBe(0);
    expect(result[5].amount).toBe(0);
  });

  it('should include color and fill properties for all categories', () => {
    const result = transformToBarChartData([]);

    expect(result).toHaveLength(6);
    result.forEach(item => {
      expect(item.color).toBeDefined();
      expect(item.color).toMatch(/^#[0-9A-Fa-f]{6}$/); // Valid hex color
      expect(item.fill).toBe(item.color); // fill should match color
    });
  });
});
