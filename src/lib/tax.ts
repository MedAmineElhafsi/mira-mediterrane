import { TAX } from "./constants";

interface TaxableItem {
  priceCents: number;
  quantity: number;
  isBeverage: boolean;
}

/**
 * Calculate tax for a single item
 * German VAT: 7% for takeaway food, 19% for beverages
 */
export function calculateItemTax(item: TaxableItem): number {
  const rate = item.isBeverage ? TAX.beverageRate : TAX.foodRate;
  const totalPrice = item.priceCents * item.quantity;
  // Price is gross (includes tax), calculate tax portion
  // tax = gross - (gross / (1 + rate))
  return Math.round(totalPrice - totalPrice / (1 + rate));
}

/**
 * Calculate total tax for an array of items
 */
export function calculateTotalTax(items: TaxableItem[]): number {
  return items.reduce((sum, item) => sum + calculateItemTax(item), 0);
}

/**
 * Calculate net price (without tax) for a single item
 */
export function calculateNetPrice(grossCents: number, isBeverage: boolean): number {
  const rate = isBeverage ? TAX.beverageRate : TAX.foodRate;
  return Math.round(grossCents / (1 + rate));
}

/**
 * Format tax breakdown for display
 */
export function getTaxBreakdown(items: TaxableItem[]): {
  foodTax: number;
  beverageTax: number;
  totalTax: number;
} {
  const foodItems = items.filter(i => !i.isBeverage);
  const beverageItems = items.filter(i => i.isBeverage);

  const foodTax = calculateTotalTax(foodItems);
  const beverageTax = calculateTotalTax(beverageItems);

  return {
    foodTax,
    beverageTax,
    totalTax: foodTax + beverageTax,
  };
}
