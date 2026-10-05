import { createFileRoute } from "@tanstack/react-router";
import { Categories } from "@/components/zyclos/admin";
export const Route = createFileRoute("/admin/categorias")({
    head: () => ({
        meta: meta("Categorias", "Gestão de categorias do ZYCLOS.")
    }),
    component: Categories
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
