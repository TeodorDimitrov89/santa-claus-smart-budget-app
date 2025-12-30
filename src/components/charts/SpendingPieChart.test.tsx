import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SpendingPieChart } from './SpendingPieChart';
import type { Transaction } from '../../types';

// Mock Recharts to avoid canvas rendering in tests
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({ data }: { data: unknown[] }) => (
    <div data-testid="pie" data-items={data.length}>
      {JSON.stringify({ dataCount: data.length })}
    </div>
  ),
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

describe('SpendingPieChart', () => {
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

  it('should render empty state when no expense transactions', () => {
    render(<SpendingPieChart transactions={[]} />);
    expect(screen.getByText(/No expense data available/i)).toBeInTheDocument();
  });

  it('should render empty state when only income transactions', () => {
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
    render(<SpendingPieChart transactions={incomeOnly} />);
    expect(screen.getByText(/No expense data available/i)).toBeInTheDocument();
  });

  it('should render chart with expense data', () => {
    render(<SpendingPieChart transactions={mockExpenseTransactions} />);

    // Verify chart components render
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('should display correct number of slices for expense categories', () => {
    render(<SpendingPieChart transactions={mockExpenseTransactions} />);

    const pieElement = screen.getByTestId('pie');
    // 2 expense categories (Gifts, Food & Dinner)
    expect(pieElement).toHaveAttribute('data-items', '2');
  });

  it('should re-render when transactions change', () => {
    const { rerender } = render(
      <SpendingPieChart transactions={mockExpenseTransactions} />
    );

    expect(screen.getByTestId('pie')).toBeInTheDocument();

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

    rerender(<SpendingPieChart transactions={newTransactions} />);

    const pieElement = screen.getByTestId('pie');
    // Now 3 expense categories
    expect(pieElement).toHaveAttribute('data-items', '3');
  });

  it('should have ARIA label on chart container', () => {
    const { container } = render(
      <SpendingPieChart transactions={mockExpenseTransactions} />
    );

    const chartContainer = container.querySelector('[aria-label]');
    expect(chartContainer).toHaveAttribute(
      'aria-label',
      'Spending distribution pie chart'
    );
  });

  // Story 3.6: Income view tests
  it('should render income data when view prop is income', () => {
    const incomeTransactions: Transaction[] = [
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
        description: 'Donation',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    render(<SpendingPieChart transactions={incomeTransactions} view="income" />);

    const pieElement = screen.getByTestId('pie');
    expect(pieElement).toHaveAttribute('data-items', '2');
  });

  it('should update chart title for income view', () => {
    const incomeTransactions: Transaction[] = [
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

    const { container } = render(
      <SpendingPieChart transactions={incomeTransactions} view="income" />
    );

    const chartContainer = container.querySelector('[aria-label]');
    expect(chartContainer).toHaveAttribute(
      'aria-label',
      'Income distribution pie chart'
    );
  });

  it('should show income empty state message', () => {
    const expenseOnly: Transaction[] = [
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
    ];

    render(<SpendingPieChart transactions={expenseOnly} view="income" />);

    expect(screen.getByText(/No income data available for chart/i)).toBeInTheDocument();
    expect(screen.getByText(/Add some income transactions to see your income distribution/i)).toBeInTheDocument();
  });

  it('should default to expense view when view prop is omitted', () => {
    const { container } = render(
      <SpendingPieChart transactions={mockExpenseTransactions} />
    );

    const chartContainer = container.querySelector('[aria-label]');
    expect(chartContainer).toHaveAttribute(
      'aria-label',
      'Spending distribution pie chart'
    );
  });
});
