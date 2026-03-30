import { db } from "./P2897972db.js";
import {
  register,
  login,
  resetPassword,
  checkAuth
} from "../controllers/P2897972authController.js";

export async function authRoutes(req) {
  const url = new URL(req.url);

  // REGISTER
  if (req.method === "POST" && url.pathname === "/register") {
    return register(req);
  }

  // LOGIN
  if (req.method === "POST" && url.pathname === "/login") {
    return login(req);
  }

  // RESET PASSWORD
  if (req.method === "POST" && url.pathname === "/reset") {
    return resetPassword(req);
  }

  // CHECK AUTH
  if (req.method === "GET" && url.pathname === "/check-auth") {
    return checkAuth(req);
  }

  // ✅ USERS (DEBUG ROUTE)
  if (req.method === "GET" && url.pathname === "/users") {
    console.log("USERS ROUTE HIT");

    const rows = [...db.query("SELECT id, firstname, lastname, email FROM users")];

    const users = rows.map(([id, firstname, lastname, email]) => ({
      id,
      firstname,
      lastname,
      email
    }));

    return new Response(JSON.stringify(users), {
      headers: { "Content-Type": "application/json" }
    });
  }

  return null;
}