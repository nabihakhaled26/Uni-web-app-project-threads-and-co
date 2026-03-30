const csrfTokens = new Map();

export function generateCSRF(sessionId) {
  const token = crypto.randomUUID();
  csrfTokens.set(sessionId, token);
  return token;
}

export function verifyCSRF(sessionId, token) {
  return csrfTokens.get(sessionId) === token;
}