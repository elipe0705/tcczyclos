import { createFileRoute } from "@tanstack/react-router";
import { FavoritesPage } from "@/components/zyclos/user-pages";
export const Route = createFileRoute("/favoritos")({
  head: () => ({ meta: meta("Favoritos", "Suas peças favoritas no ZYCLOS.") }),
  component: FavoritesPage,
});
function meta(t, d) {
  return [
    { title: `${t} — ZYCLOS` },
    { name: "description", content: d },
    { property: "og:title", content: `${t} — ZYCLOS` },
    { property: "og:description", content: d },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}
