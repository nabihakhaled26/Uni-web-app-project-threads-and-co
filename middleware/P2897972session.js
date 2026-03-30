const sessions = new Map();

// this fucntion will generate random session ID
function generateSessionId() {
  return crypto.randomUUID();
}

// function to create session
export function createSession(email) {
  const sessionId = generateSessionId();
  sessions.set(sessionId, { email, sessionId });
  return sessionId;
}

// function to get session
export function getSession(req) {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;

  const match = cookie.match(/session=([^;]+)/);
  if (!match) return null;

  return sessions.get(match[1]);
}

// this is to destroy session
export function destroySession(req) {
  const cookie = req.headers.get("cookie");
  if (!cookie) return;

  const match = cookie.match(/session=([^;]+)/);
  if (match) sessions.delete(match[1]);
}