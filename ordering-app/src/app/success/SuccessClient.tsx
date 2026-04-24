"use client";

import { useEffect } from "react";
import { useCart } from "@/hooks/useCart";

export function SuccessClient() {
  const { clearCart } = useCart();
  
  useEffect(() => {
    // Clear the cart when the user successfully lands on the success page
    clearCart();
  }, [clearCart]);

  return null; // This component just runs logic
}
