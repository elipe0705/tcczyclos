import { createFileRoute } from "@tanstack/react-router";
import { Reports } from "@/components/zyclos/admin";
export const Route = createFileRoute("/admin/relatorios")({
  head: () => ({
    meta: meta("Relatórios", "Relatórios da atividade da comunidade ZYCLOS."),
  }),
  component: Reports,
});
function meta(t, d) {
  return [
    { title: `${t} — Admin ZYCLOS` },
    { name: "description", content: d },
    { property: "og:title", content: t },
    { property: "og:description", content: d },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}
