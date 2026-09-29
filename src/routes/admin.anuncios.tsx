import { createFileRoute } from "@tanstack/react-router";
import { Ads } from "@/components/zyclos/admin";

export const Route = createFileRoute("/admin/anuncios")({
  head: () => ({
    meta: meta("Anúncios", "Gestão de anúncios do ZYCLOS.")
  }),
  component: Ads
});

function meta(t: string, d: string) {
  return [
    { title: `${t} — Admin ZYCLOS` },
    { name: "description", content: d },
    { property: "og:title", content: t },
    { property: "og:description", content: d },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" }
  ];
}
