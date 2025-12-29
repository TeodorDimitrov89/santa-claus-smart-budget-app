import { CATEGORIES } from '../../lib/constants';
import type { FilterState } from '../../hooks/useTransactionFilters';

type TransactionFiltersProps = {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
};

export const TransactionFilters = ({
  filters,
  setFilters,
  clearFilters,
  hasActiveFilters,
}: TransactionFiltersProps) => {
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      type: e.target.value as 'All' | 'Income' | 'Expense',
    });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];

    setFilters({ ...filters, categories: newCategories });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchQuery: e.target.value });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        startDate: e.target.value ? new Date(e.target.value) : null,
      },
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        endDate: e.target.value ? new Date(e.target.value) : null,
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Type Filter */}
        <div>
          <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            id="type-filter"
            value={filters.type}
            onChange={handleTypeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          >
            <option value="All">All</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>

        {/* Search Input */}
        <div>
          <label htmlFor="search-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            id="search-filter"
            type="text"
            placeholder="Search descriptions..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            id="start-date"
            type="date"
            value={filters.dateRange.startDate?.toISOString().split('T')[0] || ''}
            onChange={handleStartDateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            id="end-date"
            type="date"
            value={filters.dateRange.endDate?.toISOString().split('T')[0] || ''}
            onChange={handleEndDateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Category Filter */}
        <div className="md:col-span-2 lg:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => {
              const CategoryIcon = cat.icon;
              return (
                <label
                  key={cat.name}
                  className="flex items-center gap-2 p-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(cat.name)}
                    onChange={() => handleCategoryToggle(cat.name)}
                    className="rounded text-green-600 focus:ring-green-500"
                  />
                  <div className="flex items-center gap-1">
                    <CategoryIcon className="w-4 h-4 text-gray-500" aria-hidden="true" />
                    <span className="text-sm">{cat.name}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="md:col-span-2 lg:col-span-4 flex justify-end">
          <button
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};
