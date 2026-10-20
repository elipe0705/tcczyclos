import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/zyclos/home";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZYCLOS — Moda que continua em movimento" },
      {
        name: "description",
        content: "Compre, venda e troque roupas e acessórios com a comunidade ZYCLOS.",
      },
      { property: "og:title", content: "ZYCLOS — Moda que continua em movimento" },
      { property: "og:description", content: "Moda circular, consciente e de pessoa para pessoa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});
function Index() {
  return <HomePage />;
}
