export interface CartItemType {
  id: string; // menuItemId or menuItemId-variantId
  menuItemId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  priceCents: number;
  quantity: number;
  specialInstructions?: string;
  imageUrl?: string;
  isBeverage: boolean;
}

export interface CartState {
  items: CartItemType[];
  itemCount: number;
  subtotalCents: number;
}
