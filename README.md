# Santa's Smart Budget App

## Project Brief

Santa is preparing for Christmas, and managing the budget for gifts, elves, reindeer care, and holiday logistics has become a serious challenge. This web application helps Santa manage expenses and income during the holiday season.

### Core Features

**1. Budget Management (CRUD Operations)**
- Add, update, and delete income and expense records
- Transaction types: Income and Expense 
- Examples: Salary, Bonus (Income); Gift Budget, Decorations, Travel (Expense)

**2. Categorization System**
- Assign transactions to predefined categories:
  - Gifts
  - Food & Dinner
  - Decorations
  - Travel
  - Charity
  - Santa's Workshop

**3. Data Visualization**
- Display budget summaries
- Visual charts showing spending distribution across categories
- Real-time budget balance calculation (Total Income - Total Expenses)

**4. AI-Based Features (Optional) - Not Implemented** 
- Smart Alerts for overspending detection
- AI-powered spending suggestions and budget reallocation recommendations
- Proactive monitoring to protect critical budgets

### Tech Stack

- **Frontend Framework**: React 18.3.1 with TypeScript 5.5.3
- **Build Tool**: Vite 5.4.8
- **Styling**: Tailwind CSS 3.4.13
- **Database**: IndexedDB via Dexie.js 4.0.8
- **Routing**: React Router 6.26.2
- **Form Validation**: React Hook Form 7.53.0 + Zod 3.23.8
- **Charts**: Recharts 2.15.4
- **Icons**: Lucide React 0.446.0
- **Error Handling**: react-error-boundary 4.0.13
- **Testing**: Vitest 2.1.9, React Testing Library

### Data Model

**Transaction Structure:**
- Amount (number)
- Type (Income/Expense)
- Category (from predefined list)
- Date (timestamp)
- Description (text)

**Business Logic:**
- Budget Balance = Total Income - Total Expenses
- Category-based spending analysis
- AI monitoring for anomaly detection

## How to Run

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm (comes with Node.js)

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server (runs on http://localhost:5173)
npm run dev
```

### Testing

```bash
# Run all tests (283 tests across the project)
npm test
```

**Note on Additional Test Commands:**
The following test commands are defined in package.json but require additional packages:
- `npm run test:ui` - Requires `@vitest/ui` (not installed)
- `npm run test:coverage` - Requires `@vitest/coverage-v8` (not installed)
- `npm run test:e2e` - Playwright tests (deferred for this project)

**Note on E2E Testing:** Initial Playwright configuration and reports are present in the project. However, full E2E test suite implementation was deferred to prioritize core business logic and AI features within the allocated resource (token) budget.

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Available Commands

- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run all tests (283 unit and component tests)
- `npm run lint` - Run ESLint (24 errors, 1 warning - primarily test file `any` types)

## Required Deliverables

- [x] prompts.md (active log)
- [x] README.md (project brief and setup instructions)
- [x] summary.md (AI impact log)

## Project Structure

```
santa-claus-smart-budget-app/
├── _bmad/                                    # BMAD workflow system
├── _bmad-output/                             # Generated planning artifacts
│   ├── analysis/                             # Product briefs
│   ├── planning/                             # PRD, UX Design
│   ├── solutioning/                          # Architecture documents
│   ├── stories/                              # Story files, sprint status, retrospective
│   └── epics.md                              # All epics and stories
├── public/                                   # Static assets
├── src/
│   ├── components/
│   │   ├── budget/                           # Budget display components
│   │   │   ├── BudgetBalanceCard.tsx         # Real-time balance with status indicators
│   │   │   └── budget-status-config.ts       # Status color/icon configuration
│   │   ├── categories/                       # Category aggregation components
│   │   │   └── CategoryAggregationTable.tsx  # Category summary table with sorting
│   │   ├── charts/                           # Data visualization components
│   │   │   ├── SpendingPieChart.tsx          # Donut pie chart for spending distribution
│   │   │   ├── CategoryBarChart.tsx          # Bar chart for category comparison
│   │   │   ├── ChartViewToggle.tsx           # Income/Expense view toggle
│   │   │   └── CategorySortToggle.tsx        # Sort control for bar chart
│   │   ├── filters/                          # Transaction filtering components
│   │   │   └── TransactionFilters.tsx        # Type/category/date/search filters
│   │   ├── forms/                            # Form components
│   │   │   └── TransactionForm.tsx           # Transaction create/edit form
│   │   ├── layout/                           # Layout components
│   │   │   ├── Layout.tsx                    # App shell with gradient background
│   │   │   └── Header.tsx                    # Navigation header
│   │   ├── lists/                            # List components
│   │   │   ├── TransactionList.tsx           # Filtered transaction list
│   │   │   └── TransactionItem.tsx           # Individual transaction card
│   │   ├── modals/                           # Modal dialogs
│   │   │   ├── TransactionModal.tsx          # Create/edit transaction modal
│   │   │   └── ConfirmationDialog.tsx        # Delete confirmation dialog
│   │   ├── transactions/                     # Transaction-specific components
│   │   │   └── TransactionSummary.tsx        # Transaction details summary
│   │   └── ui/                               # Reusable UI components
│   │       └── ErrorFallback.tsx             # Error boundary fallback UI
│   ├── hooks/
│   │   ├── useTransactions.ts                # Dexie useLiveQuery wrapper
│   │   ├── useTransactionFilters.ts          # Filter state management
│   │   ├── useBudget.ts                      # Budget calculations with memoization
│   │   └── useCategoryAggregations.ts        # Category aggregation with sorting
│   ├── lib/
│   │   ├── db.ts                             # Dexie database configuration
│   │   ├── constants.ts                      # Categories, colors, icons
│   │   ├── validation.ts                     # Zod schemas
│   │   ├── result.ts                         # Result type for error handling
│   │   ├── transaction-helpers.ts            # Transaction CRUD operations
│   │   ├── category-helpers.ts               # Category utility functions
│   │   ├── budget.ts                         # Budget calculation functions
│   │   ├── budget-status.ts                  # Balance status helper
│   │   ├── format.ts                         # Currency formatting
│   │   ├── categories.ts                     # Category aggregation logic
│   │   └── chart-data.ts                     # Chart data transformations
│   ├── pages/
│   │   ├── Dashboard.tsx                     # Dashboard with budget & charts
│   │   ├── Transactions.tsx                  # Transaction management page
│   │   └── Categories.tsx                    # Category analysis page
│   ├── test/
│   │   └── setup.ts                          # Vitest test setup
│   ├── types/
│   │   └── index.ts                          # TypeScript type definitions
│   ├── App.tsx                               # Root component with routing
│   ├── main.tsx                              # Application entry point
│   └── index.css                             # Global styles with Tailwind
├── prompts.md                                # Log of all user prompts
├── summary.md                                # AI impact and usage log
├── README.md                                 # This file
├── package.json                              # Dependencies and scripts
├── tsconfig.json                             # TypeScript configuration
├── vite.config.ts                            # Vite build configuration
├── tailwind.config.js                        # Tailwind CSS configuration
└── eslint.config.js                          # ESLint configuration
```

## Documentation

### Planning Artifacts
- **Product Brief**: `_bmad-output/analysis/product-brief-santa-claus-smart-budget-app-2025-12-24.md` - Complete vision, problem statement, and technical requirements
- **PRD**: `_bmad-output/planning/prd.md` - 10 functional requirements (FR-001 to FR-010) with acceptance criteria
- **UX Design**: `_bmad-output/planning/ux-design.md` - Christmas theme, wireframes, design system, accessibility guidelines
- **Architecture**: `_bmad-output/solutioning/architecture.md` - 100% functional approach, Vite+React+TypeScript stack, flat structure
- **Epics & Stories**: `_bmad-output/epics.md` - 3 epics, 17 implementation-ready stories
- **Implementation Readiness**: `_bmad-output/implementation-readiness-report-2025-12-26.md` - Pre-implementation validation report

### Implementation Artifacts
- **Sprint Status**: `_bmad-output/stories/sprint-status.yaml` - Real-time tracking of all 17 stories (all done)
- **Story Files**: `_bmad-output/stories/*.md` - Individual story specifications with dev notes, tasks, and completion records
- **Project Retrospective**: `_bmad-output/stories/project-retrospective-epics-1-2-3.md` - Comprehensive review covering all 3 epics, token budget strategy, technical achievements, and lessons learned
- **Workflow Status**: `_bmad-output/bmm-workflow-status.yaml` - Complete project workflow tracking from planning through retrospective

### Development Logs
- **Prompts Log**: `prompts.md` - Chronological log of all user prompts across sessions
- **AI Impact Summary**: `summary.md` - Complete AI usage analysis with 33 documented problems and solutions
