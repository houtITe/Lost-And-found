const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const validationMessage = Object.values(payload.errors || {}).flat()[0];
    throw new Error(validationMessage || payload.message || "Request failed");
  }

  return payload;
}

export async function fetchCategories() {
  return request("/categories");
}

export async function fetchItems({ search = "", type = "all", page = 1 } = {}) {
  const params = new URLSearchParams({ page: String(page), per_page: "100" });
  if (search.trim()) params.set("search", search.trim());
  if (type !== "all") params.set("type", type);
  return request(`/items?${params.toString()}`);
}

export async function fetchItem(itemId) {
  return request(`/items/${itemId}`);
}

export async function createItem({ fields, files = [] }) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });
  files.forEach((file) => formData.append("images[]", file));

  return request("/items", {
    method: "POST",
    body: formData,
  });
}

export async function createComment(itemId, { name, message, files = [] }) {
  const formData = new FormData();
  if (name) formData.append("name", name);
  if (message) formData.append("message", message);
  files.forEach((file) => formData.append("images[]", file));

  return request(`/items/${itemId}/comments`, {
    method: "POST",
    body: formData,
  });
}

export async function createClaim(itemId, { claimantName, contact, proof, files = [] }) {
  const formData = new FormData();
  formData.append("claimant_name", claimantName);
  formData.append("contact", contact);
  formData.append("proof", proof);
  files.forEach((file) => formData.append("images[]", file));

  return request(`/items/${itemId}/claims`, {
    method: "POST",
    body: formData,
  });
}
