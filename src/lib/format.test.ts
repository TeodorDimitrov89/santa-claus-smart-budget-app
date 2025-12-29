import { describe, it, expect } from 'vitest';
import { formatCurrency } from './format';

describe('formatCurrency', () => {
  it('should format positive numbers with 2 decimal places', () => {
    expect(formatCurrency(100)).toBe('$100.00');
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
    expect(formatCurrency(999999.99)).toBe('$999,999.99');
  });

  it('should format zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should format negative numbers with minus sign', () => {
    expect(formatCurrency(-100)).toBe('-$100.00');
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
  });

  it('should round to 2 decimal places', () => {
    expect(formatCurrency(123.456)).toBe('$123.46');
    expect(formatCurrency(123.454)).toBe('$123.45');
  });

  it('should handle very small amounts', () => {
    expect(formatCurrency(0.01)).toBe('$0.01');
    expect(formatCurrency(0.99)).toBe('$0.99');
  });

  it('should add thousands separators', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
    expect(formatCurrency(1000000)).toBe('$1,000,000.00');
  });

  it('should handle decimal-only inputs', () => {
    expect(formatCurrency(0.5)).toBe('$0.50');
    expect(formatCurrency(0.1 + 0.2)).toBe('$0.30'); // Floating point test
  });
});
