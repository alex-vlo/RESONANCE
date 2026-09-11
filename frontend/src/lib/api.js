const API_URL = import.meta.env.VITE_API_URL || "";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) {
    throw new Error(payload.error || "No se pudo completar la solicitud");
  }
  return payload.data;
}

export const api = {
  login: (email, password) =>
    request("/api/auth/login", { method: "POST", body: { email, password } }),
  register: (full_name, email, password) =>
    request("/api/auth/register", {
      method: "POST",
      body: { full_name, email, password },
    }),
  me: (token) => request("/api/auth/me", { token }),
};
