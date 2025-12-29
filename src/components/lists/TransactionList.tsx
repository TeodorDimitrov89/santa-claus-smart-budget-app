import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TransactionItem } from './TransactionItem';
import type { Transaction } from '../../types';

type TransactionListProps = {
  transactions?: Transaction[];
};

const ITEMS_PER_PAGE = 50;

export const TransactionList = ({ transactions = [] }: TransactionListProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const showPagination = transactions.length > ITEMS_PER_PAGE;

  const paginatedTransactions = useMemo(() => {
    if (!showPagination) return transactions;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return transactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [transactions, currentPage, showPagination]);

  // Reset to page 1 when transactions change
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [transactions.length, currentPage, totalPages]);

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">🎅 No transactions found</p>
        <p className="text-gray-400">
          Start tracking your Christmas budget by adding a transaction!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {paginatedTransactions.length} of {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          {showPagination && ` (Page ${currentPage} of ${totalPages})`}
        </p>
      </div>

      <div className="space-y-3">
        {paginatedTransactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>

      {showPagination && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <span className="text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            aria-label="Next page"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
