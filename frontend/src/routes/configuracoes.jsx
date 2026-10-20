import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/zyclos/user-pages";
export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: meta("Configurações", "Gerencie suas preferências no ZYCLOS.") }),
  component: SettingsPage,
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
