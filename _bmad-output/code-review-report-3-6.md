# Code Review Report

**Date:** 2025-12-30
**Reviewer:** Amelia (Dev Agent)
**Story:** 3-6-interactive-chart-features-and-toggle-views.md

## Summary

The adversarial code review for Story 3.6 revealed significant gaps in meeting the established Acceptance Criteria, particularly regarding interactivity and accessibility. Several features were unilaterally marked as "DEFERRED" in the story tasks despite being mandatory requirements in the ACs.

**Status:** `in-progress` (Action items required)

## Findings

### 🔴 CRITICAL (High Severity)

1.  **Unauthorized Deferral of Acceptance Criteria**:
    - **Finding**: The story Tasks/Subtasks section marks the interactivity features (bar chart click-to-filter and pie chart slice highlighting) as `[DEFERRED]`.
    - **Impact**: These are explicit requirements in the Acceptance Criteria (*"Clicking a slice optionally highlights"*, *"Clicking a bar optionally filters"*). Deferring them violates the mandate to implement all ACs.

2.  **Incomplete Accessibility (Keyboard Navigation)**:
    - **Finding**: The AC requires *"Keyboard navigation support (Tab through data points)"*. The current implementation of `SpendingPieChart` and `CategoryBarChart` does not allow users to focus or interact with individual slices or bars via keyboard.
    - **Impact**: This is a direct violation of WCAG 2.1 AA compliance and the story's own ACs.

3.  **Missing Smooth Transitions**:
    - **Finding**: The AC requires *"smooth transition between views (animated if possible)"*.
    - **Impact**: While Recharts has default animations, there is no explicit handling to ensure a smooth, animated transition specifically during the toggle between Income and Expense views.

### 🟡 MEDIUM (Medium Severity)

1.  **Placeholder Mocking in Tests**:
    - **Finding**: `Dashboard.test.tsx` mocks away the toggle components with simple buttons, failing to validate the actual keyboard logic (Arrow keys) implemented in the real components.
    - **Impact**: The integration tests do not prove the components work as intended in a real environment.

2.  **Keyboard Navigation Usability Conflict**:
    - **Finding**: The `onKeyDown` handlers in `ChartViewToggle.tsx` and `CategorySortToggle.tsx` do not call `e.preventDefault()`.
    - **Impact**: Pressing arrow keys to switch toggles will also cause the browser window to scroll, creating a jarring user experience.

3.  **Documentation Discrepancy**:
    - **Finding**: The story File List claims the story file was modified, but it remains untracked in git.
    - **Impact**: Inaccurate record-keeping of the implementation process.

### 🟢 LOW (Low Severity)

1.  **Missing Screen Reader Announcements**:
    - **Finding**: Significant view changes (Income vs Expense) are not announced.
    - **Impact**: An `aria-live` region is needed to inform assistive technology users when the data perspective shifts.

2.  **Magic Strings**:
    - **Finding**: Repeated use of string literals `'income' | 'expense'` across multiple files.
    - **Impact**: Minor maintainability issue; could be centralized in types or constants.

## Action Items

The following action items must be addressed before the story can be marked as `done`:

- [ ] **[AI-Review][High]** Implement slice highlighting in `SpendingPieChart.tsx` on click.
- [ ] **[AI-Review][High]** Implement bar filtering in `CategoryBarChart.tsx` on click (with "Clear Filter" UI in Dashboard).
- [ ] **[AI-Review][High]** Implement keyboard navigation (Tab/Enter/Space) for all chart data points.
- [ ] **[AI-Review][Medium]** Add `e.preventDefault()` to toggle keyboard handlers and support bidirectional navigation.
- [ ] **[AI-Review][Medium]** Update `Dashboard.test.tsx` to use more realistic mocks or shallow rendering that tests keyboard interactions.
- [ ] **[AI-Review][Low]** Add an `aria-live` announcement for chart view changes in `Dashboard.tsx`.

## Recommendations

1.  **Don't Settle for "Optional"**: In a project with strict ACs, "optionally" in a requirement often means "the user has the option to do this", not "the developer has the option to skip this".
2.  **Test the Logic, Not the Mock**: Ensure integration tests actually exercise the logic you wrote (like keyboard handlers) rather than just clicking mocked buttons.
3.  **Prioritize WCAG 2.1 AA**: Accessibility is a P0 requirement in the architecture; it cannot be an afterthought.
