import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBudget } from './useBudget';
import type { Transaction } from '../types';

// Mock useTransactions hook
vi.mock('./useTransactions', () => ({
  useTransactions: vi.fn(),
}));

import { useTransactions } from './useTransactions';

describe('useBudget', () => {
  it('should return zero values for empty transactions', () => {
    vi.mocked(useTransactions).mockReturnValue({
      transactions: [],
      isLoading: false,
    });

    const { result } = renderHook(() => useBudget());

    expect(result.current.totalIncome).toBe(0);
    expect(result.current.totalExpense).toBe(0);
    expect(result.current.balance).toBe(0);
  });

  it('should calculate totals with only income transactions', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        amount: 100,
        type: 'Income',
        category: 'Gifts',
        date: new Date(),
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        amount: 50,
        type: 'Income',
        category: 'Charity',
        date: new Date(),
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.mocked(useTransactions).mockReturnValue({
      transactions,
      isLoading: false,
    });

    const { result } = renderHook(() => useBudget());

    expect(result.current.totalIncome).toBe(150);
    expect(result.current.totalExpense).toBe(0);
    expect(result.current.balance).toBe(150);
  });

  it('should calculate totals with only expense transactions', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        amount: 75,
        type: 'Expense',
        category: 'Food & Dinner',
        date: new Date(),
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        amount: 25,
        type: 'Expense',
        category: 'Travel',
        date: new Date(),
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.mocked(useTransactions).mockReturnValue({
      transactions,
      isLoading: false,
    });

    const { result } = renderHook(() => useBudget());

    expect(result.current.totalIncome).toBe(0);
    expect(result.current.totalExpense).toBe(100);
    expect(result.current.balance).toBe(-100);
  });

  it('should calculate totals with mixed income and expense transactions', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        amount: 200,
        type: 'Income',
        category: 'Gifts',
        date: new Date(),
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        amount: 80,
        type: 'Expense',
        category: 'Decorations',
        date: new Date(),
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        amount: 50,
        type: 'Expense',
        category: 'Food & Dinner',
        date: new Date(),
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.mocked(useTransactions).mockReturnValue({
      transactions,
      isLoading: false,
    });

    const { result } = renderHook(() => useBudget());

    expect(result.current.totalIncome).toBe(200);
    expect(result.current.totalExpense).toBe(130);
    expect(result.current.balance).toBe(70);
  });

  it('should recompute when transactions change', () => {
    const initialTransactions: Transaction[] = [
      {
        id: '1',
        amount: 100,
        type: 'Income',
        category: 'Gifts',
        date: new Date(),
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.mocked(useTransactions).mockReturnValue({
      transactions: initialTransactions,
      isLoading: false,
    });

    const { result, rerender } = renderHook(() => useBudget());

    expect(result.current.balance).toBe(100);

    // Simulate transaction change
    const updatedTransactions: Transaction[] = [
      ...initialTransactions,
      {
        id: '2',
        amount: 50,
        type: 'Expense',
        category: 'Food & Dinner',
        date: new Date(),
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.mocked(useTransactions).mockReturnValue({
      transactions: updatedTransactions,
      isLoading: false,
    });

    rerender();

    expect(result.current.totalIncome).toBe(100);
    expect(result.current.totalExpense).toBe(50);
    expect(result.current.balance).toBe(50);
  });
});
