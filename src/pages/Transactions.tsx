import { useState } from 'react';
import { TransactionModal } from '../components/modals/TransactionModal';
import { useTransactions } from '../hooks/useTransactions';

export default function Transactions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { transactions, isLoading } = useTransactions();

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    setErrorMessage('');
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
    setSuccessMessage('');
    // Clear error message after 5 seconds
    setTimeout(() => setErrorMessage(''), 5000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-heading text-christmas-green">
          📋 Transactions
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="festive-button"
        >
          + Add Transaction
        </button>
      </div>

      {/* Success/Error Notifications */}
      {successMessage && (
        <div className="mb-4 p-4 bg-christmas-green/10 border-2 border-christmas-green rounded-lg">
          <p className="text-christmas-green font-semibold">
            ✅ {successMessage}
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-500 rounded-lg">
          <p className="text-red-600 font-semibold">❌ {errorMessage}</p>
        </div>
      )}

      {/* Transaction List - Placeholder for Story 2.2 */}
      <div className="festive-card">
        {isLoading ? (
          <p className="text-gray-500 text-center py-8">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500 mb-2">No transactions yet</p>
            <p className="text-sm text-gray-400">
              Click "Add Transaction" to get started
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </p>
            {/* Transaction list implementation in Story 2.2 */}
            <div className="space-y-2">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-3 border-2 border-gray-200 rounded-lg hover:border-christmas-red/30 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">
                        {transaction.description || '(No description)'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.category} •{' '}
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <p
                      className={`text-lg font-bold ${
                        transaction.type === 'Income'
                          ? 'text-christmas-green'
                          : 'text-christmas-red'
                      }`}
                    >
                      {transaction.type === 'Income' ? '+' : '-'}$
                      {transaction.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
}
