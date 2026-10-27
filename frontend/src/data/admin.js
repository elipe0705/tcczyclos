import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
// Dados do painel administrativo: listas completas da API, que só ADMIN pode ler
// (GET /usuarios, /anuncios, /categorias, /denuncias, /propostas-troca)

const byNewest = (list, field = "dataCadastro") =>
  [...list].sort((a, b) => String(b[field] ?? "").localeCompare(String(a[field] ?? "")));

function useAdminList(resource) {
  return useQuery({
    queryKey: ["admin", resource],
    queryFn: async () => byNewest(await api.get(`/${resource}`)),
    staleTime: 15_000,
  });
}

export const useAdminUsers = () => useAdminList("usuarios");
export const useAdminListings = () => useAdminList("anuncios");
export const useAdminCategories = () => useAdminList("categorias");
export const useAdminReports = () => useAdminList("denuncias");
export const useAdminTrades = () => useAdminList("propostas-troca");

// Junta várias consultas: carregando enquanto alguma carrega, primeiro erro, refetch de todas
export function combineQueries(...queries) {
  return {
    isPending: queries.some((q) => q.isPending),
    error: queries.find((q) => q.error)?.error ?? null,
    refetch: () => Promise.all(queries.map((q) => q.refetch())),
  };
}

// Mapas id -> registro, para mostrar nomes no lugar dos ids
export function indexById(list) {
  return Object.fromEntries((list ?? []).map((item) => [item.id, item]));
}

// Depois de mudar categorias: o painel e o catálogo do site mostram a versão nova
export function useRefreshAdmin() {
  const queryClient = useQueryClient();
  return (resource) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin", resource] }),
      queryClient.invalidateQueries({ queryKey: ["catalog"] }),
    ]);
}

// Status gravados no banco -> texto exibido (e cor do selo nas tabelas)
export const statusLabels = {
  ATIVO: ["Ativo", "ok"],
  INATIVO: ["Inativo", "off"],
  PENDENTE: ["Pendente", "alert"],
  EM_ANALISE: ["Em análise", "warn"],
  RESOLVIDA: ["Resolvida", "ok"],
  REJEITADA: ["Rejeitada", "off"],
  ACEITA: ["Aceita", "ok"],
  RECUSADA: ["Recusada", "off"],
};

export const REPORT_STATUSES = ["PENDENTE", "EM_ANALISE", "RESOLVIDA", "REJEITADA"];

// "Camisas Pólo" -> "camisas-polo"
export function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
