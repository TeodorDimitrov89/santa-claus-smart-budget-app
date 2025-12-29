# Story 2.5: Implement Predefined Categories System

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Santa or a Workshop Manager,
I want all transactions to be categorized using 6 predefined, immutable categories,
So that spending is consistently organized across North Pole operations.

## Acceptance Criteria

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

## Tasks / Subtasks

- [x] Define Category Constants (AC: 6 predefined categories with metadata)
  - [x] Verify `src/lib/constants.ts` exists (created in Story 2.1)
  - [x] Ensure `CATEGORIES` array is defined with exactly 6 categories:
    ```typescript
    import { Gift, UtensilsCrossed, Sparkles, Plane, Heart, Wrench } from 'lucide-react';

    export const CATEGORIES = [
      {
        name: 'Gifts',
        description: 'Budget allocated for children\'s presents',
        icon: <Gift className="w-4 h-4" />,
        color: '#C41E3A', // Christmas red
      },
      {
        name: 'Food & Dinner',
        description: 'Meals for elves, reindeer feed, holiday feasts',
        icon: <UtensilsCrossed className="w-4 h-4" />,
        color: '#165B33', // Christmas green
      },
      {
        name: 'Decorations',
        description: 'North Pole decorations, workshop festive setup',
        icon: <Sparkles className="w-4 h-4" />,
        color: '#FFD700', // Gold
      },
      {
        name: 'Travel',
        description: 'Sleigh maintenance, reindeer transportation costs',
        icon: <Plane className="w-4 h-4" />,
        color: '#4169E1', // Royal blue
      },
      {
        name: 'Charity',
        description: 'Community giving, support for those in need',
        icon: <Heart className="w-4 h-4" />,
        color: '#FF69B4', // Hot pink
      },
      {
        name: 'Santa\'s Workshop',
        description: 'Workshop operations, tools, elf salaries, maintenance',
        icon: <Wrench className="w-4 h-4" />,
        color: '#8B4513', // Saddle brown
      },
    ] as const;
    ```
  - [x] Export `MAX_DESCRIPTION_LENGTH = 500` (if not already present)

- [x] Define Category Type and Enum (AC: TypeScript types match categories)
  - [x] Verify `src/types/index.ts` contains `Category` type
  - [x] Define Category as union type derived from constants:
    ```typescript
    import { CATEGORIES } from '@/lib/constants';

    export type Category =
      | 'Gifts'
      | 'Food & Dinner'
      | 'Decorations'
      | 'Travel'
      | 'Charity'
      | 'Santa\'s Workshop';

    // Helper to get category names from constants
    export const categoryNames = CATEGORIES.map(c => c.name) as Category[];
    ```
  - [x] Ensure `Transaction` type uses `Category`:
    ```typescript
    export type Transaction = {
      id: string;
      amount: number;
      type: 'Income' | 'Expense';
      category: Category;
      date: Date;
      description: string;
      createdAt: Date;
      updatedAt: Date;
    };
    ```

- [x] Update Category Validation Schema (AC: Zod validates against 6 categories)
  - [x] Verify `src/lib/validation.ts` contains category validation
  - [x] Ensure Zod schema validates category as enum:
    ```typescript
    import { z } from 'zod';
    import { CATEGORIES } from './constants';

    const categoryNames = CATEGORIES.map(c => c.name);

    export const transactionSchema = z.object({
      amount: z.number().positive('Amount must be greater than 0'),
      type: z.enum(['Income', 'Expense']),
      category: z.enum(categoryNames as [string, ...string[]], {
        errorMap: () => ({ message: 'Please select a valid category' }),
      }),
      date: z.date().refine(
        (date) => date <= new Date(Date.now() + 24 * 60 * 60 * 1000 - 1),
        { message: 'Date cannot be in the future' }
      ),
      description: z.string().max(500, 'Description must be 500 characters or less').optional(),
    });
    ```

- [x] Verify Category Dropdown in TransactionForm (AC: Mandatory selection, 6 categories)
  - [x] Review `src/components/forms/TransactionForm.tsx` (created in Story 2.1)
  - [x] Ensure category dropdown renders all 6 categories from `CATEGORIES` constant
  - [x] Verify dropdown is required (validation enforces selection)
  - [x] Each option should display category name
  - [x] Optional: Add icons to dropdown options (may require custom select component)

- [x] Add Category Tooltips (AC: Description tooltips)
  - [x] Add tooltip component or use native `title` attribute
  - [x] Display category description on hover in dropdown
  - [x] Display category description in transaction list badges (optional enhancement)
  - [x] Example:
    ```typescript
    <option value={cat.name} title={cat.description}>
      {cat.name}
    </option>
    ```

- [x] Implement Category Badges in Transaction List (AC: Icon + Color)
  - [x] Review `src/components/lists/TransactionItem.tsx` (created in Story 2.2)
  - [x] Render category badge with icon and color:
    ```typescript
    const getCategoryData = (categoryName: Category) => {
      return CATEGORIES.find(c => c.name === categoryName);
    };

    // In component:
    const categoryData = getCategoryData(transaction.category);

    <div
      className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
      style={{ backgroundColor: `${categoryData?.color}20`, color: categoryData?.color }}
    >
      {categoryData?.icon}
      <span className="font-medium">{transaction.category}</span>
    </div>
    ```
  - [x] Use category color for background (20% opacity) and text
  - [x] Display category icon from constants

- [x] Verify Category Filter in Filters Component (AC: Consistent data)
  - [x] Review `src/components/filters/TransactionFilters.tsx` (created in Story 2.2)
  - [x] Ensure category filter uses `CATEGORIES` constant (not hardcoded)
  - [x] Display category checkboxes with icons and colors
  - [x] Example:
    ```typescript
    {CATEGORIES.map(cat => (
      <label key={cat.name} className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={selectedCategories.includes(cat.name)}
          onChange={() => toggleCategory(cat.name)}
        />
        <div className="flex items-center gap-1">
          {cat.icon}
          <span>{cat.name}</span>
        </div>
      </label>
    ))}
    ```

- [x] Verify No Category CRUD Operations (AC: Immutable categories)
  - [x] Confirm there are NO UI elements to add, edit, or delete categories
  - [x] Confirm `CATEGORIES` constant is exported as `as const` (immutable)
  - [x] Confirm no database table for categories (categories are code-level constants)
  - [x] Document in architecture: Categories are hardcoded, not user-configurable

- [x] Add Category Helper Functions (AC: Consistent access)
  - [x] Create `src/lib/category-helpers.ts` with utility functions:
    ```typescript
    import { CATEGORIES } from './constants';
    import type { Category } from '@/types';

    export const getCategoryByName = (name: Category) => {
      return CATEGORIES.find(c => c.name === name);
    };

    export const getCategoryColor = (name: Category): string => {
      return getCategoryByName(name)?.color || '#000000';
    };

    export const getCategoryIcon = (name: Category) => {
      return getCategoryByName(name)?.icon || null;
    };

    export const getCategoryDescription = (name: Category): string => {
      return getCategoryByName(name)?.description || '';
    };

    export const getAllCategoryNames = (): Category[] => {
      return CATEGORIES.map(c => c.name) as Category[];
    };
    ```
  - [x] Use these helpers throughout the app for consistency

- [x] Add Unit Tests for Category Helpers (AC: Test utility functions)
  - [x] Create `src/lib/category-helpers.test.ts`
  - [x] Test: `getCategoryByName` returns correct category
  - [x] Test: `getCategoryByName` with invalid name returns undefined
  - [x] Test: `getCategoryColor` returns correct color hex
  - [x] Test: `getCategoryIcon` returns React element
  - [x] Test: `getAllCategoryNames` returns array of 6 names
  - [x] Test: `CATEGORIES` array has exactly 6 items

- [x] Add Component Tests for Category Display (AC: Test rendering)
  - [x] Extend `src/components/forms/TransactionForm.test.tsx`
  - [x] Test: Category dropdown displays all 6 categories
  - [x] Test: Category dropdown shows category names
  - [x] Test: Category selection is required (validation error if not selected)
  - [x] Extend `src/components/lists/TransactionItem.test.tsx`
  - [x] Test: Category badge renders with correct icon
  - [x] Test: Category badge uses correct color
  - [x] Test: Hovering over category shows tooltip (if implemented)

- [x] Manual Testing Checklist
  - [x] Open transaction form → Verify category dropdown has exactly 6 options
  - [x] Hover over each category → Verify tooltip shows description
  - [x] Try submitting form without selecting category → Verify validation error
  - [x] Create transaction with each category → Verify all save correctly
  - [x] View transaction list → Verify category badges display with correct icons and colors
  - [x] Apply category filter → Verify filtering works for all 6 categories
  - [x] Verify no UI exists to add/edit/delete categories
  - [x] Check `CATEGORIES` constant in code → Verify it's `as const` (immutable)
  - [x] Verify all components import categories from `constants.ts` (no hardcoding)

## Files Created

- `src/lib/category-helpers.ts` - Utility functions for category operations
- `src/lib/category-helpers.test.ts` - Unit tests for category helpers

## Files Modified

- `src/lib/constants.ts` - Verify/update `CATEGORIES` array with full metadata (icon, color, description)
- `src/types/index.ts` - Verify/update `Category` type as union of 6 category names
- `src/lib/validation.ts` - Verify/update category validation with Zod enum
- `src/components/forms/TransactionForm.tsx` - Verify category dropdown uses `CATEGORIES` constant
- `src/components/lists/TransactionItem.tsx` - Verify category badge displays icon and color
- `src/components/filters/TransactionFilters.tsx` - Verify category filter uses `CATEGORIES` constant

## Dev Notes

### 1. Category Constants with Full Metadata

```typescript
// src/lib/constants.ts
import { Gift, UtensilsCrossed, Sparkles, Plane, Heart, Wrench } from 'lucide-react';
import type { ReactElement } from 'react';

export type CategoryData = {
  name: string;
  description: string;
  icon: ReactElement;
  color: string;
};

export const CATEGORIES: readonly CategoryData[] = [
  {
    name: 'Gifts',
    description: 'Budget allocated for children\'s presents',
    icon: <Gift className="w-4 h-4" />,
    color: '#C41E3A', // Christmas red
  },
  {
    name: 'Food & Dinner',
    description: 'Meals for elves, reindeer feed, holiday feasts',
    icon: <UtensilsCrossed className="w-4 h-4" />,
    color: '#165B33', // Christmas green
  },
  {
    name: 'Decorations',
    description: 'North Pole decorations, workshop festive setup',
    icon: <Sparkles className="w-4 h-4" />,
    color: '#FFD700', // Gold
  },
  {
    name: 'Travel',
    description: 'Sleigh maintenance, reindeer transportation costs',
    icon: <Plane className="w-4 h-4" />,
    color: '#4169E1', // Royal blue
  },
  {
    name: 'Charity',
    description: 'Community giving, support for those in need',
    icon: <Heart className="w-4 h-4" />,
    color: '#FF69B4', // Hot pink
  },
  {
    name: 'Santa\'s Workshop',
    description: 'Workshop operations, tools, elf salaries, maintenance',
    icon: <Wrench className="w-4 h-4" />,
    color: '#8B4513', // Saddle brown
  },
] as const;

export const MAX_DESCRIPTION_LENGTH = 500;
```

**Key Points:**
- `as const` makes array immutable (prevents runtime modification)
- `readonly` in type ensures TypeScript enforces immutability
- Icons are React elements (Lucide React components)
- Colors use hex codes for consistency

### 2. Category Type Derivation

```typescript
// src/types/index.ts
import { CATEGORIES } from '@/lib/constants';

// Derive Category type from constants (single source of truth)
export type Category = typeof CATEGORIES[number]['name'];

// Alternative explicit union type:
// export type Category = 'Gifts' | 'Food & Dinner' | 'Decorations' | 'Travel' | 'Charity' | 'Santa\'s Workshop';

export type Transaction = {
  id: string;
  amount: number;
  type: 'Income' | 'Expense';
  category: Category;
  date: Date;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};
```

**Benefits of Derivation:**
- Single source of truth (constants drive types)
- Adding a category to `CATEGORIES` automatically updates type
- No manual sync needed between constants and types

### 3. Zod Schema with Dynamic Category Validation

```typescript
// src/lib/validation.ts
import { z } from 'zod';
import { CATEGORIES } from './constants';

const categoryNames = CATEGORIES.map(c => c.name);

export const transactionSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  type: z.enum(['Income', 'Expense']),
  category: z.enum(categoryNames as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
  date: z.date().refine(
    (date) => {
      const maxDate = new Date();
      maxDate.setHours(23, 59, 59, 999);
      return date <= maxDate;
    },
    { message: 'Date cannot be in the future' }
  ),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
```

**Notes:**
- Category enum dynamically generated from `CATEGORIES` constant
- `as [string, ...string[]]` satisfies Zod's enum type requirement (non-empty tuple)
- Custom error message: "Please select a valid category"

### 4. Category Dropdown with Tooltips

```typescript
// src/components/forms/TransactionForm.tsx (excerpt)
import { CATEGORIES } from '@/lib/constants';

<div>
  <label htmlFor="category">Category *</label>
  <select
    id="category"
    {...register('category')}
    className="w-full px-3 py-2 border rounded-md"
  >
    <option value="">Select a category</option>
    {CATEGORIES.map(cat => (
      <option key={cat.name} value={cat.name} title={cat.description}>
        {cat.name}
      </option>
    ))}
  </select>
  {errors.category && (
    <p className="text-red-600 text-sm">{errors.category.message}</p>
  )}
</div>
```

**Notes:**
- `title` attribute provides native browser tooltip on hover
- First option is placeholder ("Select a category") with empty value
- Validation ensures category is selected before submission

### 5. Category Badge with Icon and Color

```typescript
// src/components/lists/TransactionItem.tsx (excerpt)
import { CATEGORIES } from '@/lib/constants';
import type { Transaction } from '@/types';

const CategoryBadge = ({ category }: { category: string }) => {
  const categoryData = CATEGORIES.find(c => c.name === category);

  if (!categoryData) return <span>{category}</span>;

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
      style={{
        backgroundColor: `${categoryData.color}20`, // 20% opacity
        color: categoryData.color,
      }}
      title={categoryData.description}
    >
      {categoryData.icon}
      <span>{categoryData.name}</span>
    </div>
  );
};

// In TransactionItem:
<CategoryBadge category={transaction.category} />
```

**Styling Details:**
- Background: Category color at 20% opacity (e.g., `#C41E3A20`)
- Text and icon: Full category color
- Rounded pill shape with padding
- Tooltip shows category description on hover

### 6. Category Filter with Icons

```typescript
// src/components/filters/TransactionFilters.tsx (excerpt)
import { CATEGORIES } from '@/lib/constants';

<div>
  <label>Categories</label>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
    {CATEGORIES.map(cat => (
      <label
        key={cat.name}
        className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-gray-50"
      >
        <input
          type="checkbox"
          checked={selectedCategories.includes(cat.name)}
          onChange={() => toggleCategory(cat.name)}
          className="rounded"
        />
        <div className="flex items-center gap-1">
          <span style={{ color: cat.color }}>{cat.icon}</span>
          <span className="text-sm">{cat.name}</span>
        </div>
      </label>
    ))}
  </div>
</div>
```

**Features:**
- Checkbox grid (2 columns on mobile, 3 on desktop)
- Icons colored with category color
- Hover effect for better UX
- Accessible labels

### 7. Category Helper Functions

```typescript
// src/lib/category-helpers.ts
import { CATEGORIES } from './constants';
import type { Category } from '@/types';

export const getCategoryByName = (name: Category) => {
  return CATEGORIES.find(c => c.name === name);
};

export const getCategoryColor = (name: Category): string => {
  const category = getCategoryByName(name);
  return category?.color || '#000000'; // Fallback to black
};

export const getCategoryIcon = (name: Category) => {
  const category = getCategoryByName(name);
  return category?.icon || null;
};

export const getCategoryDescription = (name: Category): string => {
  const category = getCategoryByName(name);
  return category?.description || '';
};

export const getAllCategoryNames = (): Category[] => {
  return CATEGORIES.map(c => c.name) as Category[];
};

export const isCategoryValid = (name: string): name is Category => {
  return CATEGORIES.some(c => c.name === name);
};
```

**Usage Example:**
```typescript
import { getCategoryColor, getCategoryIcon } from '@/lib/category-helpers';

const color = getCategoryColor('Gifts'); // '#C41E3A'
const icon = getCategoryIcon('Travel'); // <Plane /> element
```

### 8. Immutability Enforcement

**TypeScript Level:**
```typescript
export const CATEGORIES: readonly CategoryData[] = [...] as const;
```
- `readonly` in type prevents array mutations
- `as const` makes all properties immutable

**Runtime Checks (if paranoid):**
```typescript
// src/lib/constants.ts
export const CATEGORIES = Object.freeze([...]);
```

**Note:** TypeScript `as const` is sufficient for this project. `Object.freeze` adds runtime immutability but is overkill for controlled codebase.

### 9. No Category CRUD

**Explicitly document that categories are NOT stored in IndexedDB:**

```typescript
// src/lib/db.ts
export const db = new Dexie('SantaBudgetDB');

db.version(1).stores({
  transactions: '++id, type, category, date, createdAt',
  // NO categories table - categories are code-level constants
});
```

**Categories are:**
- ✅ Defined in code (`constants.ts`)
- ✅ Immutable (cannot be changed by users)
- ✅ Versioned with code (not user data)

**Categories are NOT:**
- ❌ Stored in database
- ❌ User-configurable
- ❌ Editable via UI

### 10. Testing Category Validation

```typescript
// src/lib/validation.test.ts
import { describe, it, expect } from 'vitest';
import { transactionSchema } from './validation';

describe('transactionSchema - category validation', () => {
  it('should accept valid category', () => {
    const result = transactionSchema.safeParse({
      amount: 100,
      type: 'Expense',
      category: 'Gifts',
      date: new Date(),
      description: 'Test',
    });

    expect(result.success).toBe(true);
  });

  it('should reject invalid category', () => {
    const result = transactionSchema.safeParse({
      amount: 100,
      type: 'Expense',
      category: 'Invalid Category',
      date: new Date(),
      description: 'Test',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('valid category');
    }
  });

  it('should accept all 6 predefined categories', () => {
    const categories = ['Gifts', 'Food & Dinner', 'Decorations', 'Travel', 'Charity', 'Santa\'s Workshop'];

    categories.forEach(category => {
      const result = transactionSchema.safeParse({
        amount: 100,
        type: 'Expense',
        category,
        date: new Date(),
      });

      expect(result.success).toBe(true);
    });
  });
});
```

### 11. Christmas Theme Color Palette

**Category Colors:**
- **Gifts**: `#C41E3A` (Christmas Red)
- **Food & Dinner**: `#165B33` (Christmas Green)
- **Decorations**: `#FFD700` (Gold)
- **Travel**: `#4169E1` (Royal Blue)
- **Charity**: `#FF69B4` (Hot Pink)
- **Santa's Workshop**: `#8B4513` (Saddle Brown)

**Usage in Charts:**
These colors will be used in Story 3.2 (Category Charts) for pie/bar chart segments.

### 12. Icon Selection Rationale

| Category | Icon | Rationale |
|----------|------|-----------|
| Gifts | `<Gift />` | Obvious choice for presents |
| Food & Dinner | `<UtensilsCrossed />` | Represents meals and dining |
| Decorations | `<Sparkles />` | Festive, sparkly decorations |
| Travel | `<Plane />` | Sleigh travel, transportation |
| Charity | `<Heart />` | Giving, love, community support |
| Santa's Workshop | `<Wrench />` | Tools, maintenance, operations |

All icons from `lucide-react` for consistency.

### 13. Accessibility for Category Badges

```typescript
<div
  role="img"
  aria-label={`Category: ${categoryData.name} - ${categoryData.description}`}
  style={{ backgroundColor: `${categoryData.color}20`, color: categoryData.color }}
  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
>
  <span aria-hidden="true">{categoryData.icon}</span>
  <span>{categoryData.name}</span>
</div>
```

**Notes:**
- `role="img"` for screen readers (badge is decorative + informative)
- `aria-label` provides full context (name + description)
- Icon marked `aria-hidden` (redundant with text)

### 14. Integration with Previous Stories

**Story 2.1 (Create Transaction Form):**
- Already uses `CATEGORIES` constant (verify in this story)
- Category dropdown pre-populated
- Validation already enforces category selection

**Story 2.2 (Display Transaction List):**
- TransactionItem likely already displays category (verify icon/color added)
- TransactionFilters already uses categories (verify consistency)

**Story 2.3/2.4 (Edit/Delete):**
- No changes needed (category is just another field)

**This story is mostly verification** that all previous stories use `CATEGORIES` consistently, with some enhancements (icons, colors, tooltips).

### 15. Architectural Compliance

✅ **100% Functional Approach:**
- Categories are immutable constants (no class-based management)
- Helper functions are pure functions
- No category service classes

✅ **Flat Structure:**
- Category helpers in `lib/` directory (flat)
- Constants co-located with types and validation

✅ **Error Handling:**
- Validation schema enforces category constraints
- Helper functions provide safe fallbacks (e.g., `|| '#000000'`)

---

**Estimated Complexity:** Low (mostly verification + enhancements)

**Dependencies:**
- Story 2.1 (Create Transaction Form) - Must be complete
- Story 2.2 (Display Transaction List) - Should be complete for consistency checks

**Ready for Development:** ✅ Yes (depends on Story 2.1, recommended after Story 2.2)

**Note:** This story is primarily about **system-level verification** that the category system is implemented correctly across all components, with enhancements for icons, colors, and tooltips.

## Dev Agent Record

### Implementation Plan

1. Updated CATEGORIES constant with hex color codes (#C41E3A, #165B33, #FFD700, #4169E1, #FF69B4, #8B4513)
2. Changed icon from Hammer to Wrench for Santa's Workshop category
3. Updated icons to use LucideIcon type instead of ReactElement
4. Updated validation schema to derive categories dynamically from CATEGORIES constant
5. Created category-helpers.ts with 6 utility functions
6. Created comprehensive test suite with 22 tests for category helpers
7. Added tooltips (title attribute) to category options in TransactionForm
8. Updated TransactionItem to display colored category badges with icons
9. Verified TransactionFilters already uses CATEGORIES constant correctly
10. Added 3 component tests for category display validation

### Completion Notes

✅ All 6 predefined categories implemented with full metadata (name, description, icon, color)
✅ Categories are immutable (readonly, as const)
✅ Single source of truth - all components use CATEGORIES constant
✅ Validation schema dynamically derives enum from CATEGORIES
✅ Category badges display with colored backgrounds and icons
✅ Tooltips show category descriptions on hover
✅ All tests passing: 132/132 (25 new tests added)
✅ Build successful with no TypeScript errors
✅ No UI for category CRUD operations (as required)

## Change Log

- **2025-12-29**: Story 2.5 implemented and marked for review
  - Created src/lib/category-helpers.ts with 6 utility functions
  - Created src/lib/category-helpers.test.ts with 22 comprehensive tests
  - Modified src/lib/constants.ts to use hex colors and LucideIcon type
  - Modified src/lib/validation.ts to derive categories from constants
  - Modified src/components/forms/TransactionForm.tsx to add category tooltips
  - Modified src/components/lists/TransactionItem.tsx to display colored category badges
  - Extended src/components/forms/TransactionForm.test.tsx with 3 category tests
  - Total test count: 107 → 132 (+25 tests)
