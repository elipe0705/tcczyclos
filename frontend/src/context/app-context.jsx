import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { api } from "@/lib/api";
const AppContext = createContext(undefined);
const SESSION_KEY = "zyclos.usuario";
// Converte o usuário do back-end para o formato usado pelas telas
function toUser(usuario) {
  return {
    id: usuario.id,
    name: usuario.nome,
    username: usuario.username,
    email: usuario.email,
    avatarUrl: usuario.avatarUrl ?? undefined,
    type: usuario.tipoUsuario,
  };
}
function readSession() {
  try {
    const saved = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}
function saveSession(user, remember) {
  try {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    if (user) (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify(user));
  } catch {
    // navegação privada: a sessão vale só enquanto a página estiver aberta
  }
}
export function AppProvider({ children }) {
  // { anuncioId: favoritoId } do usuário logado
  const [favoriteIds, setFavoriteIds] = useState({});
  // ids de anúncios com favoritar/desfavoritar em andamento
  const pendingFavorites = useRef(new Set());
  const [toast, setToast] = useState("");
  const [user, setUser] = useState(null);
  const notify = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }, []);
  // A sessão é lida só no navegador, depois da renderização no servidor
  useEffect(() => setUser(readSession()), []);
  useEffect(() => {
    if (!user) {
      setFavoriteIds({});
      return;
    }
    api
      .get("/favoritos")
      .then((favoritos) =>
        setFavoriteIds(
          Object.fromEntries(
            favoritos
              .filter((f) => f.usuarioId === user.id)
              .map((f) => [String(f.anuncioId), f.id]),
          ),
        ),
      )
      .catch(() => setFavoriteIds({}));
  }, [user]);
  const value = useMemo(
    () => ({
      favorites: Object.keys(favoriteIds),
      toggleFavorite: async (id) => {
        if (!user) {
          notify("Entre na sua conta para salvar favoritos.");
          return;
        }
        // Ignora cliques enquanto a requisição deste anúncio ainda está em andamento
        if (pendingFavorites.current.has(id)) return;
        pendingFavorites.current.add(id);
        const favoritoId = favoriteIds[id];
        try {
          if (favoritoId) {
            await api.delete(`/favoritos/${favoritoId}`);
            setFavoriteIds(({ [id]: _removed, ...rest }) => rest);
            notify("Produto removido dos favoritos.");
          } else {
            const novo = await api.post("/favoritos", {
              usuarioId: user.id,
              anuncioId: Number(id),
            });
            setFavoriteIds((current) => ({ ...current, [id]: novo.id }));
            notify("Produto adicionado aos favoritos.");
          }
        } catch (error) {
          notify(error.message);
        } finally {
          pendingFavorites.current.delete(id);
        }
      },
      toast,
      notify,
      user,
      signIn: async (email, senha, remember = false) => {
        const usuario = await api.post("/usuarios/login", { email, senha });
        const logged = toUser(usuario);
        saveSession(logged, remember);
        setUser(logged);
        return logged;
      },
      signUp: async ({ name, username, email, password, avatarUrl }) => {
        const usuario = await api.post("/usuarios", {
          nome: name,
          username,
          email,
          senha: password,
          avatarUrl: avatarUrl || null,
        });
        const logged = toUser(usuario);
        saveSession(logged, false);
        setUser(logged);
        return logged;
      },
      signOut: () => {
        saveSession(null);
        setUser(null);
      },
    }),
    [favoriteIds, toast, user, notify],
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used within AppProvider");
  return value;
}
