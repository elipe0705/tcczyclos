import { createFileRoute } from "@tanstack/react-router";
import { Complaints } from "@/components/zyclos/admin";
export const Route = createFileRoute("/admin/denuncias")({
  head: () => ({
    meta: meta("Denúncias", "Análise de denúncias do ZYCLOS."),
  }),
  component: Complaints,
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
