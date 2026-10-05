import { createFileRoute } from "@tanstack/react-router";
import { MessagesPage } from "@/components/zyclos/user-pages";
export const Route = createFileRoute("/mensagens")({ head: () => ({ meta: meta("Mensagens", "Converse com a comunidade ZYCLOS.") }), component: MessagesPage });
function meta(t, d) { return [{ title: `${t} — ZYCLOS` }, { name: "description", content: d }, { property: "og:title", content: `${t} — ZYCLOS` }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }]; }
