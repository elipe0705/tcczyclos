import { createFileRoute } from "@tanstack/react-router";
import { NotificationsPage } from "@/components/zyclos/notifications";
export const Route = createFileRoute("/notificacoes")({
  head: () => ({ meta: meta("Notificações", "Acompanhe novidades da sua comunidade ZYCLOS.") }),
  component: NotificationsPage,
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
