import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "@tanstack/react-router";
import { api, getToken, isTokenRemembered, saveToken, setUnauthorizedHandler } from "@/lib/api";
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
// O usuário salvo serve só para exibir nome/foto nas telas. Quem decide o que cada um pode fazer é a
// API, pelo token JWT enviado em toda requisição (src/lib/api.js)
function saveSession(user, token, remember) {
  saveToken(token, remember);
  try {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    if (user) (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify(user));
  } catch {
    // navegação privada: a sessão vale só enquanto a página estiver aberta
  }
}
export function AppProvider({ children }) {
  const navigate = useNavigate();
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
  // A sessão é lida só no navegador, depois da renderização no servidor. Sem token, não há sessão
  useEffect(() => setUser(getToken() ? readSession() : null), []);
  // Token expirado ou inválido (401): sai da conta e volta para o login
  useEffect(() => {
    setUnauthorizedHandler(() => {
      saveSession(null);
      setUser(null);
      notify("Sua sessão expirou. Entre novamente.");
      void navigate({ to: "/login" });
    });
    return () => setUnauthorizedHandler(() => {});
  }, [navigate, notify]);
  useEffect(() => {
    if (!user) {
      setFavoriteIds({});
      return;
    }
    // Só os favoritos do usuário logado: a API identifica o usuário pelo token
    api
      .get("/favoritos/meus")
      .then((favoritos) =>
        setFavoriteIds(Object.fromEntries(favoritos.map((f) => [String(f.anuncioId), f.id]))),
      )
      .catch(() => setFavoriteIds({}));
  }, [user]);
  const value = useMemo(() => {
    // Login: a API devolve { token, usuario }
    async function signIn(email, senha, remember = false) {
      // Sem o token antigo: senha errada aqui é "E-mail ou senha inválidos", não "sessão expirada"
      const { token, usuario } = await api.post(
        "/usuarios/login",
        { email, senha },
        { auth: false },
      );
      const logged = toUser(usuario);
      saveSession(logged, token, remember);
      setUser(logged);
      return logged;
    }
    return {
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
            const novo = await api.post("/favoritos", { anuncioId: Number(id) });
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
      signIn,
      // O cadastro não devolve token: em seguida faz o login com o mesmo e-mail e senha
      signUp: async ({ name, username, email, password, avatarUrl }) => {
        await api.post("/usuarios", {
          nome: name,
          username,
          email,
          senha: password,
          avatarUrl: avatarUrl || null,
        });
        try {
          return await signIn(email, password);
        } catch {
          // A conta já existe: tentar o cadastro de novo daria "e-mail já cadastrado"
          const error = new Error(
            "Sua conta foi criada, mas não foi possível entrar agora. Entre com seu e-mail e senha.",
          );
          error.accountCreated = true;
          throw error;
        }
      },
      // Depois de editar o perfil: regrava o usuário salvo no mesmo lugar do token
      // (localStorage com "Lembrar de mim", senão sessionStorage), mantendo o token atual
      updateUser: (usuario) => {
        const updated = toUser(usuario);
        saveSession(updated, getToken(), isTokenRemembered());
        setUser(updated);
      },
      signOut: () => {
        saveSession(null);
        setUser(null);
      },
    };
  }, [favoriteIds, toast, user, notify]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used within AppProvider");
  return value;
}
