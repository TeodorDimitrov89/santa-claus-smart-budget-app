import type { Category } from '../types';
import {
  Gift,
  UtensilsCrossed,
  Sparkles,
  Plane,
  Heart,
  Hammer,
} from 'lucide-react';

/**
 * Predefined transaction categories (immutable)
 * [FR-005: 6 predefined, immutable categories]
 * [Source: _bmad-output/epics/epic-2-transaction-management.md#Story 2.5]
 */
export const CATEGORIES = [
  {
    name: 'Gifts' as Category,
    description: "Budget allocated for children's presents",
    icon: Gift,
    color: 'christmas-red' as const,
  },
  {
    name: 'Food & Dinner' as Category,
    description: 'Meals for elves, reindeer feed, holiday feasts',
    icon: UtensilsCrossed,
    color: 'christmas-green' as const,
  },
  {
    name: 'Decorations' as Category,
    description: 'North Pole decorations, workshop festive setup',
    icon: Sparkles,
    color: 'christmas-gold' as const,
  },
  {
    name: 'Travel' as Category,
    description: 'Sleigh maintenance, reindeer transportation costs',
    icon: Plane,
    color: 'christmas-red' as const,
  },
  {
    name: 'Charity' as Category,
    description: 'Community giving, support for those in need',
    icon: Heart,
    color: 'christmas-green' as const,
  },
  {
    name: "Santa's Workshop" as Category,
    description: 'Workshop operations, tools, elf salaries, maintenance',
    icon: Hammer,
    color: 'christmas-gold' as const,
  },
] as const;

/**
 * Maximum description length for transactions
 * [FR-001: Description max 500 characters]
 */
export const MAX_DESCRIPTION_LENGTH = 500;

/**
 * Helper to get category metadata
 */
export const getCategoryInfo = (categoryName: Category) => {
  return CATEGORIES.find((cat) => cat.name === categoryName);
};
