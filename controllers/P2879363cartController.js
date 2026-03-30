import {
  addToCart,
  calculateCartTotals,
  increaseCartItem,
  decreaseCartItem,
  removeFromCart
} from "../model/P2879363cartModel.js";

export function showCart() {
  return calculateCartTotals();
}

export function handleAddToCart(productId) {
  addToCart(productId);
}

export function handleIncreaseCartItem(productId) {
  increaseCartItem(productId);
}

export function handleDecreaseCartItem(productId) {
  decreaseCartItem(productId);
}

export function handleRemoveFromCart(productId) {
  removeFromCart(productId);
}