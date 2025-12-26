---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - "_bmad-output/planning/prd.md"
  - "_bmad-output/solutioning/architecture.md"
  - "_bmad-output/planning/ux-design.md"
---

# santa-claus-smart-budget-app - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for santa-claus-smart-budget-app, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**FR-001: Create Transaction** (P0 - Must Have)
- Users must be able to add new income or expense transactions to the system
- Fields: Amount (positive, required), Type (Income/Expense), Category (6 predefined), Date (default today, cannot be future), Description (optional, max 500 chars)
- Validation: amount > 0, date not in future, category from predefined list
- Real-time balance update after creation
- Confirmation upon successful creation

**FR-002: Read/View Transactions** (P0 - Must Have)
- Display all transactions in reverse chronological order (newest first)
- Show: Date, Description, Category, Amount, Type (Income/Expense indicator)
- Visual differentiation: Income (green/positive), Expense (red/negative)
- Filter by: Transaction Type (Income, Expense, All), Category (single or multiple), Date range
- Search transactions by description text
- Display transaction count and total amounts
- Show current budget balance prominently
- Pagination or infinite scroll for large transaction lists (>50 items)

**FR-003: Update Transaction** (P0 - Must Have)
- Users must be able to edit existing transactions to correct errors or update information
- All fields editable: Amount, Type, Category, Date, Description
- Same validation rules as creation
- Cancel edit without saving changes
- Confirmation upon successful update
- Balance recalculates immediately after update
- Transaction list updates to reflect changes
- Date modified timestamp tracked (system metadata)

**FR-004: Delete Transaction** (P0 - Must Have)
- Users must be able to remove transactions from the system
- Confirmation prompt before deletion ("Are you sure you want to delete this transaction?")
- User can cancel deletion
- Permanent removal upon confirmation
- Balance recalculates immediately after deletion
- Transaction list updates to remove deleted item
- Confirmation of successful deletion
- No undo functionality in V1 (permanent deletion)
- System logs deletion event (timestamp, user) for audit trail

**FR-005: Predefined Categories** (P0 - Must Have)
- System must enforce 6 predefined categories for all transactions:
  1. Gifts - Budget allocated for children's presents
  2. Food & Dinner - Meals for elves, reindeer feed, holiday feasts
  3. Decorations - North Pole decorations, workshop festive setup
  4. Travel - Sleigh maintenance, reindeer transportation costs
  5. Charity - Community giving, support for those in need
  6. Santa's Workshop - Workshop operations, tools, elf salaries, maintenance
- Categories appear in dropdown/select during transaction creation/editing
- Categories cannot be added, removed, or renamed by users
- Each transaction must belong to exactly one category
- Category selection is mandatory for all transactions

**FR-006: Category-Based Analysis** (P0 - Must Have)
- Display total income per category
- Display total expenses per category
- Display net amount (income - expense) per category
- Show percentage of total budget allocated to each category
- Highlight categories with highest spending
- Sort categories by total amount (descending)
- Filter transaction list by category
- Category totals update in real-time as transactions change

**FR-007: Budget Balance Display** (P0 - Must Have)
- Budget balance visible on main dashboard/homepage
- Formula: Total Income - Total Expenses
- Updates in real-time when transactions are created/updated/deleted
- Visual indicator of balance status:
  - Positive balance: Green
  - Zero balance: Yellow/Warning
  - Negative balance: Red/Critical
- Display total income and total expense separately
- Show balance with appropriate currency formatting
- Balance persists across user sessions

**FR-008: Visual Charts** (P1 - Should Have)
- Pie Chart: Spending distribution across 6 categories (% breakdown)
- Bar Chart: Total amount per category (sortable)
- Charts display expense data (income less relevant for visual distribution)
- Interactive charts (hover to see exact amounts and percentages)
- Charts update in real-time as transactions change
- Option to toggle between Income view and Expense view
- Charts are colorful and festive (aligned with Santa theme)
- Mobile-responsive chart rendering

**FR-009: Overspending Detection** (P2 - Nice to Have)
- AI system monitors spending patterns and alerts users to potential budget issues
- Alerts triggered when category spending exceeds expected thresholds:
  - Warning: Category spending > 40% of total budget
  - Critical: Category spending > 60% of total budget
- Alerts displayed prominently on dashboard
- Alert message includes: Category name, Current spending amount and percentage, Recommended action
- Example: "⚠️ Alert: Decorations spending is 55% of total budget. Consider moving funds to Gifts."
- Users can dismiss alerts
- Alert history visible (last 10 alerts)

**FR-010: Budget Reallocation Suggestions** (P2 - Nice to Have)
- AI provides actionable recommendations for budget reallocation to protect critical categories
- System prioritizes "Gifts" category as mission-critical
- When Gifts budget is low (<30% of total) and other categories are high, system suggests:
  - Source category (where to reduce spending)
  - Target category (Gifts)
  - Suggested amount to reallocate
- Example: "💡 Suggestion: Move 500 coins from Decorations to Gifts to ensure Christmas success!"
- Suggestions appear on dashboard when conditions are met
- Users can accept or dismiss suggestions
- Suggestions update as budget changes

### NonFunctional Requirements

**NFR-001: Performance**
- Page load time < 2 seconds on standard broadband connection
- Transaction creation/update response time < 500ms
- Chart rendering < 1 second
- Support up to 1,000 transactions without performance degradation

**NFR-002: Usability**
- Intuitive UI requiring minimal training
- Festive Santa-themed design (Christmas colors: Red #C41E3A, Green #165B33, Gold #FFD700, playful typography)
- Mobile-responsive design (works on tablets and phones)
- Accessible (WCAG 2.1 Level AA compliance)
- Clear error messages for validation failures

**NFR-003: Reliability**
- 99% uptime during December (critical period)
- Data persistence (no transaction loss)
- Automatic save (no manual save required)
- Graceful error handling (no data corruption)

**NFR-004: Browser Compatibility**
- Support for modern browsers: Chrome, Firefox, Safari, Edge (last 2 versions each)

**NFR-005: Data Storage**
- Browser-based storage (IndexedDB for structured data)
- No cloud/server dependency (offline-first approach)
- Data persists across browser sessions
- Data export capability (JSON format)

### Additional Requirements

**From Architecture Document:**

**Starter Template (CRITICAL for Epic 1, Story 1):**
- Initialize project using: `npm create vite@latest santa-claus-smart-budget-app -- --template react-ts`
- Node.js requirements: 20.19+ or 22.12+
- Vite + React 18 + TypeScript stack

**Architectural Constraints (MANDATORY):**
- 100% Functional Approach - NO CLASSES (no service classes, no class-based error boundaries)
- Error Handling: Must use 'react-error-boundary' library for functional error boundaries
- Structure: Keep it flat and simple (max 2-3 levels deep)

**Technology Stack Requirements:**
- Core: React 18.x, TypeScript 5.x, Vite (latest), React Router 6.x, React Context + useReducer
- Styling: Tailwind CSS 3.x, Headless UI (optional), Lucide React icons, Google Fonts ("Mountains of Christmas" + "Poppins")
- Data & Validation: Dexie.js 4.x (IndexedDB), Zod 3.x (validation), React Hook Form 7.x, date-fns 3.x
- Charts: Recharts 2.x (React-native, declarative)
- Error Handling: react-error-boundary 4.x (MANDATORY - user requirement)
- Testing: Vitest, React Testing Library, Playwright (E2E)
- Code Quality: ESLint + TypeScript ESLint, Prettier
- Dev Tools: Husky + lint-staged (pre-commit hooks)

**Project Structure (Flat Architecture):**
- src/pages/ - Page-level components (Dashboard, Transactions, Categories)
- src/components/ - Reusable UI components (layout, budget, transactions, ui)
- src/hooks/ - Custom React hooks (useTransactions, useBudget, useCategories, useFilters)
- src/lib/ - Business logic & utilities (budget.ts, categories.ts, validation.ts, db.ts, constants.ts, result.ts)
- src/context/ - React Context providers (TransactionContext)
- src/types/ - TypeScript type definitions
- tests/ - Test files (unit, integration, e2e)

**Data Model Implementation:**
- IndexedDB database name: 'SantaBudgetDB'
- IndexedDB table: 'transactions' with indices on: type, category, date, amount
- Transaction entity with fields: id (UUID), amount (number), type (enum), category (enum), date (date), description (string), createdAt (timestamp), updatedAt (timestamp)

**From UX Design Document:**

**Responsive Design Requirements:**
- Breakpoints: Mobile (< 768px), Tablet (768-1023px), Desktop (1024px+)
- Touch-friendly tap targets (min 44px)
- Adaptive layouts (single column → grid)

**Accessibility Requirements (WCAG 2.1 Level AA):**
- Keyboard navigation support (Tab, Enter, Escape, Arrow keys)
- Screen reader support with ARIA labels and ARIA live regions for alerts/updates
- 4.5:1 contrast ratio for normal text
- 3:1 contrast ratio for large text and UI components
- Focus indicators visible on all interactive elements

**Festive Theming:**
- Christmas color palette (Red, Green, Gold)
- Festive typography ("Mountains of Christmas" for headers, "Poppins" for body)
- Micro-animations (balance count-up, transaction slide-in)
- Optional decorative elements (snowflakes, icons)

**Interaction Patterns:**
- Modal-based transaction creation/editing forms
- Inline validation with clear error messages
- Real-time balance updates with visual feedback
- Confirmation dialogs for destructive actions (delete)
- Hover tooltips on charts for detailed information

### FR Coverage Map

```
FR-001 (Create Transaction): Epic 2 - Transaction Management
FR-002 (Read/View Transactions): Epic 2 - Transaction Management
FR-003 (Update Transaction): Epic 2 - Transaction Management
FR-004 (Delete Transaction): Epic 2 - Transaction Management
FR-005 (Predefined Categories): Epic 2 - Transaction Management
FR-006 (Category-Based Analysis): Epic 3 - Budget Visibility & Analytics
FR-007 (Budget Balance Display): Epic 3 - Budget Visibility & Analytics
FR-008 (Visual Charts): Epic 3 - Budget Visibility & Analytics
FR-009 (Overspending Detection): DEFERRED - Future Phase
FR-010 (Budget Reallocation Suggestions): DEFERRED - Future Phase

Architecture Requirements: Epic 1 - Project Foundation & Core Infrastructure
UX Requirements: Distributed across Epic 1 (theming), Epic 2 (forms, validation), Epic 3 (charts, responsiveness)
NFRs: Addressed across all epics (Performance, Accessibility, Browser Compatibility)
```

## Epic List

### Epic 1: Project Foundation & Core Infrastructure
Development environment is set up with all necessary tools, libraries, and architectural patterns established, enabling developers to start building features with confidence.

**FRs covered:** Architecture requirements (starter template, tech stack setup, project structure)

### Epic 2: Transaction Management
Santa and Workshop Managers can create, view, edit, and delete income/expense transactions with full validation, enabling complete financial record keeping.

**FRs covered:** FR-001 (Create), FR-002 (Read/View), FR-003 (Update), FR-004 (Delete), FR-005 (Predefined Categories)

### Epic 3: Budget Visibility & Analytics
Users can see their current budget balance, understand spending distribution across categories, and visualize financial patterns through interactive charts.

**FRs covered:** FR-006 (Category-Based Analysis), FR-007 (Budget Balance Display), FR-008 (Visual Charts)

**Deferred to Future Phase:**
- Epic 4: AI-Powered Smart Alerts (FR-009, FR-010) - P2 Nice to Have features

---

## Epic 1: Project Foundation & Core Infrastructure

Development environment is set up with all necessary tools, libraries, and architectural patterns established, enabling developers to start building features with confidence.

### Story 1.1: Initialize Project with Vite Starter

As a developer,
I want to initialize the project using Vite + React + TypeScript starter template,
So that I have a modern, fast development environment ready for building features.

**Acceptance Criteria:**

**Given** Node.js 20.19+ or 22.12+ is installed on the development machine
**When** I run `npm create vite@latest santa-claus-smart-budget-app -- --template react-ts`
**Then** A new project directory is created with Vite, React 18, and TypeScript 5 configured

**And** The project includes:
- `package.json` with React 18.x and TypeScript 5.x dependencies
- `tsconfig.json` with strict TypeScript configuration
- `vite.config.ts` with Vite build configuration
- `index.html` as the application entry point
- `src/` directory with `main.tsx`, `App.tsx`, and `vite-env.d.ts`

**And** I can run `npm install` successfully to install all dependencies

**And** I can run `npm run dev` and see the default Vite + React welcome page at `http://localhost:5173`

**And** Hot Module Replacement (HMR) works when I edit `App.tsx`

### Story 1.2: Install and Configure Core Dependencies

As a developer,
I want to install and configure all core dependencies (Tailwind, Dexie.js, Zod, react-error-boundary, Recharts, React Router, React Hook Form, date-fns),
So that I have all the necessary libraries ready for implementing features.

**Acceptance Criteria:**

**Given** The Vite project is initialized from Story 1.1
**When** I install the core dependencies via npm
**Then** All dependencies are installed and listed in `package.json`:
- Tailwind CSS 3.x with PostCSS and Autoprefixer
- Dexie.js 4.x and dexie-react-hooks
- Zod 3.x
- react-error-boundary 4.x
- Recharts 2.x
- React Router 6.x
- React Hook Form 7.x with @hookform/resolvers
- date-fns 3.x
- Lucide React (icons)

**And** Tailwind CSS is configured:
- `tailwind.config.js` created with Christmas color palette (Red #C41E3A, Green #165B33, Gold #FFD700)
- `postcss.config.js` configured
- Tailwind directives added to `src/index.css`

**And** Google Fonts are integrated:
- "Mountains of Christmas" font imported
- "Poppins" font imported
- Font families configured in Tailwind config

**And** ESLint and Prettier are configured with TypeScript rules

**And** I can run `npm run dev` and see Tailwind styles applied

### Story 1.3: Set up IndexedDB Database Schema and TypeScript Types

As a developer,
I want to set up the IndexedDB database schema using Dexie.js and define TypeScript types,
So that I have a structured database ready for storing transactions.

**Acceptance Criteria:**

**Given** Dexie.js is installed from Story 1.2
**When** I create `src/lib/db.ts` with Dexie database setup
**Then** A database named 'SantaBudgetDB' is configured with version 1

**And** A `transactions` table is defined with indices on:
- `++id` (auto-incrementing primary key)
- `type` (Income/Expense)
- `category` (6 predefined categories)
- `date` (transaction date)
- `amount` (transaction amount)

**And** TypeScript types are defined in `src/types/index.ts`:
- `Transaction` type with fields: id (string), amount (number), type (enum), category (enum), date (Date), description (string), createdAt (Date), updatedAt (Date)
- `TransactionType` enum: 'Income' | 'Expense'
- `Category` enum: 'Gifts' | 'Food & Dinner' | 'Decorations' | 'Travel' | 'Charity' | 'Santa\'s Workshop'
- `FilterState` type for transaction filtering
- `BudgetSummary` type for calculated budget data

**And** The database can be imported and used in other modules

**And** TypeScript compilation succeeds with no errors

### Story 1.4: Create Base Project Structure and Navigation

As a developer,
I want to create the base project structure with flat folder hierarchy and set up routing,
So that I have organized folders and navigation ready for building features.

**Acceptance Criteria:**

**Given** The project is initialized with dependencies from Stories 1.1-1.3
**When** I create the folder structure following the flat architecture pattern
**Then** The following directories exist under `src/`:
- `pages/` - Page-level components
- `components/` - Reusable UI components (subdirs: layout, budget, transactions, ui)
- `hooks/` - Custom React hooks
- `lib/` - Business logic and utilities
- `context/` - React Context providers
- `types/` - TypeScript type definitions (already created in Story 1.3)

**And** React Router is configured in `src/App.tsx`:
- `/` route → Dashboard page
- `/transactions` route → Transactions page
- `/categories` route → Categories page

**And** A `Layout` component is created in `src/components/layout/Layout.tsx`:
- Header with navigation links (Dashboard, Transactions, Categories)
- Footer with app name and version
- Main content area that renders child routes
- Festive styling with Christmas colors

**And** A `Header` component is created in `src/components/layout/Header.tsx`:
- Navigation menu with links to all pages
- Active route highlighting
- Responsive design (mobile hamburger menu)

**And** Placeholder page components are created:
- `src/pages/Dashboard.tsx`
- `src/pages/Transactions.tsx`
- `src/pages/Categories.tsx`

**And** I can navigate between all three pages using the header navigation

**And** The URL updates correctly for each route

### Story 1.5: Configure Festive Theme and Typography

As a developer,
I want to configure the festive Christmas theme with colors, typography, and decorative elements,
So that the app has a cohesive Santa-themed visual design.

**Acceptance Criteria:**

**Given** Tailwind CSS and Google Fonts are configured from Story 1.2
**When** I update the Tailwind configuration with Christmas theme
**Then** The following custom colors are defined in `tailwind.config.js`:
- `christmas-red`: #C41E3A
- `christmas-green`: #165B33
- `christmas-gold`: #FFD700
- Additional shades for each color (light, DEFAULT, dark)

**And** Custom font families are configured:
- `heading`: "Mountains of Christmas", cursive
- `body`: "Poppins", sans-serif

**And** Global styles are added to `src/index.css`:
- Base typography using Poppins
- Heading styles using Mountains of Christmas
- Christmas-themed background gradient or pattern (optional)
- Smooth scrolling behavior

**And** Festive decorative elements are available:
- Snowflake SVG icon in `public/` directory
- Optional decorative CSS classes (e.g., `.festive-border`, `.snow-animation`)

**And** The Layout component uses the festive theme colors

**And** The app visually reflects the Christmas theme when running

### Story 1.6: Set up Error Boundaries and Testing Framework

As a developer,
I want to set up functional error boundaries using react-error-boundary and configure the testing framework,
So that errors are handled gracefully and I can write tests for components and business logic.

**Acceptance Criteria:**

**Given** react-error-boundary is installed from Story 1.2
**When** I wrap the App component with ErrorBoundary in `src/main.tsx`
**Then** An ErrorBoundary component is configured with:
- `FallbackComponent` that displays user-friendly error message
- Error message display with `error.message`
- "Try again" button that resets the error boundary
- Festive styling matching the app theme

**And** A functional Result type pattern is created in `src/lib/result.ts`:
- `Result<T, E>` type definition (success with data | failure with error)
- `ok<T>(data: T)` helper function
- `err<E>(error: E)` helper function

**And** Testing framework is configured:
- Vitest installed and configured in `vite.config.ts`
- React Testing Library installed
- Example test file created: `src/lib/result.test.ts`

**And** I can run `npm run test` and see tests execute

**And** I can intentionally trigger an error and see the error boundary fallback UI

**And** All TypeScript compilation and linting passes with no errors

---

## Epic 2: Transaction Management

Santa and Workshop Managers can create, view, edit, and delete income/expense transactions with full validation, enabling complete financial record keeping.

### Story 2.1: Create Transaction Form with Validation

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

### Story 2.2: Display Transaction List with Filtering and Search

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

### Story 2.3: Edit Existing Transaction

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

### Story 2.4: Delete Transaction with Confirmation

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

### Story 2.5: Implement Predefined Categories System

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

---

## Epic 3: Budget Visibility & Analytics

Users can see their current budget balance, understand spending distribution across categories, and visualize financial patterns through interactive charts.

### Story 3.1: Real-time Budget Balance Calculation and Display

As Santa,
I want to see my current budget balance calculated in real-time,
So that I always know how much money I have available.

**Acceptance Criteria:**

**Given** I am on the Dashboard page
**When** The page loads
**Then** The budget balance is displayed prominently in a large, festive card at the top

**And** The balance displays:
- Total Income (sum of all Income transactions)
- Total Expenses (sum of all Expense transactions)
- Current Balance (Total Income - Total Expenses)

**And** All amounts are formatted with currency symbol and 2 decimal places

**And** A pure function `calculateBalance(transactions: Transaction[]): number` is implemented in `src/lib/budget.ts`

**And** The calculation is memoized using `useMemo` to prevent unnecessary recalculations

**When** I create, update, or delete a transaction
**Then** The balance recalculates immediately without page refresh

**And** The useLiveQuery hook ensures real-time updates from IndexedDB

**And** The balance calculation is accurate across all operations

### Story 3.2: Color-coded Balance Status Indicators

As Santa,
I want visual indicators showing my budget health status,
So that I can quickly identify if I'm in good financial shape or at risk.

**Acceptance Criteria:**

**Given** I am viewing the budget balance on the Dashboard
**When** The current balance is positive (> 0)
**Then** The balance card has a green background or border (using `christmas-green` color)

**And** A checkmark icon or festive positive indicator is displayed

**And** Optional encouraging message: "Ho ho ho! Budget is healthy!"

**When** The current balance is zero (= 0)
**Then** The balance card has a yellow/warning background or border

**And** A warning icon is displayed

**And** Optional cautionary message: "Budget is balanced, spend carefully!"

**When** The current balance is negative (< 0)
**Then** The balance card has a red background or border (using `christmas-red` color)

**And** An alert/warning icon is displayed

**And** The negative balance is displayed with a minus sign: "-$XXX.XX"

**And** Optional warning message: "⚠️ Budget overspent! Review expenses."

**And** Color changes happen immediately when balance crosses thresholds

**And** WCAG 2.1 AA contrast requirements are met (4.5:1 ratio for text)

### Story 3.3: Category Aggregations and Analysis

As Santa,
I want to see spending and income aggregated by category,
So that I understand where my money is going and coming from.

**Acceptance Criteria:**

**Given** I am on the Categories page (or Dashboard with category summary)
**When** The page loads
**Then** A table/grid displays all 6 categories with the following columns:
- Category name with icon
- Total Income for that category
- Total Expenses for that category
- Net Amount (Income - Expenses)
- Percentage of total budget allocated to that category

**And** Categories with zero transactions still appear with $0.00 amounts

**And** Percentage calculation: (Category Expense Total / Grand Total Expenses) × 100

**And** Categories are sorted by Total Expense amount (descending) by default

**And** Sorting options are available:
- By Total Expense (ascending/descending)
- By Category Name (A-Z/Z-A)
- By Percentage (ascending/descending)

**And** The category with highest spending is highlighted or badged

**And** A pure function `aggregateByCategory(transactions: Transaction[]): CategorySummary[]` is implemented in `src/lib/categories.ts`

**And** The aggregation is memoized for performance

**And** Real-time updates occur when transactions change

**When** I click on a category row
**Then** The transaction list filters to show only that category's transactions

### Story 3.4: Pie Chart for Spending Distribution

As Santa or a Workshop Manager,
I want to see a pie chart showing spending distribution across categories,
So that I can quickly visualize where my budget is being allocated.

**Acceptance Criteria:**

**Given** I am on the Dashboard page with existing expense transactions
**When** The page loads
**Then** A pie chart is displayed using Recharts library

**And** The chart shows expense distribution across the 6 categories:
- Each slice represents one category
- Slice size represents percentage of total expenses
- Each slice uses a distinct color from the Christmas palette

**And** Categories with 0% (no expenses) show as 0% in the chart (no slice)

**And** The chart is interactive:
- Hovering over a slice shows a tooltip with exact amount and percentage
- Tooltip format: "Gifts: $500.00 (45%)"

**And** A legend is displayed showing all categories with their colors

**And** The chart is responsive and renders correctly on mobile devices

**And** Chart data updates in real-time when transactions change

**And** Chart rendering time is < 1 second (per NFR-001)

**And** The chart displays festive styling consistent with the app theme

### Story 3.5: Bar Chart for Category Comparison

As Santa or a Workshop Manager,
I want to see a bar chart comparing amounts across categories,
So that I can easily identify which categories have the most spending.

**Acceptance Criteria:**

**Given** I am on the Dashboard or Categories page
**When** The page loads
**Then** A bar chart is displayed using Recharts library

**And** The chart shows all 6 categories on the X-axis

**And** The Y-axis shows amount values (in dollars)

**And** Each category has a bar representing total expenses

**And** Bars are colored using the Christmas color palette

**And** The chart is sortable:
- Default: Categories in original order (Gifts, Food & Dinner, Decorations, etc.)
- Option: Sort by amount (highest to lowest)

**And** The chart is interactive:
- Hovering over a bar shows exact amount in tooltip
- Tooltip format: "Food & Dinner: $350.00"

**And** Grid lines are displayed for easy value reading

**And** The chart is responsive and renders correctly on mobile devices

**And** Chart data updates in real-time when transactions change

**And** Chart rendering time is < 1 second (per NFR-001)

### Story 3.6: Interactive Chart Features and Toggle Views

As Santa or a Workshop Manager,
I want interactive chart features and the ability to toggle between Income and Expense views,
So that I can explore my financial data from different perspectives.

**Acceptance Criteria:**

**Given** I am viewing the pie chart or bar chart
**When** The page loads
**Then** A toggle control is displayed: "View: [Expenses] / [Income]"

**And** Default view is "Expenses"

**When** I click "Income" toggle
**Then** Both charts update to show income distribution across categories

**And** Chart colors remain consistent

**And** Tooltips update to show income amounts

**When** I click back to "Expenses" toggle
**Then** Charts revert to showing expense distribution

**And** The transition between views is smooth (animated if possible)

**And** For the pie chart:
- Clicking a slice optionally highlights that category
- Clicking again de-highlights

**And** For the bar chart:
- Clicking a bar optionally filters transactions to that category
- A "Clear Filter" button appears when filtered

**And** Charts support touch interactions on mobile devices:
- Tap to see tooltip
- Pinch to zoom (optional)

**And** Charts are accessible:
- Keyboard navigation support (Tab through data points)
- ARIA labels for screen readers
- Alternative text description of chart data

**And** All chart interactions maintain festive, playful feel with smooth animations
