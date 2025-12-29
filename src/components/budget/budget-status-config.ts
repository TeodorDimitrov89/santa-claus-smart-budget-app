import { Sparkles, AlertTriangle, AlertCircle, type LucideIcon } from 'lucide-react';
import type { BalanceStatus } from '../../lib/budget-status';

/**
 * Status configuration for balance indicators
 */
export type StatusConfig = {
  bgColor: string; // Tailwind class
  textColor: string; // Tailwind class
  icon: LucideIcon;
  message: string;
};

/**
 * Visual configuration for each balance status
 * Maps balance status to festive colors, icons, and messages
 * [FR-007: Color-coded balance status indicators]
 */
export const STATUS_CONFIG: Record<BalanceStatus, StatusConfig> = {
  positive: {
    bgColor: 'bg-christmas-green/20',
    textColor: 'text-christmas-green-dark',
    icon: Sparkles,
    message: 'Ho ho ho! Budget is healthy!',
  },
  zero: {
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    icon: AlertTriangle,
    message: 'Budget is balanced, spend carefully!',
  },
  negative: {
    bgColor: 'bg-christmas-red/20',
    textColor: 'text-christmas-red-dark',
    icon: AlertCircle,
    message: '⚠️ Budget overspent! Review expenses.',
  },
};
