import { createFileRoute } from "@tanstack/react-router";
import { MessagesPage } from "@/components/zyclos/messages";
export const Route = createFileRoute("/mensagens")({
  // ?conversa=<id> abre a conversa direto (botões "Tenho interesse"/"Conversar" e notificações)
  validateSearch: (search) => {
    const conversa = Number(search["conversa"]);
    return Number.isInteger(conversa) && conversa > 0 ? { conversa } : {};
  },
  head: () => ({ meta: meta("Mensagens", "Converse com a comunidade ZYCLOS.") }),
  component: Messages,
});
function Messages() {
  const { conversa } = Route.useSearch();
  return <MessagesPage initialConversation={conversa} />;
}
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
