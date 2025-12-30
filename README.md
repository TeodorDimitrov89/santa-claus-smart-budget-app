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

**4. AI-Based Features (Optional)**
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
├── _bmad/                          # BMAD workflow system
├── _bmad-output/                   # Generated analysis artifacts
│   └── analysis/
│       └── product-brief-*.md      # Complete product vision and requirements
├── prompts.md                      # Log of all user prompts
├── summary.md                      # AI impact and usage log
└── README.md                       # This file
```

## Documentation

- **Product Brief**: See `_bmad-output/analysis/product-brief-santa-claus-smart-budget-app-2025-12-24.md` for complete vision, problem statement, and technical requirements
- **Prompts Log**: See `prompts.md` for session history
- **AI Impact**: See `summary.md` for AI usage analysis
