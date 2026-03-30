import { db } from "../server/P2897972db.js";

export function createUser(firstname, lastname, email, password) {
  try {
    db.query(
      "INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)",
      [firstname, lastname, email, password]
    );
    return true;
  } catch (e) {
    console.error("DB INSERT ERROR:", e);
    return false;
  }
}

export function findUserByEmail(email) {
  const result = [...db.query("SELECT * FROM users WHERE email = ?", [email])];
  return result[0] || null;
}

export function updateUserPassword(email, password) {
  try {
    db.query("UPDATE users SET password = ? WHERE email = ?", [password, email]);
    return true;
  } catch (e) {
    console.error("DB UPDATE ERROR:", e);
    return false;
  }
}