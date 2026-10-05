import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/zyclos/admin";
export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: meta("Dashboard", "Visão geral administrativa do ZYCLOS."),
  }),
  component: Dashboard,
});
function meta(t, d) {
  return [
    { title: `${t} — Admin ZYCLOS` },
    { name: "description", content: d },
    { property: "og:title", content: `${t} — Admin ZYCLOS` },
    { property: "og:description", content: d },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}
