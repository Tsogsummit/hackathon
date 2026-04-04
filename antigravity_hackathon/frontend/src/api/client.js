const base = () => {
  const v = import.meta.env.VITE_API_BASE_URL;
  if (v) return String(v).replace(/\/$/, "");
  return "/api";
};

export async function apiFetch(path, { method = "GET", body, token: tokenOpt, headers = {}, signal } = {}) {
  const token = tokenOpt ?? (typeof window !== "undefined" ? requireTokenFromStore() : null);
  const h = { ...headers };
  if (token) h.Authorization = `Bearer ${token}`;
  const opts = { method, headers: h, signal };
  if (body instanceof FormData) {
    opts.body = body;
  } else if (body != null) {
    h["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(`${base()}${path}`, opts);
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const detail = typeof data === "object" && data?.detail;
    const msg = Array.isArray(detail)
      ? detail.map((d) => d.msg || d).join(", ")
      : typeof detail === "string"
        ? detail
        : text || res.statusText;
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return data;
}

function requireTokenFromStore() {
  try {
    const raw = localStorage.getItem("stuto-auth");
    if (!raw) return null;
    const p = JSON.parse(raw);
    return p?.state?.token ?? null;
  } catch {
    return null;
  }
}
