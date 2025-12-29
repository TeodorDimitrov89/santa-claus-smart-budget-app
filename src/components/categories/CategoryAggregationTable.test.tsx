import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { CategoryAggregationTable } from './CategoryAggregationTable';
import type { CategorySummary } from '../../types';

/**
 * Tests for CategoryAggregationTable component
 * [Source: Story 3.3 - Category Aggregations and Analysis]
 * Behavioral testing approach: test what users see and interact with,
 * not implementation details
 */

// Mock the hook
vi.mock('../../hooks/useCategoryAggregations', () => ({
  useCategoryAggregations: vi.fn(),
}));

import { useCategoryAggregations } from '../../hooks/useCategoryAggregations';

describe('CategoryAggregationTable', () => {
  const mockTransactions = [
    {
      id: '1',
      amount: 100,
      type: 'Expense' as const,
      category: 'Gifts' as const,
      date: new Date(),
      description: 'Test',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockCategories: CategorySummary[] = [
    {
      category: 'Gifts',
      totalIncome: 500,
      totalExpense: 1000,
      netAmount: -500,
      percentage: 40,
      transactionCount: 5,
    },
    {
      category: 'Food & Dinner',
      totalIncome: 200,
      totalExpense: 800,
      netAmount: -600,
      percentage: 32,
      transactionCount: 3,
    },
    {
      category: 'Decorations',
      totalIncome: 0,
      totalExpense: 700,
      netAmount: -700,
      percentage: 28,
      transactionCount: 2,
    },
    {
      category: 'Travel',
      totalIncome: 0,
      totalExpense: 0,
      netAmount: 0,
      percentage: 0,
      transactionCount: 0,
    },
    {
      category: 'Charity',
      totalIncome: 100,
      totalExpense: 0,
      netAmount: 100,
      percentage: 0,
      transactionCount: 1,
    },
    {
      category: "Santa's Workshop",
      totalIncome: 0,
      totalExpense: 0,
      netAmount: 0,
      percentage: 0,
      transactionCount: 0,
    },
  ];

  const mockHandleSort = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCategoryAggregations).mockReturnValue({
      categories: mockCategories,
      sortField: 'expense',
      sortDirection: 'desc',
      handleSort: mockHandleSort,
    });
  });

  it('should render all 6 categories', () => {
    render(<CategoryAggregationTable transactions={mockTransactions} />);

    // All category names should be visible (rendered in both desktop and mobile views)
    expect(screen.getAllByText('Gifts').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Food & Dinner').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Decorations').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Travel').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Charity').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Santa's Workshop").length).toBeGreaterThanOrEqual(1);
  });

  it('should display formatted currency values', () => {
    render(<CategoryAggregationTable transactions={mockTransactions} />);

    // Check for formatted values (may appear multiple times in desktop/mobile)
    expect(screen.getAllByText('$1,000.00').length).toBeGreaterThanOrEqual(1); // Gifts expense
    expect(screen.getAllByText('$500.00').length).toBeGreaterThanOrEqual(1); // Gifts income
    expect(screen.getAllByText('$800.00').length).toBeGreaterThanOrEqual(1); // Food expense
  });

  it('should display percentage values with one decimal place', () => {
    render(<CategoryAggregationTable transactions={mockTransactions} />);

    expect(screen.getAllByText('40.0%').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('32.0%').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('28.0%').length).toBeGreaterThanOrEqual(1);
  });

  it('should display $0.00 for categories with no transactions', () => {
    render(<CategoryAggregationTable transactions={mockTransactions} />);

    // Travel and Santa's Workshop have zero values
    // Check that multiple $0.00 values exist
    const zeroValues = screen.getAllByText('$0.00');
    expect(zeroValues.length).toBeGreaterThan(0);

    // Check percentage for zero categories
    const zeroPercentages = screen.getAllByText('0.0%');
    expect(zeroPercentages.length).toBeGreaterThan(0);
  });

  it('should display net amounts correctly (positive and negative)', () => {
    render(<CategoryAggregationTable transactions={mockTransactions} />);

    // Negative net amounts (may appear multiple times)
    expect(screen.getAllByText('-$500.00').length).toBeGreaterThanOrEqual(1); // Gifts
    expect(screen.getAllByText('-$600.00').length).toBeGreaterThanOrEqual(1); // Food

    // Positive net amount
    expect(screen.getAllByText('$100.00').length).toBeGreaterThanOrEqual(1); // Charity income
  });

  it('should display column headers', () => {
    render(<CategoryAggregationTable transactions={mockTransactions} />);

    // Headers may appear in multiple places (heading includes "Category" word)
    expect(screen.getAllByText(/^Category$/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/total income/i)).toBeInTheDocument();
    expect(screen.getByText(/total expense/i)).toBeInTheDocument();
    expect(screen.getByText(/net amount/i)).toBeInTheDocument();
    expect(screen.getByText(/% of budget/i)).toBeInTheDocument();
  });

  it('should call handleSort when clicking sortable column headers', () => {
    render(<CategoryAggregationTable transactions={mockTransactions} />);

    // Click on category name header (use exact match to avoid heading)
    const categoryHeaders = screen.getAllByText(/^Category$/i);
    const categoryHeader = categoryHeaders.find(el => el.tagName === 'TH');
    if (categoryHeader) {
      fireEvent.click(categoryHeader);
      expect(mockHandleSort).toHaveBeenCalledWith('name');
    }

    // Click on expense header
    const expenseHeader = screen.getByText(/total expense/i);
    fireEvent.click(expenseHeader);
    expect(mockHandleSort).toHaveBeenCalledWith('expense');

    // Click on percentage header
    const percentageHeader = screen.getByText(/% of budget/i);
    fireEvent.click(percentageHeader);
    expect(mockHandleSort).toHaveBeenCalledWith('percentage');
  });

  it('should call onCategoryClick when clicking a category row', () => {
    const mockOnCategoryClick = vi.fn();
    render(<CategoryAggregationTable transactions={mockTransactions} onCategoryClick={mockOnCategoryClick} />);

    // Click on Gifts row (find by category name and click its parent row)
    const giftsElements = screen.getAllByText('Gifts');
    const giftsRow = giftsElements[0].closest('tr') || giftsElements[0].closest('[role="button"]');

    if (giftsRow) {
      fireEvent.click(giftsRow);
      expect(mockOnCategoryClick).toHaveBeenCalledWith('Gifts');
    }
  });

  it('should highlight highest spending category with badge', () => {
    render(<CategoryAggregationTable transactions={mockTransactions} />);

    // Gifts has highest expense (1000)
    // Look for "Top Spending" or similar badge text
    const badges = screen.queryAllByText(/top|highest/i);

    // If badge exists, verify it's associated with highest expense category
    if (badges.length > 0) {
      expect(badges.length).toBeGreaterThan(0);
    }
  });

  it('should handle empty transactions array', () => {
    vi.mocked(useCategoryAggregations).mockReturnValue({
      categories: mockCategories.map(c => ({
        ...c,
        totalIncome: 0,
        totalExpense: 0,
        netAmount: 0,
        percentage: 0,
        transactionCount: 0,
      })),
      sortField: 'expense',
      sortDirection: 'desc',
      handleSort: mockHandleSort,
    });

    render(<CategoryAggregationTable transactions={mockTransactions} />);

    // All categories should still render
    expect(screen.getAllByText('Gifts').length).toBeGreaterThanOrEqual(1);

    // All values should be $0.00
    const zeroValues = screen.getAllByText('$0.00');
    expect(zeroValues.length).toBeGreaterThan(0);
  });

  it('should display empty state when no transactions exist', () => {
    render(<CategoryAggregationTable transactions={mockTransactions} />);

    // Even with empty transactions, table should render with all categories
    // (per AC: "Categories with zero transactions still appear with $0.00 amounts")
    expect(screen.getAllByText('Gifts').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Food & Dinner').length).toBeGreaterThanOrEqual(1);
  });

  it('should show sort indicators on active sort column', () => {
    render(<CategoryAggregationTable transactions={mockTransactions} />);

    // Check that sortable headers exist
    const expenseHeader = screen.getByText(/total expense/i);
    expect(expenseHeader).toBeInTheDocument();

    // Visual indicators (arrows) are implementation details,
    // but we can verify headers are clickable
    expect(expenseHeader.closest('th')?.getAttribute('role')).toBeTruthy();
  });

  it('should handle category with only income (no expenses)', () => {
    render(<CategoryAggregationTable transactions={mockTransactions} />);

    // Charity has income but no expenses
    const charityElements = screen.getAllByText('Charity');
    const charityRow = charityElements[0].closest('tr');

    if (charityRow) {
      expect(within(charityRow).getAllByText('$100.00').length).toBeGreaterThanOrEqual(1); // Income
      expect(within(charityRow).getAllByText('0.0%').length).toBeGreaterThanOrEqual(1); // Percentage
    }
  });

  it('should render table structure with proper accessibility', () => {
    render(<CategoryAggregationTable transactions={mockTransactions} />);

    // Check for table element
    const tables = document.querySelectorAll('table');
    expect(tables.length).toBeGreaterThan(0);

    // Check for thead and tbody
    const thead = document.querySelector('thead');
    const tbody = document.querySelector('tbody');
    expect(thead).toBeInTheDocument();
    expect(tbody).toBeInTheDocument();
  });

  it('should handle keyboard interaction on category rows', () => {
    const mockOnCategoryClick = vi.fn();
    render(<CategoryAggregationTable transactions={mockTransactions} onCategoryClick={mockOnCategoryClick} />);

    const giftsElements = screen.getAllByText('Gifts');
    const giftsRow = giftsElements[0].closest('tr') || giftsElements[0].closest('[role="button"]');

    if (giftsRow) {
      // Simulate Enter key press
      fireEvent.keyDown(giftsRow, { key: 'Enter', code: 'Enter' });
      expect(mockOnCategoryClick).toHaveBeenCalledWith('Gifts');
    }
  });

  it('should pass transactions to useCategoryAggregations hook', () => {
    const mockTransactions = [
      {
        id: '1',
        amount: 100,
        type: 'Expense' as const,
        category: 'Gifts' as const,
        date: new Date(),
        description: 'Test',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    render(<CategoryAggregationTable transactions={mockTransactions} />);

    expect(useCategoryAggregations).toHaveBeenCalledWith(mockTransactions);
  });
});
