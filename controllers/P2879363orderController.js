import { clearCart } from "../model/P2879363cartModel.js";

export function placeOrder() {
  clearCart();
  return { success: true };
}