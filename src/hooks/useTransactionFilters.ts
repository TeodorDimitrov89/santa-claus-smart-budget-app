import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';

export type FilterState = {
  type: 'All' | 'Income' | 'Expense';
  categories: string[];
  dateRange: { startDate: Date | null; endDate: Date | null };
  searchQuery: string;
};

export const useTransactionFilters = () => {
  const [filters, setFilters] = useState<FilterState>({
    type: 'All',
    categories: [],
    dateRange: { startDate: null, endDate: null },
    searchQuery: '',
  });

  const allTransactions = useLiveQuery(() =>
    db.transactions.orderBy('date').reverse().toArray()
  );

  const filteredTransactions = useMemo(() => {
    if (!allTransactions) return [];

    return allTransactions
      .filter((t) => filters.type === 'All' || t.type === filters.type)
      .filter(
        (t) =>
          filters.categories.length === 0 ||
          filters.categories.includes(t.category)
      )
      .filter((t) => {
        const { startDate, endDate } = filters.dateRange;
        if (!startDate && !endDate) return true;
        if (startDate && t.date < startDate) return false;
        if (endDate && t.date > endDate) return false;
        return true;
      })
      .filter(
        (t) =>
          !filters.searchQuery ||
          t.description.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
  }, [allTransactions, filters]);

  const clearFilters = () => {
    setFilters({
      type: 'All',
      categories: [],
      dateRange: { startDate: null, endDate: null },
      searchQuery: '',
    });
  };

  const hasActiveFilters =
    filters.type !== 'All' ||
    filters.categories.length > 0 ||
    filters.dateRange.startDate !== null ||
    filters.dateRange.endDate !== null ||
    filters.searchQuery !== '';

  return {
    filters,
    setFilters,
    filteredTransactions,
    clearFilters,
    hasActiveFilters,
  };
};
