import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { transformToPieChartData } from '../../lib/chart-data';
import type { Transaction } from '../../types';

/**
 * Spending Pie Chart Component (Donut style)
 * Displays expense distribution across categories
 * [FR-008: Visual Charts - Pie Chart]
 * [AC: Donut style, interactive tooltip, legend, responsive, festive theme]
 */

interface Props {
  transactions: Transaction[];
}

export const SpendingPieChart = ({ transactions }: Props) => {
  // Memoize chart data transformation (performance optimization)
  const chartData = useMemo(
    () => transformToPieChartData(transactions),
    [transactions]
  );

  // Empty state when no expense data
  if (chartData.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-gray-600 text-lg">
          No expense data available for chart
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Add some expense transactions to see your spending distribution
        </p>
      </div>
    );
  }

  return (
    <div aria-label="Spending distribution pie chart" role="img">
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60} // Donut style (AC requirement)
            outerRadius={120}
            paddingAngle={2}
            label={(entry) => `${entry.name}: ${entry.percentage}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string, props) => {
              const percentage = props.payload.percentage;
              return [`$${value.toFixed(2)} (${percentage}%)`, name];
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
