import { useEffect, useState } from 'react';
import { TransactionForm } from '../forms/TransactionForm';
import { createTransaction } from '../../lib/transaction-helpers';
import { updateTransaction } from '../../hooks/useTransactions';
import type { TransactionInput } from '../../lib/validation';
import type { Transaction } from '../../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError?: (error: string) => void;
  editTransaction?: Transaction | null;
}

export const TransactionModal = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
  editTransaction,
}: TransactionModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mode = editTransaction ? 'edit' : 'create';
  const modalTitle = mode === 'edit' ? '✏️ Edit Transaction' : '🎅 Add Transaction';

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (data: TransactionInput) => {
    setIsSubmitting(true);

    try {
      const result = editTransaction
        ? await updateTransaction(editTransaction.id, data)
        : await createTransaction(data as any);

      if (result.ok) {
        const successMessage = editTransaction
          ? 'Transaction updated successfully'
          : 'Transaction added successfully';
        onSuccess(successMessage);
        onClose(); // Auto-close on success
      } else {
        // Handle both string and Error types for result.error
        const errorMessage = typeof result.error === 'string'
          ? result.error
          : result.error?.message || 'Failed to save transaction';
        onError?.(errorMessage);
      }
    } catch (error) {
      onError?.(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepare initialData for edit mode
  const initialData = editTransaction
    ? {
        amount: editTransaction.amount,
        type: editTransaction.type,
        category: editTransaction.category,
        date: editTransaction.date,
        description: editTransaction.description,
      }
    : undefined;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Close modal only if clicking the backdrop, not the modal content
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="festive-card max-w-md w-full mx-4 animate-fade-in">
        <h2
          id="modal-title"
          className="font-heading text-2xl text-christmas-red mb-4"
        >
          {modalTitle}
        </h2>

        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          initialData={initialData}
        />
      </div>
    </div>
  );
};
