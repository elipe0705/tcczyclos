import { useState } from "react";
import {
  Flag,
  Heart,
  LoaderCircle,
  MapPin,
  MessageCircle,
  Pencil,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  Star,
} from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { acceptsTrade, formatPrice, useCatalog } from "@/data/catalog";
import { usePublicProfile, useStartConversation } from "@/data/social";
import { useApp } from "@/context/app-context";
import { api } from "@/lib/api";
import { formatRating } from "@/lib/format";
import { ListingImage, UserAvatar } from "./common";
export function ProductDetail({ product }) {
  const [image, setImage] = useState(product.image);
  const { favorites, toggleFavorite, user } = useApp();
  const navigate = useNavigate();
  const conversation = useStartConversation();
  const [tradeOpen, setTradeOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  // Só com usuário logado; sem o != null, undefined === undefined liberaria o botão
  const mine = user?.id != null && user.id === product.sellerId;
  const liked = favorites.includes(product.id);
  const anuncioId = Number(product.id);
  // Exige login: sem usuário, leva para a tela de entrar
  const requireUser = (action) => () => (user ? action() : void navigate({ to: "/login" }));
  const talk = () => conversation.start(product.sellerId, anuncioId);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <p className="mb-6 text-sm text-muted-foreground">
        <Link to="/anuncios" className="hover:text-primary">
          Anúncios
        </Link>{" "}
        / {product.category} / <span className="text-foreground">{product.name}</span>
      </p>
      <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
        <div className="grid gap-3 sm:grid-cols-[90px_1fr]">
          <div className="order-2 flex max-w-full gap-3 overflow-x-auto sm:order-1 sm:flex-col">
            {product.images.length > 1 &&
              product.images.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setImage(item)}
                  className={`aspect-square w-20 shrink-0 overflow-hidden rounded-md border-2 ${image === item ? "border-primary" : "border-transparent"}`}
                >
                  <img src={item} alt="Vista da peça" className="size-full object-cover" />
                </button>
              ))}
          </div>
          <div className="order-1 aspect-square overflow-hidden rounded-lg bg-muted sm:order-2">
            <ListingImage
              src={image}
              alt={product.name}
              width={1024}
              height={1024}
              iconClassName="size-16"
              className="size-full"
            />
          </div>
        </div>
        <div>
          <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
            {product.deal}
          </span>
          <h1 className="mt-4 font-display text-3xl font-black sm:text-4xl">{product.name}</h1>
          <p className="mt-3 font-display text-3xl font-black text-primary">
            {formatPrice(product.price)}
          </p>
          <div className="mt-7 grid grid-cols-2 gap-y-5 border-y py-6 text-sm">
            {[
              ["Marca", product.brand],
              ["Tamanho", product.size],
              ["Condição", product.condition],
              ["Categoria", product.category],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-muted-foreground">{label}</p>
                <p className="mt-1 font-bold">{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 whitespace-pre-line leading-relaxed text-muted-foreground">
            {product.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs">
                #{tag}
              </span>
            ))}
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {!mine && (
              <>
                <Button size="lg" disabled={conversation.isPending} onClick={talk}>
                  {conversation.isPending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <ShoppingBag />
                  )}
                  Tenho interesse
                </Button>
                {acceptsTrade(product) && (
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={requireUser(() => setTradeOpen(true))}
                  >
                    <RefreshCcw /> Propor troca
                  </Button>
                )}
                <Button
                  size="lg"
                  variant="outline"
                  disabled={conversation.isPending}
                  onClick={talk}
                  className={acceptsTrade(product) ? "sm:col-span-2" : ""}
                >
                  <MessageCircle /> Conversar
                </Button>
              </>
            )}
            {mine && (
              <Button variant="outline" className="sm:col-span-2" asChild>
                <Link to="/editar-anuncio/$id" params={{ id: product.id }}>
                  <Pencil /> Editar meu anúncio
                </Link>
              </Button>
            )}
            <Button
              variant="ghost"
              className="sm:col-span-2"
              onClick={() => void toggleFavorite(product.id)}
            >
              <Heart className={liked ? "fill-highlight text-highlight" : ""} />
              {liked ? "Favoritado" : "Favoritar"}
            </Button>
          </div>
          <SellerCard product={product} />
          {user && !mine && (
            <Button
              variant="link"
              className="mt-3 h-auto p-0 text-xs text-muted-foreground"
              onClick={() => setReportOpen(true)}
            >
              <Flag className="size-3" /> Denunciar anúncio
            </Button>
          )}
        </div>
      </div>
      {tradeOpen && <TradeDialog product={product} onClose={() => setTradeOpen(false)} />}
      {reportOpen && <ReportDialog product={product} onClose={() => setReportOpen(false)} />}
    </div>
  );
}
function SellerCard({ product }) {
  // Média e total de avaliações reais do vendedor (perfil público)
  const { data: profile, isPending, isError } = usePublicProfile(product.sellerId);
  const name = product.seller ?? "Vendedor";
  return (
    <div className="mt-8 rounded-lg bg-muted p-5">
      <div className="flex items-center gap-3">
        <UserAvatar name={name} src={profile?.avatarUrl} className="size-12" />
        <div>
          {product.seller && product.sellerUsername ? (
            <Link
              to="/perfil/$username"
              params={{ username: product.sellerUsername }}
              className="font-bold hover:text-primary"
            >
              {name}
            </Link>
          ) : (
            <p className="font-bold">{name}</p>
          )}
          {!isError && (
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              {isPending ? (
                "Carregando avaliações..."
              ) : profile.totalAvaliacoes > 0 ? (
                <>
                  <Star className="size-3 fill-highlight text-highlight" />
                  {formatRating(profile.mediaAvaliacoes)} · {profile.totalAvaliacoes}{" "}
                  {profile.totalAvaliacoes === 1 ? "avaliação" : "avaliações"}
                </>
              ) : (
                "Sem avaliações ainda"
              )}
            </p>
          )}
        </div>
      </div>
      {(product.location || product.sellerVerified) && (
        <div className="mt-4 flex gap-5 text-xs text-muted-foreground">
          {product.location && (
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {product.location}
            </span>
          )}
          {product.sellerVerified && (
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-3" />
              Perfil verificado
            </span>
          )}
        </div>
      )}
    </div>
  );
}
// Proposta de troca: o usuário escolhe um dos seus anúncios ativos para oferecer
function TradeDialog({ product, onClose }) {
  const { user, notify } = useApp();
  const { products, isLoading, error: catalogError } = useCatalog();
  const mine = products.filter((p) => p.sellerId === user?.id);
  const [offered, setOffered] = useState("");
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const send = useMutation({
    mutationFn: () =>
      api.post("/propostas-troca", {
        anuncioDesejadoId: Number(product.id),
        anuncioOferecidoId: Number(offered),
        mensagem: message.trim() || null,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["propostas-troca"] });
      notify("Proposta de troca enviada.");
    },
  });
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Propor troca</DialogTitle>
          <DialogDescription>
            Escolha uma peça sua para oferecer por {product.name}.
          </DialogDescription>
        </DialogHeader>
        {send.isSuccess ? (
          <div className="grid gap-4 text-center">
            <p className="rounded-md bg-accent p-4 text-sm font-semibold">
              Proposta enviada! O vendedor vai ver na página de trocas.
            </p>
            <Button asChild>
              <Link to="/trocas">Ver minhas trocas</Link>
            </Button>
          </div>
        ) : isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando seus anúncios...</p>
        ) : catalogError ? (
          <p className="text-sm text-destructive">{catalogError.message}</p>
        ) : !mine.length ? (
          <div className="grid gap-4 text-sm">
            <p className="text-muted-foreground">
              Você ainda não tem anúncios ativos para oferecer em troca.
            </p>
            <Button asChild>
              <Link to="/criar-anuncio">Criar anúncio</Link>
            </Button>
          </div>
        ) : (
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (offered) send.mutate();
            }}
          >
            <div className="grid max-h-64 gap-2 overflow-y-auto">
              {mine.map((p) => (
                <label
                  key={p.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-2 ${offered === p.id ? "border-primary bg-accent" : ""}`}
                >
                  <input
                    type="radio"
                    name="offered"
                    value={p.id}
                    checked={offered === p.id}
                    onChange={() => setOffered(p.id)}
                    className="accent-primary"
                  />
                  <ListingImage
                    src={p.image}
                    alt={p.name}
                    className="size-12 rounded-md"
                    iconClassName="size-5"
                  />
                  <span className="min-w-0">
                    <strong className="block truncate text-sm">{p.name}</strong>
                    <span className="text-xs text-muted-foreground">
                      Tam. {p.size} · {p.condition}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            <label className="text-sm font-semibold">
              Mensagem (opcional)
              <textarea
                maxLength={500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2 min-h-20 w-full rounded-md border bg-background p-3 font-normal"
              />
              <span className="mt-1 block text-right text-xs font-normal text-muted-foreground">
                {message.length}/500
              </span>
            </label>
            {send.error && (
              <Alert variant="destructive">
                <AlertDescription>{send.error.message}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={!offered || send.isPending}>
              {send.isPending && <LoaderCircle className="animate-spin" />}
              Enviar proposta
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
const reportReasons = [
  "Produto falso",
  "Descrição enganosa",
  "Conteúdo impróprio",
  "Golpe",
  "Outro",
];
// Denúncia do anúncio: vai para a tela "Denúncias" do painel administrativo
function ReportDialog({ product, onClose }) {
  const { notify } = useApp();
  const [reason, setReason] = useState(reportReasons[0]);
  const [description, setDescription] = useState("");
  const send = useMutation({
    mutationFn: () =>
      api.post("/denuncias", {
        anuncioId: Number(product.id),
        usuarioDenunciadoId: product.sellerId,
        motivo: reason,
        descricao: description.trim() || null,
      }),
    onSuccess: () => {
      notify("Denúncia enviada. A moderação vai analisar.");
      onClose();
    },
  });
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Denunciar anúncio</DialogTitle>
          <DialogDescription>Conte o que há de errado com {product.name}.</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            send.mutate();
          }}
        >
          <label className="text-sm font-semibold">
            Motivo
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-2 h-10 w-full rounded-md border bg-background px-3 font-normal"
            >
              {reportReasons.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Descrição (opcional)
            <textarea
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 min-h-24 w-full rounded-md border bg-background p-3 font-normal"
            />
            <span className="mt-1 block text-right text-xs font-normal text-muted-foreground">
              {description.length}/1000
            </span>
          </label>
          {send.error && (
            <Alert variant="destructive">
              <AlertDescription>{send.error.message}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" variant="destructive" disabled={send.isPending}>
            {send.isPending && <LoaderCircle className="animate-spin" />}
            Enviar denúncia
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
