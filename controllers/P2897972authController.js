import { 
  createUser,
  findUserByEmail,
  updateUserPassword
} from "../model/P2897972userModel.js";

import {
  createSession,
  getSession
} from "../middleware/P2897972session.js";

import {
  generateCSRF,
  verifyCSRF
} from "../middleware/P2897972csrf.js";


function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders
    }
  });
}


async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}



export async function register(req) {
  try {
    const body = await req.json();
    const { firstname, lastname, email, password } = body;

    if (!firstname || !lastname || !email || !password) {
      return json({ error: "All fields required" }, 400);
    }

    if (password.length < 8) {
      return json({ error: "Password must be 8+ chars" }, 400);
    }

    const hashed = await hashPassword(password);

    const success = createUser(firstname, lastname, email, hashed);

    if (!success) {
      return json({ error: "User already exists" }, 400);
    }

    
    const sessionId = createSession(email);
    const csrfToken = generateCSRF(sessionId);

    return json(
      { message: "Registered", csrfToken },
      201,
      {
        
        "Set-Cookie": `session=${sessionId}; HttpOnly; Path=/; SameSite=None; Secure`
      }
    );

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return json({ error: "Register failed" }, 500);
  }
}


export async function login(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return json({ error: "Missing credentials" }, 400);
    }

    const user = findUserByEmail(email);
    if (!user) {
      return json({ error: "Invalid credentials" }, 401);
    }

    const hashed = await hashPassword(password);

    if (hashed !== user[4]) {
      return json({ error: "Invalid credentials" }, 401);
    }

   
    const sessionId = createSession(email);
    const csrfToken = generateCSRF(sessionId);

    return json(
      { message: "Login success", csrfToken },
      200,
      {
        
        "Set-Cookie": `session=${sessionId}; HttpOnly; Path=/; SameSite=None; Secure`
      }
    );

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return json({ error: "Login failed" }, 500);
  }
}


export function checkAuth(req) {
  const session = getSession(req);

  if (!session) {
    return json({ error: "Unauthorized" }, 401);
  }

  return json({
    message: "Authenticated",
    email: session.email
  });
}



export async function resetPassword(req) {
  try {
    const session = getSession(req);
    if (!session) {
      return json({ error: "Unauthorized" }, 401);
    }

    const body = await req.json();
    const { newPassword } = body;

    if (!newPassword || newPassword.length < 8) {
      return json({ error: "Password must be 8+ chars" }, 400);
    }

    const csrfToken = req.headers.get("x-csrf-token");

    if (!verifyCSRF(session.sessionId, csrfToken)) {
      return json({ error: "Invalid CSRF" }, 403);
    }

    const hashed = await hashPassword(newPassword);
    const success = updateUserPassword(session.email, hashed);

    if (!success) {
      return json({ error: "Update failed" }, 500);
    }

    return json({
      message: "Password updated",
      redirect: "/P2897972reset-confirmation.html"
    });

  } catch (err) {
    console.error("RESET ERROR:", err);
    return json({ error: "Reset failed" }, 500);
  }
}