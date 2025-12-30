import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  SpendingPieChart: ({ transactions, view }: { transactions: Transaction[]; view?: 'income' | 'expense' }) => (
    <div data-testid="spending-pie-chart" data-view={view || 'expense'}>
      Chart with {transactions.length} transactions ({view || 'expense'} view)
    </div>
  ),
}));

vi.mock('../components/charts/CategoryBarChart', () => ({
  CategoryBarChart: ({ transactions, view, sortByAmount }: { transactions: Transaction[]; view?: 'income' | 'expense'; sortByAmount?: boolean }) => (
    <div data-testid="category-bar-chart" data-view={view || 'expense'} data-sort={sortByAmount ? 'true' : 'false'}>
      Bar chart with {transactions.length} transactions ({view || 'expense'} view, sort: {sortByAmount ? 'yes' : 'no'})
    </div>
  ),
}));

vi.mock('../components/charts/ChartViewToggle', () => ({
  ChartViewToggle: ({ view, onChange }: { view: 'income' | 'expense'; onChange: (v: 'income' | 'expense') => void }) => (
    <div data-testid="chart-view-toggle">
      <button onClick={() => onChange('expense')}>Expenses</button>
      <button onClick={() => onChange('income')}>Income</button>
      <span>Current: {view}</span>
    </div>
  ),
}));

vi.mock('../components/charts/CategorySortToggle', () => ({
  CategorySortToggle: ({ sortByAmount, onChange }: { sortByAmount: boolean; onChange: (v: boolean) => void }) => (
    <div data-testid="category-sort-toggle">
      <button onClick={() => onChange(false)}>Original Order</button>
      <button onClick={() => onChange(true)}>By Amount</button>
      <span>Sort: {sortByAmount ? 'by amount' : 'original'}</span>
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
    const pieChart = screen.getByTestId('spending-pie-chart');
    expect(pieChart).toHaveTextContent('Chart with 2 transactions');
  });

  it('should handle empty transactions gracefully', () => {
    vi.mocked(useTransactions).mockReturnValue({
      transactions: [],
      isLoading: false,
    });

    render(<Dashboard />);
    const pieChart = screen.getByTestId('spending-pie-chart');
    expect(pieChart).toHaveTextContent('Chart with 0 transactions');
  });

  it('should render Spending Distribution section heading', () => {
    vi.mocked(useTransactions).mockReturnValue({
      transactions: mockTransactions,
      isLoading: false,
    });

    render(<Dashboard />);
    expect(screen.getByText(/Spending Distribution/i)).toBeInTheDocument();
  });

  it('should render CategoryBarChart component', () => {
    vi.mocked(useTransactions).mockReturnValue({
      transactions: mockTransactions,
      isLoading: false,
    });

    render(<Dashboard />);
    expect(screen.getByTestId('category-bar-chart')).toBeInTheDocument();
  });

  it('should pass transactions to CategoryBarChart', () => {
    vi.mocked(useTransactions).mockReturnValue({
      transactions: mockTransactions,
      isLoading: false,
    });

    render(<Dashboard />);
    expect(screen.getByText(/Bar chart with 2 transactions/i)).toBeInTheDocument();
  });

  it('should render Category Comparison section heading', () => {
    vi.mocked(useTransactions).mockReturnValue({
      transactions: mockTransactions,
      isLoading: false,
    });

    render(<Dashboard />);
    expect(screen.getByText(/Category Comparison/i)).toBeInTheDocument();
  });

  describe('Toggle Components Integration', () => {
    it('should render ChartViewToggle component', () => {
      vi.mocked(useTransactions).mockReturnValue({
        transactions: mockTransactions,
        isLoading: false,
      });

      render(<Dashboard />);
      expect(screen.getByTestId('chart-view-toggle')).toBeInTheDocument();
    });

    it('should render CategorySortToggle component', () => {
      vi.mocked(useTransactions).mockReturnValue({
        transactions: mockTransactions,
        isLoading: false,
      });

      render(<Dashboard />);
      expect(screen.getByTestId('category-sort-toggle')).toBeInTheDocument();
    });

    it('should default to expense view', () => {
      vi.mocked(useTransactions).mockReturnValue({
        transactions: mockTransactions,
        isLoading: false,
      });

      render(<Dashboard />);

      const pieChart = screen.getByTestId('spending-pie-chart');
      const barChart = screen.getByTestId('category-bar-chart');

      expect(pieChart).toHaveAttribute('data-view', 'expense');
      expect(barChart).toHaveAttribute('data-view', 'expense');
    });

    it('should update charts when view toggle is clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(useTransactions).mockReturnValue({
        transactions: mockTransactions,
        isLoading: false,
      });

      render(<Dashboard />);

      const incomeButton = screen.getByRole('button', { name: /Income/i });
      await user.click(incomeButton);

      const pieChart = screen.getByTestId('spending-pie-chart');
      const barChart = screen.getByTestId('category-bar-chart');

      expect(pieChart).toHaveAttribute('data-view', 'income');
      expect(barChart).toHaveAttribute('data-view', 'income');
    });

    it('should update section heading when view changes', async () => {
      const user = userEvent.setup();
      vi.mocked(useTransactions).mockReturnValue({
        transactions: mockTransactions,
        isLoading: false,
      });

      render(<Dashboard />);

      // Initially should show "Spending Distribution"
      expect(screen.getByText(/Spending Distribution/i)).toBeInTheDocument();

      // Click Income toggle
      const incomeButton = screen.getByRole('button', { name: /Income/i });
      await user.click(incomeButton);

      // Should now show "Income Distribution"
      expect(screen.getByText(/Income Distribution/i)).toBeInTheDocument();
    });

    it('should default to original sort order', () => {
      vi.mocked(useTransactions).mockReturnValue({
        transactions: mockTransactions,
        isLoading: false,
      });

      render(<Dashboard />);

      const barChart = screen.getByTestId('category-bar-chart');
      expect(barChart).toHaveAttribute('data-sort', 'false');
    });

    it('should update bar chart when sort toggle is clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(useTransactions).mockReturnValue({
        transactions: mockTransactions,
        isLoading: false,
      });

      render(<Dashboard />);

      const sortByAmountButton = screen.getByRole('button', { name: /By Amount/i });
      await user.click(sortByAmountButton);

      const barChart = screen.getByTestId('category-bar-chart');
      expect(barChart).toHaveAttribute('data-sort', 'true');
    });

    it('should support combinations of view and sort toggles', async () => {
      const user = userEvent.setup();
      vi.mocked(useTransactions).mockReturnValue({
        transactions: mockTransactions,
        isLoading: false,
      });

      render(<Dashboard />);

      // Change to income view
      const incomeButton = screen.getByRole('button', { name: /Income/i });
      await user.click(incomeButton);

      // Enable sort by amount
      const sortByAmountButton = screen.getByRole('button', { name: /By Amount/i });
      await user.click(sortByAmountButton);

      const barChart = screen.getByTestId('category-bar-chart');
      expect(barChart).toHaveAttribute('data-view', 'income');
      expect(barChart).toHaveAttribute('data-sort', 'true');
    });
  });
});
