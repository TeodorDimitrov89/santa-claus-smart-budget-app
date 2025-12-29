import { describe, it, expect } from 'vitest';
import { getBalanceStatus } from './budget-status';

describe('getBalanceStatus', () => {
  it('should return "positive" when balance > 0', () => {
    expect(getBalanceStatus(100)).toBe('positive');
    expect(getBalanceStatus(0.01)).toBe('positive');
    expect(getBalanceStatus(10000)).toBe('positive');
  });

  it('should return "negative" when balance < 0', () => {
    expect(getBalanceStatus(-50)).toBe('negative');
    expect(getBalanceStatus(-0.01)).toBe('negative');
    expect(getBalanceStatus(-10000)).toBe('negative');
  });

  it('should return "zero" when balance === 0', () => {
    expect(getBalanceStatus(0)).toBe('zero');
  });
});
