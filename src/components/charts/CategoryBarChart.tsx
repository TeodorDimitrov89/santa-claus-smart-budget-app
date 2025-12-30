import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { transformToBarChartData } from '../../lib/chart-data';
import type { Transaction } from '../../types';

/**
 * Category Bar Chart Component
 * Displays expense comparison across all 6 categories
 * [FR-008: Visual Charts - Bar Chart]
 * [AC: All 6 categories, sortable, interactive tooltip, grid lines, responsive, festive theme]
 */

interface Props {
  transactions: Transaction[];
  sortByAmount?: boolean;
}

export const CategoryBarChart = ({
  transactions,
  sortByAmount = false,
}: Props) => {
  // Memoize chart data transformation (performance optimization)
  const chartData = useMemo(
    () => transformToBarChartData(transactions, sortByAmount),
    [transactions, sortByAmount]
  );

  // Check if all categories have $0 (empty state)
  const hasAnyExpenses = chartData.some((item) => item.amount > 0);

  if (!hasAnyExpenses) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-gray-600 text-lg">
          No expense data available for chart
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Add some expense transactions to see category comparison
        </p>
      </div>
    );
  }

  return (
    <div aria-label="Category spending comparison bar chart" role="img">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="category"
            angle={-45}
            textAnchor="end"
            height={100}
            style={{ fontSize: '12px' }}
          />
          <YAxis
            label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              return [`$${value.toFixed(2)}`, name];
            }}
            labelFormatter={(label: string) => `Category: ${label}`}
          />
          <Bar dataKey="amount">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
