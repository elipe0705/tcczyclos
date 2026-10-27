import { useRouter } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, LoaderCircle, MessageCircle, RefreshCcw, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-context";
import { useNotifications } from "@/data/social";
import { api } from "@/lib/api";
import { formatRelative } from "@/lib/format";
import { Empty, Loading, QueryError } from "./common";
import { Page } from "./page";
const icons = { TROCA: RefreshCcw, PERFIL: UserPlus, MENSAGEM: MessageCircle };
// Notificações reais do usuário logado (GET /notificacoes/meus)
export function NotificationsPage() {
  const { user, ready } = useApp();
  // Antes de ler a sessão salva, user é null mesmo para quem está logado
  if (!ready)
    return (
      <Page title="Notificações" eyebrow="Sua comunidade">
        <Loading />
      </Page>
    );
  if (!user)
    return (
      <Page title="Notificações" eyebrow="Sua comunidade">
        <Empty
          icon={<Bell />}
          title="Entre para ver suas notificações"
          text="Avisos de trocas, mensagens e novos seguidores aparecem aqui."
          link="/login"
          action="Entrar"
        />
      </Page>
    );
  return <Notifications />;
}
function Notifications() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isPending, error, refetch } = useNotifications();
  const unread = (data ?? []).filter((n) => !n.lida);
  // Marcar como lida: PUT com o objeto completo e lida: true
  const markRead = (list) =>
    Promise.all(list.map((n) => api.put(`/notificacoes/${n.id}`, { ...n, lida: true }))).finally(
      () => queryClient.invalidateQueries({ queryKey: ["notificacoes"] }),
    );
  const markAll = useMutation({ mutationFn: () => markRead(unread) });
  const open = useMutation({
    mutationFn: async (n) => {
      if (!n.lida) await markRead([n]);
      return n;
    },
    // destino pode ter busca (ex.: /mensagens?conversa=3): usa o histórico do roteador com o caminho completo
    onSuccess: (n) => {
      if (n.destino) router.history.push(n.destino);
    },
  });
  const actionError = markAll.error ?? open.error;
  return (
    <Page
      title="Notificações"
      eyebrow="Sua comunidade"
      actions={
        unread.length > 0 && (
          <Button variant="outline" disabled={markAll.isPending} onClick={() => markAll.mutate()}>
            {markAll.isPending && <LoaderCircle className="animate-spin" />}
            Marcar todas como lidas
          </Button>
        )
      }
    >
      {isPending ? (
        <Loading text="Carregando notificações..." />
      ) : error ? (
        <QueryError
          error={error}
          message="Não foi possível carregar suas notificações."
          onRetry={refetch}
        />
      ) : !data.length ? (
        <Empty icon={<Bell />} title="Nenhuma notificação" />
      ) : (
        <div className="mx-auto max-w-3xl">
          {actionError && <p className="mb-3 text-sm text-destructive">{actionError.message}</p>}
          <div className="divide-y rounded-lg border bg-card">
            {data.map((n) => {
              const Icon = icons[n.tipo] ?? Bell;
              return (
                <button
                  key={n.id}
                  onClick={() => open.mutate(n)}
                  className={`flex w-full items-start gap-4 p-5 text-left hover:bg-muted ${n.lida ? "opacity-60" : ""}`}
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-primary">
                    <Icon className="size-5" />
                  </span>
                  <span className="flex-1">
                    <strong className="block text-sm">{n.texto}</strong>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {formatRelative(n.dataCadastro)}
                    </span>
                  </span>
                  {!n.lida && <span className="mt-2 size-2 rounded-full bg-highlight" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Page>
  );
}
