import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, LoaderCircle, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/app-context";
import { useListingLookup, usePublicProfiles } from "@/data/social";
import { api } from "@/lib/api";
import { formatChatTime, formatDateTime } from "@/lib/format";
import { Empty, Loading, QueryError, UserAvatar } from "./common";
import { Page } from "./page";
// Mensagens: conversas e mensagens reais do usuário logado (GET /conversas/meus e /mensagens/meus),
// atualizadas a cada 10 segundos
export function MessagesPage({ initialConversation }) {
  const { user } = useApp();
  if (!user)
    return (
      <Page title="Mensagens" eyebrow="Conversas">
        <Empty
          icon={<MessageCircle />}
          title="Entre para ver suas mensagens"
          text="Converse com quem vende e com quem quer trocar peças com você."
          link="/login"
          action="Entrar"
        />
      </Page>
    );
  return <Inbox user={user} initialConversation={initialConversation} />;
}
function Inbox({ user, initialConversation }) {
  const queryClient = useQueryClient();
  const [active, setActive] = useState(initialConversation ?? null);
  const [mobileChat, setMobileChat] = useState(initialConversation != null);
  const [search, setSearch] = useState("");
  // Link de notificação (/mensagens?conversa=X) com a página já aberta
  useEffect(() => {
    if (initialConversation != null) {
      setActive(initialConversation);
      setMobileChat(true);
    }
  }, [initialConversation]);
  const conversas = useQuery({
    queryKey: ["conversas", user.id],
    queryFn: () => api.get("/conversas/meus"),
    refetchInterval: 10_000,
  });
  const mensagens = useQuery({
    queryKey: ["mensagens", user.id],
    queryFn: () => api.get("/mensagens/meus"),
    refetchInterval: 10_000,
  });
  const otherId = (c) => (c.participanteAId === user.id ? c.participanteBId : c.participanteAId);
  const profiles = usePublicProfiles((conversas.data ?? []).map(otherId));
  const listings = useListingLookup((conversas.data ?? []).map((c) => c.anuncioId));
  // Conversas com a última mensagem e o total de não lidas, da conversa mais recente para a mais antiga
  const threads = useMemo(() => {
    const porConversa = {};
    for (const m of mensagens.data ?? []) (porConversa[m.conversaId] ??= []).push(m);
    return (conversas.data ?? [])
      .map((c) => {
        const msgs = (porConversa[c.id] ?? []).sort((a, b) =>
          String(a.dataEnvio).localeCompare(String(b.dataEnvio)),
        );
        const last = msgs[msgs.length - 1];
        const other = profiles[String(otherId(c))];
        return {
          ...c,
          messages: msgs,
          last,
          lastDate: last?.dataEnvio ?? c.dataCadastro,
          unread: msgs.filter((m) => !m.lida && m.remetenteId !== user.id).length,
          other,
          otherName: other?.nome ?? "Usuário",
          listing: c.anuncioId != null ? listings[String(c.anuncioId)] : null,
        };
      })
      .sort((a, b) => String(b.lastDate).localeCompare(String(a.lastDate)));
    // otherId depende só de user.id
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversas.data, mensagens.data, profiles, listings, user.id]);
  const current = threads.find((t) => t.id === active);
  // Abrir a conversa marca como lidas as mensagens recebidas (PUT com o objeto completo e lida: true)
  const marking = useRef(new Set());
  useEffect(() => {
    const pending = (current?.messages ?? []).filter(
      (m) => !m.lida && m.remetenteId !== user.id && !marking.current.has(m.id),
    );
    if (!pending.length) return;
    pending.forEach((m) => marking.current.add(m.id));
    // Ids marcados ficam no conjunto: evita repetir o PUT até a lista ser recarregada
    Promise.all(pending.map((m) => api.put(`/mensagens/${m.id}`, { ...m, lida: true })))
      .then(() => queryClient.invalidateQueries({ queryKey: ["mensagens"] }))
      .catch(() => pending.forEach((m) => marking.current.delete(m.id)));
  }, [current, user.id, queryClient]);
  const error = conversas.error ?? mensagens.error;
  if (conversas.isPending || mensagens.isPending)
    return (
      <Page title="Mensagens" eyebrow="Conversas">
        <Loading text="Carregando conversas..." />
      </Page>
    );
  if (error && !conversas.data)
    return (
      <Page title="Mensagens" eyebrow="Conversas">
        <QueryError
          error={error}
          message="Não foi possível carregar suas conversas."
          onRetry={() => Promise.all([conversas.refetch(), mensagens.refetch()])}
        />
      </Page>
    );
  if (!threads.length)
    return (
      <Page title="Mensagens" eyebrow="Conversas">
        <Empty
          icon={<MessageCircle />}
          title="Nenhuma conversa ainda"
          text='Abra um anúncio e clique em "Tenho interesse" ou "Conversar".'
          link="/anuncios"
          action="Ver anúncios"
        />
      </Page>
    );
  const visible = threads.filter((t) => t.otherName.toLowerCase().includes(search.toLowerCase()));
  return (
    <Page title="Mensagens" eyebrow="Conversas">
      <div className="grid min-h-[600px] overflow-hidden rounded-lg border bg-card md:grid-cols-[320px_minmax(0,1fr)]">
        <aside
          className={`${mobileChat ? "hidden" : "block"} border-b md:block md:border-b-0 md:border-r`}
        >
          <div className="p-4">
            <Input
              aria-label="Buscar conversa"
              placeholder="Buscar conversa"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {visible.map((t) => (
            <Button
              variant="ghost"
              onClick={() => {
                setActive(t.id);
                setMobileChat(true);
              }}
              key={t.id}
              className={`flex h-auto w-full justify-start gap-3 rounded-none border-t p-4 text-left ${active === t.id ? "bg-accent" : "hover:bg-muted"}`}
            >
              <UserAvatar name={t.otherName} src={t.other?.avatarUrl} />
              <span className="min-w-0 flex-1">
                <span className="flex justify-between gap-2">
                  <strong className="truncate text-sm">{t.otherName}</strong>
                  <small className="shrink-0">{formatChatTime(t.lastDate)}</small>
                </span>
                {t.listing && (
                  <span className="block truncate text-xs font-semibold text-secondary">
                    {t.listing.name}
                  </span>
                )}
                <span className="block truncate text-xs text-muted-foreground">
                  {t.last
                    ? `${t.last.remetenteId === user.id ? "Você: " : ""}${t.last.conteudo}`
                    : "Nenhuma mensagem ainda"}
                </span>
              </span>
              {t.unread > 0 && (
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {t.unread}
                </span>
              )}
            </Button>
          ))}
          {visible.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">Nenhuma conversa encontrada.</p>
          )}
        </aside>
        <section
          className={`${mobileChat ? "flex" : "hidden"} min-h-[480px] min-w-0 flex-col md:flex`}
        >
          {current ? (
            <Chat thread={current} user={user} onBack={() => setMobileChat(false)} />
          ) : (
            <div className="grid flex-1 place-items-center p-6 text-center text-sm text-muted-foreground">
              {active != null ? "Conversa não encontrada." : "Escolha uma conversa."}
            </div>
          )}
        </section>
      </div>
    </Page>
  );
}
function Chat({ thread, user, onBack }) {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const bottom = useRef(null);
  const send = useMutation({
    mutationFn: (conteudo) => api.post("/mensagens", { conversaId: thread.id, conteudo }),
    onSuccess: () => {
      setText("");
      void queryClient.invalidateQueries({ queryKey: ["mensagens"] });
    },
  });
  // Mostra sempre a mensagem mais recente
  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [thread.id, thread.messages.length]);
  const trimmed = text.trim();
  return (
    <>
      <header className="flex items-center gap-3 border-b p-4">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Voltar às conversas"
          className="md:hidden"
          onClick={onBack}
        >
          <ArrowLeft />
        </Button>
        <UserAvatar
          name={thread.otherName}
          src={thread.other?.avatarUrl}
          className="size-9 text-xs"
        />
        <div className="min-w-0">
          {thread.other?.username ? (
            <Link
              to="/perfil/$username"
              params={{ username: thread.other.username }}
              className="block truncate font-bold hover:text-primary"
            >
              {thread.otherName}
            </Link>
          ) : (
            <strong className="block truncate">{thread.otherName}</strong>
          )}
          {thread.listing && (
            <span className="block truncate text-xs text-muted-foreground">
              Sobre:{" "}
              {thread.listing.status === "ATIVO" ? (
                <Link
                  to="/anuncios/$id"
                  params={{ id: thread.listing.id }}
                  className="font-semibold text-secondary hover:underline"
                >
                  {thread.listing.name}
                </Link>
              ) : (
                thread.listing.name
              )}
            </span>
          )}
        </div>
      </header>
      <div className="h-[420px] min-w-0 flex-1 space-y-3 overflow-y-auto bg-muted/50 p-5">
        {thread.messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            Nenhuma mensagem ainda. Diga olá!
          </p>
        )}
        {thread.messages.map((m) => {
          const mine = m.remetenteId === user.id;
          return (
            <div
              key={m.id}
              title={formatDateTime(m.dataEnvio)}
              className={
                mine
                  ? "ml-auto w-fit max-w-[85%] whitespace-pre-line break-words rounded-lg rounded-tr-none bg-primary p-3 text-sm text-primary-foreground"
                  : "w-fit max-w-[85%] whitespace-pre-line break-words rounded-lg rounded-tl-none bg-card p-3 text-sm shadow-sm"
              }
            >
              {m.conteudo}
              <span
                className={`mt-1 block text-right text-[10px] ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}
              >
                {formatChatTime(m.dataEnvio)}
              </span>
            </div>
          );
        })}
        <div ref={bottom} />
      </div>
      <form
        className="grid gap-2 border-t p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (trimmed && trimmed.length <= 2000 && !send.isPending) send.mutate(trimmed);
        }}
      >
        {send.error && <p className="text-sm text-destructive">{send.error.message}</p>}
        <div className="flex min-w-0 gap-2">
          <Input
            aria-label="Mensagem"
            className="min-w-0"
            maxLength={2000}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva uma mensagem..."
          />
          <Button
            type="submit"
            size="icon"
            className="shrink-0"
            aria-label="Enviar"
            disabled={!trimmed || send.isPending}
          >
            {send.isPending ? <LoaderCircle className="animate-spin" /> : <Send />}
          </Button>
        </div>
      </form>
    </>
  );
}
