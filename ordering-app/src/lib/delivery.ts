import { RESTAURANT, DELIVERY } from "./constants";

/**
 * Calculate Haversine distance between two GPS coordinates in km
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Check if an address/coordinates are within delivery radius
 */
export function isWithinDeliveryRadius(lat: number, lng: number): boolean {
  const distance = haversineDistance(
    RESTAURANT.lat,
    RESTAURANT.lng,
    lat,
    lng
  );
  return distance <= DELIVERY.radiusKm;
}

/**
 * Get delivery fee in cents
 */
export function getDeliveryFeeCents(): number {
  return DELIVERY.flatFeeCents;
}

/**
 * Check if order meets minimum for delivery
 */
export function meetsMinimumOrder(subtotalCents: number): boolean {
  return subtotalCents >= DELIVERY.minimumOrderCents;
}

/**
 * Get estimated delivery time string
 */
export function getEstimatedDeliveryTime(): string {
  const minTotal = 20 + DELIVERY.estimatedMinutes; // 35 min
  const maxTotal = 30 + DELIVERY.estimatedMinutes; // 45 min
  return `${minTotal}–${maxTotal} Min.`;
}

/**
 * Get estimated pickup time string
 */
export function getEstimatedPickupTime(): string {
  return "20–30 Min.";
}
