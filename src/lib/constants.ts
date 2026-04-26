// Business rules constants for Mira Mediterrane Küche

export const RESTAURANT = {
  name: "Mira Mediterrane Küche",
  address: "Klobikauer Str. 64, 06217 Merseburg",
  phone: "+49 163 647 3331",
  lat: 51.3547,
  lng: 11.9926,
} as const;

export const DELIVERY = {
  radiusKm: 5,
  flatFeeCents: 250, // 2,50 €
  minimumOrderCents: 1000, // 10,00 €
  estimatedMinutes: 15, // on top of preparation
} as const;

export const PREPARATION = {
  minMinutes: 20,
  maxMinutes: 30,
} as const;

export const TAX = {
  foodRate: 0.07, // 7% for takeaway food
  beverageRate: 0.19, // 19% for beverages
} as const;

export const TIP_OPTIONS = [
  { label: "Kein Trinkgeld", value: 0 },
  { label: "5%", value: 0.05 },
  { label: "10%", value: 0.1 },
  { label: "15%", value: 0.15 },
] as const;

// Opening hours: [openHour, openMinute, closeHour, closeMinute]
// null means closed
export const OPENING_HOURS: Record<number, [number, number, number, number] | null> = {
  0: [12, 0, 22, 0], // Sonntag
  1: [11, 0, 22, 0], // Montag
  2: [11, 0, 22, 0], // Dienstag
  3: [11, 0, 22, 0], // Mittwoch
  4: [11, 0, 22, 0], // Donnerstag
  5: [11, 0, 23, 0], // Freitag
  6: [12, 0, 23, 0], // Samstag
};

export const LAST_ORDER_CUTOFF_MINUTES = 30;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Zahlung ausstehend",
  PAID: "Bezahlt",
  CONFIRMED: "Bestätigt",
  PREPARING: "In Zubereitung",
  READY: "Fertig",
  OUT_FOR_DELIVERY: "Unterwegs",
  DELIVERED: "Geliefert",
  COMPLETED: "Abgeschlossen",
  CANCELLED: "Storniert",
};

export const ORDER_STATUS_FLOW = [
  "PAID",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] as const;

export const ORDER_STATUS_FLOW_PICKUP = [
  "PAID",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "COMPLETED",
] as const;
