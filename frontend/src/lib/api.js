const API_URL = process.env.REACT_APP_BACKEND_URL;

export async function api(path, options = {}) {
  const response = await fetch(`${API_URL}/api${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong.");
  }
  return data;
}

