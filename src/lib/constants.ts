import type { Category } from '../types';
import {
  Gift,
  UtensilsCrossed,
  Sparkles,
  Plane,
  Heart,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

/**
 * Category metadata type
 */
export type CategoryData = {
  name: Category;
  description: string;
  icon: LucideIcon;
  color: string;
};

/**
 * Predefined transaction categories (immutable)
 * [FR-005: 6 predefined, immutable categories]
 * [Source: _bmad-output/epics/epic-2-transaction-management.md#Story 2.5]
 */
export const CATEGORIES: readonly CategoryData[] = [
  {
    name: 'Gifts',
    description: "Budget allocated for children's presents",
    icon: Gift,
    color: '#C41E3A', // Christmas red
  },
  {
    name: 'Food & Dinner',
    description: 'Meals for elves, reindeer feed, holiday feasts',
    icon: UtensilsCrossed,
    color: '#165B33', // Christmas green
  },
  {
    name: 'Decorations',
    description: 'North Pole decorations, workshop festive setup',
    icon: Sparkles,
    color: '#FFD700', // Gold
  },
  {
    name: 'Travel',
    description: 'Sleigh maintenance, reindeer transportation costs',
    icon: Plane,
    color: '#4169E1', // Royal blue
  },
  {
    name: 'Charity',
    description: 'Community giving, support for those in need',
    icon: Heart,
    color: '#FF69B4', // Hot pink
  },
  {
    name: "Santa's Workshop",
    description: 'Workshop operations, tools, elf salaries, maintenance',
    icon: Wrench,
    color: '#8B4513', // Saddle brown
  },
] as const;

/**
 * Maximum description length for transactions
 * [FR-001: Description max 500 characters]
 */
export const MAX_DESCRIPTION_LENGTH = 500;
