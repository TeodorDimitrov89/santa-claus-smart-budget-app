import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTransactionFilters } from './useTransactionFilters';
import type { Transaction } from '../types';

// Mock useLiveQuery
vi.mock('dexie-react-hooks', () => ({
  useLiveQuery: vi.fn(),
}));

import { useLiveQuery } from 'dexie-react-hooks';

describe('useTransactionFilters', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      amount: 100,
      type: 'Income',
      category: 'Gifts',
      date: new Date('2025-12-25'),
      description: 'Christmas bonus',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      amount: 50,
      type: 'Expense',
      category: 'Food & Dinner',
      date: new Date('2025-12-20'),
      description: 'Holiday dinner',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      amount: 75,
      type: 'Expense',
      category: 'Gifts',
      date: new Date('2025-12-15'),
      description: 'Present shopping',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLiveQuery).mockReturnValue(mockTransactions);
  });

  it('should return all transactions by default', () => {
    const { result } = renderHook(() => useTransactionFilters());
    expect(result.current.filteredTransactions).toHaveLength(3);
  });

  it('should filter by type (Income)', () => {
    const { result } = renderHook(() => useTransactionFilters());

    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        type: 'Income',
      });
    });

    expect(result.current.filteredTransactions).toHaveLength(1);
    expect(result.current.filteredTransactions[0].type).toBe('Income');
  });

  it('should filter by type (Expense)', () => {
    const { result } = renderHook(() => useTransactionFilters());

    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        type: 'Expense',
      });
    });

    expect(result.current.filteredTransactions).toHaveLength(2);
  });

  it('should filter by category', () => {
    const { result } = renderHook(() => useTransactionFilters());

    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        categories: ['Gifts'],
      });
    });

    expect(result.current.filteredTransactions).toHaveLength(2);
  });

  it('should filter by multiple categories', () => {
    const { result } = renderHook(() => useTransactionFilters());

    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        categories: ['Gifts', 'Food & Dinner'],
      });
    });

    expect(result.current.filteredTransactions).toHaveLength(3);
  });

  it('should filter by search query (case insensitive)', () => {
    const { result } = renderHook(() => useTransactionFilters());

    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        searchQuery: 'DINNER',
      });
    });

    expect(result.current.filteredTransactions).toHaveLength(1);
    expect(result.current.filteredTransactions[0].description).toContain('dinner');
  });

  it('should combine multiple filters', () => {
    const { result } = renderHook(() => useTransactionFilters());

    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        type: 'Expense',
        categories: ['Gifts'],
      });
    });

    expect(result.current.filteredTransactions).toHaveLength(1);
    expect(result.current.filteredTransactions[0].category).toBe('Gifts');
    expect(result.current.filteredTransactions[0].type).toBe('Expense');
  });

  it('should clear all filters', () => {
    const { result } = renderHook(() => useTransactionFilters());

    act(() => {
      result.current.setFilters({
        type: 'Income',
        categories: ['Gifts'],
        dateRange: { startDate: new Date(), endDate: new Date() },
        searchQuery: 'test',
      });
    });

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters.type).toBe('All');
    expect(result.current.filters.categories).toEqual([]);
    expect(result.current.filters.dateRange.startDate).toBeNull();
    expect(result.current.filters.dateRange.endDate).toBeNull();
    expect(result.current.filters.searchQuery).toBe('');
  });

  it('should track hasActiveFilters correctly', () => {
    const { result } = renderHook(() => useTransactionFilters());

    expect(result.current.hasActiveFilters).toBe(false);

    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        type: 'Income',
      });
    });

    expect(result.current.hasActiveFilters).toBe(true);
  });
});
