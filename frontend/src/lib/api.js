// Cliente da API REST do ZYCLOS (Spring Boot). A URL base vem de VITE_API_URL (arquivo .env).
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
async function request(path, { method = "GET", body } = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // status 0: a API não respondeu (back-end desligado ou CORS)
    throw new ApiError("Não foi possível conectar ao servidor do ZYCLOS.", 0);
  }
  const data = await response.json().catch(() => null);
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
