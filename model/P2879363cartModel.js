import { db } from "./P2879363db.js";

export function getCartItems() {
  const rows = [...db.query(`
    SELECT c.product_id, c.quantity, p.id, p.name, p.price, p.image, p.category
    FROM cart c
    JOIN products p ON c.product_id = p.id
  `)];

  return rows.map(([product_id, quantity, id, name, price, image, category]) => ({
    product_id, quantity, id, name, price, image, category
  }));
}

export function addToCart(productId) {
  const existing = [...db.query(
    `SELECT quantity FROM cart WHERE product_id = ?`,
    [productId]
  )];

  if (existing.length > 0) {
    db.query(
      `UPDATE cart SET quantity = quantity + 1 WHERE product_id = ?`,
      [productId]
    );
  } else {
    db.query(
      `INSERT INTO cart (product_id, quantity) VALUES (?, 1)`,
      [productId]
    );
  }
}

export function increaseCartItem(productId) {
  db.query(`UPDATE cart SET quantity = quantity + 1 WHERE product_id = ?`, [productId]);
}

export function decreaseCartItem(productId) {
  const existing = [...db.query(
    `SELECT quantity FROM cart WHERE product_id = ?`,
    [productId]
  )];

  if (existing.length === 0) return;

  const quantity = existing[0][0];

  if (quantity <= 1) {
    db.query(`DELETE FROM cart WHERE product_id = ?`, [productId]);
  } else {
    db.query(`UPDATE cart SET quantity = quantity - 1 WHERE product_id = ?`, [productId]);
  }
}

export function removeFromCart(productId) {
  db.query(`DELETE FROM cart WHERE product_id = ?`, [productId]);
}

export function clearCart() {
  db.query(`DELETE FROM cart`);
}

export function calculateCartTotals() {
  const items = getCartItems();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = items.length > 0 ? 20 : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  return { items, subtotal, shipping, tax, total };
}