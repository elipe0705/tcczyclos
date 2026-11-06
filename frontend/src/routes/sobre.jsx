import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/zyclos/about";
export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: meta("Sobre", "Objetivo, justificativa e ODS 12 do ZYCLOS, plataforma de moda circular."),
  }),
  component: AboutPage,
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
