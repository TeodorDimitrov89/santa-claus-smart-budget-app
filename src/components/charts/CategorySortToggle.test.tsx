import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CategorySortToggle } from './CategorySortToggle';

describe('CategorySortToggle', () => {
  it('should render with original order selected by default', () => {
    const onChange = vi.fn();
    render(<CategorySortToggle sortByAmount={false} onChange={onChange} />);

    const originalButton = screen.getByRole('radio', { name: /original order/i });
    const amountButton = screen.getByRole('radio', { name: /by amount/i });

    expect(originalButton).toHaveAttribute('aria-checked', 'true');
    expect(amountButton).toHaveAttribute('aria-checked', 'false');
  });

  it('should render with sort by amount selected', () => {
    const onChange = vi.fn();
    render(<CategorySortToggle sortByAmount={true} onChange={onChange} />);

    const originalButton = screen.getByRole('radio', { name: /original order/i });
    const amountButton = screen.getByRole('radio', { name: /by amount/i });

    expect(originalButton).toHaveAttribute('aria-checked', 'false');
    expect(amountButton).toHaveAttribute('aria-checked', 'true');
  });

  it('should call onChange with true when By Amount clicked', () => {
    const onChange = vi.fn();
    render(<CategorySortToggle sortByAmount={false} onChange={onChange} />);

    const amountButton = screen.getByRole('radio', { name: /by amount/i });
    fireEvent.click(amountButton);

    expect(onChange).toHaveBeenCalledWith(true);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should call onChange with false when Original Order clicked', () => {
    const onChange = vi.fn();
    render(<CategorySortToggle sortByAmount={true} onChange={onChange} />);

    const originalButton = screen.getByRole('radio', { name: /original order/i });
    fireEvent.click(originalButton);

    expect(onChange).toHaveBeenCalledWith(false);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should have radiogroup role with proper aria-label', () => {
    const onChange = vi.fn();
    const { container } = render(<CategorySortToggle sortByAmount={false} onChange={onChange} />);

    const radiogroup = container.querySelector('[role="radiogroup"]');
    expect(radiogroup).toBeInTheDocument();
    expect(radiogroup).toHaveAttribute('aria-label', 'Category sort order');
  });

  it('should support keyboard navigation with arrow keys', () => {
    const onChange = vi.fn();
    render(<CategorySortToggle sortByAmount={false} onChange={onChange} />);

    const originalButton = screen.getByRole('radio', { name: /original order/i });

    // Arrow Right should switch to sort by amount
    fireEvent.keyDown(originalButton, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(true);

    // Arrow Down should also switch to sort by amount
    onChange.mockClear();
    fireEvent.keyDown(originalButton, { key: 'ArrowDown' });
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('should support keyboard navigation from amount to original', () => {
    const onChange = vi.fn();
    render(<CategorySortToggle sortByAmount={true} onChange={onChange} />);

    const amountButton = screen.getByRole('radio', { name: /by amount/i });

    // Arrow Left should switch to original order
    fireEvent.keyDown(amountButton, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenCalledWith(false);

    // Arrow Up should also switch to original order
    onChange.mockClear();
    fireEvent.keyDown(amountButton, { key: 'ArrowUp' });
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('should render festive icons with aria-hidden', () => {
    const onChange = vi.fn();
    const { container } = render(<CategorySortToggle sortByAmount={false} onChange={onChange} />);

    // Icons should be present but hidden from screen readers
    const icons = container.querySelectorAll('[aria-hidden="true"]');
    expect(icons.length).toBe(2); // ArrowUpDown and ArrowDownAZ
  });
});
