import { createFileRoute } from "@tanstack/react-router";
import { UserProfilePage } from "@/components/zyclos/profile";
export const Route = createFileRoute("/perfil/$username")({
  head: () => ({
    meta: [
      { title: "Perfil da comunidade — ZYCLOS" },
      { name: "description", content: "Conheça vendedores e suas avaliações no ZYCLOS." },
      { property: "og:title", content: "Perfil da comunidade — ZYCLOS" },
      { property: "og:description", content: "Veja anúncios e avaliações deste perfil." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Profile,
});
function Profile() {
  const { username } = Route.useParams();
  // key: trocar de perfil recomeça a tela (abas, estados)
  return <UserProfilePage key={username} username={username} />;
}
