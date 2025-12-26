# Epic 3: Budget Visibility & Analytics

Users can see their current budget balance, understand spending distribution across categories, and visualize financial patterns through interactive charts.

**FRs covered:** FR-006 (Category-Based Analysis), FR-007 (Budget Balance Display), FR-008 (Visual Charts)

---

## Story 3.1: Real-time Budget Balance Calculation and Display

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

---

## Story 3.2: Color-coded Balance Status Indicators

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

---

## Story 3.3: Category Aggregations and Analysis

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

---

## Story 3.4: Pie Chart for Spending Distribution

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

---

## Story 3.5: Bar Chart for Category Comparison

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

---

## Story 3.6: Interactive Chart Features and Toggle Views

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
