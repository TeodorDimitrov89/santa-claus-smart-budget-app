import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';
import type { Transaction } from '../types';

// Mock hooks
vi.mock('../hooks/useTransactions', () => ({
  useTransactions: vi.fn(),
}));

// Mock components
vi.mock('../components/budget/BudgetBalanceCard', () => ({
  BudgetBalanceCard: () => <div data-testid="budget-balance-card">Budget Balance</div>,
}));

vi.mock('../components/charts/SpendingPieChart', () => ({
  SpendingPieChart: ({ transactions }: { transactions: Transaction[] }) => (
    <div data-testid="spending-pie-chart">
      Chart with {transactions.length} transactions
    </div>
  ),
}));

import { useTransactions } from '../hooks/useTransactions';

describe('Dashboard', () => {
  const mockTransactions: Transaction[] = [
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

  it('should render Dashboard heading', () => {
    vi.mocked(useTransactions).mockReturnValue({
      transactions: [],
      isLoading: false,
    });

    render(<Dashboard />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  it('should render BudgetBalanceCard component', () => {
    vi.mocked(useTransactions).mockReturnValue({
      transactions: mockTransactions,
      isLoading: false,
    });

    render(<Dashboard />);
    expect(screen.getByTestId('budget-balance-card')).toBeInTheDocument();
  });

  it('should render SpendingPieChart component', () => {
    vi.mocked(useTransactions).mockReturnValue({
      transactions: mockTransactions,
      isLoading: false,
    });

    render(<Dashboard />);
    expect(screen.getByTestId('spending-pie-chart')).toBeInTheDocument();
  });

  it('should pass transactions to SpendingPieChart', () => {
    vi.mocked(useTransactions).mockReturnValue({
      transactions: mockTransactions,
      isLoading: false,
    });

    render(<Dashboard />);
    expect(screen.getByText(/Chart with 2 transactions/i)).toBeInTheDocument();
  });

  it('should handle empty transactions gracefully', () => {
    vi.mocked(useTransactions).mockReturnValue({
      transactions: [],
      isLoading: false,
    });

    render(<Dashboard />);
    expect(screen.getByText(/Chart with 0 transactions/i)).toBeInTheDocument();
  });

  it('should render Spending Distribution section heading', () => {
    vi.mocked(useTransactions).mockReturnValue({
      transactions: mockTransactions,
      isLoading: false,
    });

    render(<Dashboard />);
    expect(screen.getByText(/Spending Distribution/i)).toBeInTheDocument();
  });
});
