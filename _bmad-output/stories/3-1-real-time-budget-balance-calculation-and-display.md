# Story 3.1: Real-time Budget Balance Calculation and Display

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Santa,
I want to see my current budget balance calculated in real-time,
So that I always know how much money I have available.

## Acceptance Criteria

**Given** I am on the Dashboard page
**When** The page loads
**Then** The budget balance is displayed prominently in a large, festive card at the top

**And** The balance displays:
- Total Income (sum of all Income transactions)
- Total Expenses (sum of all Expense transactions)
- Current Balance (Total Income - Total Expenses)

**And** All amounts are formatted with currency symbol and 2 decimal places (e.g., "$1,234.56")

**And** Pure functions for calculations are implemented in `src/lib/budget.ts`

**And** The calculation is memoized using `useMemo` in a custom hook to prevent unnecessary recalculations

**When** I create, update, or delete a transaction
**Then** The balance recalculates immediately without page refresh

**And** The `useLiveQuery` hook ensures real-time updates from IndexedDB

**And** The balance calculation is accurate across all operations

## Tasks / Subtasks

- [ ] Extend Budget Calculation Library (AC: Pure functions)
  - [ ] Verify `src/lib/budget.ts` exists.
  - [ ] Implement/Update calculation functions using `reduce`:
    ```typescript
    export const calculateTotalByType = (transactions: Transaction[], type: 'Income' | 'Expense'): number => {
      return transactions
        .filter((t) => t.type === type)
        .reduce((sum, t) => sum + t.amount, 0);
    };

    export const calculateBalance = (transactions: Transaction[]): number => {
      const income = calculateTotalByType(transactions, 'Income');
      const expense = calculateTotalByType(transactions, 'Expense');
      return income - expense;
    };
    ```

- [ ] Verify/Update Budget Summary Type (AC: Type-safe balance data)
  - [ ] Ensure `BudgetSummary` in `src/types/index.ts` contains:
    ```typescript
    export type BudgetSummary = {
      totalIncome: number;
      totalExpense: number;
      balance: number;
    };
    ```

- [ ] Create `useBudget` Custom Hook (AC: Real-time balance with memoization)
  - [ ] Create `src/hooks/useBudget.ts`.
  - [ ] Implement hook using `useTransactions` (from `src/hooks/useTransactions.ts`):
    ```typescript
    import { useMemo } from 'react';
    import { calculateTotalByType, calculateBalance } from '../lib/budget';
    import { useTransactions } from './useTransactions';
    import type { BudgetSummary } from '../types';

    export const useBudget = (): BudgetSummary => {
      const { transactions } = useTransactions();

      return useMemo(() => ({
        totalIncome: calculateTotalByType(transactions, 'Income'),
        totalExpense: calculateTotalByType(transactions, 'Expense'),
        balance: calculateBalance(transactions),
      }), [transactions]);
    };
    ```

- [ ] Create Currency Formatting Utility (AC: $ symbol, 2 decimal places)
  - [ ] Create `src/lib/format.ts`.
  - [ ] Implement `formatCurrency` using `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`.

- [ ] Implement Budget Balance UI (AC: Festive display on Dashboard)
  - [ ] Create `src/components/budget/BudgetBalanceCard.tsx`.
  - [ ] Implement responsive 3-column grid (mobile: 1-column).
  - [ ] Use festive colors: `christmas-red` for headers, `green-600` for income, `red-600` for expenses.
  - [ ] Add `BudgetBalanceCard` to the top of `src/pages/Dashboard.tsx`.

- [ ] Comprehensive Testing (AC: 100% logic coverage + Reactivity)
  - [ ] `src/lib/budget.test.ts`: Test `calculateTotalByType` and `calculateBalance` with mixed transactions and empty arrays.
  - [ ] `src/hooks/useBudget.test.ts`: Test reactivity. **Hint**: Mock `useTransactions` to return different transaction arrays and verify the hook returns updated values.
  - [ ] `src/components/budget/BudgetBalanceCard.test.tsx`: Verify rendering and formatting.

- [ ] Manual Testing Checklist
  - [ ] Verify Dashboard top placement.
  - [ ] Add/Edit/Delete transaction → Observe instant balance update.
  - [ ] Check mobile responsive layout.

## Dev Notes

### Implementation Requirements
- **100% Functional**: Pure functions for logic, hooks for state/data.
- **Reactivity**: `useLiveQuery` (via `useTransactions`) is the source of truth.
- **Performance**: `useMemo` is mandatory in `useBudget` as `useLiveQuery` returns a new array on every DB change.

### Architecture Compliance
- **Theme**: Use `christmas-red` (#C41E3A), `christmas-green` (#165B33), and `christmas-gold` (#FFD700) from Tailwind config.
- **Formatting**: Always show 2 decimal places. Handle negative balances with a minus sign (default `Intl` behavior).