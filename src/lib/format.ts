/**
 * Formats a number as currency with 2 decimal places
 * Uses Intl.NumberFormat for locale-aware formatting
 * @param amount - The number to format
 * @param locale - Optional locale string (defaults to 'en-US')
 * @param currency - Optional currency code (defaults to 'USD')
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export const formatCurrency = (
  amount: number,
  locale: string = 'en-US',
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
