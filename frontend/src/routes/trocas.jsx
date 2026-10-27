import { createFileRoute } from "@tanstack/react-router";
import { TradesPage } from "@/components/zyclos/trades";
export const Route = createFileRoute("/trocas")({
  head: () => ({ meta: meta("Troca de peças", "Renove seu estilo trocando peças no ZYCLOS.") }),
  component: TradesPage,
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
