import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProductDetail } from "@/components/zyclos/product-detail";
import { products } from "@/data/mock";
export const Route = createFileRoute("/anuncios/$id")({
  loader: ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Peça"} — ZYCLOS` },
      { name: "description", content: loaderData?.description ?? "Detalhes do anúncio ZYCLOS." },
      { property: "og:title", content: `${loaderData?.name ?? "Peça"} — ZYCLOS` },
      { property: "og:description", content: loaderData?.description ?? "Detalhes do anúncio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Detail,
});
function Detail() {
  return <ProductDetail product={Route.useLoaderData()} />;
}
