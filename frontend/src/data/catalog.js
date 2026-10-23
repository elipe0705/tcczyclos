import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import fallbackImage from "@/assets/product-collection.jpg";
import * as mock from "./mock";
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
    image: fotos[0]?.url ?? fallbackImage,
    images: fotos.length ? fotos.map((f) => f.url) : [fallbackImage],
    imageIds: fotos.map((f) => f.id),
    category: categoria?.nome ?? "Sem categoria",
    categoryId: anuncio.categoriaId,
    brand: anuncio.marca ?? "Sem marca",
    size: anuncio.tamanho,
    condition: anuncio.condicao,
    city: anuncio.cidade ?? "",
    state: anuncio.estado ?? "",
    location: [anuncio.cidade, anuncio.estado].filter(Boolean).join(", ") || "Brasil",
    seller: anuncio.vendedorNome ?? "Usuário ZYCLOS",
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
async function fetchCatalog() {
  try {
    // O catálogo não baixa mais /usuarios: o back-end já manda só o nome de exibição do vendedor
    const [anuncios, categorias, imagens] = await Promise.all([
      api.get("/anuncios/catalogo"),
      api.get("/categorias"),
      api.get("/anuncio-imagens"),
    ]);
    const lookups = { categorias, imagens };
    return {
      offline: false,
      categories: categorias.filter((c) => c.codStatus),
      // O back-end já devolve só anúncios ATIVO
      products: anuncios
        .sort((a, b) => String(b.dataCadastro).localeCompare(String(a.dataCadastro)))
        .map((a) => toProduct(a, lookups)),
    };
  } catch (error) {
    if (error.status !== 0) throw error;
    // Back-end desligado: mostra os dados de demonstração para a apresentação não travar
    return {
      offline: true,
      categories: mock.categories.map((nome, index) => ({ id: index + 1, nome })),
      products: mock.products.map((p) => ({ ...p, images: [p.image] })),
    };
  }
}
export function useCatalog() {
  const query = useQuery({ queryKey: ["catalog"], queryFn: fetchCatalog, staleTime: 30_000 });
  return {
    products: query.data?.products ?? [],
    categories: query.data?.categories ?? [],
    offline: query.data?.offline ?? false,
    isLoading: query.isPending,
    error: query.error,
  };
}
export function useRefreshCatalog() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["catalog"] });
}
export function formatPrice(price) {
  return price == null
    ? "Para troca"
    : price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
