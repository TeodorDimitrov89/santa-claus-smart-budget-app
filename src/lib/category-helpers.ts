import { CATEGORIES } from './constants';
import type { Category } from '../types';
import type { LucideIcon } from 'lucide-react';

/**
 * Get category metadata by name
 * @param name - The category name
 * @returns Category data object or undefined if not found
 */
export const getCategoryByName = (name: Category) => {
  return CATEGORIES.find((c) => c.name === name);
};

/**
 * Get category color hex code
 * @param name - The category name
 * @returns Hex color code or black as fallback
 */
export const getCategoryColor = (name: Category): string => {
  const category = getCategoryByName(name);
  return category?.color || '#000000';
};

/**
 * Get category icon component
 * @param name - The category name
 * @returns Lucide icon component or null
 */
export const getCategoryIcon = (name: Category): LucideIcon | null => {
  const category = getCategoryByName(name);
  return category?.icon || null;
};

/**
 * Get category description
 * @param name - The category name
 * @returns Category description or empty string
 */
export const getCategoryDescription = (name: Category): string => {
  const category = getCategoryByName(name);
  return category?.description || '';
};

/**
 * Get all category names
 * @returns Array of all category names
 */
export const getAllCategoryNames = (): Category[] => {
  return CATEGORIES.map((c) => c.name) as Category[];
};

/**
 * Check if a string is a valid category name
 * @param name - The string to check
 * @returns True if name is a valid category
 */
export const isCategoryValid = (name: string): name is Category => {
  return CATEGORIES.some((c) => c.name === name);
};
