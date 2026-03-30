import { db } from "./P2879363db.js";

 const products = [
  // WOMEN
  { id: 1, name: "Classic White Blouse", price: 149, image: "/images/white-blouse.jpg", category: "women" },
  { id: 2, name: "Floral Midi Dress", price: 229, image: "/images/floral-midi-dress.jpg", category: "women" },
  { id: 3, name: "Satin Evening Dress", price: 279, image: "/images/satin-evening-dress.jpg", category: "women" },
  { id: 4, name: "Tailored Beige Blazer", price: 259, image: "/images/tailored-beige-blazer.jpg", category: "women" },
  { id: 5, name: "Soft Knit Cardigan", price: 189, image: "/images/soft-knit-cardigan.jpg", category: "women" },
  { id: 6, name: "Pleated Maxi Skirt", price: 169, image: "/images/pleated-maxi-skirt.jpg", category: "women" },
  { id: 7, name: "Minimal Black Top", price: 119, image: "/images/minimal-black-top.jpg", category: "women" },
  { id: 8, name: "Structured Midi Coat", price: 319, image: "/images/structured-midi-coat.jpg", category: "women" },
  { id: 9, name: "Relaxed Linen Dress", price: 239, image: "/images/relaxed-linen-dress.jpg", category: "women" },
  { id: 10, name: "Button Front Shirt Dress", price: 209, image: "/images/button-front-shirt-dress.jpg", category: "women" },

  // GIRL
  { id: 11, name: "Oversized Beige Hoodie", price: 199, image: "/images/oversized-beige-hoodie.jpg", category: "girl" },
  { id: 12, name: "Relaxed Fit T-Shirt", price: 99, image: "/images/relaxed-fit-tshirt.jpg", category: "girl" },
  { id: 13, name: "Cotton Everyday Sweatshirt", price: 139, image: "/images/cotton-everyday-sweatshirt.jpg", category: "girl" },
  { id: 14, name: "Light Wash Denim Jacket", price: 249, image: "/images/light-wash-denim-jacket.jpg", category: "girl" },
  { id: 15, name: "Straight Fit Jeans", price: 179, image: "/images/straight-fit-jeans.jpg", category: "girl" },
  { id: 16, name: "Casual White Tee", price: 89, image: "/images/casual-white-tee.jpg", category: "girl" },
  { id: 17, name: "Zip-Up Fleece Jacket", price: 219, image: "/images/zip-up-fleece-jacket.jpg", category: "girl" },
  { id: 18, name: "Neutral Ribbed Top", price: 109, image: "/images/neutral-ribbed-top.jpg", category: "girl" },
  { id: 19, name: "Soft Lounge Set", price: 189, image: "/images/soft-lounge-set.jpg", category: "girl" },
  { id: 20, name: "Weekend Knit Pullover", price: 159, image: "/images/weekend-knit-pullover.jpg", category: "girl" },

  // ACCESSORIES
  { id: 21, name: "Minimal Crossbody Bag", price: 189, image: "/images/minimal-cross-body-bag.jpg", category: "accessories" },
  { id: 22, name: "Leather Tote Bag", price: 239, image: "/images/leather-tote-bag.jpg", category: "accessories" },
  { id: 23, name: "Silk Neck Scarf", price: 79, image: "/images/silk-neck-scarf.jpg", category: "accessories" },
  { id: 24, name: "Everyday Sunglasses", price: 129, image: "/images/everyday-sunglasses.jpg", category: "accessories" },
  { id: 25, name: "Classic Wrist Watch", price: 219, image: "/images/classic-wrist-watch.jpg", category: "accessories" },
  { id: 26, name: "Structured Mini Bag", price: 199, image: "/images/structured-mini-bag.jpg", category: "accessories" },
  { id: 27, name: "Canvas Shoulder Bag", price: 149, image: "/images/canvas-shoulder-bag.jpg", category: "accessories" },
  { id: 28, name: "Layered Gold Necklace", price: 99, image: "/images/layered-gold-necklace.jpg", category: "accessories" },
  { id: 29, name: "Minimal Hoop Earrings", price: 69, image: "/images/minimal-hoop-earrings.jpg", category: "accessories" },
  { id: 30, name: "Soft Wool Beanie", price: 59, image: "/images/soft-wool-beanie.jpg", category: "accessories" }
];

export function seedProducts() {
  for (const product of products) {
    db.query(
      `INSERT OR IGNORE INTO products (id, name, price, image, category) VALUES (?, ?, ?, ?, ?)`,
      [product.id, product.name, product.price, product.image, product.category]
    );
  }
}

export function getAllProducts() {
  const rows = [...db.query(`SELECT id, name, price, image, category FROM products`)];
  return rows.map(([id, name, price, image, category]) => ({
    id, name, price, image, category
  }));
}

export function getProductsByCategory(category) {
  const rows = [...db.query(
    `SELECT id, name, price, image, category FROM products WHERE category = ?`,
    [category]
  )];

  return rows.map(([id, name, price, image, category]) => ({
    id, name, price, image, category
  }));
}

export function getProductById(productId) {
  const rows = [...db.query(
    `SELECT id, name, price, image, category FROM products WHERE id = ?`,
    [productId]
  )];

  if (rows.length === 0) return null;

  const [id, name, price, image, category] = rows[0];
  return { id, name, price, image, category };
}