# Story 1.6: Set up Error Boundaries and Testing Framework

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to set up functional error boundaries using react-error-boundary and configure the testing framework,
So that errors are handled gracefully and I can write tests for components and business logic.

## Acceptance Criteria

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

**And** Playwright is configured for E2E testing:
- Playwright installed
- `playwright.config.ts` created
- Example E2E test file created: `tests/navigation.spec.ts`

**And** Test scripts are added to `package.json`:
- `npm run test` → Run unit tests with Vitest
- `npm run test:ui` → Open Vitest UI
- `npm run test:e2e` → Run Playwright E2E tests

**And** I can run `npm run test` and see tests execute

**And** I can intentionally trigger an error and see the error boundary fallback UI

**And** All TypeScript compilation and linting passes with no errors

## Tasks / Subtasks

- [ ] Create Error Fallback Component (AC: 1)
  - [ ] Create `src/components/ui/ErrorFallback.tsx`
  - [ ] Import FallbackProps type from react-error-boundary
  - [ ] Create functional component with props: `{ error, resetErrorBoundary }`
  - [ ] Display error message in festive styled container:
    ```tsx
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-red-50">
      <div className="festive-card max-w-md text-center">
        <h1 className="text-4xl font-heading text-christmas-red mb-4">
          🎅 Oops! Something went wrong
        </h1>
        <p className="text-gray-700 mb-2">Santa's elves are working on it!</p>
        <p className="text-sm text-gray-600 mb-6">{error.message}</p>
        <button onClick={resetErrorBoundary} className="festive-button">
          🎄 Try Again
        </button>
      </div>
    </div>
    ```
  - [ ] Export ErrorFallback component

- [ ] Configure Error Boundary in main.tsx (AC: 1)
  - [ ] Open `src/main.tsx`
  - [ ] Import ErrorBoundary from react-error-boundary
  - [ ] Import ErrorFallback component
  - [ ] Wrap App component with ErrorBoundary:
    ```tsx
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
      onError={(error, errorInfo) => {
        console.error('Error caught by boundary:', error, errorInfo);
      }}
    >
      <App />
    </ErrorBoundary>
    ```
  - [ ] Verify error boundary wraps entire app

- [ ] Create Result Type Pattern (AC: 2)
  - [ ] Create `src/lib/result.ts`
  - [ ] Define Result type using discriminated union:
    ```typescript
    export type Result<T, E = Error> =
      | { ok: true; value: T }
      | { ok: false; error: E };
    ```
  - [ ] Create `ok` helper function:
    ```typescript
    export const ok = <T>(value: T): Result<T, never> => ({
      ok: true,
      value,
    });
    ```
  - [ ] Create `err` helper function:
    ```typescript
    export const err = <E = Error>(error: E): Result<never, E> => ({
      ok: false,
      error,
    });
    ```
  - [ ] Add JSDoc comments explaining usage
  - [ ] Export all functions and types

- [ ] Install Testing Dependencies (AC: 3)
  - [ ] Install Vitest: `npm install -D vitest`
  - [ ] Install jsdom for browser environment: `npm install -D jsdom`
  - [ ] Install React Testing Library:
    ```bash
    npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
    ```
  - [ ] Install Playwright: `npm install -D @playwright/test`
  - [ ] Verify all dependencies appear in `package.json` devDependencies

- [ ] Configure Vitest (AC: 3)
  - [ ] Open `vite.config.ts`
  - [ ] Add Vitest configuration:
    ```typescript
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';

    export default defineConfig({
      plugins: [react()],
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        css: true,
      },
    });
    ```
  - [ ] Create `src/test/` directory
  - [ ] Create `src/test/setup.ts`:
    ```typescript
    import { expect, afterEach } from 'vitest';
    import { cleanup } from '@testing-library/react';
    import * as matchers from '@testing-library/jest-dom/matchers';

    expect.extend(matchers);

    afterEach(() => {
      cleanup();
    });
    ```

- [ ] Create Example Unit Test (AC: 3)
  - [ ] Create `src/lib/result.test.ts`
  - [ ] Import test utilities: `import { describe, it, expect } from 'vitest';`
  - [ ] Import Result helpers: `import { ok, err, Result } from './result';`
  - [ ] Write tests for ok() helper:
    ```typescript
    describe('Result type', () => {
      describe('ok()', () => {
        it('should create a success result', () => {
          const result = ok(42);
          expect(result.ok).toBe(true);
          if (result.ok) {
            expect(result.value).toBe(42);
          }
        });
      });

      describe('err()', () => {
        it('should create an error result', () => {
          const error = new Error('Test error');
          const result = err(error);
          expect(result.ok).toBe(false);
          if (!result.ok) {
            expect(result.error).toBe(error);
          }
        });
      });
    });
    ```

- [ ] Configure Playwright (AC: 4)
  - [ ] Run: `npx playwright install` to install browsers
  - [ ] Create `playwright.config.ts`:
    ```typescript
    import { defineConfig, devices } from '@playwright/test';

    export default defineConfig({
      testDir: './tests',
      fullyParallel: true,
      forbidOnly: !!process.env.CI,
      retries: process.env.CI ? 2 : 0,
      workers: process.env.CI ? 1 : undefined,
      reporter: 'html',
      use: {
        baseURL: 'http://localhost:5173',
        trace: 'on-first-retry',
      },
      projects: [
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
      ],
      webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
      },
    });
    ```
  - [ ] Create `tests/` directory at project root

- [ ] Create Example E2E Test (AC: 4)
  - [ ] Create `tests/navigation.spec.ts`
  - [ ] Import Playwright test utilities: `import { test, expect } from '@playwright/test';`
  - [ ] Write navigation test:
    ```typescript
    test.describe('Navigation', () => {
      test('should navigate between pages', async ({ page }) => {
        await page.goto('/');

        // Verify Dashboard page loads
        await expect(page.locator('h2')).toContainText('Dashboard');

        // Click Transactions link
        await page.click('text=Transactions');
        await expect(page).toHaveURL('/transactions');
        await expect(page.locator('h2')).toContainText('Transactions');

        // Click Categories link
        await page.click('text=Categories');
        await expect(page).toHaveURL('/categories');
        await expect(page.locator('h2')).toContainText('Categories');
      });
    });
    ```

- [ ] Add Test Scripts to package.json (AC: 5)
  - [ ] Open `package.json`
  - [ ] Add test scripts:
    ```json
    {
      "scripts": {
        "test": "vitest",
        "test:ui": "vitest --ui",
        "test:coverage": "vitest --coverage",
        "test:e2e": "playwright test",
        "test:e2e:ui": "playwright test --ui"
      }
    }
    ```

- [ ] Test Error Boundary (AC: 7)
  - [ ] Create a test page with intentional error (temporary):
    - Add a button to Dashboard.tsx that throws an error
    - Example: `<button onClick={() => { throw new Error('Test error'); }}>Trigger Error</button>`
  - [ ] Run: `npm run dev`
  - [ ] Click the error button
  - [ ] Verify ErrorFallback component displays:
    - Festive styling (christmas colors)
    - Error message: "Test error"
    - "Try Again" button
  - [ ] Click "Try Again" button
  - [ ] Verify app reloads and error is cleared
  - [ ] Remove test error button after verification

- [ ] Verify All Tests Pass (AC: 6, 8)
  - [ ] Run: `npm run test`
  - [ ] Verify result.test.ts passes
  - [ ] Run: `npm run test:e2e`
  - [ ] Verify navigation.spec.ts passes
  - [ ] Verify TypeScript compilation: `npm run build`
  - [ ] Check for ESLint errors: `npm run lint` (if lint script exists)

## Dev Notes

### Critical Architectural Constraints (MANDATORY)

🚨 **THESE CONSTRAINTS APPLY TO THE ENTIRE PROJECT - NOT NEGOTIABLE:**

1. **100% Functional Approach - NO CLASSES**
   - ✅ ONLY functional components for ErrorFallback
   - ✅ Use `react-error-boundary` library (NOT class-based error boundary)
   - ✅ Functional Result type pattern (NOT class-based Result)
   - ❌ NO class-based React.Component with componentDidCatch
   - ❌ NO class-based error handlers

2. **Error Handling - react-error-boundary Required**
   - ✅ MANDATORY: Use react-error-boundary library
   - User requirement from architecture constraints
   - Functional approach only

3. **Structure - Keep it Flat and Simple**
   - Error handling utilities in `src/lib/`
   - UI components in `src/components/ui/`
   - Test files co-located with source files (e.g., result.test.ts next to result.ts)
   - E2E tests in `tests/` directory at project root

[Source: _bmad-output/solutioning/architecture.md#CRITICAL ARCHITECTURAL CONSTRAINTS]

### Error Boundary Pattern (Functional)

**Why react-error-boundary?**

React's built-in error boundary requires a class component:

```tsx
// ❌ NOT ALLOWED - Class-based error boundary violates functional constraint
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }
}
```

The `react-error-boundary` library provides a functional alternative:

```tsx
// ✅ ALLOWED - Functional error boundary using library
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary FallbackComponent={ErrorFallback}>
  <App />
</ErrorBoundary>
```

**ErrorBoundary Props**:

- `FallbackComponent`: Component to render when error occurs
- `onReset`: Function to call when user clicks "Try Again" (we use `window.location.reload()`)
- `onError`: Optional error logging callback

**FallbackComponent Props**:

```typescript
interface FallbackProps {
  error: Error;              // The error that was thrown
  resetErrorBoundary: () => void; // Function to reset error state
}
```

[Source: react-error-boundary Documentation: https://github.com/bvaughn/react-error-boundary]

### Result Type Pattern (Functional Approach)

**What is the Result Type?**

The Result type is a functional pattern for explicit error handling without exceptions:

```typescript
// Instead of throwing exceptions:
function divide(a: number, b: number): number {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
}

// Use Result type for explicit error handling:
function divide(a: number, b: number): Result<number, Error> {
  if (b === 0) return err(new Error('Division by zero'));
  return ok(a / b);
}
```

**Why Result Type?**

1. **Type-safe error handling**: TypeScript forces you to handle both success and error cases
2. **No exceptions**: Errors are values, not control flow disruptions
3. **Composable**: Easy to chain operations with map/flatMap (future enhancement)
4. **Functional**: Aligns with functional programming principles

**Usage Pattern**:

```typescript
// Creating results
const successResult = ok(42);         // { ok: true, value: 42 }
const errorResult = err(new Error('Failed')); // { ok: false, error: Error }

// Handling results
const result = divide(10, 2);

if (result.ok) {
  console.log('Success:', result.value); // TypeScript knows result.value exists
} else {
  console.error('Error:', result.error.message); // TypeScript knows result.error exists
}
```

**When to Use Result vs Exceptions?**

- ✅ Use Result for: Expected errors (validation, not found, etc.)
- ✅ Use exceptions for: Unexpected errors (network failure, etc.)
- ✅ Use ErrorBoundary for: Unhandled exceptions (last resort)

[Source: Functional Error Handling Pattern from Rust, Haskell, and functional languages]

### Testing Strategy

**Three-Layer Testing Pyramid**:

1. **Unit Tests** (Vitest + React Testing Library)
   - Test individual functions and components in isolation
   - Fast, numerous, focused
   - Examples: Result helpers, validation functions, utility functions
   - Located: `src/**/*.test.ts` or `src/**/*.test.tsx`

2. **Integration Tests** (Vitest + React Testing Library)
   - Test component interactions and hooks
   - Examples: Form submission with validation, transaction creation flow
   - Located: `src/**/*.test.tsx`

3. **E2E Tests** (Playwright)
   - Test complete user workflows
   - Examples: Navigation, transaction CRUD, filtering
   - Located: `tests/**/*.spec.ts`

**Testing Philosophy**:

- ✅ Test behavior, not implementation
- ✅ Focus on user-facing functionality
- ✅ Keep tests simple and readable
- ❌ Don't test library internals (React Router, Dexie.js)
- ❌ Don't over-mock (use real components when possible)

[Source: _bmad-output/solutioning/architecture.md#Testing Strategy]

### Vitest Configuration

**Why Vitest over Jest?**

1. ✅ Native Vite integration (faster, no config overhead)
2. ✅ Modern API (same as Jest, but with improvements)
3. ✅ TypeScript support out of the box
4. ✅ Fast watch mode with HMR
5. ✅ Built-in coverage reporting

**Vitest Config Explanation**:

```typescript
export default defineConfig({
  test: {
    globals: true,           // Use global test functions (describe, it, expect)
    environment: 'jsdom',    // Simulate browser environment for React components
    setupFiles: './src/test/setup.ts', // Run setup before tests
    css: true,               // Process CSS imports (needed for Tailwind)
  },
});
```

**Setup File Explanation**:

```typescript
// src/test/setup.ts
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);  // Add jest-dom matchers (toBeInTheDocument, etc.)

afterEach(() => {
  cleanup();  // Clean up DOM after each test (prevent memory leaks)
});
```

[Source: Vitest Documentation: https://vitest.dev/]

### React Testing Library Best Practices

**Query Priority** (in order of preference):

1. **getByRole**: Most accessible (e.g., `getByRole('button', { name: 'Submit' })`)
2. **getByLabelText**: For form fields (e.g., `getByLabelText('Amount')`)
3. **getByPlaceholderText**: For inputs without labels
4. **getByText**: For non-interactive elements (e.g., `getByText('Dashboard')`)
5. **getByTestId**: Last resort (e.g., `getByTestId('transaction-card')`)

**Example Test Pattern**:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ErrorFallback from './ErrorFallback';

describe('ErrorFallback', () => {
  it('should display error message', () => {
    const error = new Error('Test error');
    const resetErrorBoundary = vi.fn();

    render(<ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />);

    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });
});
```

[Source: React Testing Library Documentation: https://testing-library.com/docs/react-testing-library/intro/]

### Playwright Configuration

**Why Playwright?**

1. ✅ Multi-browser support (Chromium, Firefox, WebKit)
2. ✅ Auto-wait (no manual waits for element visibility)
3. ✅ Network interception (mock API calls)
4. ✅ Video/screenshot on failure
5. ✅ Parallel test execution

**Config Highlights**:

```typescript
export default defineConfig({
  testDir: './tests',       // E2E tests in tests/ directory (not src/)
  fullyParallel: true,      // Run tests in parallel (faster)
  use: {
    baseURL: 'http://localhost:5173', // Vite dev server URL
    trace: 'on-first-retry', // Capture trace on first retry (debugging)
  },
  webServer: {
    command: 'npm run dev',  // Start dev server before tests
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI, // Reuse server in local dev
  },
});
```

**Test File Structure**:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Group', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');

    // Interact with page
    await page.click('text=Button');

    // Assert
    await expect(page.locator('h1')).toContainText('Expected Text');
  });
});
```

[Source: Playwright Documentation: https://playwright.dev/]

### Error Fallback Component Design

**ErrorFallback UI/UX Considerations**:

1. **User-Friendly Message**: Avoid technical jargon ("Something went wrong" vs "Uncaught TypeError")
2. **Festive Styling**: Match app theme (christmas colors, festive font)
3. **Recovery Action**: "Try Again" button to reset error boundary
4. **Error Details**: Show `error.message` for debugging (users can screenshot)

**Example ErrorFallback Component**:

```tsx
// src/components/ui/ErrorFallback.tsx
import { FallbackProps } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-red-50">
      <div className="festive-card max-w-md text-center">
        <h1 className="text-4xl font-heading text-christmas-red mb-4">
          🎅 Oops! Something went wrong
        </h1>
        <p className="text-gray-700 mb-2">Santa's elves are working on it!</p>
        <p className="text-sm text-gray-600 mb-6 font-mono bg-gray-100 p-2 rounded">
          {error.message}
        </p>
        <button onClick={resetErrorBoundary} className="festive-button">
          🎄 Try Again
        </button>
      </div>
    </div>
  );
}

export default ErrorFallback;
```

**Design Decisions**:

- **Centered Layout**: `min-h-screen flex items-center justify-center`
- **Festive Card**: Uses `.festive-card` class from Story 1.5
- **Christmas Emoji**: 🎅 and 🎄 add festive touch
- **Monospace Error**: `font-mono` for technical error message
- **Festive Button**: Uses `.festive-button` class

[Source: _bmad-output/solutioning/ux-design.md#Error States]

### Testing Error Boundary

**How to Test Error Boundary**:

Option 1: **Manual Testing** (During Development)
```tsx
// Temporarily add to Dashboard.tsx
<button onClick={() => { throw new Error('Test error'); }}>
  Trigger Error
</button>
```

Option 2: **Automated Testing** (Vitest)
```tsx
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './ErrorFallback';

const ThrowError = () => {
  throw new Error('Test error');
};

test('should catch and display error', () => {
  render(
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThrowError />
    </ErrorBoundary>
  );

  expect(screen.getByText('Test error')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
});
```

**What to Verify**:

- ✅ Error message displays correctly
- ✅ "Try Again" button appears
- ✅ Festive styling is applied
- ✅ Clicking "Try Again" resets error boundary

[Source: react-error-boundary Testing Documentation]

### Test File Organization

**Directory Structure**:

```
santa-claus-smart-budget-app/
├── src/
│   ├── lib/
│   │   ├── result.ts              # Source file
│   │   └── result.test.ts         # Unit test (co-located)
│   ├── components/
│   │   └── ui/
│   │       ├── ErrorFallback.tsx
│   │       └── ErrorFallback.test.tsx # Component test (co-located)
│   └── test/
│       └── setup.ts               # Test setup/config
├── tests/                          # E2E tests (project root)
│   └── navigation.spec.ts
└── playwright.config.ts            # Playwright config (project root)
```

**File Naming Conventions**:

- Unit/Integration Tests: `*.test.ts` or `*.test.tsx`
- E2E Tests: `*.spec.ts` (Playwright convention)
- Test Setup: `setup.ts`
- Config Files: `*.config.ts`

**Co-location Benefits**:

- ✅ Tests are easy to find (next to source file)
- ✅ Refactoring is easier (move file + test together)
- ✅ Reduces deep nesting
- ✅ Clear ownership (which test tests which file)

[Source: _bmad-output/solutioning/architecture.md#Project Structure]

### Previous Story Learnings (Stories 1.1-1.5)

**From Story 1.2**:
- ✅ react-error-boundary library installed
- ✅ Development dependencies can be installed with `npm install -D`

**From Story 1.4**:
- ✅ Functional components only (no classes)
- ✅ `src/components/ui/` directory created for generic UI components

**From Story 1.5**:
- ✅ Festive component classes available (`.festive-card`, `.festive-button`)
- ✅ Christmas colors configured in Tailwind

**Patterns to Follow**:
- Create test files alongside source files
- Use functional components and hooks only
- Test user behavior, not implementation details
- Add JSDoc comments to public APIs (Result helpers)
- Verify all tests pass before marking story complete

### Package.json Test Scripts

**Recommended Test Scripts**:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

**Script Usage**:

- `npm run test` - Run unit tests in watch mode
- `npm run test:ui` - Open Vitest UI (interactive test runner)
- `npm run test:coverage` - Generate code coverage report
- `npm run test:e2e` - Run E2E tests headless
- `npm run test:e2e:ui` - Open Playwright UI (interactive E2E runner)
- `npm run test:e2e:debug` - Debug E2E tests step-by-step

[Source: Vitest and Playwright Documentation]

### Project Structure Notes

**Current State (After Story 1.5):**
```
santa-claus-smart-budget-app/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   └── ui/
│   ├── lib/
│   │   └── db.ts
│   ├── pages/
│   ├── types/
│   ├── main.tsx
│   └── index.css
├── package.json
└── vite.config.ts
```

**After Story 1.6:**
```
santa-claus-smart-budget-app/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   └── ui/
│   │       ├── ErrorFallback.tsx         ← NEW
│   │       └── ErrorFallback.test.tsx    ← NEW (optional)
│   ├── lib/
│   │   ├── db.ts
│   │   ├── result.ts                     ← NEW
│   │   └── result.test.ts                ← NEW
│   ├── pages/
│   ├── test/                              ← NEW
│   │   └── setup.ts                      ← NEW
│   ├── types/
│   ├── main.tsx                          ← MODIFIED (ErrorBoundary added)
│   └── index.css
├── tests/                                 ← NEW
│   └── navigation.spec.ts                ← NEW
├── package.json                          ← MODIFIED (test scripts + deps)
├── playwright.config.ts                  ← NEW
└── vite.config.ts                        ← MODIFIED (Vitest config)
```

**Alignment with Unified Project Structure:**
- ✅ Test files co-located with source files
- ✅ E2E tests in `tests/` directory at root
- ✅ Config files at root level
- ✅ Flat structure maintained (max 3 levels deep)

### References

- [Source: _bmad-output/epics.md#Epic 1: Story 1.6]
- [Source: _bmad-output/solutioning/architecture.md#Error Handling (Functional Approach)]
- [Source: _bmad-output/solutioning/architecture.md#Testing Strategy]
- [Source: _bmad-output/solutioning/architecture.md#CRITICAL ARCHITECTURAL CONSTRAINTS]
- [Source: _bmad-output/planning/prd.md#NFR-003: Reliability - Graceful error handling]
- [Source: react-error-boundary: https://github.com/bvaughn/react-error-boundary]
- [Source: Vitest: https://vitest.dev/]
- [Source: Playwright: https://playwright.dev/]
- [Source: React Testing Library: https://testing-library.com/docs/react-testing-library/intro/]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

*To be added during implementation*

### Completion Notes List

*To be added during implementation*

### File List

**New Directories:**
- src/test/
- tests/

**New Files:**
- src/components/ui/ErrorFallback.tsx
- src/lib/result.ts
- src/lib/result.test.ts
- src/test/setup.ts
- tests/navigation.spec.ts
- playwright.config.ts

**Modified Files:**
- src/main.tsx (ErrorBoundary wrapper added)
- vite.config.ts (Vitest configuration added)
- package.json (test scripts and testing dependencies added)

**Optional Files (for comprehensive testing):**
- src/components/ui/ErrorFallback.test.tsx
