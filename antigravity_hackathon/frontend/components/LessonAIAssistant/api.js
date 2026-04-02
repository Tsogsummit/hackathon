const base = () => {
  const v = import.meta.env.VITE_API_BASE_URL ?? import.meta.env.REACT_APP_API_BASE_URL;
  if (v) return String(v).replace(/\/$/, "");
  return "/api";
};

export async function apiFetch(path, { method = "GET", body, headers = {}, token, signal } = {}) {
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
    const msg = typeof data === "object" && data?.detail ? JSON.stringify(data.detail) : text || res.statusText;
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return data;
}

export async function pollJob(jobId, token, { signal, intervalMs = 1500 } = {}) {
  const path = `/jobs/${jobId}/status`;
  for (;;) {
    if (signal?.aborted) throw new Error("Цуцлагдсан");
    const st = await apiFetch(path, { token, signal });
    if (st.status === "completed" || st.status === "failed") return st;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
}
