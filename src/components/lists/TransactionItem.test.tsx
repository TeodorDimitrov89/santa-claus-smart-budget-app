import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TransactionItem } from './TransactionItem';
import type { Transaction } from '../../types';

// Mock date-fns
vi.mock('date-fns', () => ({
  format: vi.fn(() => 'Dec 25, 2025'),
}));

describe('TransactionItem', () => {
  const mockIncomeTransaction: Transaction = {
    id: '1',
    amount: 100.5,
    type: 'Income',
    category: 'Gifts',
    date: new Date('2025-12-25'),
    description: 'Christmas bonus',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockExpenseTransaction: Transaction = {
    id: '2',
    amount: 75.25,
    type: 'Expense',
    category: 'Food & Dinner',
    date: new Date('2025-12-24'),
    description: 'Holiday dinner for elves',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should render transaction with all required fields', () => {
    render(<TransactionItem transaction={mockIncomeTransaction} />);

    expect(screen.getByText('Dec 25, 2025')).toBeInTheDocument();
    expect(screen.getByText('Christmas bonus')).toBeInTheDocument();
    expect(screen.getByText('Gifts')).toBeInTheDocument();
    expect(screen.getByText(/\+\$100\.50/)).toBeInTheDocument();
  });

  it('should display income with green color and + prefix', () => {
    render(<TransactionItem transaction={mockIncomeTransaction} />);

    const amountElement = screen.getByText(/\+\$100\.50/);
    expect(amountElement).toHaveClass('text-green-600');
  });

  it('should display expense with red color and - prefix', () => {
    render(<TransactionItem transaction={mockExpenseTransaction} />);

    const amountElement = screen.getByText(/-\$75\.25/);
    expect(amountElement).toHaveClass('text-red-600');
  });

  it('should format amount with 2 decimal places', () => {
    const transaction = { ...mockIncomeTransaction, amount: 50 };
    render(<TransactionItem transaction={transaction} />);

    expect(screen.getByText(/\+\$50\.00/)).toBeInTheDocument();
  });

  it('should display category badge', () => {
    render(<TransactionItem transaction={mockIncomeTransaction} />);

    const categoryBadge = screen.getByText('Gifts');
    expect(categoryBadge).toBeInTheDocument();
  });

  it('should truncate long descriptions', () => {
    const longDescription = 'This is a very long description that exceeds fifty characters and should be truncated';
    const transaction = { ...mockIncomeTransaction, description: longDescription };
    render(<TransactionItem transaction={transaction} />);

    const descElement = screen.getByText(/This is a very long description/);
    expect(descElement).toBeInTheDocument();
  });

  it('should render edit and delete button placeholders', () => {
    render(<TransactionItem transaction={mockIncomeTransaction} />);

    const editButton = screen.getByLabelText('Edit transaction');
    const deleteButton = screen.getByLabelText('Delete transaction');

    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
    expect(editButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });

  it('should show tooltips for disabled action buttons', () => {
    render(<TransactionItem transaction={mockIncomeTransaction} />);

    const editButton = screen.getByLabelText('Edit transaction');
    const deleteButton = screen.getByLabelText('Delete transaction');

    expect(editButton).toHaveAttribute('title', 'Edit (Coming in Story 2.3)');
    expect(deleteButton).toHaveAttribute('title', 'Delete (Coming in Story 2.4)');
  });
});
