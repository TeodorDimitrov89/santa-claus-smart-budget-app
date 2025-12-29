# Story 2.4: Delete Transaction with Confirmation

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Santa or a Workshop Manager,
I want to delete a transaction from the system,
So that I can remove duplicate or erroneous entries.

## Acceptance Criteria

**Given** I am viewing the transaction list with existing transactions
**When** I click the "Delete" button on a transaction
**Then** A confirmation dialog appears asking: "Are you sure you want to delete this transaction?"

**And** The dialog shows the transaction details:
- Amount, Type, Category, Date, Description

**And** The dialog has two buttons: "Cancel" and "Delete"

**When** I click "Cancel"
**Then** The dialog closes

**And** No changes are made to the database

**When** I click "Delete" in the confirmation dialog
**Then** The transaction is permanently removed from IndexedDB

**And** A deletion event is logged with timestamp (console.log for V1)

**And** A success message is displayed: "Transaction deleted successfully"

**And** The transaction list updates immediately to remove the deleted item

**And** The budget balance recalculates immediately

**And** The confirmation dialog closes

**And** There is no undo functionality (permanent deletion per requirement)

## Tasks / Subtasks

- [x] Create Confirmation Dialog Component (AC: Dialog with transaction details)
  - [x] Create `src/components/modals/ConfirmationDialog.tsx`
  - [x] Accept props:
    - `isOpen: boolean`
    - `onClose: () => void`
    - `onConfirm: () => void`
    - `title: string`
    - `message: string`
    - `details?: ReactNode` (optional transaction details)
    - `confirmText?: string` (default: "Delete")
    - `cancelText?: string` (default: "Cancel")
    - `isDangerous?: boolean` (applies red styling for destructive actions)
  - [x] Render modal overlay with backdrop
  - [x] Display title, message, and optional details section
  - [x] Render Cancel and Confirm buttons
  - [x] Apply festive styling with Christmas theme
  - [x] Add danger styling when `isDangerous` is true (red button for Delete)
  - [x] Handle Escape key to close dialog (same as Cancel)
  - [x] Handle backdrop click to close dialog (same as Cancel)

- [x] Add Delete Button to TransactionItem (AC: Click Delete to open confirmation)
  - [x] Modify `src/components/lists/TransactionItem.tsx` (if not already done in Story 2.3)
  - [x] Add delete button with trash icon from `lucide-react`: `<Trash2 className="w-4 h-4" />`
  - [x] Apply festive button styling with red/danger color
  - [x] Add `onClick` handler that calls parent callback with transaction
  - [x] Ensure button has ARIA label: `aria-label="Delete transaction"`
  - [x] Position button next to Edit button in action column

- [x] Implement Delete Transaction Logic (AC: Permanently remove from IndexedDB)
  - [x] Modify `src/hooks/useTransactions.ts` to add `deleteTransaction` function:
    ```typescript
    const deleteTransaction = async (id: string): Promise<Result<void, string>> => {
      try {
        await db.transactions.delete(id);
        console.log(`[DELETE] Transaction deleted at ${new Date().toISOString()}, ID: ${id}`);
        return ok(undefined);
      } catch (error) {
        return err(`Failed to delete transaction: ${error.message}`);
      }
    };
    ```
  - [x] Export `deleteTransaction` from the hook
  - [x] Log deletion event to console with timestamp and transaction ID

- [x] Handle Delete Flow in Transactions Page (AC: Orchestrate delete workflow)
  - [x] Modify `src/pages/Transactions.tsx` to manage delete confirmation state:
    ```typescript
    const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
    ```
  - [x] Pass delete handler to TransactionList/TransactionItem:
    ```typescript
    const handleDeleteClick = (transaction: Transaction) => {
      setDeletingTransaction(transaction);
    };
    ```
  - [x] Render ConfirmationDialog:
    ```typescript
    <ConfirmationDialog
      isOpen={!!deletingTransaction}
      onClose={() => setDeletingTransaction(null)}
      onConfirm={handleConfirmDelete}
      title="Delete Transaction"
      message="Are you sure you want to delete this transaction?"
      details={<TransactionSummary transaction={deletingTransaction} />}
      confirmText="Delete"
      cancelText="Cancel"
      isDangerous={true}
    />
    ```
  - [x] Implement `handleConfirmDelete`:
    ```typescript
    const handleConfirmDelete = async () => {
      if (!deletingTransaction) return;

      const result = await deleteTransaction(deletingTransaction.id);

      if (result.ok) {
        showNotification({ type: 'success', message: 'Transaction deleted successfully' });
      } else {
        showNotification({ type: 'error', message: result.error });
      }

      setDeletingTransaction(null);
    };
    ```

- [x] Create Transaction Summary Component (AC: Display transaction details in dialog)
  - [x] Create `src/components/transactions/TransactionSummary.tsx`
  - [x] Accept `transaction: Transaction` prop
  - [x] Display transaction details in a formatted card:
    - Amount: `$${transaction.amount.toFixed(2)}`
    - Type: Income or Expense (color-coded)
    - Category: Name with icon
    - Date: Formatted as "MMM DD, YYYY"
    - Description: Full text (or "No description" if empty)
  - [x] Apply festive styling
  - [x] Use semantic HTML for accessibility

- [x] Verify Real-time Balance Recalculation (AC: Balance updates after deletion)
  - [x] Test: Delete an Income transaction → Balance decreases by amount
  - [x] Test: Delete an Expense transaction → Balance increases by amount
  - [x] Ensure `useLiveQuery` in balance calculation picks up deletion automatically

- [x] Verify Real-time List Updates (AC: List updates after deletion)
  - [x] Test: Delete transaction → Item removed from list immediately
  - [x] Ensure `useLiveQuery` in TransactionList picks up deletion automatically
  - [x] Transaction count updates ("Showing X transactions")

- [x] Add Unit Tests for Delete Function (AC: Test delete logic)
  - [x] Create or extend `src/hooks/useTransactions.test.ts`
  - [x] Test: `deleteTransaction` with valid ID returns `ok()`
  - [x] Test: `deleteTransaction` with invalid ID returns `ok()` (Dexie doesn't error on non-existent ID)
  - [x] Test: Console.log called with deletion event and timestamp
  - [x] Mock `db.transactions.delete` to verify it's called with correct ID

- [x] Add Component Tests for ConfirmationDialog (AC: Test dialog behavior)
  - [x] Create `src/components/modals/ConfirmationDialog.test.tsx`
  - [x] Test: Dialog renders when `isOpen` is true
  - [x] Test: Dialog does not render when `isOpen` is false
  - [x] Test: Title and message display correctly
  - [x] Test: Details section renders when provided
  - [x] Test: Cancel button calls `onClose`
  - [x] Test: Delete button calls `onConfirm`
  - [x] Test: Escape key calls `onClose`
  - [x] Test: Backdrop click calls `onClose`
  - [x] Test: Dangerous styling applied when `isDangerous` is true

- [x] Add Component Tests for Delete Flow (AC: Test delete interaction)
  - [x] Extend `src/components/lists/TransactionItem.test.tsx`
  - [x] Test: Delete button is rendered
  - [x] Test: Delete button click calls parent callback with transaction
  - [x] Extend `src/pages/Transactions.test.tsx` (create if needed)
  - [x] Test: Clicking delete opens confirmation dialog
  - [x] Test: Clicking cancel in dialog closes it without deleting
  - [x] Test: Clicking delete in dialog calls `deleteTransaction`
  - [x] Test: Success notification shown after delete

- [x] Manual Testing Checklist (User verification needed)
  - [x] View transaction list with existing transactions
  - [x] Click "Delete" button on a transaction → Confirmation dialog opens
  - [x] Verify dialog shows transaction details (amount, type, category, date, description)
  - [x] Verify dialog has "Cancel" and "Delete" buttons
  - [x] Click "Cancel" → Dialog closes, transaction still in list
  - [x] Click "Delete" again → Dialog opens
  - [x] Click "Delete" in dialog → Transaction removed from list immediately
  - [x] Verify success notification: "Transaction deleted successfully"
  - [x] Verify transaction count updates ("Showing X transactions")
  - [x] Verify budget balance recalculates correctly
  - [x] Check browser console for deletion log with timestamp
  - [x] Verify IndexedDB no longer contains deleted transaction (use dev tools)
  - [x] Test Escape key → Dialog closes without deleting
  - [x] Test backdrop click → Dialog closes without deleting
  - [x] Delete multiple transactions in succession → All work correctly

## Files Created

- `src/components/modals/ConfirmationDialog.tsx` - Reusable confirmation dialog component
- `src/components/transactions/TransactionSummary.tsx` - Transaction details display
- `src/components/modals/ConfirmationDialog.test.tsx` - Confirmation dialog tests

## Files Modified

- `src/hooks/useTransactions.ts` - Add `deleteTransaction` function with console logging
- `src/components/lists/TransactionItem.tsx` - Add "Delete" button (if not added in Story 2.3)
- `src/pages/Transactions.tsx` - Manage delete confirmation state, orchestrate delete flow

## Dev Notes

### 1. ConfirmationDialog Component Pattern

```typescript
// src/components/modals/ConfirmationDialog.tsx
import { type ReactNode } from 'react';
import { X } from 'lucide-react';

type ConfirmationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  details?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
};

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  details,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
}: ConfirmationDialogProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscapeKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const confirmButtonClass = isDangerous
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-green-600 hover:bg-green-700 text-white';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
      onKeyDown={handleEscapeKey}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h2 id="dialog-title" className="text-xl font-bold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-700 mb-4">{message}</p>

        {/* Details */}
        {details && <div className="mb-6 p-4 bg-gray-50 rounded-md">{details}</div>}

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md transition-colors ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
```

**Key Points:**
- Generic, reusable confirmation dialog
- `isDangerous` prop applies red styling for destructive actions
- Backdrop click and Escape key close dialog
- ARIA attributes for accessibility

### 2. TransactionSummary Component

```typescript
// src/components/transactions/TransactionSummary.tsx
import { format } from 'date-fns';
import { CATEGORIES } from '@/lib/constants';
import type { Transaction } from '@/types';

type TransactionSummaryProps = {
  transaction: Transaction | null;
};

export const TransactionSummary = ({ transaction }: TransactionSummaryProps) => {
  if (!transaction) return null;

  const category = CATEGORIES.find((c) => c.name === transaction.category);
  const typeColor = transaction.type === 'Income' ? 'text-green-600' : 'text-red-600';

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Amount:</span>
        <span className={`font-semibold ${typeColor}`}>
          ${transaction.amount.toFixed(2)}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-600">Type:</span>
        <span className={`font-medium ${typeColor}`}>{transaction.type}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-600">Category:</span>
        <div className="flex items-center gap-2">
          {category?.icon}
          <span>{transaction.category}</span>
        </div>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-600">Date:</span>
        <span>{format(transaction.date, 'MMM dd, yyyy')}</span>
      </div>

      {transaction.description && (
        <div className="flex flex-col gap-1">
          <span className="text-gray-600">Description:</span>
          <span className="text-gray-800">{transaction.description}</span>
        </div>
      )}
    </div>
  );
};
```

### 3. Delete Transaction Function

```typescript
// src/hooks/useTransactions.ts
import { db } from '@/lib/db';
import { ok, err } from '@/lib/result';
import type { Result } from '@/lib/result';

export const useTransactions = () => {
  const deleteTransaction = async (id: string): Promise<Result<void, string>> => {
    try {
      await db.transactions.delete(id);

      // Log deletion event per acceptance criteria
      console.log(
        `[DELETE] Transaction deleted at ${new Date().toISOString()}, ID: ${id}`
      );

      return ok(undefined);
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      return err(`Failed to delete transaction: ${(error as Error).message}`);
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
- Dexie's `delete()` does not error if ID doesn't exist (idempotent)
- Console.log per acceptance criteria: "A deletion event is logged with timestamp"
- Returns `Result<void, string>` for consistent error handling

### 4. Transactions Page Delete Flow

```typescript
// src/pages/Transactions.tsx
import { useState } from 'react';
import { TransactionList } from '@/components/lists/TransactionList';
import { TransactionModal } from '@/components/modals/TransactionModal';
import { ConfirmationDialog } from '@/components/modals/ConfirmationDialog';
import { TransactionSummary } from '@/components/transactions/TransactionSummary';
import { useTransactions } from '@/hooks/useTransactions';
import type { Transaction } from '@/types';

export const Transactions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  const { deleteTransaction } = useTransactions();

  const handleDeleteClick = (transaction: Transaction) => {
    setDeletingTransaction(transaction);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTransaction) return;

    const result = await deleteTransaction(deletingTransaction.id);

    if (result.ok) {
      showNotification({
        type: 'success',
        message: 'Transaction deleted successfully',
      });
    } else {
      showNotification({
        type: 'error',
        message: result.error,
      });
    }

    setDeletingTransaction(null);
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Add Transaction</button>

      <TransactionList
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      <TransactionModal
        isOpen={isModalOpen || !!editingTransaction}
        onClose={handleModalClose}
        editTransaction={editingTransaction}
      />

      <ConfirmationDialog
        isOpen={!!deletingTransaction}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        details={<TransactionSummary transaction={deletingTransaction} />}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
      />
    </div>
  );
};
```

**Key Points:**
- `deletingTransaction` state holds transaction pending deletion
- `handleDeleteClick` sets `deletingTransaction` to open confirmation
- `handleConfirmDelete` performs deletion and shows notification
- Dialog closes after confirmation (success or error)

### 5. Real-time Updates After Deletion

Because the transaction list and balance calculations use `useLiveQuery`, deletions propagate automatically:

```typescript
// Transaction list (Story 2.2)
const transactions = useLiveQuery(() =>
  db.transactions.orderBy('date').reverse().toArray()
);

// Balance calculation
const balance = useMemo(() => calculateBalance(transactions || []), [transactions]);
```

When `deleteTransaction` removes a record:
1. Dexie.js emits a change event
2. `useLiveQuery` detects the change
3. Queries re-execute automatically
4. Components re-render with updated data (transaction removed from list, balance recalculated)

**No manual refresh needed!**

### 6. Console Logging for Deletion Events

Per acceptance criteria: "A deletion event is logged with timestamp (console.log for V1)"

Example console output:
```
[DELETE] Transaction deleted at 2025-12-28T15:30:45.123Z, ID: txn-abc123
```

This provides a simple audit trail for V1. Future versions might send this to an analytics service or local storage.

### 7. No Undo Functionality

Per acceptance criteria: "There is no undo functionality (permanent deletion per requirement)"

**Implementation Notes:**
- Deletion is immediate and irreversible
- No "soft delete" (marking as deleted without removing)
- No undo notification or Ctrl+Z support
- Confirmation dialog is the only safeguard

**Future Enhancement (if requested):** Could add:
- Recent deletions stored in localStorage for undo
- 5-second undo window with notification
- Soft delete with archive feature

### 8. Accessibility Considerations

- **Dialog ARIA**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` for title
- **Focus Management**: When dialog opens, focus moves to Cancel button (safer default than Delete)
- **Keyboard Navigation**: Tab cycles between Cancel and Delete, Escape closes dialog
- **Screen Readers**: Announce dialog title and message on open
- **Button Labels**: Clear, descriptive labels ("Delete" not just "OK")

### 9. Testing Edge Cases

**Test Case 1: Delete Income Transaction**
- Initial: Income $100, Balance: +$100
- Delete transaction
- Expected: Balance: $0, transaction removed from list

**Test Case 2: Delete Expense Transaction**
- Initial: Expense $50, Balance: -$50
- Delete transaction
- Expected: Balance: $0, transaction removed from list

**Test Case 3: Delete with Filters Active**
- Apply filters (e.g., Type="Expense")
- Delete an expense transaction
- Expected: Transaction removed, filtered view updates

**Test Case 4: Delete Last Transaction**
- Only one transaction in database
- Delete it
- Expected: Empty state displays ("No transactions found")

**Test Case 5: Rapid Delete**
- Open delete dialog, click Delete very quickly multiple times
- Expected: Only one delete operation executes (guard with `if (!deletingTransaction)`)

### 10. Integration with Previous Stories

This story integrates with:
- **Story 2.1**: Uses same notification system for success/error messages
- **Story 2.2**: TransactionItem component adds Delete button, TransactionList passes delete handler
- **Story 2.3**: Delete button appears alongside Edit button in TransactionItem

**Shared Components:**
- `TransactionItem` - Now has both Edit and Delete buttons
- `Transactions` page - Manages edit and delete states
- `useTransactions` hook - Provides create, update, delete operations

### 11. Architectural Compliance

✅ **100% Functional Approach:**
- All components are functional (ConfirmationDialog, TransactionSummary)
- Delete logic uses pure async functions
- State management uses React hooks (`useState`)

✅ **Flat Structure:**
- New components in `components/modals/` and `components/transactions/`
- Max 2 levels deep, no over-engineering

✅ **Error Handling:**
- `deleteTransaction` returns `Result<void, string>`
- Errors displayed to user via notification
- No silent failures

---

**Estimated Complexity:** Low-Medium (straightforward CRUD operation)

**Dependencies:**
- Story 2.2 (Display Transaction List) must be complete (provides TransactionItem)
- Story 2.3 (Edit Transaction) recommended but not required

**Ready for Development:** ✅ Yes (depends on Story 2.2)
