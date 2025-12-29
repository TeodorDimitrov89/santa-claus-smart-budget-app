import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionModal } from './TransactionModal';
import type { Transaction } from '../../types';

// Mock the transaction helpers
vi.mock('../../lib/transaction-helpers', () => ({
  createTransaction: vi.fn(),
}));

vi.mock('../../hooks/useTransactions', () => ({
  updateTransaction: vi.fn(),
}));

// Import the mocked functions
import { createTransaction } from '../../lib/transaction-helpers';
import { updateTransaction } from '../../hooks/useTransactions';

describe('TransactionModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

  const mockTransaction: Transaction = {
    id: 'test-id',
    amount: 150.75,
    type: 'Income',
    category: 'Gifts',
    date: new Date('2025-12-25'),
    description: 'Christmas bonus',
    createdAt: new Date('2025-12-20'),
    updatedAt: new Date('2025-12-20'),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Create Mode', () => {
    it('should display "Add Transaction" title in create mode', () => {
      render(
        <TransactionModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      );

      expect(screen.getByText('🎅 Add Transaction')).toBeInTheDocument();
    });

    it('should not render modal when isOpen is false', () => {
      render(
        <TransactionModal
          isOpen={false}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      );

      expect(screen.queryByText('🎅 Add Transaction')).not.toBeInTheDocument();
    });

    it('should call onClose when Escape key is pressed', async () => {
      const user = userEvent.setup();

      render(
        <TransactionModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      );

      await user.keyboard('{Escape}');

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked', async () => {
      const user = userEvent.setup();

      render(
        <TransactionModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      );

      // Click the backdrop (the outer div)
      const backdrop = screen.getByRole('dialog');
      await user.click(backdrop);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call createTransaction and onSuccess on successful create', async () => {
      const user = userEvent.setup();
      vi.mocked(createTransaction).mockResolvedValue({ ok: true, value: 'test-id' });

      render(
        <TransactionModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      );

      // Fill in the form
      await user.type(screen.getByLabelText(/amount/i), '100');
      await user.selectOptions(screen.getByLabelText(/type/i), 'Income');
      await user.selectOptions(screen.getByLabelText(/category/i), 'Gifts');
      await user.type(screen.getByLabelText(/date/i), '2025-12-25');

      // Submit the form
      const saveButton = screen.getByRole('button', { name: /save transaction/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(createTransaction).toHaveBeenCalled();
        expect(mockOnSuccess).toHaveBeenCalledWith('Transaction added successfully');
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should call onError on failed create', async () => {
      const user = userEvent.setup();
      vi.mocked(createTransaction).mockResolvedValue({
        ok: false,
        error: new Error('Database error'),
      });

      render(
        <TransactionModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          onError={mockOnError}
        />
      );

      // Fill in the form
      await user.type(screen.getByLabelText(/amount/i), '100');
      await user.selectOptions(screen.getByLabelText(/type/i), 'Income');
      await user.selectOptions(screen.getByLabelText(/category/i), 'Gifts');
      await user.type(screen.getByLabelText(/date/i), '2025-12-25');

      // Submit the form
      const saveButton = screen.getByRole('button', { name: /save transaction/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith('Database error');
        expect(mockOnClose).not.toHaveBeenCalled();
      });
    });
  });

  describe('Edit Mode', () => {
    it('should display "Edit Transaction" title in edit mode', () => {
      render(
        <TransactionModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          editTransaction={mockTransaction}
        />
      );

      expect(screen.getByText('✏️ Edit Transaction')).toBeInTheDocument();
    });

    it('should pre-populate form fields with editTransaction data', () => {
      render(
        <TransactionModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          editTransaction={mockTransaction}
        />
      );

      const amountInput = screen.getByLabelText(/amount/i) as HTMLInputElement;
      const typeSelect = screen.getByLabelText(/type/i) as HTMLSelectElement;
      const categorySelect = screen.getByLabelText(/category/i) as HTMLSelectElement;
      const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;

      expect(amountInput.value).toBe('150.75');
      expect(typeSelect.value).toBe('Income');
      expect(categorySelect.value).toBe('Gifts');
      expect(descriptionInput.value).toBe('Christmas bonus');
    });

    it('should display "Update Transaction" button text in edit mode', () => {
      render(
        <TransactionModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          editTransaction={mockTransaction}
        />
      );

      expect(screen.getByRole('button', { name: /update transaction/i })).toBeInTheDocument();
    });

    it('should call updateTransaction and onSuccess on successful update', async () => {
      const user = userEvent.setup();
      vi.mocked(updateTransaction).mockResolvedValue({ ok: true, value: undefined });

      render(
        <TransactionModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          editTransaction={mockTransaction}
        />
      );

      // Modify a field
      const amountInput = screen.getByLabelText(/amount/i);
      await user.clear(amountInput);
      await user.type(amountInput, '200');

      // Submit the form
      const updateButton = screen.getByRole('button', { name: /update transaction/i });
      await user.click(updateButton);

      await waitFor(() => {
        expect(updateTransaction).toHaveBeenCalledWith('test-id', expect.objectContaining({
          amount: 200,
        }));
        expect(mockOnSuccess).toHaveBeenCalledWith('Transaction updated successfully');
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should call onError on failed update', async () => {
      const user = userEvent.setup();
      vi.mocked(updateTransaction).mockResolvedValue({
        ok: false,
        error: 'Transaction not found',
      });

      render(
        <TransactionModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          onError={mockOnError}
          editTransaction={mockTransaction}
        />
      );

      // Submit the form
      const updateButton = screen.getByRole('button', { name: /update transaction/i });
      await user.click(updateButton);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith('Transaction not found');
        expect(mockOnClose).not.toHaveBeenCalled();
      });
    });

    it('should clear editTransaction state when modal closes', async () => {
      const user = userEvent.setup();

      render(
        <TransactionModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          editTransaction={mockTransaction}
        />
      );

      // Click cancel button
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <TransactionModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('should prevent body scroll when modal is open', () => {
      render(
        <TransactionModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      );

      expect(document.body.style.overflow).toBe('hidden');
    });
  });
});