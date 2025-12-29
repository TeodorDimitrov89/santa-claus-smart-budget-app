import { describe, it, expect } from 'vitest';
import { calculateCategoryPercentage, aggregateByCategory } from './categories';
import type { Transaction } from '../types';

/**
 * Unit tests for category aggregation logic
 * [Source: Story 3.3 - Category Aggregations and Analysis]
 * TDD approach: Write tests first, then implement logic
 */

describe('calculateCategoryPercentage', () => {
  it('should calculate percentage correctly for standard values', () => {
    expect(calculateCategoryPercentage(50, 200)).toBe(25);
    expect(calculateCategoryPercentage(100, 200)).toBe(50);
    expect(calculateCategoryPercentage(200, 200)).toBe(100);
  });

  it('should return 0 when totalExpenses is 0 (division by zero protection)', () => {
    expect(calculateCategoryPercentage(0, 0)).toBe(0);
    expect(calculateCategoryPercentage(100, 0)).toBe(0);
  });

  it('should handle decimal percentages accurately', () => {
    expect(calculateCategoryPercentage(33.33, 100)).toBeCloseTo(33.33, 2);
    expect(calculateCategoryPercentage(66.67, 100)).toBeCloseTo(66.67, 2);
    expect(calculateCategoryPercentage(1, 3)).toBeCloseTo(33.333, 2);
  });

  it('should handle zero category expense', () => {
    expect(calculateCategoryPercentage(0, 1000)).toBe(0);
  });

  it('should calculate correct percentage for small values', () => {
    expect(calculateCategoryPercentage(1, 1000)).toBeCloseTo(0.1, 2);
  });
});

describe('aggregateByCategory', () => {
  const createTransaction = (
    type: 'Income' | 'Expense',
    category: string,
    amount: number,
    id: string = crypto.randomUUID()
  ): Transaction => ({
    id,
    amount,
    type,
    category: category as any,
    date: new Date('2024-12-15'),
    description: 'Test transaction',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  });

  it('should return all 6 categories with zero values when no transactions exist', () => {
    const result = aggregateByCategory([]);

    expect(result).toHaveLength(6);

    // Verify all categories are present
    const categoryNames = result.map(c => c.category);
    expect(categoryNames).toContain('Gifts');
    expect(categoryNames).toContain('Food & Dinner');
    expect(categoryNames).toContain('Decorations');
    expect(categoryNames).toContain('Travel');
    expect(categoryNames).toContain('Charity');
    expect(categoryNames).toContain("Santa's Workshop");

    // All values should be zero
    result.forEach(category => {
      expect(category.totalIncome).toBe(0);
      expect(category.totalExpense).toBe(0);
      expect(category.netAmount).toBe(0);
      expect(category.percentage).toBe(0);
      expect(category.transactionCount).toBe(0);
    });
  });

  it('should calculate totals correctly for a single category', () => {
    const transactions = [
      createTransaction('Expense', 'Gifts', 100),
      createTransaction('Income', 'Gifts', 50),
      createTransaction('Expense', 'Gifts', 150),
    ];

    const result = aggregateByCategory(transactions);
    const gifts = result.find(c => c.category === 'Gifts')!;

    expect(gifts.totalExpense).toBe(250); // 100 + 150
    expect(gifts.totalIncome).toBe(50);
    expect(gifts.netAmount).toBe(-200); // 50 - 250
    expect(gifts.percentage).toBe(100); // 250 / 250 * 100
    expect(gifts.transactionCount).toBe(3);

    // Other categories should have zero values
    const food = result.find(c => c.category === 'Food & Dinner')!;
    expect(food.totalExpense).toBe(0);
    expect(food.totalIncome).toBe(0);
  });

  it('should calculate percentages correctly across multiple categories', () => {
    const transactions = [
      createTransaction('Expense', 'Gifts', 100),
      createTransaction('Expense', 'Food & Dinner', 200),
      createTransaction('Expense', 'Decorations', 300),
    ];

    const result = aggregateByCategory(transactions);

    const gifts = result.find(c => c.category === 'Gifts')!;
    const food = result.find(c => c.category === 'Food & Dinner')!;
    const decorations = result.find(c => c.category === 'Decorations')!;

    // Grand total is 600
    expect(gifts.percentage).toBeCloseTo(16.67, 1); // 100/600
    expect(food.percentage).toBeCloseTo(33.33, 1); // 200/600
    expect(decorations.percentage).toBe(50); // 300/600

    // Percentages should sum to 100
    const totalPercentage = gifts.percentage + food.percentage + decorations.percentage;
    expect(totalPercentage).toBeCloseTo(100, 0);
  });

  it('should handle categories with only income (0% expense)', () => {
    const transactions = [
      createTransaction('Income', 'Charity', 100),
      createTransaction('Income', 'Charity', 50),
    ];

    const result = aggregateByCategory(transactions);
    const charity = result.find(c => c.category === 'Charity')!;

    expect(charity.totalIncome).toBe(150);
    expect(charity.totalExpense).toBe(0);
    expect(charity.netAmount).toBe(150); // Positive net
    expect(charity.percentage).toBe(0); // No expenses, so 0%
    expect(charity.transactionCount).toBe(2);
  });

  it('should handle mixed income and expense transactions', () => {
    const transactions = [
      createTransaction('Expense', 'Travel', 500),
      createTransaction('Income', 'Travel', 200),
      createTransaction('Expense', 'Travel', 300),
      createTransaction('Income', 'Travel', 100),
    ];

    const result = aggregateByCategory(transactions);
    const travel = result.find(c => c.category === 'Travel')!;

    expect(travel.totalExpense).toBe(800); // 500 + 300
    expect(travel.totalIncome).toBe(300); // 200 + 100
    expect(travel.netAmount).toBe(-500); // 300 - 800
    expect(travel.percentage).toBe(100); // Only category with expenses
    expect(travel.transactionCount).toBe(4);
  });

  it('should aggregate across all categories correctly', () => {
    const transactions = [
      createTransaction('Expense', 'Gifts', 100),
      createTransaction('Expense', 'Food & Dinner', 200),
      createTransaction('Expense', 'Decorations', 300),
      createTransaction('Expense', 'Travel', 400),
      createTransaction('Expense', 'Charity', 500),
      createTransaction('Expense', "Santa's Workshop", 500),
      createTransaction('Income', 'Gifts', 50),
      createTransaction('Income', 'Food & Dinner', 75),
    ];

    const result = aggregateByCategory(transactions);

    // Grand total expenses = 2000
    const gifts = result.find(c => c.category === 'Gifts')!;
    const food = result.find(c => c.category === 'Food & Dinner')!;
    const workshop = result.find(c => c.category === "Santa's Workshop")!;

    expect(gifts.percentage).toBe(5); // 100/2000
    expect(food.percentage).toBe(10); // 200/2000
    expect(workshop.percentage).toBe(25); // 500/2000

    // Verify all percentages sum to 100
    const totalPercentage = result.reduce((sum, cat) => sum + cat.percentage, 0);
    expect(totalPercentage).toBeCloseTo(100, 0);
  });

  it('should handle empty category with zero transaction count', () => {
    const transactions = [
      createTransaction('Expense', 'Gifts', 100),
    ];

    const result = aggregateByCategory(transactions);
    const decorations = result.find(c => c.category === 'Decorations')!;

    expect(decorations.transactionCount).toBe(0);
    expect(decorations.totalExpense).toBe(0);
    expect(decorations.totalIncome).toBe(0);
  });

  it('should handle large amounts without precision loss', () => {
    const transactions = [
      createTransaction('Expense', 'Gifts', 999999.99),
      createTransaction('Expense', 'Food & Dinner', 0.01),
    ];

    const result = aggregateByCategory(transactions);
    const gifts = result.find(c => c.category === 'Gifts')!;
    const food = result.find(c => c.category === 'Food & Dinner')!;

    expect(gifts.totalExpense).toBe(999999.99);
    expect(food.totalExpense).toBe(0.01);

    // Percentage calculation should be accurate
    expect(gifts.percentage).toBeCloseTo(99.9999, 3);
    expect(food.percentage).toBeCloseTo(0.0001, 3);
  });
});
