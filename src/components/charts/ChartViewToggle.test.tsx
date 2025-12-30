import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChartViewToggle } from './ChartViewToggle';

describe('ChartViewToggle', () => {
  it('should render with expense view selected by default', () => {
    const onChange = vi.fn();
    render(<ChartViewToggle view="expense" onChange={onChange} />);

    const expenseButton = screen.getByRole('radio', { name: /expenses/i });
    const incomeButton = screen.getByRole('radio', { name: /income/i });

    expect(expenseButton).toHaveAttribute('aria-checked', 'true');
    expect(incomeButton).toHaveAttribute('aria-checked', 'false');
  });

  it('should render with income view selected', () => {
    const onChange = vi.fn();
    render(<ChartViewToggle view="income" onChange={onChange} />);

    const expenseButton = screen.getByRole('radio', { name: /expenses/i });
    const incomeButton = screen.getByRole('radio', { name: /income/i });

    expect(expenseButton).toHaveAttribute('aria-checked', 'false');
    expect(incomeButton).toHaveAttribute('aria-checked', 'true');
  });

  it('should call onChange with income when income button clicked', () => {
    const onChange = vi.fn();
    render(<ChartViewToggle view="expense" onChange={onChange} />);

    const incomeButton = screen.getByRole('radio', { name: /income/i });
    fireEvent.click(incomeButton);

    expect(onChange).toHaveBeenCalledWith('income');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should call onChange with expense when expense button clicked', () => {
    const onChange = vi.fn();
    render(<ChartViewToggle view="income" onChange={onChange} />);

    const expenseButton = screen.getByRole('radio', { name: /expenses/i });
    fireEvent.click(expenseButton);

    expect(onChange).toHaveBeenCalledWith('expense');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should have radiogroup role with proper aria-label', () => {
    const onChange = vi.fn();
    const { container } = render(<ChartViewToggle view="expense" onChange={onChange} />);

    const radiogroup = container.querySelector('[role="radiogroup"]');
    expect(radiogroup).toBeInTheDocument();
    expect(radiogroup).toHaveAttribute('aria-label', 'Transaction type view');
  });

  it('should support keyboard navigation with arrow keys', () => {
    const onChange = vi.fn();
    render(<ChartViewToggle view="expense" onChange={onChange} />);

    const expenseButton = screen.getByRole('radio', { name: /expenses/i });

    // Arrow Right should switch to income
    fireEvent.keyDown(expenseButton, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith('income');

    // Arrow Down should also switch to income
    onChange.mockClear();
    fireEvent.keyDown(expenseButton, { key: 'ArrowDown' });
    expect(onChange).toHaveBeenCalledWith('income');
  });

  it('should support keyboard navigation from income to expense', () => {
    const onChange = vi.fn();
    render(<ChartViewToggle view="income" onChange={onChange} />);

    const incomeButton = screen.getByRole('radio', { name: /income/i });

    // Arrow Left should switch to expense
    fireEvent.keyDown(incomeButton, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenCalledWith('expense');

    // Arrow Up should also switch to expense
    onChange.mockClear();
    fireEvent.keyDown(incomeButton, { key: 'ArrowUp' });
    expect(onChange).toHaveBeenCalledWith('expense');
  });

  it('should render festive icons with aria-hidden', () => {
    const onChange = vi.fn();
    const { container } = render(<ChartViewToggle view="expense" onChange={onChange} />);

    // Icons should be present but hidden from screen readers
    const icons = container.querySelectorAll('[aria-hidden="true"]');
    expect(icons.length).toBe(2); // TrendingDown and TrendingUp
  });
});
