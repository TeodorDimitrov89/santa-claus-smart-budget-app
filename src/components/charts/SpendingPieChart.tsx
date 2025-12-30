import { useMemo, useState } from 'react';
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
 * Displays expense or income distribution across categories
 * [FR-008: Visual Charts - Pie Chart]
 * [Story 3.6: Extended to support income view and slice highlighting]
 * [AC: Donut style, interactive tooltip, legend, responsive, festive theme, clickable slices]
 */

interface Props {
  transactions: Transaction[];
  view?: 'income' | 'expense';
}

export const SpendingPieChart = ({ transactions, view = 'expense' }: Props) => {
  const [highlightedSlice, setHighlightedSlice] = useState<string | null>(null);

  // Memoize chart data transformation (performance optimization)
  const chartData = useMemo(
    () => transformToPieChartData(transactions, view),
    [transactions, view]
  );

  // Empty state when no data
  if (chartData.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-gray-600 text-lg">
          No {view} data available for chart
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Add some {view} transactions to see your {view === 'expense' ? 'spending' : 'income'} distribution
        </p>
      </div>
    );
  }

  const chartTitle = view === 'expense' ? 'Spending distribution pie chart' : 'Income distribution pie chart';

  const handleSliceClick = (categoryName: string) => {
    setHighlightedSlice(highlightedSlice === categoryName ? null : categoryName);
  };

  return (
    <div aria-label={chartTitle} role="img">
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
            onClick={(data) => handleSliceClick(data.name)}
            style={{ cursor: 'pointer' }}
          >
            {chartData.map((entry, index) => {
              const isHighlighted = highlightedSlice === entry.name;
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={highlightedSlice === null || isHighlighted ? 1 : 0.3}
                  stroke={isHighlighted ? '#FFD700' : 'none'}
                  strokeWidth={isHighlighted ? 3 : 0}
                />
              );
            })}
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