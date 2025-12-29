/**
 * Balance status type for visual indicators
 */
export type BalanceStatus = 'positive' | 'zero' | 'negative';

/**
 * Determines balance status based on numeric value
 * [FR-007: Budget Balance Display with color-coded indicators]
 *
 * @param balance - Current budget balance
 * @returns Status indicator: 'positive' (>0), 'zero' (=0), or 'negative' (<0)
 */
export const getBalanceStatus = (balance: number): BalanceStatus => {
  if (balance > 0) return 'positive';
  if (balance < 0) return 'negative';
  return 'zero';
};
