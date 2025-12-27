/**
 * Natural language date parser utility
 *
 * Uses date-fns to parse natural language dates like
 * "tomorrow", "next week", "in 2 days", etc.
 *
 * Based on Context7 MCP patterns for date-fns.
 */

import { parse, add, startOfDay, isToday, isTomorrow, isThisWeek, format } from 'date-fns';
import type { TaskFilters } from '../stores/uiStore';

/**
 * Natural language date patterns
 */
const NATURAL_DATE_PATTERNS = {
  // Today patterns
  today: [
    /^today$/i,
    /^today\s+at\s+.*$/i,
  ],
  // Tomorrow patterns
  tomorrow: [
    /^tomorrow$/i,
    /^tomorrow\s+(morning|afternoon|evening)?$/i,
    /^tmrw$/i,
  ],
  // This week patterns
  thisWeek: [
    /^this\s+week$/i,
    /^this\s+week\s+(morning|afternoon|evening)?$/i,
  ],
  // Next week patterns
  nextWeek: [
    /^next\s+week$/i,
    /^next\s+week\s+(morning|afternoon|evening)?$/i,
  ],
  // In X days patterns
  inDays: [
    /^in\s+(\d+)\s+days?$/i,
    /^in\s+(\d+)\s+days?\s+(from\s+now)?$/i,
  ],
  // Weekday patterns (Monday, Tuesday, etc.)
  weekdays: [
    /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s+(morning|afternoon|evening)?$/i,
    /^(mon|tue|wed|thu|fri|sat|sun)\s+(morning|afternoon|evening)?$/i,
  ],
  // Weekend patterns
  weekend: [
    /^weekend$/i,
    /^this\s+weekend$/i,
    /^next\s+weekend$/i,
  ],
} as const;

/**
 * Get weekday index from name
 */
function getWeekdayIndex(name: string): number | null {
  const lower = name.toLowerCase();
  const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const shortDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  const index = weekdays.indexOf(lower);
  if (index !== -1) return index;

  const shortIndex = shortDays.indexOf(lower);
  if (shortIndex !== -1) return shortIndex;

  return null;
}

/**
 * Get next occurrence of a weekday
 */
function getNextWeekday(weekdayIndex: number, addWeeks: number = 0): Date {
  const now = new Date();
  const currentDay = now.getDay();
  const daysUntilTarget = (weekdayIndex + 7 - currentDay) % 7;

  const targetDate = add(now, { days: daysUntilTarget + (addWeeks * 7) });

  return startOfDay(targetDate);
}

/**
 * Parse natural language date string to ISO date string
 *
 * @param input - Natural language date like "tomorrow", "next week", "in 2 days"
 * @returns ISO date string or null if parsing fails
 */
export function parseNaturalDate(input: string): string | null {
  const trimmed = input.trim().toLowerCase();

  // Check for "today"
  if (NATURAL_DATE_PATTERNS.today.some((pattern) => pattern.test(trimmed))) {
    const today = startOfDay(new Date());
    return format(today, "yyyy-MM-dd'T'HH:mm:ss");
  }

  // Check for "tomorrow"
  if (NATURAL_DATE_PATTERNS.tomorrow.some((pattern) => pattern.test(trimmed))) {
    const tomorrow = add(new Date(), { days: 1 });
    return format(startOfDay(tomorrow), "yyyy-MM-dd'T'HH:mm:ss");
  }

  // Check for "in X days"
  const inDaysMatch = NATURAL_DATE_PATTERNS.inDays.find((pattern) => pattern.test(trimmed));
  if (inDaysMatch) {
    const match = trimmed.match(/^in\s+(\d+)\s+days?$/i);
    if (match) {
      const days = parseInt(match[1], 10);
      const futureDate = add(new Date(), { days });
      return format(startOfDay(futureDate), "yyyy-MM-dd'T'HH:mm:ss");
    }
  }

  // Check for "this week"
  if (NATURAL_DATE_PATTERNS.thisWeek.some((pattern) => pattern.test(trimmed))) {
    // Default to Monday of this week
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilMonday = (1 + 7 - dayOfWeek) % 7;
    const monday = add(now, { days: daysUntilMonday });
    return format(startOfDay(monday), "yyyy-MM-dd'T'HH:mm:ss");
  }

  // Check for "next week"
  if (NATURAL_DATE_PATTERNS.nextWeek.some((pattern) => pattern.test(trimmed))) {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilNextMonday = (1 + 7 - dayOfWeek) % 7 + 7;
    const nextMonday = add(now, { days: daysUntilNextMonday });
    return format(startOfDay(nextMonday), "yyyy-MM-dd'T'HH:mm:ss");
  }

  // Check for weekend
  if (NATURAL_DATE_PATTERNS.weekend.some((pattern) => pattern.test(trimmed))) {
    const now = new Date();
    const dayOfWeek = now.getDay();

    // If it's already Friday or Saturday, this weekend
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      // Friday -> Saturday
      const daysUntilSaturday = (6 + 7 - dayOfWeek) % 7;
      const saturday = add(now, { days: daysUntilSaturday });
      return format(startOfDay(saturday), "yyyy-MM-dd'T'HH:mm:ss");
    }
    // Otherwise, next weekend
    const daysUntilSaturday = (6 + 7 - dayOfWeek) % 7;
    const saturday = add(now, { days: daysUntilSaturday });
    return format(startOfDay(saturday), "yyyy-MM-dd'T'HH:mm:ss");
  }

  // Check for weekday names
  const weekdayMatch = NATURAL_DATE_PATTERNS.weekdays.find((pattern) => pattern.test(trimmed));
  if (weekdayMatch) {
    // Extract the weekday name
    const parts = trimmed.match(/^(monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun)/i);
    if (!parts) return null;

    const weekdayIndex = getWeekdayIndex(parts[1]);
    if (weekdayIndex === null) return null;

    // Check if "next [weekday]" or just "[weekday]"
    if (trimmed.startsWith('next ')) {
      return format(getNextWeekday(weekdayIndex, 1), "yyyy-MM-dd'T'HH:mm:ss");
    }
    return format(getNextWeekday(weekdayIndex), "yyyy-MM-dd'T'HH:mm:ss");
  }

  // Try standard date parsing as fallback
  try {
    const parsed = parse(trimmed, 'P', new Date());
    if (parsed && !isNaN(parsed.getTime())) {
      return format(parsed, "yyyy-MM-dd'T'HH:mm:ss");
    }
  } catch {
    // Ignore parsing errors
  }

  return null;
}

/**
 * Check if a date matches a deadline filter
 */
export function matchesDeadlineFilter(dateString: string | undefined, filter: TaskFilters['deadline']): boolean {
  if (!filter || !dateString) return true;

  const date = new Date(dateString);
  const now = new Date();

  if (filter === 'today') {
    return isToday(date);
  }

  if (filter === 'thisWeek') {
    return isThisWeek(date);
  }

  if (filter === 'later') {
    return !isToday(date) && !isThisWeek(date);
  }

  return true;
}

/**
 * Get a friendly label for deadline filter
 */
export function getDeadlineFilterLabel(filter?: TaskFilters['deadline']): string {
  switch (filter) {
    case 'today':
      return 'Today';
    case 'thisWeek':
      return 'This Week';
    case 'later':
      return 'Later';
    default:
      return 'All Time';
  }
}
