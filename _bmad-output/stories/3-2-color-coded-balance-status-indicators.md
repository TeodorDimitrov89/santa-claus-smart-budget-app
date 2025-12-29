# Story 3.2: Color-coded Balance Status Indicators

**Epic:** 3 - Budget Visibility & Analytics
**Status:** ready-for-dev
**Story Key:** 3-2-color-coded-balance-status-indicators
**Created:** 2025-12-29

---

## User Story

As Santa,
I want visual indicators showing my budget health status,
So that I can quickly identify if I'm in good financial shape or at risk.

---

## Acceptance Criteria

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

## Developer Context

### Related Stories
- **Story 3.1** (completed): Created BudgetBalanceCard component, useBudget hook, formatCurrency utility
  - This story **enhances** the existing BudgetBalanceCard component with conditional color-coded status
  - Pattern established: functional components, TDD approach, comprehensive test coverage

### Key Files Created in Story 3.1 (to be modified)
1. **src/components/budget/BudgetBalanceCard.tsx** - Main component to enhance
2. **src/components/budget/BudgetBalanceCard.test.tsx** - Test file to extend
3. **src/hooks/useBudget.ts** - Hook providing balance data (no changes needed)
4. **src/lib/format.ts** - Currency formatting utility (no changes needed)

### Current BudgetBalanceCard Implementation
Location: [src/components/budget/BudgetBalanceCard.tsx](src/components/budget/BudgetBalanceCard.tsx)

**Current Structure:**
```tsx
export const BudgetBalanceCard = () => {
  const { totalIncome, totalExpense, balance } = useBudget();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-heading text-christmas-red mb-4">
        Budget Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Income - bg-green-50 */}
        {/* Total Expenses - bg-red-50 */}
        {/* Current Balance - bg-christmas-gold/20 */}
      </div>
    </div>
  );
};
```

**What needs to change:**
- The "Current Balance" section (currently line 36-41) needs conditional styling based on balance value
- Add icon import from lucide-react (CheckCircle, AlertTriangle, AlertCircle)
- Add conditional classes/styles for background color
- Add optional status message
- Maintain responsive grid layout (`grid-cols-1 md:grid-cols-3`)

### Available Design Tokens

**Colors** (from [tailwind.config.js](tailwind.config.js)):
- `christmas-green` (positive): #165B33 (DEFAULT), #2D8659 (light), #0E3D22 (dark)
- `yellow-*` (zero/warning): Use Tailwind's built-in yellow palette (e.g., `yellow-100`, `yellow-500`)
- `christmas-red` (negative): #C41E3A (DEFAULT), #E85370 (light), #9A1829 (dark)

**Icons** (lucide-react - already in package.json):
- Positive: `CheckCircle`, `Sparkles` (festive alternative)
- Zero: `AlertTriangle`
- Negative: `AlertCircle`, `XCircle`

**Typography:**
- Font: `font-heading` (Mountains of Christmas) for headings
- Font: `font-body` (Poppins) for body text

### Architectural Patterns from Story 3.1

1. **Pure Functional Components**: No classes, 100% functional approach
2. **Custom Hooks**: useBudget provides all budget data via useMemo
3. **Real-time Updates**: useLiveQuery ensures IndexedDB changes trigger immediate re-renders
4. **TDD Approach**: Write tests first (red), implement (green), refactor
5. **Behavioral Testing**: Test user-facing behavior, not implementation details (use `getByRole`, `getByText`, not CSS class assertions)
6. **Responsive Design**: Mobile-first with Tailwind breakpoints (`grid-cols-1 md:grid-cols-3`)

### Implementation Guidance

**Step 1: Create Logic Helper (TDD)**
Create a pure function to determine balance status:

```typescript
// src/lib/budget-status.ts (NEW FILE)
export type BalanceStatus = 'positive' | 'zero' | 'negative';

export const getBalanceStatus = (balance: number): BalanceStatus => {
  if (balance > 0) return 'positive';
  if (balance < 0) return 'negative';
  return 'zero';
};
```

**Test first** in `src/lib/budget-status.test.ts`:
```typescript
import { getBalanceStatus } from './budget-status';

describe('getBalanceStatus', () => {
  it('should return "positive" when balance > 0', () => {
    expect(getBalanceStatus(100)).toBe('positive');
  });

  it('should return "negative" when balance < 0', () => {
    expect(getBalanceStatus(-50)).toBe('negative');
  });

  it('should return "zero" when balance === 0', () => {
    expect(getBalanceStatus(0)).toBe('zero');
  });
});
```

**Step 2: Create UI Status Configuration**
Define festive visual properties for each status in the components directory:

```typescript
// src/components/budget/budget-status-config.ts (NEW FILE)
import { Sparkles, AlertTriangle, AlertCircle, type LucideIcon } from 'lucide-react';
import type { BalanceStatus } from '../../lib/budget-status';

export type StatusConfig = {
  bgColor: string; // Tailwind class
  textColor: string;
  icon: LucideIcon;
  message: string;
};

export const STATUS_CONFIG: Record<BalanceStatus, StatusConfig> = {
  positive: {
    bgColor: 'bg-christmas-green/20',
    textColor: 'text-christmas-green-dark',
    icon: Sparkles,
    message: 'Ho ho ho! Budget is healthy!',
  },
  zero: {
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    icon: AlertTriangle,
    message: 'Budget is balanced, spend carefully!',
  },
  negative: {
    bgColor: 'bg-christmas-red/20',
    textColor: 'text-christmas-red-dark',
    icon: AlertCircle,
    message: '⚠️ Budget overspent! Review expenses.',
  },
};
```

**Step 3: Update BudgetBalanceCard Component**

Modify the "Current Balance" section:

```tsx
import { useBudget } from '../../hooks/useBudget';
import { formatCurrency } from '../../lib/format';
import { getBalanceStatus } from '../../lib/budget-status';
import { STATUS_CONFIG } from './budget-status-config';

export const BudgetBalanceCard = () => {
  const { totalIncome, totalExpense, balance } = useBudget();
  const status = getBalanceStatus(balance);
  const statusConfig = STATUS_CONFIG[status];
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      {/* ... existing heading ... */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ... Total Income (unchanged) ... */}
        {/* ... Total Expenses (unchanged) ... */}

        {/* Current Balance - ENHANCED */}
        <div className={`text-center p-4 rounded ${statusConfig.bgColor}`}>
          <p className="text-sm text-gray-600 mb-1">Current Balance</p>

          <div className="flex items-center justify-center gap-2 mb-1">
            <StatusIcon className={`w-6 h-6 ${statusConfig.textColor}`} />
            <p className={`text-3xl font-bold ${statusConfig.textColor}`}>
              {formatCurrency(balance)}
            </p>
          </div>

          <p className={`text-xs ${statusConfig.textColor} mt-2`}>
            {statusConfig.message}
          </p>
        </div>
      </div>
    </div>
  );
};
```

**Step 4: Update Tests (BudgetBalanceCard.test.tsx)**

Add test cases for each balance status:

```typescript
describe('Balance Status Indicators', () => {
  it('should display positive status with green styling and sparkles icon when balance > 0', () => {
    vi.mocked(useBudget).mockReturnValue({
      totalIncome: 1000,
      totalExpense: 500,
      balance: 500,
      categoryTotals: {} as any,
    });

    render(<BudgetBalanceCard />);

    // Check message appears
    expect(screen.getByText(/Ho ho ho! Budget is healthy!/i)).toBeInTheDocument();

    // Check balance displays correctly
    expect(screen.getByText('$500.00')).toBeInTheDocument();
  });

  // ... (rest of tests for zero and negative states) ...
});
```

**Step 5: Accessibility Testing**

Ensure WCAG 2.1 AA compliance:
- Test color contrast ratios using browser DevTools or online tools
- `christmas-green-dark` (#0E3D22) on `christmas-green/20` background
- `christmas-red-dark` (#9A1829) on `christmas-red/20` background
- `yellow-700` on `yellow-100` background
- All should meet 4.5:1 ratio for normal text

### Edge Cases to Test

1. **Very small positive balance** (e.g., $0.01) - should show positive status
2. **Very large negative balance** (e.g., -$10,000) - should show negative status
3. **Balance exactly zero** - should show zero status
4. **Real-time transition** - status changes immediately when transactions added/deleted

### Files to Create/Modify

**NEW FILES:**
1. `src/lib/budget-status.ts` - Status helper logic and types
2. `src/lib/budget-status.test.ts` - Tests for status helper
3. `src/components/budget/budget-status-config.ts` - UI status configuration

**MODIFIED FILES:**
1. `src/components/budget/BudgetBalanceCard.tsx` - Add conditional styling
2. `src/components/budget/BudgetBalanceCard.test.tsx` - Add status indicator tests

### Testing Strategy

1. **Unit Tests** for `getBalanceStatus` function (pure logic)
2. **Component Tests** for BudgetBalanceCard with different balance values
3. **Integration Tests** (optional) - create transaction, verify status updates
4. **Manual Accessibility Check** - contrast ratios using browser DevTools

### Definition of Done

- [ ] `getBalanceStatus` helper function created with tests (100% coverage)
- [ ] `STATUS_CONFIG` object created in `src/components/budget/budget-status-config.ts`
- [ ] BudgetBalanceCard component enhanced with conditional styling using `STATUS_CONFIG`
- [ ] Icon displays correctly for each status (Sparkles, AlertTriangle, AlertCircle)
- [ ] Status message displays for each state
- [ ] All component tests pass (existing + new status tests)
- [ ] Balance displays with minus sign when negative
- [ ] Color changes happen immediately when balance crosses thresholds
- [ ] WCAG 2.1 AA contrast verified manually (4.5:1 ratio)
- [ ] All existing tests still pass (no regressions)
- [ ] Build succeeds with no TypeScript errors
- [ ] Responsive layout maintained on mobile and desktop

---

## Technical Notes

### Why This Approach?

1. **Pure Helper Function**: `getBalanceStatus` is a pure function (testable in isolation, no side effects)
2. **Config Object**: `STATUS_CONFIG` centralizes all visual properties (easy to maintain, single source of truth)
3. **Conditional Classes**: Uses Tailwind dynamic classes (better than inline styles, consistent with existing code)
4. **Icon Components**: Lucide React icons are tree-shakable, accessible, and festive
5. **Behavioral Testing**: Tests focus on user-visible behavior (messages, values) not implementation (CSS classes)

### Alternative Approaches Considered

❌ **Inline Styles**: Rejected - inconsistent with existing Tailwind approach
❌ **CSS-in-JS**: Rejected - no CSS-in-JS library in stack
❌ **Separate Components**: Rejected - over-engineering for three states
✅ **Config-Driven Conditional Rendering**: Selected - clean, testable, maintainable

### Performance Considerations

- `getBalanceStatus` is a pure function (no memoization needed, trivial computation)
- `useBudget` already memoizes balance calculation (no additional optimization needed)
- Status config object is defined once at module level (no re-creation on renders)

### Accessibility Notes

- Icons have semantic meaning but text message provides redundancy
- Color is not the only indicator (icons + text messages)
- High contrast ratios ensure visibility for low-vision users
- Screen readers will announce the status message

---

## Review Checklist

Before marking this story as "done", verify:

- [ ] All acceptance criteria met
- [ ] Test coverage ≥ 95% for new code
- [ ] No TypeScript errors or warnings
- [ ] ESLint passes with no violations
- [ ] Contrast ratios verified (WCAG 2.1 AA)
- [ ] Responsive design works on mobile
- [ ] Real-time updates work correctly
- [ ] No performance regressions

---

## References

- **Epic 3**: [_bmad-output/epics/epic-3-budget-visibility.md](_bmad-output/epics/epic-3-budget-visibility.md)
- **Story 3.1**: [_bmad-output/stories/3-1-real-time-budget-balance-calculation-and-display.md](_bmad-output/stories/3-1-real-time-budget-balance-calculation-and-display.md)
- **PRD**: [_bmad-output/prd.md](_bmad-output/prd.md)
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Lucide Icons**: https://lucide.dev/icons/
