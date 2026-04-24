"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { CartItemType, CartState } from "@/types/cart";

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItemType }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "UPDATE_INSTRUCTIONS"; payload: { id: string; specialInstructions: string } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItemType[] };

interface CartContextType extends CartState {
  addItem: (item: CartItemType) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateInstructions: (id: string, instructions: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "mira-cart";

function calculateTotals(items: CartItemType[]): CartState {
  return {
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotalCents: items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0),
  };
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      let newItems: CartItemType[];
      if (existingIndex >= 0) {
        newItems = state.items.map((item, i) =>
          i === existingIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }
      return calculateTotals(newItems);
    }
    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload.id);
      return calculateTotals(newItems);
    }
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        const newItems = state.items.filter((item) => item.id !== action.payload.id);
        return calculateTotals(newItems);
      }
      const newItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return calculateTotals(newItems);
    }
    case "UPDATE_INSTRUCTIONS": {
      const newItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, specialInstructions: action.payload.specialInstructions }
          : item
      );
      return calculateTotals(newItems);
    }
    case "CLEAR_CART":
      return calculateTotals([]);
    case "LOAD_CART":
      return calculateTotals(action.payload);
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, calculateTotals([]));

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const items = JSON.parse(saved) as CartItemType[];
        dispatch({ type: "LOAD_CART", payload: items });
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Ignore storage errors
    }
  }, [state.items]);

  const addItem = useCallback((item: CartItemType) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  }, []);

  const updateInstructions = useCallback((id: string, instructions: string) => {
    dispatch({ type: "UPDATE_INSTRUCTIONS", payload: { id, specialInstructions: instructions } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        updateInstructions,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
