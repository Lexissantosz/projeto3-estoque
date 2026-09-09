const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8082';
const BASE_URL = `${API_URL}/api`;

async function tratarResposta(res) {
  if (!res.ok) {
    let mensagem = `Erro ${res.status}`;

    try {
      const dados = await res.json();
      mensagem = dados.message || dados.error || mensagem;
    } catch {
      // Mantem a mensagem padrao quando a resposta nao for JSON.
    }

    throw new Error(mensagem);
  }

  if (res.status === 204) return null;

  const texto = await res.text();
  if (!texto) return null;

  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}

export async function get(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  return tratarResposta(res);
}

export async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return tratarResposta(res);
}

export async function put(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return tratarResposta(res);
}

export async function del(path) {
  const res = await fetch(`${BASE_URL}${path}`, { method: 'DELETE' });
  return tratarResposta(res);
}
