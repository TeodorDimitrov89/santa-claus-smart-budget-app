import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionList } from './TransactionList';
import type { Transaction } from '../../types';

// Mock date-fns
vi.mock('date-fns', () => ({
  format: vi.fn(() => 'Dec 25, 2025'),
}));

describe('TransactionList', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      amount: 100.5,
      type: 'Income',
      category: 'Gifts',
      date: new Date('2025-12-25'),
      description: 'Test income',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      amount: 50.75,
      type: 'Expense',
      category: 'Food & Dinner',
      date: new Date('2025-12-24'),
      description: 'Test expense',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const createManyTransactions = (count: number): Transaction[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `${i + 1}`,
      amount: 100 + i,
      type: i % 2 === 0 ? ('Income' as const) : ('Expense' as const),
      category: 'Gifts',
      date: new Date('2025-12-25'),
      description: `Transaction ${i + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  };

  it('should display empty state when no transactions', () => {
    render(<TransactionList transactions={[]} />);
    expect(screen.getByText(/no transactions found/i)).toBeInTheDocument();
  });

  it('should display transaction count', () => {
    render(<TransactionList transactions={mockTransactions} />);
    expect(screen.getByText(/showing 2 of 2 transaction/i)).toBeInTheDocument();
  });

  it('should render all transactions', () => {
    render(<TransactionList transactions={mockTransactions} />);
    expect(screen.getByText('Test income')).toBeInTheDocument();
    expect(screen.getByText('Test expense')).toBeInTheDocument();
  });

  it('should format income with green color and + prefix', () => {
    render(<TransactionList transactions={[mockTransactions[0]]} />);
    const amountElement = screen.getByText(/\+\$100\.50/);
    expect(amountElement).toBeInTheDocument();
    expect(amountElement).toHaveClass('text-green-600');
  });

  it('should format expense with red color and - prefix', () => {
    render(<TransactionList transactions={[mockTransactions[1]]} />);
    const amountElement = screen.getByText(/-\$50\.75/);
    expect(amountElement).toBeInTheDocument();
    expect(amountElement).toHaveClass('text-red-600');
  });

  it('should not show pagination for 50 or fewer transactions', () => {
    const transactions = createManyTransactions(50);
    render(<TransactionList transactions={transactions} />);
    expect(screen.queryByLabelText('Previous page')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next page')).not.toBeInTheDocument();
  });

  it('should show pagination for more than 50 transactions', () => {
    const transactions = createManyTransactions(60);
    render(<TransactionList transactions={transactions} />);
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    expect(screen.getByText('Showing 50 of 60 transactions (Page 1 of 2)')).toBeInTheDocument();
  });

  it('should paginate transactions correctly', async () => {
    const transactions = createManyTransactions(60);
    render(<TransactionList transactions={transactions} />);

    // Should show first 50 transactions
    expect(screen.getByText('Transaction 1')).toBeInTheDocument();
    expect(screen.queryByText('Transaction 51')).not.toBeInTheDocument();

    // Click next page
    const nextButton = screen.getByLabelText('Next page');
    await userEvent.click(nextButton);

    // Should show remaining 10 transactions
    expect(screen.getByText('Transaction 51')).toBeInTheDocument();
    expect(screen.queryByText('Transaction 1')).not.toBeInTheDocument();
  });

  it('should disable Previous button on first page', () => {
    const transactions = createManyTransactions(60);
    render(<TransactionList transactions={transactions} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('should disable Next button on last page', async () => {
    const transactions = createManyTransactions(60);
    render(<TransactionList transactions={transactions} />);

    const nextButton = screen.getByLabelText('Next page');
    await userEvent.click(nextButton);

    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });
});
