# Epic 1: Project Foundation & Core Infrastructure

Development environment is set up with all necessary tools, libraries, and architectural patterns established, enabling developers to start building features with confidence.

**FRs covered:** Architecture requirements (starter template, tech stack setup, project structure)

---

## Story 1.1: Initialize Project with Vite Starter

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

---

## Story 1.2: Install and Configure Core Dependencies

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

---

## Story 1.3: Set up IndexedDB Database Schema and TypeScript Types

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

---

## Story 1.4: Create Base Project Structure and Navigation

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

---

## Story 1.5: Configure Festive Theme and Typography

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

---

## Story 1.6: Set up Error Boundaries and Testing Framework

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
