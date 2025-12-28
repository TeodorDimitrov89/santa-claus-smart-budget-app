import { useEffect, useState } from 'react';
import { TransactionForm } from '../forms/TransactionForm';
import { createTransaction } from '../../lib/transaction-helpers';
import type { TransactionInput } from '../../lib/validation';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError?: (error: string) => void;
}

export const TransactionModal = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
}: TransactionModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const result = await createTransaction(data);

      if (result.ok) {
        onSuccess('Transaction added successfully');
        onClose(); // Auto-close on success
      } else {
        onError?.(result.error.message || 'Failed to create transaction');
      }
    } catch (error) {
      onError?.(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
          🎅 Add Transaction
        </h2>

        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};
