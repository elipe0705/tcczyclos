import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
// Tipo de negociação: valor gravado no banco <-> texto exibido nas telas
export const deals = { VENDA: "Venda", TROCA: "Troca", VENDA_TROCA: "Venda ou troca" };
export const dealCode = (label) =>
  Object.keys(deals).find((code) => deals[code] === label) ?? "VENDA";
export const conditions = ["Novo", "Excelente", "Muito bom", "Bom"];
// Converte o anúncio do catálogo (GET /anuncios/catalogo, já com o nome do vendedor) para o
// formato de "product" usado pelos componentes
function toProduct(anuncio, { categorias, imagens }) {
  const categoria = categorias.find((c) => c.id === anuncio.categoriaId);
  const fotos = imagens
    .filter((i) => i.anuncioId === anuncio.id)
    .sort((a, b) => Number(b.principal) - Number(a.principal) || a.ordem - b.ordem);
  return {
    id: String(anuncio.id),
    name: anuncio.titulo,
    price: anuncio.preco,
    // Sem foto: as telas mostram um quadro neutro "Sem foto" (ListingImage)
    image: fotos[0]?.url ?? null,
    images: fotos.map((f) => f.url),
    imageIds: fotos.map((f) => f.id),
    category: categoria?.nome ?? "Sem categoria",
    categoryId: anuncio.categoriaId,
    brand: anuncio.marca ?? "Sem marca",
    size: anuncio.tamanho,
    condition: anuncio.condicao,
    city: anuncio.cidade ?? "",
    state: anuncio.estado ?? "",
    // Vazio quando o anúncio não tem cidade/UF: as telas escondem a linha de localização
    location: [anuncio.cidade, anuncio.estado].filter(Boolean).join(", "),
    // null quando o vendedor não existe mais: as telas mostram só "Vendedor", sem link
    seller: anuncio.vendedorNome ?? null,
    sellerId: anuncio.vendedorId,
    sellerUsername: anuncio.vendedorUsername ?? "",
    sellerVerified: anuncio.vendedorVerificado ?? false,
    deal: deals[anuncio.tipoNegociacao] ?? anuncio.tipoNegociacao,
    style: anuncio.estilo ?? "",
    status: anuncio.status,
    tags: [anuncio.estilo].filter(Boolean),
    description: anuncio.descricao,
    createdAt: anuncio.dataCadastro,
  };
}
// Back-end desligado (status 0) ou com erro: a consulta falha e as telas mostram o erro com
// "Tentar novamente". Nunca há dados de demonstração no lugar dos reais
async function fetchCatalog() {
  // O catálogo não baixa /usuarios: o back-end já manda só o nome de exibição do vendedor
  const [anuncios, categorias, imagens] = await Promise.all([
    api.get("/anuncios/catalogo"),
    api.get("/categorias"),
    api.get("/anuncio-imagens"),
  ]);
  const lookups = { categorias, imagens };
  return {
    categories: categorias.filter((c) => c.codStatus),
    // O back-end já devolve só anúncios ATIVO
    products: anuncios
      .sort((a, b) => String(b.dataCadastro).localeCompare(String(a.dataCadastro)))
      .map((a) => toProduct(a, lookups)),
  };
}
export function useCatalog() {
  const query = useQuery({ queryKey: ["catalog"], queryFn: fetchCatalog, staleTime: 30_000 });
  return {
    products: query.data?.products ?? [],
    categories: query.data?.categories ?? [],
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
  };
}
// Anúncios que aceitam troca
export const acceptsTrade = (product) =>
  product.deal === deals.TROCA || product.deal === deals.VENDA_TROCA;
export function useRefreshCatalog() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["catalog"] });
}
export function formatPrice(price) {
  return price == null
    ? "Para troca"
    : price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
