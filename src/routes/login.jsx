import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/zyclos/user-pages";
export const Route = createFileRoute("/login")({ head: () => ({ meta: meta("Entrar", "Acesse sua conta ZYCLOS.") }), component: () => <AuthPage /> });
function meta(t, d) { return [{ title: `${t} — ZYCLOS` }, { name: "description", content: d }, { property: "og:title", content: `${t} — ZYCLOS` }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }]; }
