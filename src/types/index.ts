/**
 * Transaction type: Income or Expense
 */
export type TransactionType = 'Income' | 'Expense';

/**
 * Predefined categories for Santa's Budget
 * FR-005: 6 categories, immutable by users
 */
export type Category =
  | 'Gifts'
  | 'Food & Dinner'
  | 'Decorations'
  | 'Travel'
  | 'Charity'
  | "Santa's Workshop";

/**
 * Transaction entity stored in IndexedDB
 */
export interface Transaction {
  id: string; // UUID generated on client side
  amount: number; // Must be positive
  type: TransactionType;
  category: Category;
  date: Date; // Cannot be in future
  description: string; // Optional, max 500 chars
  createdAt: Date; // System-generated timestamp
  updatedAt: Date; // Updated on edit
}

/**
 * Form data for transaction input
 * Used by TransactionForm component
 */
export interface TransactionFormData {
  amount: string; // String from input, validate to positive number
  type: TransactionType | '';
  category: Category | '';
  date: Date | null;
  description: string;
}

/**
 * Filter state for transaction list
 */
export interface FilterState {
  transactionType: TransactionType | 'All';
  categories: Category[]; // Multiple category selection
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  searchTerm: string; // Search in description field
}

/**
 * Calculated budget summary (FR-007)
 */
export interface BudgetSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number; // totalIncome - totalExpense
  categoryTotals: Record<
    Category,
    {
      income: number;
      expense: number;
      net: number; // income - expense
    }
  >;
}

/**
 * Category aggregation summary for analytics
 * [FR-006: Category-Based Analysis]
 * [Source: Story 3.3 - Category Aggregations and Analysis]
 */
export interface CategorySummary {
  category: Category;
  totalIncome: number;
  totalExpense: number;
  netAmount: number; // totalIncome - totalExpense
  percentage: number; // (totalExpense / grandTotalExpenses) * 100
  transactionCount: number; // Number of transactions in category
}

/**
 * Sort options for category aggregation table
 */
export type CategorySortField = 'name' | 'expense' | 'percentage';
export type CategorySortDirection = 'asc' | 'desc';
