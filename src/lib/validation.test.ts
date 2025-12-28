import { describe, it, expect } from 'vitest';
import { transactionSchema } from './validation';

describe('transactionSchema', () => {
  it('should accept valid transaction data', () => {
    const validData = {
      amount: 50.0,
      type: 'Expense' as const,
      category: 'Gifts' as const,
      date: new Date(),
      description: 'Test transaction',
    };

    const result = transactionSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject negative amount', () => {
    const invalidData = {
      amount: -10,
      type: 'Expense' as const,
      category: 'Gifts' as const,
      date: new Date(),
      description: '',
    };

    const result = transactionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('greater than 0');
    }
  });

  it('should reject zero amount', () => {
    const invalidData = {
      amount: 0,
      type: 'Income' as const,
      category: 'Gifts' as const,
      date: new Date(),
    };

    const result = transactionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('greater than 0');
    }
  });

  it('should reject future date', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const invalidData = {
      amount: 50,
      type: 'Income' as const,
      category: 'Gifts' as const,
      date: futureDate,
      description: '',
    };

    const result = transactionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('cannot be in the future');
    }
  });

  it('should reject description longer than 500 characters', () => {
    const longDescription = 'a'.repeat(501);

    const invalidData = {
      amount: 50,
      type: 'Expense' as const,
      category: 'Gifts' as const,
      date: new Date(),
      description: longDescription,
    };

    const result = transactionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('500 characters or less');
    }
  });

  it('should accept description with exactly 500 characters', () => {
    const exactDescription = 'a'.repeat(500);

    const validData = {
      amount: 50,
      type: 'Income' as const,
      category: 'Charity' as const,
      date: new Date(),
      description: exactDescription,
    };

    const result = transactionSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should accept missing description (optional field)', () => {
    const validData = {
      amount: 100,
      type: 'Income' as const,
      category: 'Food & Dinner' as const,
      date: new Date(),
    };

    const result = transactionSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBe('');
    }
  });

  it('should reject invalid transaction type', () => {
    const invalidData = {
      amount: 50,
      type: 'InvalidType',
      category: 'Gifts' as const,
      date: new Date(),
    };

    const result = transactionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid category', () => {
    const invalidData = {
      amount: 50,
      type: 'Expense' as const,
      category: 'InvalidCategory',
      date: new Date(),
    };

    const result = transactionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should accept all valid categories', () => {
    const categories = [
      'Gifts',
      'Food & Dinner',
      'Decorations',
      'Travel',
      'Charity',
      "Santa's Workshop",
    ] as const;

    categories.forEach((category) => {
      const validData = {
        amount: 50,
        type: 'Expense' as const,
        category,
        date: new Date(),
      };

      const result = transactionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  it('should accept date from the past', () => {
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 1);

    const validData = {
      amount: 50,
      type: 'Income' as const,
      category: 'Decorations' as const,
      date: pastDate,
    };

    const result = transactionSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should accept current date (today)', () => {
    const validData = {
      amount: 75.5,
      type: 'Expense' as const,
      category: 'Travel' as const,
      date: new Date(),
    };

    const result = transactionSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});
