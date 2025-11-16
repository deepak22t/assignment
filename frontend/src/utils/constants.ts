/**
 * Application constants
 */
import { QuickAction } from '../types';

export const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Cheapest Properties', query: 'Show me the cheapest properties' },
  { label: 'Under $500k', query: 'Show me properties under $500,000' },
  { label: '3BR in SF', query: '3 bedroom house in San Francisco' },
  { label: 'With Pool', query: 'Properties with pool and garage' },
  { label: 'Show All', query: 'Show all properties' },
];

export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 500,
  TYPING_INDICATOR_DELAY: 300,
} as const;

