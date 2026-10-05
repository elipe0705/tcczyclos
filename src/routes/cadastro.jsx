import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/zyclos/user-pages";
export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Cadastro — ZYCLOS" },
      { name: "description", content: "Faça parte da comunidade de moda circular ZYCLOS." },
      { property: "og:title", content: "Cadastro — ZYCLOS" },
      { property: "og:description", content: "Crie sua conta e movimente seu estilo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AuthPage signup />,
});
