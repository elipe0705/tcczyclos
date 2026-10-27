import { Link } from "@tanstack/react-router";
import {
  LoaderCircle,
  MessageCircle,
  Package,
  Pencil,
  Plus,
  ShieldCheck,
  Star,
  User,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/context/app-context";
import { useCatalog } from "@/data/catalog";
import {
  useFollow,
  usePublicProfile,
  usePublicProfileByUsername,
  useReviewsReceived,
  useStartConversation,
} from "@/data/social";
import { formatDate, formatMonthYear, formatRating } from "@/lib/format";
import { CatalogError, Empty, Loading, QueryError, UserAvatar } from "./common";
import { Page } from "./page";
import { ProductCard } from "./product-card";
// /perfil: o próprio perfil do usuário logado
export function OwnProfilePage() {
  const { user, ready } = useApp();
  const query = usePublicProfile(user?.id);
  if (!ready)
    return (
      <Page title="Meu perfil">
        <Loading />
      </Page>
    );
  if (!user)
    return (
      <Page title="Meu perfil">
        <Empty
          icon={<User />}
          title="Entre para ver seu perfil"
          text="Seu perfil mostra seus anúncios, seguidores e avaliações."
          link="/login"
          action="Entrar"
        />
      </Page>
    );
  return <ProfileQuery query={query} />;
}
// /perfil/{username}: perfil de qualquer pessoa da comunidade
export function UserProfilePage({ username }) {
  const query = usePublicProfileByUsername(username);
  return <ProfileQuery query={query} />;
}
function ProfileQuery({ query }) {
  const { user } = useApp();
  if (query.isPending)
    return (
      <Page title="Perfil">
        <Loading text="Carregando perfil..." />
      </Page>
    );
  if (query.error?.status === 404)
    return (
      <Page title="Perfil não encontrado">
        <Empty
          icon={<User />}
          title="Perfil não encontrado"
          text="Este usuário não existe ou foi desativado."
          link="/anuncios"
          action="Ver anúncios"
        />
      </Page>
    );
  if (query.error)
    return (
      <Page title="Perfil">
        <QueryError
          error={query.error}
          message="Não foi possível carregar o perfil."
          onRetry={query.refetch}
        />
      </Page>
    );
  return <ProfilePage profile={query.data} isOwn={user?.id === query.data.id} />;
}
export function ProfilePage({ profile, isOwn }) {
  const hasReviews = profile.totalAvaliacoes > 0;
  const location = [profile.cidade, profile.estado].filter(Boolean).join(", ");
  const hasAbout = Boolean(profile.bio || location);
  const since = formatMonthYear(profile.dataCadastro);
  const stats = [
    ...(hasReviews ? [[formatRating(profile.mediaAvaliacoes), "Avaliação"]] : []),
    [profile.totalAnunciosAtivos, "Anúncios"],
    [profile.totalSeguidores, "Seguidores"],
    [profile.totalSeguindo, "Seguindo"],
  ];
  return (
    <Page
      title={profile.nome}
      eyebrow={`@${profile.username}${since ? ` · No ZYCLOS desde ${since}` : ""}`}
      actions={isOwn ? <OwnActions /> : <OtherActions profile={profile} />}
    >
      <div className="mb-8 grid gap-6 md:grid-cols-[160px_1fr]">
        <UserAvatar
          name={profile.nome}
          src={profile.avatarUrl}
          className="size-36 font-display text-5xl font-black"
        />
        <div>
          {profile.verificado && (
            <p className="mb-3 flex items-center gap-1 text-sm font-semibold text-secondary">
              <ShieldCheck className="size-4" /> Perfil verificado
            </p>
          )}
          {profile.bio && (
            <p className="max-w-xl whitespace-pre-line text-muted-foreground">{profile.bio}</p>
          )}
          {location && <p className="mt-2 text-sm text-muted-foreground">{location}</p>}
          <div className="mt-6 flex flex-wrap gap-7 text-sm">
            {stats.map(([n, l]) => (
              <div key={l}>
                <strong className="block font-display text-xl">{n}</strong>
                <span className="text-muted-foreground">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Tabs defaultValue="ads">
        <TabsList>
          <TabsTrigger value="ads">Anúncios</TabsTrigger>
          <TabsTrigger value="reviews">Avaliações</TabsTrigger>
          {hasAbout && <TabsTrigger value="about">Sobre</TabsTrigger>}
        </TabsList>
        <TabsContent value="ads" className="mt-7">
          <ProfileListings profile={profile} isOwn={isOwn} />
        </TabsContent>
        <TabsContent value="reviews" className="mt-7">
          <ProfileReviews profileId={profile.id} />
        </TabsContent>
        {hasAbout && (
          <TabsContent value="about" className="mt-7">
            <div className="max-w-2xl rounded-lg bg-muted p-6">
              <h2 className="font-display text-xl font-bold">Sobre {profile.nome.split(" ")[0]}</h2>
              {profile.bio && (
                <p className="mt-3 whitespace-pre-line text-muted-foreground">{profile.bio}</p>
              )}
              {location && <p className="mt-3 text-sm text-muted-foreground">{location}</p>}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </Page>
  );
}
function OwnActions() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" asChild>
        <Link to="/configuracoes">
          <Pencil /> Editar perfil
        </Link>
      </Button>
      <Button asChild>
        <Link to="/criar-anuncio">
          <Plus /> Criar anúncio
        </Link>
      </Button>
    </div>
  );
}
function OtherActions({ profile }) {
  const follow = useFollow(profile.id);
  const conversation = useStartConversation();
  return (
    <div className="flex flex-col items-start gap-2 md:items-end">
      <div className="flex gap-2">
        <Button
          variant={follow.following ? "outline" : "default"}
          disabled={follow.isLoading || follow.isPending}
          onClick={follow.toggle}
        >
          {follow.isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : follow.following ? (
            <UserCheck />
          ) : (
            <UserPlus />
          )}
          {follow.following ? "Seguindo" : "Seguir"}
        </Button>
        <Button
          variant="outline"
          disabled={conversation.isPending}
          onClick={() => conversation.start(profile.id)}
        >
          <MessageCircle />
          Conversar
        </Button>
      </div>
      {follow.error && <p className="text-sm text-destructive">{follow.error.message}</p>}
    </div>
  );
}
function ProfileListings({ profile, isOwn }) {
  const { products, isLoading, error, refetch } = useCatalog();
  const items = products.filter((p) => p.sellerId === profile.id);
  if (error) return <CatalogError error={error} onRetry={refetch} />;
  if (isLoading) return <Loading text="Carregando anúncios..." />;
  if (!items.length)
    return (
      <Empty
        icon={<Package />}
        title="Nenhum anúncio ativo ainda"
        text={isOwn ? "Publique sua primeira peça." : undefined}
        link={isOwn ? "/criar-anuncio" : undefined}
        action="Criar anúncio"
      />
    );
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
function ProfileReviews({ profileId }) {
  const { data, isPending, error, refetch } = useReviewsReceived(profileId);
  if (isPending) return <Loading text="Carregando avaliações..." />;
  if (error)
    return (
      <QueryError
        error={error}
        message="Não foi possível carregar as avaliações."
        onRetry={refetch}
      />
    );
  if (!data.length) return <Empty icon={<Star />} title="Nenhuma avaliação ainda" />;
  return (
    <div className="grid gap-4">
      {data.map((r) => (
        <article key={r.id} className="rounded-lg border bg-card p-5">
          <div className="flex justify-between gap-3">
            {r.autorUsername ? (
              <Link
                to="/perfil/$username"
                params={{ username: r.autorUsername }}
                className="font-bold hover:text-primary"
              >
                {r.autorNome}
              </Link>
            ) : (
              <strong>{r.autorNome ?? "Usuário"}</strong>
            )}
            <span className="text-xs text-muted-foreground">{formatDate(r.dataCadastro)}</span>
          </div>
          <p className="my-2 text-highlight" aria-label={`Nota ${r.nota} de 5`}>
            {"★".repeat(r.nota)}
            <span className="text-muted-foreground/40">{"★".repeat(Math.max(0, 5 - r.nota))}</span>
          </p>
          {r.comentario && <p className="text-sm text-muted-foreground">{r.comentario}</p>}
        </article>
      ))}
    </div>
  );
}
