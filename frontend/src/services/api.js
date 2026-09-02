const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8082';
const BASE_URL = `${API_URL}/api`;

export async function get(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  return res.json();
}

export async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function put(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function del(path) {
  await fetch(`${BASE_URL}${path}`, { method: 'DELETE' });
}
