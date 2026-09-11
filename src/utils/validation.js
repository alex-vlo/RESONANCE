const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value) {
  return typeof value === "string" && EMAIL_RE.test(value.trim().toLowerCase());
}

export function normalizeEmail(value) {
  return String(value).trim().toLowerCase();
}

export function requireFields(body, fields) {
  const missing = fields.filter((field) => {
    const value = body?.[field];
    return value === undefined || value === null || String(value).trim() === "";
  });
  return missing;
}

export function sanitizeUser(user) {
  if (!user) return null;
  const { password_hash, ...safe } = user;
  return safe;
}
