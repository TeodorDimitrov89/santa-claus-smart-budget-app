# Story 1.4: Create Base Project Structure and Navigation

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to create the base project structure with flat folder hierarchy and set up routing,
So that I have organized folders and navigation ready for building features.

## Acceptance Criteria

**Given** The project is initialized with dependencies from Stories 1.1-1.3
**When** I create the folder structure following the flat architecture pattern
**Then** The following directories exist under `src/`:
- `pages/` - Page-level components
- `components/` - Reusable UI components (subdirs: layout, budget, transactions, ui)
- `hooks/` - Custom React hooks
- `lib/` - Business logic and utilities (already exists from Story 1.3)
- `context/` - React Context providers
- `types/` - TypeScript type definitions (already exists from Story 1.3)

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

## Tasks / Subtasks

- [ ] Create Folder Structure (AC: 1)
  - [ ] Create `src/pages/` directory
  - [ ] Create `src/components/` directory
  - [ ] Create `src/components/layout/` subdirectory
  - [ ] Create `src/components/budget/` subdirectory
  - [ ] Create `src/components/transactions/` subdirectory
  - [ ] Create `src/components/ui/` subdirectory
  - [ ] Create `src/hooks/` directory
  - [ ] Create `src/context/` directory
  - [ ] Verify `src/lib/` and `src/types/` directories exist from Story 1.3

- [ ] Create Placeholder Page Components (AC: 5)
  - [ ] Create `src/pages/Dashboard.tsx`:
    - Functional component with festive heading
    - Placeholder text: "Dashboard - Coming Soon"
    - Use Christmas colors from Tailwind config
  - [ ] Create `src/pages/Transactions.tsx`:
    - Functional component with festive heading
    - Placeholder text: "Transactions - Coming Soon"
  - [ ] Create `src/pages/Categories.tsx`:
    - Functional component with festive heading
    - Placeholder text: "Categories - Coming Soon"
  - [ ] Export all page components

- [ ] Create Header Component (AC: 4)
  - [ ] Create `src/components/layout/Header.tsx`
  - [ ] Import NavLink from react-router-dom
  - [ ] Create navigation menu with links to:
    - "/" → Dashboard
    - "/transactions" → Transactions
    - "/categories" → Categories
  - [ ] Implement active route highlighting using NavLink's `isActive` prop
  - [ ] Add festive styling with Christmas colors
  - [ ] Add responsive mobile hamburger menu:
    - Hidden on desktop (lg:hidden)
    - Toggleable on mobile
    - useState hook for menu open/close state
  - [ ] Use Lucide React icons for hamburger menu (Menu, X icons)
  - [ ] Export Header component

- [ ] Create Layout Component (AC: 3)
  - [ ] Create `src/components/layout/Layout.tsx`
  - [ ] Import Header component
  - [ ] Create Footer component inline or in separate file
  - [ ] Structure:
    ```tsx
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
    ```
  - [ ] Footer content:
    - App name: "Santa's Smart Budget App"
    - Version: "v1.0.0"
    - Copyright year: 2025
    - Festive styling
  - [ ] Export Layout component

- [ ] Configure React Router (AC: 2, 6, 7)
  - [ ] Update `src/App.tsx`:
    - Import BrowserRouter, Routes, Route from react-router-dom
    - Import Layout component
    - Import all page components (Dashboard, Transactions, Categories)
  - [ ] Set up routing structure:
    ```tsx
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </Layout>
    </BrowserRouter>
    ```
  - [ ] Test navigation: Click each link and verify URL updates
  - [ ] Verify active route highlighting works correctly

- [ ] Verify Setup (AC: 6, 7)
  - [ ] Run: `npm run dev`
  - [ ] Test all navigation links work
  - [ ] Verify active link highlighting on each page
  - [ ] Test mobile responsive menu (resize browser to <768px)
  - [ ] Verify all routes load without errors
  - [ ] Check browser console for errors
  - [ ] Verify TypeScript compilation: `npm run build`

## Dev Notes

### Critical Architectural Constraints (MANDATORY)

🚨 **THESE CONSTRAINTS APPLY TO THE ENTIRE PROJECT - NOT NEGOTIABLE:**

1. **100% Functional Approach - NO CLASSES**
   - ✅ ONLY functional components for pages, layouts, headers
   - ✅ Use React hooks (useState, useEffect, useNavigate, etc.)
   - ❌ NO class-based components
   - ❌ NO class-based routing

2. **Error Handling - react-error-boundary Required**
   - Must use `react-error-boundary` library (functional approach)
   - Will be integrated in Story 1.6 (not needed in this story)
   - No class-based error boundaries allowed

3. **Structure - Keep it Flat and Simple**
   - Maximum 2-3 levels of folder depth
   - `src/components/` has only 4 subdirectories: layout, budget, transactions, ui
   - Co-locate related files (e.g., Header.tsx and Header.test.tsx in same directory)
   - Avoid over-abstraction
   - Prefer simple patterns over complex architecture

[Source: _bmad-output/solutioning/architecture.md#CRITICAL ARCHITECTURAL CONSTRAINTS]

### Project Folder Structure

**Flat Architecture Pattern**:

The folder structure follows a flat, feature-based organization:

```
src/
├── pages/                  # Page-level components (one per route)
│   ├── Dashboard.tsx
│   ├── Transactions.tsx
│   └── Categories.tsx
├── components/             # Reusable UI components
│   ├── layout/            # Layout components
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx (optional separate file)
│   ├── budget/            # Budget-related components (future stories)
│   ├── transactions/      # Transaction-related components (future stories)
│   └── ui/                # Generic UI components (future stories)
├── hooks/                  # Custom React hooks (future stories)
├── lib/                    # Business logic and utilities (db.ts from Story 1.3)
├── context/                # React Context providers (future stories)
└── types/                  # TypeScript types (index.ts from Story 1.3)
```

**Rationale for This Structure**:

1. **pages/**: Top-level route components, simple and focused
2. **components/**: Feature-based subdirectories (layout, budget, transactions, ui)
3. **hooks/**: Centralized custom hooks (e.g., useTransactions, useFilters)
4. **lib/**: Pure functions and utilities (database, validation, calculations)
5. **context/**: Global state providers (if needed, prefer hooks over context)
6. **types/**: Centralized TypeScript type definitions

**Maximum 3 Levels Deep**:
- Level 1: `src/`
- Level 2: `components/`
- Level 3: `layout/`, `budget/`, `transactions/`, `ui/`

This avoids deep nesting like `src/features/transactions/components/list/TransactionList.tsx` (5 levels).

[Source: _bmad-output/solutioning/architecture.md#Project Structure (Flat Architecture)]

### React Router Configuration

**React Router v6 Pattern**:

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
```

**Why React Router v6?**
- Functional components only (no class-based routes)
- Declarative routing with `<Route element={} />`
- Better TypeScript support
- Simpler API than v5

**Route Structure Rationale**:
- `/` → Dashboard (default landing page, shows budget summary and charts)
- `/transactions` → Transactions (CRUD operations for transactions)
- `/categories` → Categories (category-based analysis and filtering)

[Source: _bmad-output/solutioning/architecture.md#Technology Stack]

### Layout Component Structure

**Layout Component Pattern**:

```tsx
// src/components/layout/Layout.tsx
import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-red-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
      <footer className="bg-christmas-green text-white py-6 px-4 text-center">
        <p className="text-sm">
          🎅 <span className="font-heading text-lg">Santa's Smart Budget App</span> v1.0.0
        </p>
        <p className="text-xs mt-2">© 2025 - Managing Christmas Magic</p>
      </footer>
    </div>
  );
}

export default Layout;
```

**Layout Design Decisions**:

1. **Flex Layout**: Uses `flex flex-col` for sticky footer pattern
2. **Container**: Centers content with `container mx-auto` and max-width
3. **Background**: Subtle festive gradient (white to light red)
4. **Responsive**: Uses Tailwind breakpoints for mobile/desktop
5. **Footer**: Inline footer component (simple enough, no separate file needed)

[Source: _bmad-output/solutioning/ux-design.md#Layout & Navigation]

### Header Component with Responsive Navigation

**Header Component with Mobile Menu**:

```tsx
// src/components/layout/Header.tsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-md transition-colors ${
      isActive
        ? 'bg-christmas-gold text-christmas-green font-semibold'
        : 'text-christmas-green hover:bg-christmas-red-light hover:text-white'
    }`;

  return (
    <header className="bg-christmas-red shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <h1 className="text-2xl md:text-3xl font-heading text-christmas-gold">
          🎅 Santa's Budget
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4">
          <NavLink to="/" className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/transactions" className={navLinkClass}>
            Transactions
          </NavLink>
          <NavLink to="/categories" className={navLinkClass}>
            Categories
          </NavLink>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-christmas-gold hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-christmas-red-dark border-t border-christmas-gold/30">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <NavLink
              to="/"
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/transactions"
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Transactions
            </NavLink>
            <NavLink
              to="/categories"
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
```

**Header Design Decisions**:

1. **Responsive Menu**:
   - Desktop: Horizontal navigation with `hidden md:flex`
   - Mobile: Hamburger menu icon, vertical dropdown menu

2. **Active Link Highlighting**:
   - Uses NavLink's `isActive` prop for dynamic styling
   - Active: Gold background, green text
   - Inactive: Green text, hover effects

3. **Mobile UX**:
   - Hamburger icon from Lucide React (Menu/X)
   - State managed with useState hook
   - Closes menu after clicking a link

4. **Festive Styling**:
   - Christmas red background
   - Gold accents for logo and icons
   - Green text for navigation links

5. **Accessibility**:
   - `aria-label` for menu button
   - Keyboard navigation support (React Router default)
   - Focus states for links

[Source: _bmad-output/solutioning/ux-design.md#Layout & Navigation]

### Placeholder Page Components

**Page Component Pattern**:

```tsx
// src/pages/Dashboard.tsx
function Dashboard() {
  return (
    <div className="text-center py-16">
      <h2 className="text-4xl font-heading text-christmas-green mb-4">
        🎄 Dashboard
      </h2>
      <p className="text-lg text-gray-700">
        Budget summary and charts coming soon!
      </p>
    </div>
  );
}

export default Dashboard;
```

```tsx
// src/pages/Transactions.tsx
function Transactions() {
  return (
    <div className="text-center py-16">
      <h2 className="text-4xl font-heading text-christmas-green mb-4">
        💰 Transactions
      </h2>
      <p className="text-lg text-gray-700">
        Transaction management coming soon!
      </p>
    </div>
  );
}

export default Transactions;
```

```tsx
// src/pages/Categories.tsx
function Categories() {
  return (
    <div className="text-center py-16">
      <h2 className="text-4xl font-heading text-christmas-green mb-4">
        🎁 Categories
      </h2>
      <p className="text-lg text-gray-700">
        Category analysis coming soon!
      </p>
    </div>
  );
}

export default Categories;
```

**Page Design Principles**:
- Simple functional components
- Festive emojis and headings
- Centered layout for placeholder content
- Will be replaced with real content in Epic 2 and Epic 3

### Festive Styling Integration

**Christmas Colors (from Story 1.2)**:

The Tailwind config defines custom Christmas colors:

```javascript
// tailwind.config.js (already configured in Story 1.2)
colors: {
  'christmas-red': {
    light: '#E85370',
    DEFAULT: '#C41E3A',
    dark: '#9A1829',
  },
  'christmas-green': {
    light: '#2D8659',
    DEFAULT: '#165B33',
    dark: '#0E3D22',
  },
  'christmas-gold': {
    light: '#FFE55C',
    DEFAULT: '#FFD700',
    dark: '#CCB200',
  },
}
```

**Color Usage in This Story**:
- **Header**: `bg-christmas-red`, `text-christmas-gold`
- **Navigation Links**: `text-christmas-green`, `bg-christmas-gold` (active)
- **Footer**: `bg-christmas-green`, `text-white`
- **Page Headings**: `text-christmas-green`
- **Background**: `bg-gradient-to-b from-white to-red-50`

[Source: _bmad-output/planning/prd.md#NFR-002: Usability - Festive Santa-themed design]

### Responsive Design Strategy

**Tailwind Breakpoints** (Mobile-First):

- `default` (< 768px): Mobile layout
  - Stacked vertical navigation (hamburger menu)
  - Single column layout
  - Larger touch targets for buttons

- `md` (≥ 768px): Tablet layout
  - Horizontal navigation
  - Two-column layouts (future stories)

- `lg` (≥ 1024px): Desktop layout
  - Full horizontal navigation
  - Multi-column layouts

- `xl` (≥ 1440px): Wide desktop
  - Max-width container (`max-w-7xl`)

**Example Responsive Patterns**:

```tsx
// Mobile: Hidden, Desktop: Visible
<nav className="hidden md:flex">...</nav>

// Mobile: Visible, Desktop: Hidden
<button className="md:hidden">...</button>

// Responsive text sizes
<h1 className="text-2xl md:text-3xl">...</h1>

// Responsive padding
<div className="px-4 py-4 md:px-8 md:py-6">...</div>
```

[Source: _bmad-output/planning/prd.md#NFR-002: Usability - Mobile-responsive]

### Previous Story Learnings (Stories 1.1-1.3)

**From Story 1.1**:
- ✅ Vite + React 18.3.1 + TypeScript 5.9.3 initialized
- ✅ Development server runs on http://localhost:5173

**From Story 1.2**:
- ✅ Tailwind CSS configured with Christmas colors
- ✅ React Router 6.x installed
- ✅ Lucide React icons installed
- ✅ Google Fonts configured (Mountains of Christmas, Poppins)

**From Story 1.3**:
- ✅ `src/lib/` and `src/types/` directories created
- ✅ Flat structure pattern established

**Patterns to Follow**:
- Create directories before files
- Use functional components only
- Export components as default exports
- Test navigation after routing setup
- Use Tailwind utility classes (no custom CSS files)
- Follow mobile-first responsive design

### Navigation UX Decisions

**Why NavLink vs Link?**

React Router offers two link components:
- `<Link>` - Basic navigation link
- `<NavLink>` - Navigation link with active state

We use `NavLink` for header navigation because:
1. ✅ Provides `isActive` prop for active route highlighting
2. ✅ Better UX - users know which page they're on
3. ✅ No need for manual route matching logic
4. ✅ Accessibility - screen readers can announce active state

**Why BrowserRouter vs HashRouter?**

We use `BrowserRouter` because:
1. ✅ Clean URLs (`/transactions` vs `/#/transactions`)
2. ✅ Better SEO (if app is deployed publicly)
3. ✅ Standard for modern SPAs
4. ✅ Works with Vite dev server and build output

[Source: _bmad-output/solutioning/architecture.md#Technology Stack]

### Project Structure Notes

**Current State (After Story 1.3):**
```
santa-claus-smart-budget-app/
├── src/
│   ├── lib/
│   │   └── db.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── tailwind.config.js
├── package.json
└── ... (config files)
```

**After Story 1.4:**
```
santa-claus-smart-budget-app/
├── src/
│   ├── pages/                          ← NEW
│   │   ├── Dashboard.tsx              ← NEW
│   │   ├── Transactions.tsx           ← NEW
│   │   └── Categories.tsx             ← NEW
│   ├── components/                     ← NEW
│   │   ├── layout/                    ← NEW
│   │   │   ├── Layout.tsx            ← NEW
│   │   │   └── Header.tsx            ← NEW
│   │   ├── budget/                    ← NEW (empty for now)
│   │   ├── transactions/              ← NEW (empty for now)
│   │   └── ui/                        ← NEW (empty for now)
│   ├── hooks/                          ← NEW (empty for now)
│   ├── context/                        ← NEW (empty for now)
│   ├── lib/
│   │   └── db.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx                        ← MODIFIED (routing added)
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
└── ... (config files)
```

**Alignment with Unified Project Structure:**
- ✅ Flat structure maintained (max 3 levels deep)
- ✅ Feature-based organization (layout, budget, transactions, ui)
- ✅ Clear separation: pages vs components
- ✅ Co-location: related files in same directory

### References

- [Source: _bmad-output/epics.md#Epic 1: Story 1.4]
- [Source: _bmad-output/solutioning/architecture.md#Project Structure (Flat Architecture)]
- [Source: _bmad-output/solutioning/architecture.md#CRITICAL ARCHITECTURAL CONSTRAINTS]
- [Source: _bmad-output/solutioning/ux-design.md#Layout & Navigation]
- [Source: _bmad-output/planning/prd.md#NFR-002: Usability]
- [Source: React Router v6 Documentation: https://reactrouter.com/en/main]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

*To be added during implementation*

### Completion Notes List

*To be added during implementation*

### File List

**New Directories:**
- src/pages/
- src/components/
- src/components/layout/
- src/components/budget/
- src/components/transactions/
- src/components/ui/
- src/hooks/
- src/context/

**New Files:**
- src/pages/Dashboard.tsx
- src/pages/Transactions.tsx
- src/pages/Categories.tsx
- src/components/layout/Layout.tsx
- src/components/layout/Header.tsx

**Modified Files:**
- src/App.tsx (routing configuration added)
