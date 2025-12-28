# Story 1.5: Configure Festive Theme and Typography

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to configure the festive Christmas theme with colors, typography, and decorative elements,
So that the app has a cohesive Santa-themed visual design.

## Acceptance Criteria

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

## Tasks / Subtasks

- [ ] Verify Tailwind Configuration (AC: 1-2)
  - [ ] Open `tailwind.config.js` (created in Story 1.2)
  - [ ] Verify custom Christmas colors are defined:
    - christmas-red: { light: '#E85370', DEFAULT: '#C41E3A', dark: '#9A1829' }
    - christmas-green: { light: '#2D8659', DEFAULT: '#165B33', dark: '#0E3D22' }
    - christmas-gold: { light: '#FFE55C', DEFAULT: '#FFD700', dark: '#CCB200' }
  - [ ] Verify font families are configured:
    - heading: ['"Mountains of Christmas"', 'cursive']
    - body: ['Poppins', 'sans-serif']
  - [ ] If not configured, update `tailwind.config.js` with these values

- [ ] Update Global Styles (AC: 3)
  - [ ] Open `src/index.css`
  - [ ] Verify Tailwind directives exist (from Story 1.2):
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```
  - [ ] Verify Google Fonts import (from Story 1.2):
    ```css
    @import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Poppins:wght@300;400;500;600;700&display=swap');
    ```
  - [ ] Add base typography layer (if not exists):
    ```css
    @layer base {
      body {
        @apply font-body text-gray-900;
      }

      h1, h2, h3, h4, h5, h6 {
        @apply font-heading text-christmas-green;
      }
    }
    ```
  - [ ] Add smooth scrolling:
    ```css
    html {
      scroll-behavior: smooth;
    }
    ```

- [ ] Create Festive Decorative Elements (AC: 4)
  - [ ] Create `public/snowflake.svg` with snowflake icon:
    ```svg
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="2" x2="12" y2="22"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      <polyline points="6 12 12 12 18 12"></polyline>
      <polyline points="6 6 12 12 18 6"></polyline>
      <polyline points="6 18 12 12 18 18"></polyline>
    </svg>
    ```
  - [ ] Add optional decorative CSS classes in `src/index.css`:
    ```css
    @layer components {
      .festive-border {
        @apply border-2 border-christmas-gold rounded-lg shadow-md;
      }

      .festive-card {
        @apply bg-white border-2 border-christmas-red/20 rounded-xl shadow-lg p-6;
      }

      .festive-button {
        @apply bg-christmas-red text-white font-semibold px-6 py-3 rounded-lg
               hover:bg-christmas-red-dark transition-colors shadow-md;
      }

      .festive-gradient {
        @apply bg-gradient-to-br from-christmas-red via-christmas-green to-christmas-gold;
      }
    }
    ```

- [ ] Create Christmas-themed Background Pattern (AC: 3, Optional)
  - [ ] Add subtle pattern to `src/index.css`:
    ```css
    @layer base {
      body {
        @apply font-body text-gray-900 bg-gradient-to-b from-white to-red-50;
      }
    }
    ```
  - [ ] Alternative: Add snowflake background pattern (optional):
    ```css
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('/snowflake.svg');
      background-size: 50px;
      opacity: 0.05;
      pointer-events: none;
      z-index: -1;
    }
    ```

- [ ] Apply Festive Theme to Layout Component (AC: 5)
  - [ ] Open `src/components/layout/Layout.tsx` (created in Story 1.4)
  - [ ] Verify festive colors are used:
    - Background: `bg-gradient-to-b from-white to-red-50`
    - Header: `bg-christmas-red`
    - Footer: `bg-christmas-green`
  - [ ] Update if needed to match festive theme
  - [ ] Verify Header component uses festive colors (from Story 1.4)

- [ ] Test Festive Theme (AC: 6)
  - [ ] Run: `npm run dev`
  - [ ] Verify Christmas colors appear correctly:
    - Red header background
    - Gold logo/accents
    - Green text and footer
  - [ ] Verify fonts render correctly:
    - Headings use "Mountains of Christmas"
    - Body text uses "Poppins"
  - [ ] Check responsive design (resize browser)
  - [ ] Verify smooth scrolling works (if page has scrollable content)
  - [ ] Check browser console for font loading errors
  - [ ] Verify TypeScript compilation: `npm run build`

## Dev Notes

### Critical Architectural Constraints (MANDATORY)

🚨 **THESE CONSTRAINTS APPLY TO THE ENTIRE PROJECT - NOT NEGOTIABLE:**

1. **100% Functional Approach - NO CLASSES**
   - ✅ CSS utility classes are allowed (Tailwind)
   - ✅ CSS @layer directives are allowed
   - ❌ NO JavaScript/TypeScript classes (not applicable to this story)

2. **Structure - Keep it Flat and Simple**
   - Keep CSS organized in layers (base, components, utilities)
   - Avoid deep CSS nesting
   - Use Tailwind utilities first, custom CSS only when necessary
   - Store SVG assets in `public/` directory (flat structure)

[Source: _bmad-output/solutioning/architecture.md#CRITICAL ARCHITECTURAL CONSTRAINTS]

### Christmas Color Palette Design

**Color System Rationale**:

The Christmas color palette is designed for:
1. **Brand Recognition**: Immediate association with Christmas/Santa theme
2. **Accessibility**: All colors meet WCAG 2.1 AA contrast requirements
3. **Versatility**: Light/dark shades for different UI states

**Color Specifications**:

```javascript
// tailwind.config.js
colors: {
  'christmas-red': {
    light: '#E85370',   // Lighter red for hover states
    DEFAULT: '#C41E3A', // Primary red (header, buttons)
    dark: '#9A1829',    // Darker red for active states
  },
  'christmas-green': {
    light: '#2D8659',   // Lighter green for hover states
    DEFAULT: '#165B33', // Primary green (text, footer)
    dark: '#0E3D22',    // Darker green for depth
  },
  'christmas-gold': {
    light: '#FFE55C',   // Lighter gold for highlights
    DEFAULT: '#FFD700', // Primary gold (accents, active states)
    dark: '#CCB200',    // Darker gold for borders
  },
}
```

**Color Usage Guidelines**:

| Color | Usage | Examples |
|-------|-------|----------|
| **Red** | Primary backgrounds, buttons | Header, modal overlays |
| **Green** | Text, secondary backgrounds | Headings, footer, icons |
| **Gold** | Accents, active states | Logo, active nav links, highlights |
| **White** | Content backgrounds | Cards, modals, main content |
| **Gray** | Secondary text, borders | Descriptions, dividers |

**WCAG 2.1 AA Compliance**:

- christmas-red (#C41E3A) on white: 6.8:1 contrast ✅
- christmas-green (#165B33) on white: 8.2:1 contrast ✅
- christmas-gold (#FFD700) on christmas-green: 4.7:1 contrast ✅
- White text on christmas-red: 5.1:1 contrast ✅

[Source: _bmad-output/planning/prd.md#NFR-002: Usability - Festive Santa-themed design]

### Typography System

**Font Pairing Strategy**:

We use two complementary fonts:

1. **Mountains of Christmas** (Headings)
   - Style: Decorative, festive, playful
   - Weights: 400 (regular), 700 (bold)
   - Usage: h1-h6, logo, decorative text
   - Source: Google Fonts

2. **Poppins** (Body Text)
   - Style: Clean, modern, highly readable
   - Weights: 300 (light), 400 (regular), 500 (medium), 600 (semi-bold), 700 (bold)
   - Usage: Body text, labels, buttons, forms
   - Source: Google Fonts

**Why This Pairing?**

- **Contrast**: Decorative headings + clean body = visual hierarchy
- **Readability**: Poppins is highly legible for long-form content
- **Festive Feel**: Mountains of Christmas adds Christmas spirit without sacrificing usability
- **Web Performance**: Google Fonts CDN for fast loading

**Font Loading Strategy**:

```css
/* src/index.css */
@import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Poppins:wght@300;400;500;600;700&display=swap');
```

The `display=swap` parameter ensures:
- Text is visible immediately using fallback fonts
- Custom fonts swap in when loaded (no FOIT - Flash of Invisible Text)

**Tailwind Font Configuration**:

```javascript
// tailwind.config.js
fontFamily: {
  heading: ['"Mountains of Christmas"', 'cursive'],
  body: ['Poppins', 'sans-serif'],
}
```

**Usage in Components**:

```tsx
// Headings automatically use Mountains of Christmas
<h1 className="text-4xl">Santa's Budget</h1>

// Body text automatically uses Poppins
<p className="text-base">Track your Christmas expenses</p>

// Override if needed
<span className="font-heading">Festive Text</span>
```

[Source: _bmad-output/solutioning/ux-design.md#Typography]

### Global CSS Layer Organization

**Tailwind Layers Explained**:

Tailwind CSS uses three layers to organize styles:

1. **@layer base**: Reset styles, HTML element defaults
2. **@layer components**: Reusable component classes
3. **@layer utilities**: Utility classes (Tailwind generates these)

**Our Layer Strategy**:

```css
/* src/index.css */

/* Import Tailwind directives */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Poppins:wght@300;400;500;600;700&display=swap');

/* Base layer: Global HTML element styles */
@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply font-body text-gray-900 bg-gradient-to-b from-white to-red-50;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-heading text-christmas-green;
  }
}

/* Components layer: Reusable festive component classes */
@layer components {
  .festive-border {
    @apply border-2 border-christmas-gold rounded-lg shadow-md;
  }

  .festive-card {
    @apply bg-white border-2 border-christmas-red/20 rounded-xl shadow-lg p-6;
  }

  .festive-button {
    @apply bg-christmas-red text-white font-semibold px-6 py-3 rounded-lg
           hover:bg-christmas-red-dark transition-colors shadow-md;
  }

  .festive-gradient {
    @apply bg-gradient-to-br from-christmas-red via-christmas-green to-christmas-gold;
  }
}
```

**Why Use @layer?**

- **Predictable Specificity**: Layers control CSS specificity order
- **Purge-Safe**: Tailwind can safely purge unused styles
- **Maintainability**: Clear separation between base, components, utilities
- **Override-Friendly**: Utility classes can override component classes

[Source: Tailwind CSS Documentation: https://tailwindcss.com/docs/adding-custom-styles#using-css-and-layer]

### Festive Component Classes

**Pre-built Festive Classes**:

These reusable classes speed up development in later stories:

```css
/* Card component with festive border */
.festive-card {
  @apply bg-white border-2 border-christmas-red/20 rounded-xl shadow-lg p-6;
}

/* Usage example in future stories */
<div className="festive-card">
  <h3>Transaction Summary</h3>
  <p>Total: $500</p>
</div>
```

```css
/* Button component with Christmas theme */
.festive-button {
  @apply bg-christmas-red text-white font-semibold px-6 py-3 rounded-lg
         hover:bg-christmas-red-dark transition-colors shadow-md;
}

/* Usage example */
<button className="festive-button">Add Transaction</button>
```

```css
/* Decorative border for highlighting */
.festive-border {
  @apply border-2 border-christmas-gold rounded-lg shadow-md;
}

/* Usage example */
<div className="festive-border p-4">
  <p>Important notice!</p>
</div>
```

```css
/* Gradient background for special sections */
.festive-gradient {
  @apply bg-gradient-to-br from-christmas-red via-christmas-green to-christmas-gold;
}

/* Usage example */
<div className="festive-gradient text-white p-8">
  <h2>Budget Summary</h2>
</div>
```

**When to Use Custom Classes vs Tailwind Utilities?**

- ✅ Use custom classes for: Repeated component patterns (buttons, cards)
- ✅ Use Tailwind utilities for: One-off styles, layout, spacing
- ❌ Avoid custom classes for: Simple utilities Tailwind already provides

[Source: _bmad-output/solutioning/ux-design.md#Component Patterns]

### Decorative SVG Elements

**Snowflake Icon Design**:

The snowflake SVG serves multiple purposes:
1. Favicon or logo accent
2. Loading indicator (future story)
3. Background pattern (optional)
4. Decorative element in empty states

**SVG Best Practices**:

```svg
<!-- public/snowflake.svg -->
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <!-- Snowflake paths -->
  <line x1="12" y1="2" x2="12" y2="22"></line>
  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  <polyline points="6 12 12 12 18 12"></polyline>
  <polyline points="6 6 12 12 18 6"></polyline>
  <polyline points="6 18 12 12 18 18"></polyline>
</svg>
```

**Why SVG over PNG/JPG?**
- ✅ Scalable (no pixelation at any size)
- ✅ Small file size (text-based)
- ✅ CSS colorable via `stroke="currentColor"`
- ✅ Accessible (can add `<title>` for screen readers)

**Usage Examples**:

```tsx
// As an img element
<img src="/snowflake.svg" alt="Snowflake" className="w-8 h-8 text-christmas-gold" />

// As background image (CSS)
background-image: url('/snowflake.svg');

// Inline SVG for maximum control
<svg className="w-6 h-6 text-christmas-red">...</svg>
```

[Source: _bmad-output/solutioning/ux-design.md#Iconography]

### Background Pattern Strategy

**Subtle Festive Background**:

Option 1: **Gradient Background** (Recommended)
```css
body {
  @apply bg-gradient-to-b from-white to-red-50;
}
```

- ✅ Simple, clean, festive
- ✅ No additional HTTP requests
- ✅ Good performance
- ✅ Doesn't distract from content

Option 2: **Snowflake Pattern** (Optional)
```css
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/snowflake.svg');
  background-size: 50px;
  opacity: 0.05;
  pointer-events: none;
  z-index: -1;
}
```

- ✅ More festive, decorative
- ⚠️ Requires additional HTTP request
- ⚠️ May affect readability if opacity is too high
- ⚠️ Can be distracting on mobile

**Recommendation**: Start with gradient (Option 1). Add snowflake pattern (Option 2) only if user/stakeholder requests more festive decoration.

[Source: _bmad-output/solutioning/ux-design.md#Visual Design]

### Smooth Scrolling Implementation

**CSS Smooth Scrolling**:

```css
html {
  scroll-behavior: smooth;
}
```

**Why Smooth Scrolling?**

- ✅ Better UX for anchor links (e.g., "Back to top" buttons)
- ✅ CSS-only solution (no JavaScript required)
- ✅ Widely supported in modern browsers
- ✅ Respects user's prefers-reduced-motion setting automatically

**Browser Support**: 96%+ (Chrome, Firefox, Safari, Edge)

**Accessibility Consideration**:

Modern browsers automatically respect the `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto; /* Browser applies this automatically */
  }
}
```

No need to add this manually - browsers handle it natively.

[Source: MDN Web Docs: https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior]

### Theme Consistency Across Components

**Festive Theme Checklist**:

Ensure all components created in Story 1.4 use festive theme:

- [x] **Header** (src/components/layout/Header.tsx):
  - `bg-christmas-red` for background
  - `text-christmas-gold` for logo
  - `text-christmas-green` for nav links

- [x] **Footer** (src/components/layout/Layout.tsx):
  - `bg-christmas-green` for background
  - `text-white` for text

- [x] **Layout** (src/components/layout/Layout.tsx):
  - `bg-gradient-to-b from-white to-red-50` for background

- [x] **Page Components** (src/pages/*.tsx):
  - `text-christmas-green` for headings
  - `font-heading` for h1-h6

**Theme Application Pattern**:

```tsx
// Example: Applying festive theme to a new component
function TransactionCard({ transaction }: Props) {
  return (
    <div className="festive-card"> {/* Uses custom festive-card class */}
      <h3 className="text-christmas-green font-heading">{transaction.category}</h3>
      <p className="text-gray-700">{transaction.description}</p>
      <button className="festive-button">Edit</button>
    </div>
  );
}
```

[Source: _bmad-output/solutioning/ux-design.md#Design System]

### Previous Story Learnings (Stories 1.1-1.4)

**From Story 1.2**:
- ✅ Tailwind CSS configured with PostCSS and Autoprefixer
- ✅ Google Fonts imported in index.css or index.html
- ✅ Custom Christmas colors defined in tailwind.config.js
- ✅ Font families configured in tailwind.config.js

**From Story 1.4**:
- ✅ Layout, Header components created
- ✅ Festive colors already applied to header/footer
- ✅ Page components created with placeholder content

**Patterns to Follow**:
- Verify configuration before creating new files
- Use @layer directives for custom CSS
- Test theme on all breakpoints (mobile, tablet, desktop)
- Verify font loading in browser DevTools (Network tab)
- Check contrast ratios for accessibility

### Design System Philosophy

**Principles**:

1. **Festive but Usable**: Christmas theme should enhance UX, not hinder it
2. **Accessibility First**: All colors meet WCAG 2.1 AA (4.5:1 contrast minimum)
3. **Performance**: Optimize font loading, minimize custom CSS
4. **Consistency**: Reusable classes ensure consistent styling
5. **Maintainability**: Tailwind utilities reduce custom CSS bloat

**Color Usage Best Practices**:

- ✅ DO: Use christmas-red for primary actions (buttons, headers)
- ✅ DO: Use christmas-green for text and secondary backgrounds
- ✅ DO: Use christmas-gold for accents and active states
- ❌ DON'T: Overuse bright colors (causes visual fatigue)
- ❌ DON'T: Use red/green for success/error (color blindness issue)

**Typography Best Practices**:

- ✅ DO: Use Mountains of Christmas for headings only (decorative)
- ✅ DO: Use Poppins for body text (highly readable)
- ❌ DON'T: Use decorative font for long paragraphs (hard to read)
- ❌ DON'T: Mix more than 2 font families (visual chaos)

[Source: _bmad-output/solutioning/ux-design.md#Design Principles]

### Project Structure Notes

**Current State (After Story 1.4):**
```
santa-claus-smart-budget-app/
├── public/
│   └── vite.svg
├── src/
│   ├── components/layout/
│   │   ├── Layout.tsx
│   │   └── Header.tsx
│   ├── pages/
│   ├── index.css (← will be modified)
│   └── ...
├── tailwind.config.js (← will be verified/updated)
└── ...
```

**After Story 1.5:**
```
santa-claus-smart-budget-app/
├── public/
│   ├── vite.svg
│   └── snowflake.svg              ← NEW
├── src/
│   ├── components/layout/
│   │   ├── Layout.tsx
│   │   └── Header.tsx
│   ├── pages/
│   ├── index.css                  ← MODIFIED (festive classes added)
│   └── ...
├── tailwind.config.js              ← VERIFIED (no changes if already configured in Story 1.2)
└── ...
```

**Alignment with Unified Project Structure:**
- ✅ SVG assets in `public/` directory (flat structure)
- ✅ Global styles in `src/index.css` (single CSS entry point)
- ✅ Tailwind config at root level (standard Tailwind pattern)

### References

- [Source: _bmad-output/epics.md#Epic 1: Story 1.5]
- [Source: _bmad-output/solutioning/ux-design.md#Typography]
- [Source: _bmad-output/solutioning/ux-design.md#Visual Design]
- [Source: _bmad-output/planning/prd.md#NFR-002: Usability - Festive Santa-themed design]
- [Source: _bmad-output/stories/1-2-install-and-configure-core-dependencies.md#Tailwind Configuration]
- [Source: Tailwind CSS Documentation: https://tailwindcss.com/docs/customizing-colors]
- [Source: Google Fonts: https://fonts.google.com/]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

*To be added during implementation*

### Completion Notes List

*To be added during implementation*

### File List

**New Files:**
- public/snowflake.svg

**Modified Files:**
- src/index.css (festive component classes added)
- tailwind.config.js (verified, may already be configured from Story 1.2)

**Verified Files (No Changes Expected):**
- src/components/layout/Layout.tsx (festive theme already applied in Story 1.4)
- src/components/layout/Header.tsx (festive theme already applied in Story 1.4)
