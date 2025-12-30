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
import type { Transaction, Category } from '../../types';

/**
 * Category Bar Chart Component
 * Displays expense or income comparison across all 6 categories
 * [FR-008: Visual Charts - Bar Chart]
 * [Story 3.6: Extended to support income view, sorting, and click-to-filter]
 * [AC: All 6 categories, sortable, interactive tooltip, grid lines, responsive, festive theme, clickable bars]
 */

interface Props {
  transactions: Transaction[];
  sortByAmount?: boolean;
  view?: 'income' | 'expense';
  onCategoryClick?: (category: Category) => void;
  selectedCategory?: Category | null;
}

export const CategoryBarChart = ({
  transactions,
  sortByAmount = false,
  view = 'expense',
  onCategoryClick,
  selectedCategory = null,
}: Props) => {
  // Memoize chart data transformation (performance optimization)
  const chartData = useMemo(
    () => transformToBarChartData(transactions, sortByAmount, view),
    [transactions, sortByAmount, view]
  );

  // Check if all categories have $0 (empty state)
  const hasAnyData = chartData.some((item) => item.amount > 0);

  if (!hasAnyData) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-gray-600 text-lg">
          No {view} data available for chart
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Add some {view} transactions to see category comparison
        </p>
      </div>
    );
  }

  const yAxisLabel = view === 'expense' ? 'Expense ($)' : 'Income ($)';
  const chartTitle = view === 'expense' ? 'Category spending comparison bar chart' : 'Category income comparison bar chart';

  return (
    <div aria-label={chartTitle} role="img">
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
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              return [`$${value.toFixed(2)}`, name];
            }}
            labelFormatter={(label: string) => `Category: ${label}`}
          />
          <Bar
            dataKey="amount"
            onClick={(data) => onCategoryClick && onCategoryClick(data.category)}
            style={{ cursor: onCategoryClick ? 'pointer' : 'default' }}
          >
            {chartData.map((entry, index) => {
              const isSelected = selectedCategory === entry.category;
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  opacity={selectedCategory === null || isSelected ? 1 : 0.3}
                  stroke={isSelected ? '#FFD700' : 'none'}
                  strokeWidth={isSelected ? 3 : 0}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
