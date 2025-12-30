import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryBarChart } from './CategoryBarChart';
import type { Transaction } from '../../types';

// Mock Recharts to avoid canvas rendering in tests
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children, data }: { children: React.ReactNode; data: unknown[] }) => (
    <div data-testid="bar-chart" data-items={data.length}>
      {children}
    </div>
  ),
  Bar: ({ dataKey, children }: { dataKey: string; children?: React.ReactNode }) => (
    <div data-testid="bar" data-key={dataKey}>
      {children}
    </div>
  ),
  Cell: () => <div data-testid="cell" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

describe('CategoryBarChart', () => {
  const mockExpenseTransactions: Transaction[] = [
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

  it('should render empty state when no transactions', () => {
    render(<CategoryBarChart transactions={[]} />);

    // Verify empty state message is displayed
    expect(screen.getByText(/No expense data available for chart/i)).toBeInTheDocument();
    expect(screen.getByText(/Add some expense transactions to see category comparison/i)).toBeInTheDocument();
    expect(screen.getByText('📊')).toBeInTheDocument();
  });

  it('should render empty state for income-only transactions', () => {
    const incomeOnly: Transaction[] = [
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
    ];
    render(<CategoryBarChart transactions={incomeOnly} />);

    // Income doesn't count as expenses, so should show empty state
    expect(screen.getByText(/No expense data available for chart/i)).toBeInTheDocument();
  });

  it('should render chart with expense data', () => {
    render(<CategoryBarChart transactions={mockExpenseTransactions} />);

    // Verify all chart components render
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();

    // All 6 categories should still be present
    const barChart = screen.getByTestId('bar-chart');
    expect(barChart).toHaveAttribute('data-items', '6');
  });

  it('should display all 6 categories regardless of expenses', () => {
    render(<CategoryBarChart transactions={mockExpenseTransactions} />);

    const barChart = screen.getByTestId('bar-chart');
    // All 6 categories (even those with $0)
    expect(barChart).toHaveAttribute('data-items', '6');
  });

  it('should re-render when transactions change', () => {
    const { rerender } = render(
      <CategoryBarChart transactions={mockExpenseTransactions} />
    );

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();

    const newTransactions: Transaction[] = [
      ...mockExpenseTransactions,
      {
        id: '3',
        amount: 75,
        type: 'Expense',
        category: 'Decorations',
        date: new Date(),
        description: 'Decor',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    rerender(<CategoryBarChart transactions={newTransactions} />);

    const barChart = screen.getByTestId('bar-chart');
    // Still 6 categories
    expect(barChart).toHaveAttribute('data-items', '6');
  });

  it('should support sortByAmount prop', () => {
    const { rerender } = render(
      <CategoryBarChart transactions={mockExpenseTransactions} sortByAmount={false} />
    );

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();

    // Re-render with sortByAmount=true
    rerender(<CategoryBarChart transactions={mockExpenseTransactions} sortByAmount={true} />);

    const barChart = screen.getByTestId('bar-chart');
    // Still 6 categories
    expect(barChart).toHaveAttribute('data-items', '6');
  });

  it('should have ARIA label on chart container', () => {
    const { container } = render(
      <CategoryBarChart transactions={mockExpenseTransactions} />
    );

    const chartContainer = container.querySelector('[aria-label]');
    expect(chartContainer).toHaveAttribute(
      'aria-label',
      'Category spending comparison bar chart'
    );
  });
});
