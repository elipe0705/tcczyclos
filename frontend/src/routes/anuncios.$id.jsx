import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductDetail } from "@/components/zyclos/product-detail";
import { Button } from "@/components/ui/button";
import { useCatalog } from "@/data/catalog";
export const Route = createFileRoute("/anuncios/$id")({
  head: () => ({
    meta: [
      { title: "Peça — ZYCLOS" },
      { name: "description", content: "Detalhes do anúncio ZYCLOS." },
      { property: "og:title", content: "Peça — ZYCLOS" },
      { property: "og:description", content: "Detalhes do anúncio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Detail,
});
function Detail() {
  const { id } = Route.useParams();
  const { products, isLoading } = useCatalog();
  const product = products.find((p) => p.id === id);
  if (product) return <ProductDetail key={product.id} product={product} />;
  return (
    <div className="mx-auto grid min-h-[50vh] max-w-7xl place-items-center px-6 text-center">
      {isLoading ? (
        <p className="text-muted-foreground">Carregando anúncio...</p>
      ) : (
        <div>
          <h1 className="font-display text-2xl font-bold">Anúncio não encontrado</h1>
          <p className="mt-2 text-muted-foreground">Ele pode ter sido removido pelo vendedor.</p>
          <Button className="mt-5" asChild>
            <Link to="/anuncios">Ver anúncios</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
