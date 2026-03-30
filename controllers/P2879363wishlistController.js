import {
  getWishlistItems,
  addToWishlist,
  removeFromWishlist
} from "../model/P2879363wishlistModel.js";

export function showWishlist() {
  const wishlist = getWishlistItems();
  return { wishlist };
}

export function handleAddToWishlist(productId) {
  addToWishlist(productId);
}

export function handleRemoveFromWishlist(productId) {
  removeFromWishlist(productId);
}