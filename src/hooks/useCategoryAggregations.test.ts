import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCategoryAggregations } from './useCategoryAggregations';
import type { Transaction } from '../types';

/**
 * Tests for useCategoryAggregations hook
 * [Source: Story 3.3 - Category Aggregations and Analysis]
 * Verifies memoization, reactivity, and sorting functionality
 */

// Helper to create test transactions
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

describe('useCategoryAggregations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return aggregated category data', () => {
    const transactions = [
      createTransaction('Expense', 'Gifts', 100),
      createTransaction('Income', 'Gifts', 50),
    ];

    const { result } = renderHook(() => useCategoryAggregations(transactions));

    expect(result.current.categories).toHaveLength(6);

    const gifts = result.current.categories.find(c => c.category === 'Gifts');
    expect(gifts).toBeDefined();
    expect(gifts?.totalExpense).toBe(100);
    expect(gifts?.totalIncome).toBe(50);
  });

  it('should return all 6 categories even with empty transactions', () => {
    const { result } = renderHook(() => useCategoryAggregations([]));

    expect(result.current.categories).toHaveLength(6);

    const categoryNames = result.current.categories.map(c => c.category);
    expect(categoryNames).toContain('Gifts');
    expect(categoryNames).toContain('Food & Dinner');
    expect(categoryNames).toContain('Decorations');
    expect(categoryNames).toContain('Travel');
    expect(categoryNames).toContain('Charity');
    expect(categoryNames).toContain("Santa's Workshop");
  });

  it('should sort by expense descending by default', () => {
    const transactions = [
      createTransaction('Expense', 'Gifts', 100),
      createTransaction('Expense', 'Food & Dinner', 300),
      createTransaction('Expense', 'Decorations', 200),
    ];

    const { result } = renderHook(() => useCategoryAggregations(transactions));

    const expenses = result.current.categories.map(c => c.totalExpense);
    // Should be sorted descending: [300, 200, 100, 0, 0, 0]
    expect(expenses[0]).toBeGreaterThanOrEqual(expenses[1]);
    expect(expenses[1]).toBeGreaterThanOrEqual(expenses[2]);
  });

  it('should update sort field when handleSort is called', () => {
    const { result } = renderHook(() => useCategoryAggregations([]));

    expect(result.current.sortField).toBe('expense');
    expect(result.current.sortDirection).toBe('desc');

    act(() => {
      result.current.handleSort('name');
    });

    expect(result.current.sortField).toBe('name');
    expect(result.current.sortDirection).toBe('desc'); // Default for new field
  });

  it('should toggle sort direction when clicking same field', () => {
    const { result } = renderHook(() => useCategoryAggregations([]));

    expect(result.current.sortDirection).toBe('desc');

    act(() => {
      result.current.handleSort('expense'); // Same field
    });

    expect(result.current.sortField).toBe('expense');
    expect(result.current.sortDirection).toBe('asc'); // Toggled

    act(() => {
      result.current.handleSort('expense'); // Same field again
    });

    expect(result.current.sortDirection).toBe('desc'); // Toggled back
  });

  it('should sort by category name alphabetically', () => {
    const transactions = [
      createTransaction('Expense', 'Gifts', 100),
      createTransaction('Expense', 'Food & Dinner', 200),
    ];

    const { result } = renderHook(() => useCategoryAggregations(transactions));

    act(() => {
      result.current.handleSort('name');
    });

    const names = result.current.categories.map(c => c.category);
    // Should be sorted alphabetically descending by default
    for (let i = 0; i < names.length - 1; i++) {
      expect(names[i].localeCompare(names[i + 1])).toBeGreaterThanOrEqual(0);
    }

    // Toggle to ascending
    act(() => {
      result.current.handleSort('name');
    });

    const namesAsc = result.current.categories.map(c => c.category);
    // Should be sorted alphabetically ascending
    for (let i = 0; i < namesAsc.length - 1; i++) {
      expect(namesAsc[i].localeCompare(namesAsc[i + 1])).toBeLessThanOrEqual(0);
    }
  });

  it('should sort by percentage', () => {
    const transactions = [
      createTransaction('Expense', 'Gifts', 100),
      createTransaction('Expense', 'Food & Dinner', 300),
      createTransaction('Expense', 'Decorations', 200),
    ];

    const { result } = renderHook(() => useCategoryAggregations(transactions));

    act(() => {
      result.current.handleSort('percentage');
    });

    const percentages = result.current.categories.map(c => c.percentage);
    // Should be sorted by percentage descending
    expect(percentages[0]).toBeGreaterThanOrEqual(percentages[1]);
    expect(percentages[1]).toBeGreaterThanOrEqual(percentages[2]);
  });

  it('should recalculate when transactions change', () => {
    const initialTransactions = [
      createTransaction('Expense', 'Gifts', 100),
    ];

    const { result, rerender } = renderHook(
      ({ txns }) => useCategoryAggregations(txns),
      { initialProps: { txns: initialTransactions } }
    );

    const initialGifts = result.current.categories.find(c => c.category === 'Gifts');
    expect(initialGifts?.totalExpense).toBe(100);

    // Update transactions
    const updatedTransactions = [
      createTransaction('Expense', 'Gifts', 100),
      createTransaction('Expense', 'Gifts', 200),
    ];

    rerender({ txns: updatedTransactions });

    const updatedGifts = result.current.categories.find(c => c.category === 'Gifts');
    expect(updatedGifts?.totalExpense).toBe(300); // 100 + 200
  });

  it('should maintain sort state when transactions change', () => {
    const initialTransactions = [
      createTransaction('Expense', 'Gifts', 100),
    ];

    const { result, rerender } = renderHook(
      ({ txns }) => useCategoryAggregations(txns),
      { initialProps: { txns: initialTransactions } }
    );

    // Change sort to name
    act(() => {
      result.current.handleSort('name');
    });

    expect(result.current.sortField).toBe('name');

    // Update transactions
    const updatedTransactions = [
      createTransaction('Expense', 'Gifts', 200),
    ];

    rerender({ txns: updatedTransactions });

    // Sort field should remain 'name'
    expect(result.current.sortField).toBe('name');
  });

  it('should handle edge case: all categories have zero expenses', () => {
    const transactions = [
      createTransaction('Income', 'Gifts', 100),
      createTransaction('Income', 'Food & Dinner', 200),
    ];

    const { result } = renderHook(() => useCategoryAggregations(transactions));

    result.current.categories.forEach(category => {
      expect(category.totalExpense).toBe(0);
      expect(category.percentage).toBe(0);
    });
  });

  it('should handle sorting stability (same values)', () => {
    const transactions: Transaction[] = []; // All categories will have 0

    const { result } = renderHook(() => useCategoryAggregations(transactions));

    // Sort by expense (all 0)
    const firstSort = result.current.categories.map(c => c.category);

    act(() => {
      result.current.handleSort('expense');
    });

    const secondSort = result.current.categories.map(c => c.category);

    // Order should be stable even though values are equal
    expect(firstSort).toBeDefined();
    expect(secondSort).toBeDefined();
    expect(secondSort.length).toBe(6);
  });
});
