import { createFileRoute } from "@tanstack/react-router";
import { UsersPage } from "@/components/zyclos/admin";
export const Route = createFileRoute("/admin/usuarios")({
    head: () => ({
        meta: meta("Usuários", "Gestão de usuários do ZYCLOS.")
    }),
    component: UsersPage
});
function meta(t, d) {
    return [
        { title: `${t} — Admin ZYCLOS` },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" }
    ];
}
