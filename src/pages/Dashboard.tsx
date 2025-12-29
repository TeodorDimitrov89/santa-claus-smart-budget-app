import { BudgetBalanceCard } from '../components/budget/BudgetBalanceCard';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-heading text-christmas-red text-center">
        🎅 Dashboard
      </h1>

      {/* Budget Balance - Prominent Top Placement */}
      <BudgetBalanceCard />
    </div>
  );
}
