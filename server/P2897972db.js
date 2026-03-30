import { DB } from "https://deno.land/x/sqlite/mod.ts";

export const db = new DB("P2897972threads.db");

//this creates table 
db.execute(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstname TEXT,
  lastname TEXT,
  email TEXT UNIQUE,
  password TEXT
)
`);