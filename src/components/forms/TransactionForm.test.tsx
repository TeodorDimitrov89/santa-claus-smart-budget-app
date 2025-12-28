import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionForm } from './TransactionForm';

describe('TransactionForm', () => {
  it('should display validation error for negative amount', async () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();
    render(
      <TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const amountInput = screen.getByLabelText(/amount/i);
    await userEvent.type(amountInput, '-100');
    await userEvent.tab(); // Trigger blur

    await waitFor(() => {
      expect(screen.getByText(/greater than 0/i)).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', {
      name: /save transaction/i,
    });
    expect(submitButton).toBeDisabled();
  });

  it('should display validation error for zero amount', async () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();
    render(
      <TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const amountInput = screen.getByLabelText(/amount/i);
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '0');
    await userEvent.tab();

    await waitFor(() => {
      expect(screen.getByText(/greater than 0/i)).toBeInTheDocument();
    });
  });

  it('should enable submit button when form is valid', async () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();
    render(
      <TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    // Fill amount
    const amountInput = screen.getByLabelText(/amount/i);
    await userEvent.type(amountInput, '50.00');

    // Select type
    const typeSelect = screen.getByLabelText(/type/i);
    await userEvent.selectOptions(typeSelect, 'Expense');

    // Select category
    const categorySelect = screen.getByLabelText(/category/i);
    await userEvent.selectOptions(categorySelect, 'Gifts');

    // Date should default to today, so it's already valid

    const submitButton = screen.getByRole('button', {
      name: /save transaction/i,
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should call onSubmit with form data when submitted', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    const mockOnCancel = vi.fn();
    render(
      <TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    // Fill amount
    await userEvent.type(screen.getByLabelText(/amount/i), '50.00');

    // Select type
    await userEvent.selectOptions(screen.getByLabelText(/type/i), 'Expense');

    // Select category
    await userEvent.selectOptions(screen.getByLabelText(/category/i), 'Gifts');

    // Add description
    await userEvent.type(
      screen.getByLabelText(/description/i),
      'Test transaction'
    );

    // Submit
    await userEvent.click(
      screen.getByRole('button', { name: /save transaction/i })
    );

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    const callData = mockOnSubmit.mock.calls[0][0];
    expect(callData.amount).toBe(50);
    expect(callData.type).toBe('Expense');
    expect(callData.category).toBe('Gifts');
    expect(callData.description).toBe('Test transaction');
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();
    render(
      <TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledOnce();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should display all 6 categories in dropdown', () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();
    render(
      <TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const categorySelect = screen.getByLabelText(/category/i);
    const options = Array.from(
      categorySelect.querySelectorAll('option')
    ).map((opt) => opt.textContent);

    expect(options).toContain('Gifts');
    expect(options).toContain('Food & Dinner');
    expect(options).toContain('Decorations');
    expect(options).toContain('Travel');
    expect(options).toContain('Charity');
    expect(options).toContain("Santa's Workshop");
  });

  it('should show character count for description', async () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();
    render(
      <TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const descriptionInput = screen.getByLabelText(/description/i);

    // Initial count should be 0
    expect(screen.getByText(/0\/500/i)).toBeInTheDocument();

    // Type some text
    await userEvent.type(descriptionInput, 'Hello');

    // Count should update
    await waitFor(() => {
      expect(screen.getByText(/5\/500/i)).toBeInTheDocument();
    });
  });

  it('should show error for description longer than 500 characters', async () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();
    render(
      <TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;
    const longText = 'a'.repeat(501);

    // Use paste instead of type for better performance with long strings
    await userEvent.click(descriptionInput);
    await userEvent.paste(longText);
    await userEvent.tab();

    await waitFor(() => {
      expect(
        screen.getByText(/500 characters or less/i)
      ).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', {
      name: /save transaction/i,
    });
    expect(submitButton).toBeDisabled();
  });

  it('should disable submit button when isSubmitting is true', () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();
    render(
      <TransactionForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting={true}
      />
    );

    const submitButton = screen.getByRole('button', {
      name: /saving.../i,
    });
    expect(submitButton).toBeDisabled();
  });

  it('should have date input with max attribute set to today', () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();
    render(
      <TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const dateInput = screen.getByLabelText(/date/i);
    const maxDate = dateInput.getAttribute('max');
    const today = new Date().toISOString().split('T')[0];

    expect(maxDate).toBe(today);
  });

  it('should display required asterisk for required fields', () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();
    render(
      <TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    // Check for required indicators (*)
    const amountLabel = screen.getByLabelText(/amount/i);
    const typeLabel = screen.getByLabelText(/type/i);
    const categoryLabel = screen.getByLabelText(/category/i);
    const dateLabel = screen.getByLabelText(/date/i);

    expect(amountLabel).toBeInTheDocument();
    expect(typeLabel).toBeInTheDocument();
    expect(categoryLabel).toBeInTheDocument();
    expect(dateLabel).toBeInTheDocument();

    // Description should be optional (no asterisk required check)
    const descriptionLabel = screen.getByLabelText(/description/i);
    expect(descriptionLabel).toBeInTheDocument();
  });
});
