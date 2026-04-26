/**
 * Format cents to Euro string: 1250 -> "12,50 €"
 */
export function formatPrice(cents: number | null | undefined): string {
  if (cents == null) return "Preis auf Anfrage";
  return `${(cents / 100).toFixed(2).replace(".", ",")} €`;
}

/**
 * Format a date to German locale string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Format a date and time to German locale string
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format a time to German locale string
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Generate a short order number from ID
 */
export function generateOrderNumber(id: string): string {
  return `#${id.slice(-6).toUpperCase()}`;
}
