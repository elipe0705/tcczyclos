import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/zyclos/catalog";
export const Route = createFileRoute("/anuncios/")({
    validateSearch: (search) => ({
        ...(typeof search['q'] === "string" ? { q: search['q'] } : {}),
        ...(typeof search['categoria'] === "string" ? { categoria: search['categoria'] } : {}),
    }),
    head: () => ({ meta: [
            { title: "Anúncios — ZYCLOS" }, { name: "description", content: "Explore roupas, calçados e acessórios da comunidade ZYCLOS." },
            { property: "og:title", content: "Anúncios — ZYCLOS" }, { property: "og:description", content: "Garimpe peças únicas para comprar ou trocar." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
        ] }),
    component: Page,
});
function Page() { const search = Route.useSearch(); return <CatalogPage initialQuery={search.q ?? ""} initialCategory={search.categoria ?? "Todos"}/>; }
