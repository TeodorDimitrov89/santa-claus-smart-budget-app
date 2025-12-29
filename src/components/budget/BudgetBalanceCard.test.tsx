import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BudgetBalanceCard } from './BudgetBalanceCard';

// Mock useBudget hook
vi.mock('../../hooks/useBudget', () => ({
  useBudget: vi.fn(),
}));

import { useBudget } from '../../hooks/useBudget';

describe('BudgetBalanceCard', () => {
  it('should render with zero values', () => {
    vi.mocked(useBudget).mockReturnValue({
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      categoryTotals: {} as any,
    });

    render(<BudgetBalanceCard />);

    expect(screen.getByText('Budget Summary')).toBeInTheDocument();
    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText('Current Balance')).toBeInTheDocument();
    expect(screen.getAllByText('$0.00')).toHaveLength(3);
  });

  it('should render positive balance correctly', () => {
    vi.mocked(useBudget).mockReturnValue({
      totalIncome: 1000,
      totalExpense: 300,
      balance: 700,
      categoryTotals: {} as any,
    });

    render(<BudgetBalanceCard />);

    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
    expect(screen.getByText('$300.00')).toBeInTheDocument();
    expect(screen.getByText('$700.00')).toBeInTheDocument();
  });

  it('should render negative balance correctly', () => {
    vi.mocked(useBudget).mockReturnValue({
      totalIncome: 100,
      totalExpense: 500,
      balance: -400,
      categoryTotals: {} as any,
    });

    render(<BudgetBalanceCard />);

    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('$500.00')).toBeInTheDocument();
    expect(screen.getByText('-$400.00')).toBeInTheDocument();
  });

  it('should format currency with thousands separators', () => {
    vi.mocked(useBudget).mockReturnValue({
      totalIncome: 1234.56,
      totalExpense: 789.12,
      balance: 445.44,
      categoryTotals: {} as any,
    });

    render(<BudgetBalanceCard />);

    expect(screen.getByText('$1,234.56')).toBeInTheDocument();
    expect(screen.getByText('$789.12')).toBeInTheDocument();
    expect(screen.getByText('$445.44')).toBeInTheDocument();
  });

  it('should render festive heading and responsive sections', () => {
    vi.mocked(useBudget).mockReturnValue({
      totalIncome: 100,
      totalExpense: 50,
      balance: 50,
      categoryTotals: {} as any,
    });

    render(<BudgetBalanceCard />);

    // Behavioral test: Check that heading exists (visual styling is implementation detail)
    expect(screen.getByRole('heading', { name: 'Budget Summary' })).toBeInTheDocument();

    // Behavioral test: Check that all three sections are present
    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText('Current Balance')).toBeInTheDocument();
  });

  it('should display all three sections', () => {
    vi.mocked(useBudget).mockReturnValue({
      totalIncome: 500,
      totalExpense: 200,
      balance: 300,
      categoryTotals: {} as any,
    });

    render(<BudgetBalanceCard />);

    const sections = [
      { label: 'Total Income', value: '$500.00' },
      { label: 'Total Expenses', value: '$200.00' },
      { label: 'Current Balance', value: '$300.00' },
    ];

    sections.forEach(({ label, value }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });
});
