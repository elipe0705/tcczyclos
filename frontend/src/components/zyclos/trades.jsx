import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftRight, Check, LoaderCircle, RefreshCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useApp } from "@/context/app-context";
import { acceptsTrade, useCatalog } from "@/data/catalog";
import { TRADE_STATUS, tradeStatusLabel, useListingLookup, usePublicProfiles } from "@/data/social";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { CatalogError, Empty, ListingImage, Loading, QueryError } from "./common";
import { Page } from "./page";
// Trocas: propostas reais do usuário logado (GET /propostas-troca/meus)
export function TradesPage() {
  const { user, ready } = useApp();
  return (
    <Page
      title="Troca de peças"
      eyebrow="Renove seu estilo"
      description="Renove seu estilo sem deixar suas peças paradas."
    >
      {!ready ? (
        <Loading />
      ) : user ? (
        <Trades user={user} />
      ) : (
        <Empty
          icon={<RefreshCcw />}
          title="Entre para ver suas trocas"
          text="Aqui ficam as propostas que você enviou e recebeu."
          link="/login"
          action="Entrar"
        />
      )}
    </Page>
  );
}
function Trades({ user }) {
  const propostas = useQuery({
    queryKey: ["propostas-troca", user.id],
    queryFn: async () =>
      (await api.get("/propostas-troca/meus")).sort((a, b) =>
        String(b.dataAtualizacao ?? b.dataCadastro).localeCompare(
          String(a.dataAtualizacao ?? a.dataCadastro),
        ),
      ),
  });
  const list = propostas.data ?? [];
  const received = list.filter(
    (p) => p.destinatarioId === user.id && p.status === TRADE_STATUS.PENDENTE,
  );
  const sent = list.filter((p) => p.proponenteId === user.id && p.status === TRADE_STATUS.PENDENTE);
  const history = list.filter((p) => p.status !== TRADE_STATUS.PENDENTE);
  const profiles = usePublicProfiles(
    list.map((p) => (p.proponenteId === user.id ? p.destinatarioId : p.proponenteId)),
  );
  const listings = useListingLookup(
    list.flatMap((p) => [p.anuncioDesejadoId, p.anuncioOferecidoId]),
  );
  const rows = (items, kind) =>
    items.length ? (
      <div className="grid gap-3">
        {items.map((p) => (
          <TradeRow
            key={p.id}
            proposal={p}
            kind={kind}
            user={user}
            other={profiles[String(p.proponenteId === user.id ? p.destinatarioId : p.proponenteId)]}
            listings={listings}
          />
        ))}
      </div>
    ) : (
      <p className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
        {kind === "received"
          ? "Nenhuma proposta recebida aguardando resposta."
          : kind === "sent"
            ? "Nenhuma proposta enviada aguardando resposta."
            : "Nenhuma troca finalizada ainda."}
      </p>
    );
  return (
    <Tabs defaultValue="received">
      <TabsList className="h-auto flex-wrap">
        <TabsTrigger value="received">
          Recebidas{received.length ? ` (${received.length})` : ""}
        </TabsTrigger>
        <TabsTrigger value="sent">Enviadas{sent.length ? ` (${sent.length})` : ""}</TabsTrigger>
        <TabsTrigger value="history">Histórico</TabsTrigger>
        <TabsTrigger value="mine">Minhas peças para troca</TabsTrigger>
      </TabsList>
      {["received", "sent", "history"].map((kind) => (
        <TabsContent key={kind} value={kind} className="mt-8">
          {propostas.isPending ? (
            <Loading text="Carregando propostas..." />
          ) : propostas.error ? (
            <QueryError
              error={propostas.error}
              message="Não foi possível carregar suas propostas de troca."
              onRetry={propostas.refetch}
            />
          ) : (
            rows(kind === "received" ? received : kind === "sent" ? sent : history, kind)
          )}
        </TabsContent>
      ))}
      <TabsContent value="mine" className="mt-8">
        <MyTradeListings user={user} />
      </TabsContent>
    </Tabs>
  );
}
function TradeRow({ proposal, kind, user, other, listings }) {
  const queryClient = useQueryClient();
  const { notify } = useApp();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const wanted = listings[String(proposal.anuncioDesejadoId)];
  const offered = listings[String(proposal.anuncioOferecidoId)];
  const iSent = proposal.proponenteId === user.id;
  const otherName = other?.nome ?? "Usuário";
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["propostas-troca"] });
  // Aceitar / recusar: PUT com o objeto completo e o novo status (só quem recebeu pode)
  const answer = useMutation({
    mutationFn: (status) => api.put(`/propostas-troca/${proposal.id}`, { ...proposal, status }),
    onSuccess: (_data, status) => {
      notify(status === TRADE_STATUS.ACEITA ? "Proposta aceita." : "Proposta recusada.");
      void refresh();
    },
  });
  const cancel = useMutation({
    mutationFn: () => api.delete(`/propostas-troca/${proposal.id}`),
    onSuccess: () => {
      notify("Proposta cancelada.");
      void refresh();
    },
  });
  const error = answer.error ?? cancel.error;
  return (
    <article className="rounded-lg border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <strong className="block">
            {iSent ? `Você propôs uma troca a ${otherName}` : `${otherName} propôs uma troca`}
          </strong>
          <span className="text-xs text-muted-foreground">
            {formatDate(proposal.dataCadastro)}
            {proposal.dataAtualizacao && ` · atualizada em ${formatDate(proposal.dataAtualizacao)}`}
          </span>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${proposal.status === TRADE_STATUS.ACEITA ? "bg-highlight text-highlight-foreground" : proposal.status === TRADE_STATUS.RECUSADA ? "bg-destructive/15 text-destructive" : "bg-accent text-accent-foreground"}`}
        >
          {tradeStatusLabel[proposal.status] ?? proposal.status}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TradeListing
          label={iSent ? "Você oferece" : `${otherName.split(" ")[0]} oferece`}
          listing={offered}
        />
        <ArrowLeftRight className="text-highlight" />
        <TradeListing label={iSent ? "Você quer" : "Pela sua peça"} listing={wanted} />
      </div>
      {proposal.mensagem && (
        <p className="mt-4 whitespace-pre-line rounded-md bg-muted p-3 text-sm text-muted-foreground">
          “{proposal.mensagem}”
        </p>
      )}
      {error && <p className="mt-3 text-sm text-destructive">{error.message}</p>}
      {kind === "received" && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button disabled={answer.isPending} onClick={() => answer.mutate(TRADE_STATUS.ACEITA)}>
            {answer.isPending && answer.variables === TRADE_STATUS.ACEITA ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Check />
            )}
            Aceitar
          </Button>
          <Button
            variant="outline"
            disabled={answer.isPending}
            onClick={() => answer.mutate(TRADE_STATUS.RECUSADA)}
          >
            <X /> Recusar
          </Button>
        </div>
      )}
      {kind === "sent" && (
        <>
          <Button
            className="mt-4"
            variant="outline"
            disabled={cancel.isPending}
            onClick={() => setConfirmCancel(true)}
          >
            {cancel.isPending ? <LoaderCircle className="animate-spin" /> : <X />}
            Cancelar proposta
          </Button>
          <AlertDialog open={confirmCancel} onOpenChange={setConfirmCancel}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancelar esta proposta?</AlertDialogTitle>
                <AlertDialogDescription>
                  {otherName} não verá mais a sua proposta. Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Voltar</AlertDialogCancel>
                <AlertDialogAction onClick={() => cancel.mutate()}>
                  Cancelar proposta
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </article>
  );
}
function TradeListing({ label, listing }) {
  const body = (
    <>
      <ListingImage
        src={listing?.image}
        alt={listing?.name ?? "Anúncio"}
        className="aspect-square w-full rounded-md"
      />
      <strong className="mt-2 block truncate text-sm">{listing?.name ?? "Anúncio"}</strong>
      <span className="block text-xs text-muted-foreground">
        {label}
        {listing && listing.status !== "ATIVO" && " · inativo"}
      </span>
    </>
  );
  return (
    <div className="min-w-0 max-w-48 justify-self-center rounded-lg border p-3 text-center">
      {listing?.status === "ATIVO" ? (
        <Link to="/anuncios/$id" params={{ id: listing.id }} className="block hover:text-primary">
          {body}
        </Link>
      ) : (
        body
      )}
    </div>
  );
}
// Meus anúncios ativos que aceitam troca
function MyTradeListings({ user }) {
  const { products, isLoading, error, refetch } = useCatalog();
  const mine = products.filter((p) => p.sellerId === user.id && acceptsTrade(p));
  if (error) return <CatalogError error={error} onRetry={refetch} />;
  if (isLoading) return <Loading text="Carregando seus anúncios..." />;
  if (!mine.length)
    return (
      <Empty
        icon={<RefreshCcw />}
        title="Nenhuma peça disponível para troca"
        text='Crie um anúncio com negociação "Troca" ou "Venda ou troca".'
        link="/criar-anuncio"
        action="Criar anúncio"
      />
    );
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {mine.map((p) => (
        <Link
          key={p.id}
          to="/anuncios/$id"
          params={{ id: p.id }}
          className="flex gap-4 rounded-lg border bg-card p-4 hover:border-primary"
        >
          <ListingImage src={p.image} alt={p.name} className="size-24 shrink-0 rounded-md" />
          <div className="min-w-0">
            <strong className="block truncate">{p.name}</strong>
            <p className="mt-1 text-sm text-muted-foreground">
              Tam. {p.size} · {p.condition}
            </p>
            <p className="mt-1 text-xs font-semibold text-secondary">{p.deal}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
