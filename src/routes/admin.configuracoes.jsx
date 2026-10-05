import { createFileRoute } from "@tanstack/react-router";
import { AdminSettings } from "@/components/zyclos/admin";
export const Route = createFileRoute("/admin/configuracoes")({
    head: () => ({
        meta: meta("Configurações", "Configurações administrativas do ZYCLOS.")
    }),
    component: AdminSettings
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
