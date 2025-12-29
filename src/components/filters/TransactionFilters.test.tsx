import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionFilters } from './TransactionFilters';
import type { FilterState } from '../../hooks/useTransactionFilters';

describe('TransactionFilters', () => {
  const mockFilters: FilterState = {
    type: 'All',
    categories: [],
    dateRange: { startDate: null, endDate: null },
    searchQuery: '',
  };

  const mockSetFilters = vi.fn();
  const mockClearFilters = vi.fn();

  it('should render type filter with All, Income, Expense options', () => {
    render(
      <TransactionFilters
        filters={mockFilters}
        setFilters={mockSetFilters}
        clearFilters={mockClearFilters}
        hasActiveFilters={false}
      />
    );

    const typeSelect = screen.getByLabelText(/type/i);
    expect(typeSelect).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Income')).toBeInTheDocument();
    expect(screen.getByText('Expense')).toBeInTheDocument();
  });

  it('should render search input', () => {
    render(
      <TransactionFilters
        filters={mockFilters}
        setFilters={mockSetFilters}
        clearFilters={mockClearFilters}
        hasActiveFilters={false}
      />
    );

    expect(screen.getByPlaceholderText(/search descriptions/i)).toBeInTheDocument();
  });

  it('should render category checkboxes for all 6 categories', () => {
    render(
      <TransactionFilters
        filters={mockFilters}
        setFilters={mockSetFilters}
        clearFilters={mockClearFilters}
        hasActiveFilters={false}
      />
    );

    expect(screen.getByLabelText(/gifts/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/food & dinner/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/decorations/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/travel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/charity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/santa's workshop/i)).toBeInTheDocument();
  });

  it('should render Clear Filters button disabled when no active filters', () => {
    render(
      <TransactionFilters
        filters={mockFilters}
        setFilters={mockSetFilters}
        clearFilters={mockClearFilters}
        hasActiveFilters={false}
      />
    );

    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    expect(clearButton).toBeDisabled();
  });

  it('should enable Clear Filters button when filters are active', () => {
    render(
      <TransactionFilters
        filters={mockFilters}
        setFilters={mockSetFilters}
        clearFilters={mockClearFilters}
        hasActiveFilters={true}
      />
    );

    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    expect(clearButton).not.toBeDisabled();
  });

  it('should call clearFilters when Clear button clicked', async () => {
    const user = userEvent.setup();
    render(
      <TransactionFilters
        filters={mockFilters}
        setFilters={mockSetFilters}
        clearFilters={mockClearFilters}
        hasActiveFilters={true}
      />
    );

    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    await user.click(clearButton);

    expect(mockClearFilters).toHaveBeenCalledOnce();
  });
});
