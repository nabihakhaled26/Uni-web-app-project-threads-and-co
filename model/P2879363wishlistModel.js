import { db } from "./P2879363db.js";

export function getWishlistItems() {
  const rows = [...db.query(`
    SELECT w.product_id, p.id, p.name, p.price, p.image, p.category
    FROM wishlist w
    JOIN products p ON w.product_id = p.id
  `)];

  return rows.map(([product_id, id, name, price, image, category]) => ({
    product_id, id, name, price, image, category
  }));
}

export function addToWishlist(productId) {
  db.query(`INSERT OR IGNORE INTO wishlist (product_id) VALUES (?)`, [productId]);
}

export function removeFromWishlist(productId) {
  db.query(`DELETE FROM wishlist WHERE product_id = ?`, [productId]);
}