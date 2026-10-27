import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { useApp } from "@/context/app-context";
// Perfis públicos, avaliações, seguidores e abertura de conversas (React Query sobre a API)

// Perfil público (GET /usuarios/{id}/publico): nome, @username, foto, totais e média de avaliações
export function usePublicProfile(id) {
  return useQuery({
    queryKey: ["perfil", "id", String(id)],
    queryFn: () => api.get(`/usuarios/${id}/publico`),
    enabled: id != null,
    staleTime: 60_000,
  });
}

// Vários perfis de uma vez (nomes nas conversas e nas trocas), em cache como o usePublicProfile
export function usePublicProfiles(ids) {
  const unique = [...new Set(ids.filter((id) => id != null).map(String))];
  const results = useQueries({
    queries: unique.map((id) => ({
      queryKey: ["perfil", "id", id],
      queryFn: () => api.get(`/usuarios/${id}/publico`),
      staleTime: 60_000,
    })),
  });
  return Object.fromEntries(unique.map((id, index) => [id, results[index]?.data]));
}

export function usePublicProfileByUsername(username) {
  return useQuery({
    queryKey: ["perfil", "username", username],
    queryFn: () => api.get(`/usuarios/publico/${encodeURIComponent(username)}`),
    enabled: Boolean(username),
  });
}

// Avaliações recebidas pelo usuário, da mais nova à mais antiga
export function useReviewsReceived(id) {
  return useQuery({
    queryKey: ["avaliacoes", "usuario", String(id)],
    queryFn: () => api.get(`/avaliacoes/usuario/${id}`),
    enabled: id != null,
  });
}

// Seguir / deixar de seguir. GET /seguidores/meus traz quem eu sigo e quem me segue
export function useFollow(profileId) {
  const { user } = useApp();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const query = useQuery({
    queryKey: ["seguidores", "meus", user?.id],
    queryFn: () => api.get("/seguidores/meus"),
    enabled: Boolean(user),
  });
  const relation = (query.data ?? []).find(
    (s) => s.seguidorId === user?.id && s.seguidoId === profileId,
  );
  const mutation = useMutation({
    mutationFn: () =>
      relation
        ? api.delete(`/seguidores/${relation.id}`)
        : api.post("/seguidores", { seguidoId: profileId }),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["seguidores"] });
      // Os totais de seguidores/seguindo dos perfis mudaram
      void queryClient.invalidateQueries({ queryKey: ["perfil"] });
    },
  });
  return {
    following: Boolean(relation),
    isLoading: Boolean(user) && query.isPending,
    isPending: mutation.isPending,
    error: mutation.error,
    toggle: () => {
      if (!user) {
        void navigate({ to: "/login" });
        return;
      }
      mutation.mutate();
    },
  };
}

// Abre (ou reaproveita) a conversa com outra pessoa e leva para /mensagens?conversa={id}.
// Com anuncioId, procura a conversa sobre aquele anúncio; sem, qualquer conversa com a pessoa
export function useStartConversation() {
  const { user, notify } = useApp();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async ({ otherId, anuncioId = null }) => {
      const conversas = await api.get("/conversas/meus");
      const comPessoa = conversas.filter(
        (c) => c.participanteAId === otherId || c.participanteBId === otherId,
      );
      const existente =
        anuncioId != null
          ? comPessoa.find((c) => c.anuncioId === anuncioId)
          : (comPessoa.find((c) => c.anuncioId == null) ?? comPessoa[0]);
      return existente ?? api.post("/conversas", { participanteBId: otherId, anuncioId });
    },
    onSuccess: (conversa) => {
      void queryClient.invalidateQueries({ queryKey: ["conversas"] });
      void navigate({ to: "/mensagens", search: { conversa: conversa.id } });
    },
    onError: (error) => notify(error.message),
  });
  return {
    isPending: mutation.isPending,
    start: (otherId, anuncioId = null) => {
      if (!user) {
        void navigate({ to: "/login" });
        return;
      }
      mutation.mutate({ otherId, anuncioId });
    },
  };
}
