/**
 * Result Type - Functional error handling pattern
 *
 * A discriminated union for explicit error handling without exceptions.
 * Use this for expected errors (validation, not found, etc.)
 *
 * @example
 * ```typescript
 * function divide(a: number, b: number): Result<number, Error> {
 *   if (b === 0) return err(new Error('Division by zero'));
 *   return ok(a / b);
 * }
 *
 * const result = divide(10, 2);
 * if (result.ok) {
 *   console.log('Success:', result.value);
 * } else {
 *   console.error('Error:', result.error.message);
 * }
 * ```
 */
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

/**
 * Create a successful Result
 * @param value The success value
 * @returns A Result representing success
 */
export const ok = <T>(value: T): Result<T, never> => ({
  ok: true,
  value,
});

/**
 * Create an error Result
 * @param error The error value
 * @returns A Result representing failure
 */
export const err = <E = Error>(error: E): Result<never, E> => ({
  ok: false,
  error,
});
