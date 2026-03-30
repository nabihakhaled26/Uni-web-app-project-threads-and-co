import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { getSession } from "../middleware/P2897972session.js";
import { authRoutes } from "./P2897972authRoutes.js";

const ORIGIN = "http://127.0.0.1:5500";

function withCORS(res) {
  res.headers.set("Access-Control-Allow-Origin", ORIGIN);
  res.headers.set("Access-Control-Allow-Headers", "*");
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  return res;
}

function getContentType(path) {
  if (path.endsWith(".html")) return "text/html";
  if (path.endsWith(".js")) return "application/javascript";
  if (path.endsWith(".css")) return "text/css";
  return "application/octet-stream";
}

serve(async (req) => {
  const url = new URL(req.url);
  const pathname = url.pathname.toLowerCase();

  // CORS preflight
  if (req.method === "OPTIONS") {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": ORIGIN,
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

  // Auth routes
  const response = await authRoutes(req);
  if (response) return withCORS(response);

  // Protected routes
  if (pathname.includes("checkout") || pathname.includes("wishlist")) {
    const session = getSession(req);
    if (!session) {
      return withCORS(new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      }));
    }
  }

  // Static files
  let path = url.pathname;
  if (path === "/") path = "/P2897972home.html";

  if (path.includes("..")) {
    return withCORS(new Response("Forbidden", { status: 403 }));
  }

  try {
    const file = await Deno.readFile(`.${path}`);
    return withCORS(new Response(file, {
      headers: { "Content-Type": getContentType(path) }
    }));
  } catch {
    return withCORS(new Response("404 Not Found", { status: 404 }));
  }
});