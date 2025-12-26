# Epic 2: Transaction Management

Santa and Workshop Managers can create, view, edit, and delete income/expense transactions with full validation, enabling complete financial record keeping.

**FRs covered:** FR-001 (Create), FR-002 (Read/View), FR-003 (Update), FR-004 (Delete), FR-005 (Predefined Categories)

---

## Story 2.1: Create Transaction Form with Validation

As Santa or a Workshop Manager,
I want to add a new income or expense transaction with validated fields,
So that I can accurately track money coming in or going out of my budget.

**Acceptance Criteria:**

**Given** I am on the Transactions page
**When** I click the "Add Transaction" button
**Then** A modal opens with a transaction creation form

**And** The form includes the following fields:
- Amount (number input, required, positive only)
- Type (dropdown: "Income" or "Expense", required)
- Category (dropdown with 6 predefined categories, required)
- Date (date picker, default to today, cannot be future date, required)
- Description (text area, optional, max 500 characters)

**And** Zod validation schema is implemented in `src/lib/validation.ts`:
- Amount must be positive number
- Type must be 'Income' or 'Expense'
- Category must be one of the 6 predefined categories
- Date cannot be in the future
- Description max 500 characters

**And** React Hook Form is integrated with Zod resolver

**And** Inline validation errors display below each field:
- "Amount must be greater than 0"
- "Date cannot be in the future"
- Clear, user-friendly error messages

**And** Form submission is disabled when validation fails

**When** I fill out all required fields with valid data and click "Save"
**Then** The transaction is saved to IndexedDB via Dexie.js

**And** A success message is displayed: "Transaction added successfully"

**And** The modal closes automatically

**And** The transaction appears immediately in the transaction list

**And** The budget balance updates in real-time

---

## Story 2.2: Display Transaction List with Filtering and Search

As Santa or a Workshop Manager,
I want to view all my transactions in a clear, organized list with filtering and search capabilities,
So that I can easily find and review my financial activity.

**Acceptance Criteria:**

**Given** I am on the Transactions page with existing transactions in the database
**When** The page loads
**Then** All transactions are displayed in reverse chronological order (newest first)

**And** Each transaction shows:
- Date (formatted as "MMM DD, YYYY")
- Description
- Category with category icon/badge
- Amount (formatted with 2 decimal places)
- Type indicator (Income in green with + symbol, Expense in red with - symbol)

**And** Transaction count is displayed: "Showing X transactions"

**And** Filter controls are available:
- Transaction Type filter (All, Income, Expense)
- Category filter (multi-select with all 6 categories)
- Date range filter (start date, end date)

**And** Search box is available to search by description text

**When** I filter by Type="Expense"
**Then** Only expense transactions are displayed

**When** I filter by Category="Gifts"
**Then** Only transactions with Gifts category are displayed

**When** I search for a description keyword
**Then** Only transactions with matching description are displayed

**And** Filters can be combined (Type + Category + Search + Date range)

**And** A "Clear Filters" button resets all filters

**And** The current budget balance is displayed prominently at the top

**And** For lists > 50 items, pagination or infinite scroll is implemented

**And** The useLiveQuery hook from dexie-react-hooks provides real-time updates

---

## Story 2.3: Edit Existing Transaction

As Santa or a Workshop Manager,
I want to edit an existing transaction to correct errors or update information,
So that my financial records remain accurate.

**Acceptance Criteria:**

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

---

## Story 2.4: Delete Transaction with Confirmation

As Santa or a Workshop Manager,
I want to delete a transaction from the system,
So that I can remove duplicate or erroneous entries.

**Acceptance Criteria:**

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

---

## Story 2.5: Implement Predefined Categories System

As Santa or a Workshop Manager,
I want all transactions to be categorized using 6 predefined, immutable categories,
So that spending is consistently organized across North Pole operations.

**Acceptance Criteria:**

**Given** The application is running
**When** I access the category dropdown in the transaction form
**Then** Exactly 6 categories are available:
1. Gifts - "Budget allocated for children's presents"
2. Food & Dinner - "Meals for elves, reindeer feed, holiday feasts"
3. Decorations - "North Pole decorations, workshop festive setup"
4. Travel - "Sleigh maintenance, reindeer transportation costs"
5. Charity - "Community giving, support for those in need"
6. Santa's Workshop - "Workshop operations, tools, elf salaries, maintenance"

**And** Each category has:
- An icon (from Lucide React icon set)
- A color (mapped to Christmas theme colors)
- A description tooltip

**And** Categories are defined in `src/lib/constants.ts` as a constant array

**And** The Category enum in `src/types/index.ts` matches these 6 categories

**And** No options exist to add, remove, or rename categories

**And** Category selection is mandatory (cannot submit form without selecting a category)

**And** All existing transactions from Stories 2.1-2.4 use these categories

**And** Category data is consistent across all components (form, list, filters)
