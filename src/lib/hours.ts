import { OPENING_HOURS, LAST_ORDER_CUTOFF_MINUTES } from "./constants";

/**
 * Check if the restaurant is currently open for orders
 * Takes into account the 30-minute cutoff before closing
 */
export function isOpenForOrders(date: Date = new Date()): boolean {
  const day = date.getDay();
  const hours = OPENING_HOURS[day];

  if (!hours) return false;

  const [openH, openM, closeH, closeM] = hours;
  const currentMinutes = date.getHours() * 60 + date.getMinutes();
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM - LAST_ORDER_CUTOFF_MINUTES;

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

/**
 * Get today's opening hours as a formatted string
 */
export function getTodayHours(date: Date = new Date()): string {
  const day = date.getDay();
  const hours = OPENING_HOURS[day];

  if (!hours) return "Geschlossen";

  const [openH, openM, closeH, closeM] = hours;
  const formatTime = (h: number, m: number) =>
    `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;

  return `${formatTime(openH, openM)} – ${formatTime(closeH, closeM)} Uhr`;
}

/**
 * Get the next opening time
 */
export function getNextOpenTime(date: Date = new Date()): string {
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(date);
    checkDate.setDate(checkDate.getDate() + i);
    const day = checkDate.getDay();
    const hours = OPENING_HOURS[day];

    if (hours) {
      const [openH, openM] = hours;
      if (i === 0) {
        const currentMinutes = date.getHours() * 60 + date.getMinutes();
        const openMinutes = openH * 60 + openM;
        if (currentMinutes < openMinutes) {
          return `Heute ab ${openH}:${openM.toString().padStart(2, "0")} Uhr`;
        }
        continue;
      }
      const dayNames = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
      return `${dayNames[day]} ab ${openH}:${openM.toString().padStart(2, "0")} Uhr`;
    }
  }
  return "Bitte rufen Sie uns an";
}

/**
 * Get last order time for today
 */
export function getLastOrderTime(date: Date = new Date()): string | null {
  const day = date.getDay();
  const hours = OPENING_HOURS[day];

  if (!hours) return null;

  const [, , closeH, closeM] = hours;
  const lastOrderMinutes = closeH * 60 + closeM - LAST_ORDER_CUTOFF_MINUTES;
  const h = Math.floor(lastOrderMinutes / 60);
  const m = lastOrderMinutes % 60;

  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
