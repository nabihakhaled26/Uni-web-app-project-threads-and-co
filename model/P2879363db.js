import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("./database/P2879363store.db");

db.query(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL
  )
`);

db.query(`
  CREATE TABLE IF NOT EXISTS wishlist (
    product_id INTEGER PRIMARY KEY
  )
`);

db.query(`
  CREATE TABLE IF NOT EXISTS cart (
    product_id INTEGER PRIMARY KEY,
    quantity INTEGER NOT NULL DEFAULT 1
  )
`);

export { db };