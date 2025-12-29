import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Categories from './Categories';
import type { Transaction } from '../types';

/**
 * Integration tests for Categories page
 * [Source: Story 3.3 - Category Aggregations and Analysis]
 * Tests the full page interaction including filtering
 */

// Mock the hooks
vi.mock('../hooks/useTransactionFilters', () => ({
  useTransactionFilters: vi.fn(),
}));

vi.mock('../components/categories/CategoryAggregationTable', () => ({
  CategoryAggregationTable: vi.fn(({ transactions, onCategoryClick }) => (
    <div data-testid="category-table">
      <div>Table with {transactions.length} transactions</div>
      {onCategoryClick && <button onClick={() => onCategoryClick('Gifts')}>Click Gifts</button>}
    </div>
  )),
}));

vi.mock('../components/lists/TransactionList', () => ({
  TransactionList: vi.fn(({ transactions }) => (
    <div data-testid="transaction-list">List with {transactions.length} transactions</div>
  )),
}));

import { useTransactionFilters } from '../hooks/useTransactionFilters';
import { CategoryAggregationTable } from '../components/categories/CategoryAggregationTable';

describe('Categories Page', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      amount: 100,
      type: 'Expense',
      category: 'Gifts',
      date: new Date('2024-12-15'),
      description: 'Test gift',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      amount: 200,
      type: 'Expense',
      category: 'Food & Dinner',
      date: new Date('2024-12-16'),
      description: 'Test food',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useTransactionFilters).mockReturnValue({
      filters: {
        type: 'All',
        categories: [],
        dateRange: { startDate: null, endDate: null },
        searchQuery: '',
      },
      setFilters: vi.fn(),
      filteredTransactions: mockTransactions,
      transactionsWithoutCategoryFilter: mockTransactions,
      clearFilters: vi.fn(),
      hasActiveFilters: false,
    });
  });

  it('should render the page with heading', () => {
    render(<Categories />);

    expect(screen.getByRole('heading', { name: /categories/i })).toBeInTheDocument();
  });

  it('should render CategoryAggregationTable with transactions', () => {
    render(<Categories />);

    expect(screen.getByTestId('category-table')).toBeInTheDocument();
    expect(screen.getByText(/Table with 2 transactions/i)).toBeInTheDocument();
  });

  it('should pass transactionsWithoutCategoryFilter to CategoryAggregationTable', () => {
    render(<Categories />);

    expect(CategoryAggregationTable).toHaveBeenCalledWith(
      expect.objectContaining({
        transactions: mockTransactions,
        onCategoryClick: expect.any(Function),
      }),
      expect.anything()
    );
  });

  it('should show TransactionList when category is selected', () => {
    vi.mocked(useTransactionFilters).mockReturnValue({
      filters: {
        type: 'All',
        categories: ['Gifts'],
        dateRange: { startDate: null, endDate: null },
        searchQuery: '',
      },
      setFilters: vi.fn(),
      filteredTransactions: [mockTransactions[0]],
      transactionsWithoutCategoryFilter: mockTransactions,
      clearFilters: vi.fn(),
      hasActiveFilters: true,
    });

    render(<Categories />);

    expect(screen.getByTestId('transaction-list')).toBeInTheDocument();
    expect(screen.getByText(/Transactions for Gifts/i)).toBeInTheDocument();
  });

  it('should handle category click', () => {
    const mockSetFilters = vi.fn();
    vi.mocked(useTransactionFilters).mockReturnValue({
      filters: {
        type: 'All',
        categories: [],
        dateRange: { startDate: null, endDate: null },
        searchQuery: '',
      },
      setFilters: mockSetFilters,
      filteredTransactions: mockTransactions,
      transactionsWithoutCategoryFilter: mockTransactions,
      clearFilters: vi.fn(),
      hasActiveFilters: false,
    });

    render(<Categories />);

    const clickButton = screen.getByText('Click Gifts');
    fireEvent.click(clickButton);

    expect(mockSetFilters).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should handle empty transactions gracefully', () => {
    vi.mocked(useTransactionFilters).mockReturnValue({
      filters: {
        type: 'All',
        categories: [],
        dateRange: { startDate: null, endDate: null },
        searchQuery: '',
      },
      setFilters: vi.fn(),
      filteredTransactions: [],
      transactionsWithoutCategoryFilter: [],
      clearFilters: vi.fn(),
      hasActiveFilters: false,
    });

    render(<Categories />);

    expect(screen.getByTestId('category-table')).toBeInTheDocument();
    expect(screen.getByText(/Table with 0 transactions/i)).toBeInTheDocument();
  });

  it('should not show TransactionList when no category is selected', () => {
    render(<Categories />);

    expect(screen.queryByTestId('transaction-list')).not.toBeInTheDocument();
  });
});
