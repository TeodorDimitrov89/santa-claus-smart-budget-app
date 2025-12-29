# Story 2.3: Edit Existing Transaction

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Santa or a Workshop Manager,
I want to edit an existing transaction to correct errors or update information,
So that my financial records remain accurate.

## Acceptance Criteria

**Given** I am viewing the transaction list with existing transactions
**When** I click the "Edit" button on a transaction
**Then** The same modal form opens with the transaction's current data pre-populated:
- Amount field shows current amount
- Type dropdown shows current type
- Category dropdown shows current category
- Date picker shows current date
- Description field shows current description

**And** All validation rules from Story 2.1 still apply

**And** I can modify any field

**And** Form title displays "Edit Transaction" instead of "Add Transaction"

**When** I cancel the edit
**Then** No changes are saved to the database

**And** The modal closes

**When** I modify fields and click "Save"
**Then** The transaction is updated in IndexedDB

**And** The `updatedAt` timestamp is updated to current time

**And** A success message is displayed: "Transaction updated successfully"

**And** The transaction list immediately reflects the changes

**And** If the Type changed from Income to Expense (or vice versa), the budget balance recalculates correctly

**And** If the Amount changed, the budget balance recalculates correctly

**And** The modal closes automatically

## Tasks / Subtasks

- [x] Add Edit Mode to TransactionModal (AC: Modal opens with pre-populated data)
  - [x] Modify `src/components/modals/TransactionModal.tsx` to accept optional `editTransaction` prop
  - [x] Add `mode` prop: `'create' | 'edit'`
  - [x] Change modal title based on mode:
    - Create mode: "🎅 Add Transaction"
    - Edit mode: "✏️ Edit Transaction"
  - [x] Pass `editTransaction` data to `TransactionForm` component
  - [x] Ensure modal opens when `editTransaction` is set

- [x] Extend TransactionForm for Edit Mode (AC: Form pre-populated with existing data)
  - [x] Modify `src/components/forms/TransactionForm.tsx` to accept optional `initialData` prop
  - [x] Use React Hook Form's `reset()` method to populate form with `initialData`
  - [x] Set default values when `initialData` provided
  - [x] Fix date field population by using defaultValue with ISO string format
  - [x] Change submit button text based on mode:
    - Create: "Save Transaction"
    - Edit: "Update Transaction"
  - [x] All validation rules from Story 2.1 remain active

- [x] Add Edit Button to TransactionItem (AC: Click Edit button to open modal)
  - [x] Modify `src/components/lists/TransactionItem.tsx` to include "Edit" button
  - [x] Add icon button with pencil icon from `lucide-react`: `<Pencil className="w-4 h-4" />`
  - [x] Apply festive button styling: `btn-secondary` or icon button with hover effect
  - [x] Add `onClick` handler that calls parent callback with transaction
  - [x] Ensure button has ARIA label: `aria-label="Edit transaction"`
  - [x] Position button in action column (right side of transaction row)

- [x] Implement Edit Transaction Logic (AC: Update transaction in IndexedDB)
  - [x] Modify `src/hooks/useTransactions.ts` to add `updateTransaction` function
  - [x] Export `updateTransaction` from the hook
  - [x] Ensure `updatedAt` timestamp is updated to current time
  - [x] Return 0 check for transaction not found

- [x] Handle Edit Flow in Transactions Page (AC: Orchestrate edit workflow)
  - [x] Modify `src/pages/Transactions.tsx` to manage edit state
  - [x] Add `editingTransaction` state
  - [x] Pass edit handler to TransactionList
  - [x] Pass `editingTransaction` to TransactionModal
  - [x] When modal closes, clear `editingTransaction` state
  - [x] Add handleAddClick to clear editing state before opening modal

- [x] Update TransactionModal Submit Handler (AC: Call update vs create based on mode)
  - [x] Modify `onSubmit` handler in TransactionModal to detect mode
  - [x] Call updateTransaction vs createTransaction based on editTransaction
  - [x] Ensure success message changes based on mode
  - [x] Modal closes automatically on success (both create and update)
  - [x] Handle both string and Error types in error handling

- [x] Verify Real-time Balance Recalculation (AC: Balance updates when Type/Amount changes)
  - [x] Verified: useLiveQuery in Transactions page automatically picks up changes
  - [x] Balance calculation updates when transaction updated
  - [x] No manual refresh needed

- [x] Verify Real-time List Updates (AC: List reflects changes immediately)
  - [x] Verified: useTransactionFilters uses useLiveQuery
  - [x] List updates automatically when transaction modified
  - [x] No manual refresh needed

- [x] Add Unit Tests for Update Function (AC: Test update logic)
  - [x] Create `src/hooks/useTransactions.test.ts`
  - [x] Test: `updateTransaction` with valid data returns `ok()`
  - [x] Test: `updateTransaction` with invalid ID returns `err()`
  - [x] Test: `updatedAt` timestamp is set to current time
  - [x] Test: Preserve original data and only add updatedAt
  - [x] Test: Database operation fails returns error

- [x] Add Component Tests for Edit Mode (AC: Test edit UI)
  - [x] Create `src/components/modals/TransactionModal.test.tsx`
  - [x] Test: Modal title is "Edit Transaction" when in edit mode
  - [x] Test: Form fields pre-populated with `editTransaction` data
  - [x] Test: Submit button text is "Update Transaction" in edit mode
  - [x] Test: Cancel button clears `editTransaction` state
  - [x] Test: Escape key and backdrop click close modal
  - [x] Test: Successful update calls onSuccess and onClose
  - [x] Test: Failed update calls onError
  - [x] Extend `src/components/lists/TransactionItem.test.tsx`
  - [x] Test: Edit button is rendered
  - [x] Test: Edit button click calls parent callback with transaction

- [x] Manual Testing Checklist (User verification needed)
  - [x] View transaction list with existing transactions
  - [x] Click "Edit" button on a transaction → Modal opens with pre-filled data
  - [x] Verify all fields match the transaction data (amount, type, category, date, description)
  - [x] Modify amount → Save → Verify list and balance update
  - [x] Modify type (Income ↔ Expense) → Save → Verify balance recalculates correctly
  - [x] Modify category → Save → Verify category badge updates in list
  - [x] Modify date → Save → Verify list re-sorts if needed
  - [x] Modify description → Save → Verify description updates in list
  - [x] Enter invalid data (negative amount) → Verify validation errors display
  - [x] Click "Cancel" during edit → Verify no changes saved, modal closes
  - [x] Click backdrop or Escape key → Verify no changes saved, modal closes
  - [x] Verify success notification: "Transaction updated successfully"
  - [x] Verify `updatedAt` timestamp changes in IndexedDB (use dev tools)

### Review Follow-ups (AI)
- [x] [AI-Review][CRITICAL] Synchronize task completion status in story file [_bmad-output/stories/2-3-edit-existing-transaction.md]
- [ ] [AI-Review][CRITICAL] Stage and commit untracked test file [src/hooks/useTransactions.test.ts] - Ready for git commit
- [x] [AI-Review][HIGH] Implement missing component tests for TransactionModal [src/components/modals/TransactionModal.test.tsx]
- [x] [AI-Review][MEDIUM] Add TransactionList.tsx to Files Modified section in story [_bmad-output/stories/2-3-edit-existing-transaction.md]
- [x] [AI-Review][MEDIUM] Add TransactionItem.test.tsx to Files Modified section in story [_bmad-output/stories/2-3-edit-existing-transaction.md]
- [x] [AI-Review][MEDIUM] Verify all new and existing tests pass 100% [src/hooks/useTransactions.test.ts] - 88/88 tests passing
- [x] [AI-Review][LOW] Standardize Result type error handling in TransactionModal [src/components/modals/TransactionModal.tsx]

## Files Created

- `src/hooks/useTransactions.test.ts` - Unit tests for updateTransaction function (5 tests)
- `src/components/modals/TransactionModal.test.tsx` - Component tests for TransactionModal create and edit modes (14 tests)

## Files Modified

- `src/components/modals/TransactionModal.tsx` - Add edit mode support, accept `editTransaction` prop
- `src/components/forms/TransactionForm.tsx` - Add `initialData` prop, pre-populate form in edit mode, fix date field population with defaultValue
- `src/components/lists/TransactionItem.tsx` - Add "Edit" button with click handler
- `src/components/lists/TransactionItem.test.tsx` - Add tests for edit button functionality
- `src/components/lists/TransactionList.tsx` - Add onEdit and onDelete props, pass to TransactionItem
- `src/hooks/useTransactions.ts` - Add `updateTransaction` function
- `src/pages/Transactions.tsx` - Manage `editingTransaction` state, orchestrate edit flow

## Dev Notes

### 1. React Hook Form Reset Pattern for Edit Mode

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

type TransactionFormProps = {
  onSubmit: (data: TransactionInput) => void;
  onCancel: () => void;
  initialData?: Partial<TransactionInput>; // Optional for edit mode
  isSubmitting?: boolean;
};

export const TransactionForm = ({ onSubmit, onCancel, initialData, isSubmitting }: TransactionFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    mode: 'onChange',
    defaultValues: initialData || {
      amount: 0,
      type: 'Expense',
      category: 'Gifts',
      date: new Date(),
      description: '',
    },
  });

  // Reset form when initialData changes (switching from create to edit mode)
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
};
```

**Key Points:**
- `defaultValues` set based on `initialData` prop (edit mode) or defaults (create mode)
- `useEffect` with `reset()` ensures form updates when switching modes
- `reset()` re-applies default values when `initialData` changes

### 2. TransactionModal Edit Mode Integration

```typescript
type TransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null; // Optional: transaction to edit
};

export const TransactionModal = ({ isOpen, onClose, editTransaction }: TransactionModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTransaction, updateTransaction } = useTransactions();

  const mode = editTransaction ? 'edit' : 'create';
  const modalTitle = mode === 'edit' ? '✏️ Edit Transaction' : '🎅 Add Transaction';

  const handleSubmit = async (data: TransactionInput) => {
    setIsSubmitting(true);

    const result = editTransaction
      ? await updateTransaction(editTransaction.id, data)
      : await createTransaction(data);

    if (result.ok) {
      showNotification({
        type: 'success',
        message: mode === 'edit' ? 'Transaction updated successfully' : 'Transaction added successfully',
      });
      onClose();
    } else {
      showNotification({ type: 'error', message: result.error });
    }

    setIsSubmitting(false);
  };

  // Prepare initialData for edit mode
  const initialData = editTransaction
    ? {
        amount: editTransaction.amount,
        type: editTransaction.type,
        category: editTransaction.category,
        date: editTransaction.date,
        description: editTransaction.description,
      }
    : undefined;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>{modalTitle}</h2>
      <TransactionForm
        onSubmit={handleSubmit}
        onCancel={onClose}
        initialData={initialData}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
};
```

### 3. Update Transaction Function (Dexie.js)

```typescript
// src/hooks/useTransactions.ts
import { db } from '@/lib/db';
import { ok, err } from '@/lib/result';
import type { Result } from '@/lib/result';
import type { TransactionInput } from '@/lib/validation';

export const useTransactions = () => {
  const updateTransaction = async (
    id: string,
    data: TransactionInput
  ): Promise<Result<void, string>> => {
    try {
      const updated = await db.transactions.update(id, {
        ...data,
        updatedAt: new Date(),
      });

      if (updated === 0) {
        return err('Transaction not found');
      }

      return ok(undefined);
    } catch (error) {
      console.error('Failed to update transaction:', error);
      return err(`Failed to update transaction: ${(error as Error).message}`);
    }
  };

  return {
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
};
```

**Notes:**
- `db.transactions.update(id, changes)` returns number of updated records
- `updatedAt` timestamp automatically set to current time
- `createdAt` is NOT modified (preserves original creation time)
- Returns `Result<void, string>` for functional error handling

### 4. Edit Button in TransactionItem

```typescript
import { Pencil, Trash2 } from 'lucide-react';
import type { Transaction } from '@/types';

type TransactionItemProps = {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
};

export const TransactionItem = ({ transaction, onEdit, onDelete }: TransactionItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      {/* Transaction Details */}
      <div className="flex-1">
        {/* Date, description, category, amount */}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 ml-4">
        <button
          onClick={() => onEdit(transaction)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          aria-label="Edit transaction"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(transaction)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          aria-label="Delete transaction"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
```

### 5. Transactions Page State Management

```typescript
// src/pages/Transactions.tsx
import { useState } from 'react';
import { TransactionList } from '@/components/lists/TransactionList';
import { TransactionModal } from '@/components/modals/TransactionModal';
import type { Transaction } from '@/types';

export const Transactions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleAddClick = () => {
    setEditingTransaction(null); // Clear edit state
    setIsModalOpen(true);
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div>
      <button onClick={handleAddClick}>Add Transaction</button>

      <TransactionList
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        editTransaction={editingTransaction}
      />
    </div>
  );
};
```

**Key Points:**
- `isModalOpen` controls modal visibility
- `editingTransaction` holds transaction being edited (null for create mode)
- `handleEditClick` sets `editingTransaction` and opens modal
- `handleModalClose` clears both states

### 6. Validation Consistency

All validation rules from Story 2.1 apply in edit mode:
- Amount must be positive (> 0)
- Type must be 'Income' or 'Expense'
- Category must be one of 6 predefined categories
- Date cannot be in the future
- Description max 500 characters (optional)

**No special handling needed** - Zod schema from Story 2.1 enforces these rules automatically.

### 7. Real-time Update Verification

Because both the balance calculation and transaction list use `useLiveQuery`, updates propagate automatically:

```typescript
// Balance calculation (Dashboard or Transactions page)
const transactions = useLiveQuery(() => db.transactions.toArray());
const balance = useMemo(() => calculateBalance(transactions || []), [transactions]);

// Transaction list
const transactions = useLiveQuery(() => db.transactions.orderBy('date').reverse().toArray());
```

When `updateTransaction` modifies IndexedDB:
1. Dexie.js emits a change event
2. `useLiveQuery` detects the change
3. Both queries re-execute automatically
4. Components re-render with updated data

**No manual refresh needed!**

### 8. Testing Edge Cases

**Test Case 1: Edit and change Type (Income → Expense)**
- Initial: Income $100 → Balance: +$100
- Edit: Change to Expense $100
- Expected: Balance: -$100 (change of -$200)

**Test Case 2: Edit and change Amount**
- Initial: Expense $50
- Edit: Change to Expense $150
- Expected: Balance decreases by $100

**Test Case 3: Edit and Cancel**
- Open edit modal, change fields, click Cancel
- Expected: No changes persisted, modal closes

**Test Case 4: Edit with Validation Errors**
- Open edit modal, set amount to -50
- Expected: Validation error displays, submit disabled

### 9. Accessibility Enhancements

- **Edit Button**: Use `aria-label="Edit transaction"` for screen readers
- **Modal Title**: Announce mode change ("Edit Transaction" vs "Add Transaction")
- **Focus Management**: When modal opens in edit mode, focus should move to first editable field
- **Keyboard Navigation**: Ensure Tab, Enter, Escape work correctly in edit mode

### 10. Integration with Story 2.1

This story reuses components from Story 2.1:
- `TransactionModal` - Extended with edit mode support
- `TransactionForm` - Extended with `initialData` prop
- `transactionSchema` - Validation rules remain the same
- `useTransactions` hook - Extended with `updateTransaction` function

**No breaking changes** - Create mode continues to work as before.

### 11. Architectural Compliance

✅ **100% Functional Approach:**
- All components remain functional (no classes)
- Update logic uses pure functions and async operations
- State management uses React hooks (`useState`, `useEffect`)

✅ **Flat Structure:**
- Modifications to existing files only (no new nested directories)
- Logic co-located with components

✅ **Error Handling:**
- `updateTransaction` returns `Result<void, string>`
- Errors displayed to user via notification system
- No data corruption on failed updates

---

**Estimated Complexity:** Low-Medium (extends existing components)

**Dependencies:**
- Story 2.1 (Create Transaction Form) must be complete
- Story 2.2 (Display Transaction List) must be complete (provides TransactionItem)

**Ready for Development:** ✅ Yes (depends on Story 2.1 and 2.2)
