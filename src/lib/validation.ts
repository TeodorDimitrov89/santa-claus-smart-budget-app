import { z } from 'zod';

/**
 * Transaction validation schema
 * [FR-001: Create transaction with validation]
 * [Source: _bmad-output/epics/epic-2-transaction-management.md#Story 2.1]
 */
export const transactionSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Amount is required' })
    .positive('Amount must be greater than 0')
    .finite('Amount must be a valid number'),

  type: z.enum(['Income', 'Expense'], {
    errorMap: () => ({ message: 'Must select Income or Expense' }),
  }),

  category: z.enum(
    [
      'Gifts',
      'Food & Dinner',
      'Decorations',
      'Travel',
      'Charity',
      "Santa's Workshop",
    ],
    {
      errorMap: () => ({ message: 'Must select a category' }),
    }
  ),

  date: z
    .date({ invalid_type_error: 'Date is required' })
    .refine(
      (date) => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return date <= today;
      },
      { message: 'Date cannot be in the future' }
    ),

  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .default(''),
});

/**
 * Inferred TypeScript type from Zod schema
 * Use this for form submission handling
 */
export type TransactionInput = z.infer<typeof transactionSchema>;
