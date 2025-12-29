import { describe, it, expect } from 'vitest';
import {
  getCategoryByName,
  getCategoryColor,
  getCategoryIcon,
  getCategoryDescription,
  getAllCategoryNames,
  isCategoryValid,
} from './category-helpers';
import { CATEGORIES } from './constants';
import { Gift } from 'lucide-react';

describe('category-helpers', () => {
  describe('getCategoryByName', () => {
    it('should return correct category for valid name', () => {
      const result = getCategoryByName('Gifts');
      expect(result).toBeDefined();
      expect(result?.name).toBe('Gifts');
      expect(result?.description).toBe(
        "Budget allocated for children's presents"
      );
    });

    it('should return undefined for invalid category name', () => {
      const result = getCategoryByName('Invalid Category' as any);
      expect(result).toBeUndefined();
    });

    it('should return correct data for all 6 categories', () => {
      const categories = [
        'Gifts',
        'Food & Dinner',
        'Decorations',
        'Travel',
        'Charity',
        "Santa's Workshop",
      ] as const;

      categories.forEach((name) => {
        const result = getCategoryByName(name);
        expect(result).toBeDefined();
        expect(result?.name).toBe(name);
      });
    });
  });

  describe('getCategoryColor', () => {
    it('should return correct color hex for Gifts', () => {
      const color = getCategoryColor('Gifts');
      expect(color).toBe('#C41E3A'); // Christmas red
    });

    it('should return correct color hex for Food & Dinner', () => {
      const color = getCategoryColor('Food & Dinner');
      expect(color).toBe('#165B33'); // Christmas green
    });

    it('should return fallback color for invalid category', () => {
      const color = getCategoryColor('Invalid' as any);
      expect(color).toBe('#000000'); // Black fallback
    });

    it('should return hex colors for all categories', () => {
      const expectedColors = {
        Gifts: '#C41E3A',
        'Food & Dinner': '#165B33',
        Decorations: '#FFD700',
        Travel: '#4169E1',
        Charity: '#FF69B4',
        "Santa's Workshop": '#8B4513',
      };

      Object.entries(expectedColors).forEach(([category, expectedColor]) => {
        const color = getCategoryColor(category as any);
        expect(color).toBe(expectedColor);
      });
    });
  });

  describe('getCategoryIcon', () => {
    it('should return icon component for valid category', () => {
      const icon = getCategoryIcon('Gifts');
      expect(icon).toBeDefined();
      expect(icon).toBe(Gift);
    });

    it('should return null for invalid category', () => {
      const icon = getCategoryIcon('Invalid' as any);
      expect(icon).toBeNull();
    });

    it('should return icon for all 6 categories', () => {
      const categories = [
        'Gifts',
        'Food & Dinner',
        'Decorations',
        'Travel',
        'Charity',
        "Santa's Workshop",
      ] as const;

      categories.forEach((name) => {
        const icon = getCategoryIcon(name);
        expect(icon).toBeDefined();
        expect(icon).not.toBeNull();
      });
    });
  });

  describe('getCategoryDescription', () => {
    it('should return correct description for Gifts', () => {
      const description = getCategoryDescription('Gifts');
      expect(description).toBe("Budget allocated for children's presents");
    });

    it('should return empty string for invalid category', () => {
      const description = getCategoryDescription('Invalid' as any);
      expect(description).toBe('');
    });

    it('should return descriptions for all categories', () => {
      const categories = [
        'Gifts',
        'Food & Dinner',
        'Decorations',
        'Travel',
        'Charity',
        "Santa's Workshop",
      ] as const;

      categories.forEach((name) => {
        const description = getCategoryDescription(name);
        expect(description).toBeTruthy();
        expect(description.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getAllCategoryNames', () => {
    it('should return array of exactly 6 category names', () => {
      const names = getAllCategoryNames();
      expect(names).toHaveLength(6);
    });

    it('should return all expected category names', () => {
      const names = getAllCategoryNames();
      expect(names).toContain('Gifts');
      expect(names).toContain('Food & Dinner');
      expect(names).toContain('Decorations');
      expect(names).toContain('Travel');
      expect(names).toContain('Charity');
      expect(names).toContain("Santa's Workshop");
    });

    it('should match CATEGORIES constant length', () => {
      const names = getAllCategoryNames();
      expect(names.length).toBe(CATEGORIES.length);
    });
  });

  describe('isCategoryValid', () => {
    it('should return true for valid category names', () => {
      expect(isCategoryValid('Gifts')).toBe(true);
      expect(isCategoryValid('Food & Dinner')).toBe(true);
      expect(isCategoryValid('Decorations')).toBe(true);
      expect(isCategoryValid('Travel')).toBe(true);
      expect(isCategoryValid('Charity')).toBe(true);
      expect(isCategoryValid("Santa's Workshop")).toBe(true);
    });

    it('should return false for invalid category names', () => {
      expect(isCategoryValid('Invalid')).toBe(false);
      expect(isCategoryValid('gifts')).toBe(false); // Case sensitive
      expect(isCategoryValid('')).toBe(false);
      expect(isCategoryValid('Random Category')).toBe(false);
    });
  });

  describe('CATEGORIES constant validation', () => {
    it('should have exactly 6 categories', () => {
      expect(CATEGORIES).toHaveLength(6);
    });

    it('should have required properties for each category', () => {
      CATEGORIES.forEach((category) => {
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('description');
        expect(category).toHaveProperty('icon');
        expect(category).toHaveProperty('color');
      });
    });

    it('should have hex color codes for all categories', () => {
      CATEGORIES.forEach((category) => {
        expect(category.color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    it('should have non-empty descriptions for all categories', () => {
      CATEGORIES.forEach((category) => {
        expect(category.description.length).toBeGreaterThan(0);
      });
    });
  });
});
