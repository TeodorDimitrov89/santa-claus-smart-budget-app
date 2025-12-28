/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ok, err } from './result';
import type { Result } from './result';

describe('Result type', () => {
  describe('ok()', () => {
    it('should create a success result', () => {
      const result = ok(42);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(42);
      }
    });

    it('should create a success result with string value', () => {
      const result = ok('success');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe('success');
      }
    });

    it('should create a success result with object value', () => {
      const data = { id: 1, name: 'Santa' };
      const result = ok(data);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual(data);
      }
    });
  });

  describe('err()', () => {
    it('should create an error result', () => {
      const error = new Error('Test error');
      const result = err(error);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe(error);
      }
    });

    it('should create an error result with custom error type', () => {
      const customError = { code: 404, message: 'Not found' };
      const result = err(customError);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toEqual(customError);
      }
    });
  });

  describe('Type discrimination', () => {
    it('should allow type-safe handling of success case', () => {
      const result: Result<number, Error> = ok(100);

      if (result.ok) {
        // TypeScript should know result.value exists here
        const value: number = result.value;
        expect(value).toBe(100);
      }
    });

    it('should allow type-safe handling of error case', () => {
      const result: Result<number, Error> = err(new Error('Failed'));

      if (!result.ok) {
        // TypeScript should know result.error exists here
        const error: Error = result.error;
        expect(error.message).toBe('Failed');
      }
    });
  });
});
