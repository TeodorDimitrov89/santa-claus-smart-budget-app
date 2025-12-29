import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { calculateBalance } from '../lib/budget';
import { TransactionModal } from '../components/modals/TransactionModal';
import { TransactionList } from '../components/lists/TransactionList';
import { TransactionFilters } from '../components/filters/TransactionFilters';
import { ConfirmationDialog } from '../components/modals/ConfirmationDialog';
import { TransactionSummary } from '../components/transactions/TransactionSummary';
import { useTransactionFilters } from '../hooks/useTransactionFilters';
import { deleteTransaction } from '../hooks/useTransactions';
import type { Transaction } from '../types';

export default function Transactions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  // Fetch all transactions for balance calculation
  const allTransactions = useLiveQuery(() => db.transactions.toArray());

  // Use filter hook
  const { filters, setFilters, filteredTransactions, clearFilters, hasActiveFilters } =
    useTransactionFilters();

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    setErrorMessage('');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
    setSuccessMessage('');
    setTimeout(() => setErrorMessage(''), 5000);
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleAddClick = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setDeletingTransaction(transaction);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTransaction) return;

    const result = await deleteTransaction(deletingTransaction.id);

    if (result.ok) {
      handleSuccess('Transaction deleted successfully');
    } else {
      handleError(result.error);
    }

    setDeletingTransaction(null);
  };

  // Calculate balance from ALL transactions (ignoring filters)
  const balance = calculateBalance(allTransactions || []);
  const balanceColor =
    balance > 0 ? 'text-green-600' : balance < 0 ? 'text-red-600' : 'text-yellow-600';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-heading text-christmas-green">
          📋 Transactions
        </h1>
        <button onClick={handleAddClick} className="festive-button">
          + Add Transaction
        </button>
      </div>

      {/* Success/Error Notifications */}
      {successMessage && (
        <div className="mb-4 p-4 bg-christmas-green/10 border-2 border-christmas-green rounded-lg">
          <p className="text-christmas-green font-semibold">✅ {successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-500 rounded-lg">
          <p className="text-red-600 font-semibold">❌ {errorMessage}</p>
        </div>
      )}

      {/* Budget Balance Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-sm font-medium text-gray-500 mb-2">Current Balance</h2>
        <p className={`text-4xl font-bold ${balanceColor}`}>
          ${Math.abs(balance).toFixed(2)}
        </p>
        <p className="text-sm text-gray-400 mt-2">
          {balance >= 0 ? 'On budget' : 'Over budget'}
        </p>
      </div>

      {/* Filters */}
      <TransactionFilters
        filters={filters}
        setFilters={setFilters}
        clearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Transaction List */}
      <div className="festive-card">
        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        onError={handleError}
        editTransaction={editingTransaction}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!deletingTransaction}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleConfirmDelete}
        title="🗑️ Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        details={<TransactionSummary transaction={deletingTransaction} />}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
      />
    </div>
  );
}
