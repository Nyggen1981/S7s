export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('nb-NO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('nb-NO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

/**
 * Format a Date as YYYY-MM-DD in LOCAL time (not UTC)
 * This prevents timezone issues where toISOString() can shift the date
 * e.g. in Norway (UTC+1), Jan 5 at midnight = Jan 4 23:00 UTC
 */
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Get today's date as YYYY-MM-DD in local time
 */
export function getTodayLocalDate(): string {
  return formatLocalDate(new Date())
}

export const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const
export type TShirtSize = typeof TSHIRT_SIZES[number]

