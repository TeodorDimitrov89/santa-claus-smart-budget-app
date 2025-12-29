import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmationDialog } from './ConfirmationDialog';

describe('ConfirmationDialog', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render when isOpen is true', () => {
    render(<ConfirmationDialog {...defaultProps} />);

    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(<ConfirmationDialog {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
  });

  it('should display title and message correctly', () => {
    render(<ConfirmationDialog {...defaultProps} />);

    const title = screen.getByText('Confirm Action');
    const message = screen.getByText('Are you sure you want to proceed?');

    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
  });

  it('should render details section when provided', () => {
    const details = <div>Transaction details here</div>;

    render(<ConfirmationDialog {...defaultProps} details={details} />);

    expect(screen.getByText('Transaction details here')).toBeInTheDocument();
  });

  it('should not render details section when not provided', () => {
    render(<ConfirmationDialog {...defaultProps} />);

    const detailsContainer = document.querySelector('.bg-red-50');
    expect(detailsContainer).not.toBeInTheDocument();
  });

  it('should call onClose when Cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(<ConfirmationDialog {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onConfirm when Confirm button is clicked', async () => {
    const user = userEvent.setup();

    render(<ConfirmationDialog {...defaultProps} />);

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('should use custom button text when provided', () => {
    render(
      <ConfirmationDialog
        {...defaultProps}
        confirmText="Delete"
        cancelText="Go Back"
      />
    );

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
  });

  it('should call onClose when Escape key is pressed', async () => {
    const user = userEvent.setup();

    render(<ConfirmationDialog {...defaultProps} />);

    await user.keyboard('{Escape}');

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();

    render(<ConfirmationDialog {...defaultProps} />);

    const backdrop = screen.getByRole('dialog');
    await user.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should apply dangerous styling when isDangerous is true', () => {
    render(<ConfirmationDialog {...defaultProps} isDangerous={true} confirmText="Delete" />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toHaveClass('bg-red-600');
  });

  it('should not apply dangerous styling when isDangerous is false', () => {
    render(<ConfirmationDialog {...defaultProps} isDangerous={false} />);

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton).toHaveClass('festive-button');
  });

  it('should call onClose when close icon is clicked', async () => {
    const user = userEvent.setup();

    render(<ConfirmationDialog {...defaultProps} />);

    const closeButton = screen.getByLabelText('Close dialog');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should have proper ARIA attributes', () => {
    render(<ConfirmationDialog {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title');
  });

  it('should prevent body scroll when dialog is open', () => {
    render(<ConfirmationDialog {...defaultProps} />);

    expect(document.body.style.overflow).toBe('hidden');
  });
});
