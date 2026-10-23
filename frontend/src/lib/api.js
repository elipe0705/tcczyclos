// Cliente da API REST do ZYCLOS (Spring Boot). A URL base vem de VITE_API_URL (arquivo .env).
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";
// Token JWT recebido no login. "Lembrar de mim" guarda no localStorage; senão, só na aba (sessionStorage)
const TOKEN_KEY = "zyclos.token";
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}
export function saveToken(token, remember = false) {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    if (token) (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
  } catch {
    // navegação privada: o token vale só enquanto a página estiver aberta
  }
}
// Chamado quando a API recusa o token (expirado ou inválido): o AppProvider faz o logout
let onUnauthorized = () => {};
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}
async function request(path, { method = "GET", body } = {}) {
  const token = getToken();
  const headers = {
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // status 0: a API não respondeu (back-end desligado ou CORS)
    throw new ApiError("Não foi possível conectar ao servidor do ZYCLOS.", 0);
  }
  const data = await response.json().catch(() => null);
  // 401 com token = sessão expirada/inválida. Sem token (ex.: senha errada no login) é só um erro normal
  if (response.status === 401 && token) onUnauthorized();
  if (!response.ok) {
    throw new ApiError(
      data?.message ?? `Erro ${response.status} ao acessar ${API_URL}${path}. A API está rodando?`,
      response.status,
    );
  }
  return data;
}
export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  delete: (path) => request(path, { method: "DELETE" }),
};
