import { createFileRoute } from "@tanstack/react-router";
import { OwnProfilePage } from "@/components/zyclos/profile";
export const Route = createFileRoute("/perfil/")({
  head: () => ({ meta: meta("Meu perfil", "Veja seu perfil e anúncios no ZYCLOS.") }),
  component: OwnProfilePage,
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
