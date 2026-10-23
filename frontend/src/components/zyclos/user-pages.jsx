import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bell,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  Heart,
  ImagePlus,
  Leaf,
  LoaderCircle,
  Lock,
  Mail,
  MessageCircle,
  Plus,
  Recycle,
  Send,
  Settings,
  Shield,
  Sparkles,
  Trash2,
  Upload,
  User,
  UserPlus,
} from "lucide-react";
import { z } from "zod";
import { Brand } from "./brand";
import { Page } from "./page";
import { ProductCard } from "./product-card";
import { conversations, notifications, products, reviews } from "@/data/mock";
import {
  conditions,
  deals,
  dealCode,
  formatPrice,
  useCatalog,
  useRefreshCatalog,
} from "@/data/catalog";
import { api, getToken } from "@/lib/api";
import { useApp } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
const loginSchema = z.object({
  email: z.string().trim().email("Digite um e-mail válido.").max(255),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres.").max(72),
});
const signupSchema = loginSchema
  .extend({
    name: z
      .string()
      .trim()
      .min(2, "Digite seu nome completo.")
      .max(100, "O nome deve ter no máximo 100 caracteres."),
    username: z
      .string()
      .trim()
      .min(3, "O nome de usuário deve ter ao menos 3 caracteres.")
      .max(30, "O nome de usuário deve ter no máximo 30 caracteres.")
      .regex(/^[a-zA-Z0-9._]+$/, "Use apenas letras, números, ponto ou sublinhado."),
    avatarUrl: z.string().trim().max(500, "O link da foto deve ter no máximo 500 caracteres."),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "As senhas não coincidem.",
    path: ["confirm"],
  });
export function AuthPage({ signup = false }) {
  const navigate = useNavigate();
  const { signIn, signUp, signOut, notify } = useApp();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState("");
  // Abrir o login ou o cadastro encerra a sessão anterior (apaga token antigo do navegador).
  // Roda só ao abrir a página: se dependesse de signOut, rodaria de novo após o login e apagaria o token novo
  useEffect(() => {
    if (getToken()) signOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function submit(e) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const values = {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      ...(signup
        ? {
            name: String(form.get("name") ?? ""),
            username: String(form.get("username") ?? ""),
            avatarUrl: photo,
            confirm: String(form.get("confirm") ?? ""),
          }
        : {}),
    };
    if (signup) {
      const result = signupSchema.safeParse(values);
      if (!result.success) {
        setError(result.error.issues[0]?.message ?? "Revise os dados informados.");
        return;
      }
      setLoading(true);
      try {
        await signUp(result.data);
        notify("Conta criada. Bem-vindo à ZYCLOS!");
        void navigate({ to: "/" });
      } catch (err) {
        setLoading(false);
        if (err.accountCreated) {
          notify(err.message);
          void navigate({ to: "/login" });
          return;
        }
        // O back-end já explica o problema (409: e-mail/usuário em uso; 400: campo inválido)
        setError(err.message);
      }
      return;
    }
    const result = loginSchema.safeParse(values);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Revise os dados informados.");
      return;
    }
    setLoading(true);
    try {
      await signIn(result.data.email, result.data.password, form.get("remember") === "on");
      notify("Você entrou na sua conta.");
      void navigate({ to: "/" });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }
  function googleDemo() {
    notify("Entrar com Google ainda não está disponível. Use e-mail e senha.");
  }
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative hidden overflow-hidden border-r border-border bg-surface-dark p-12 lg:flex lg:flex-col lg:justify-between">
        <Brand />
        <div className="relative max-w-lg">
          <span className="mb-6 grid size-12 place-items-center rounded-md bg-highlight text-highlight-foreground">
            <Recycle />
          </span>
          <p className="font-display text-4xl font-extrabold leading-tight">
            Seu estilo merece
            <br />
            uma nova história.
          </p>
          <p className="mt-5 max-w-md text-muted-foreground">
            Entre na comunidade que transforma peças paradas em novas possibilidades.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-5 border-t border-border pt-6 text-sm">
          <p>
            <strong className="block text-highlight">Compre</strong>com propósito
          </p>
          <p>
            <strong className="block text-secondary">Venda</strong>sem complicação
          </p>
          <p>
            <strong className="block text-highlight">Troque</strong>com liberdade
          </p>
        </div>
      </section>
      <section className="flex min-h-screen min-w-0 items-center justify-center px-4 py-10 sm:px-8">
        <div className="min-w-0 w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Brand />
          </div>
          <p className="text-xs font-extrabold uppercase text-highlight">Sua conta ZYCLOS</p>
          <h1 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
            {signup ? "Crie sua conta" : "Bem-vindo de volta"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {signup
              ? "Comece a circular seu estilo hoje."
              : "Acesse seus anúncios, trocas e conversas."}
          </p>
          <form className="mt-8 grid gap-4" onSubmit={submit} noValidate>
            {signup && (
              <>
                <Field label="Nome completo" name="name" autoComplete="name" icon={<User />} />
                <Field
                  label="Nome de usuário"
                  name="username"
                  autoComplete="username"
                  icon={<UserPlus />}
                />
                {/* A foto é um link (URL), gravado em usuario.avatar_url, como a foto do anúncio */}
                <div className="flex items-end gap-3">
                  <div className="min-w-0 flex-1">
                    <Field
                      label="Link da foto de perfil (opcional)"
                      name="avatarUrl"
                      type="url"
                      required={false}
                      icon={<Camera />}
                      value={photo}
                      onChange={setPhoto}
                    />
                  </div>
                  {photo.trim() && (
                    <img
                      src={photo.trim()}
                      alt="Prévia da foto de perfil"
                      className="size-11 shrink-0 rounded-full object-cover"
                    />
                  )}
                </div>
              </>
            )}
            <Field label="E-mail" name="email" type="email" autoComplete="email" icon={<Mail />} />
            <label className="text-sm font-semibold">
              Senha
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  required
                  name="password"
                  type={show ? "text" : "password"}
                  autoComplete={signup ? "new-password" : "current-password"}
                  className="h-11 pl-9 pr-11"
                />
                <Button
                  type="button"
                  onClick={() => setShow(!show)}
                  aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                >
                  {show ? <EyeOff /> : <Eye />}
                </Button>
              </div>
              {signup && (
                <span className="mt-1.5 block text-xs font-normal text-muted-foreground">
                  Use 8 ou mais caracteres.
                </span>
              )}
            </label>
            {signup && (
              <Field
                label="Confirmar senha"
                name="confirm"
                type={show ? "text" : "password"}
                autoComplete="new-password"
                icon={<Lock />}
              />
            )}
            {signup ? (
              <label className="flex items-start gap-2 text-xs text-muted-foreground">
                <input required name="terms" type="checkbox" className="mt-0.5 accent-primary" />{" "}
                Aceito os termos de uso e a política de privacidade.
              </label>
            ) : (
              <div className="flex items-center justify-between gap-3 text-xs">
                <label className="flex items-center gap-2">
                  <input name="remember" type="checkbox" className="accent-primary" /> Lembrar de
                  mim
                </label>
                <ForgotPassword />
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button size="lg" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Aguarde...
                </>
              ) : signup ? (
                "Criar conta"
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            ou
            <span className="h-px flex-1 bg-border" />
          </div>
          <Button type="button" variant="outline" className="w-full" onClick={googleDemo}>
            <Sparkles /> Continuar com Google{" "}
            <span className="text-xs text-muted-foreground">(demonstração)</span>
          </Button>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {signup ? "Já tem uma conta?" : "Ainda não tem conta?"}{" "}
            <Link className="font-bold text-secondary" to={signup ? "/login" : "/cadastro"}>
              {signup ? "Entrar" : "Cadastre-se"}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
function Field({
  label,
  name,
  type = "text",
  autoComplete,
  icon,
  value,
  onChange,
  required = true,
}) {
  return (
    <label className="text-sm font-semibold">
      {label}
      <div className="relative mt-2">
        {icon && (
          <span className="absolute left-3 top-1/2 [&>svg]:size-4 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        )}
        <Input
          required={required}
          name={name}
          type={type}
          autoComplete={autoComplete}
          {...(onChange ? { value: value ?? "", onChange: (e) => onChange(e.target.value) } : {})}
          className={`h-11 ${icon ? "pl-9" : ""}`}
        />
      </div>
    </label>
  );
}
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  function recover() {
    const result = z.string().trim().email("Digite um e-mail válido.").safeParse(email);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "E-mail inválido.");
      return;
    }
    setError("");
    setSent(true);
  }
  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setSent(false);
          setError("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="link" className="h-auto p-0 text-xs text-secondary">
          Esqueci minha senha
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recuperar senha</DialogTitle>
          <DialogDescription>
            Informe seu e-mail para simular o envio das instruções de recuperação.
          </DialogDescription>
        </DialogHeader>
        {sent ? (
          <div role="status" className="rounded-md border bg-accent p-5 text-center">
            <CheckCircle2 className="mx-auto mb-3 size-8 text-secondary" />
            <strong className="block">Instruções simuladas enviadas</strong>
            <p className="mt-1 text-sm text-muted-foreground">
              Nenhum e-mail real foi enviado nesta versão.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            <label className="text-sm font-semibold">
              E-mail da conta
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  aria-label="E-mail para recuperação"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-9"
                />
              </div>
            </label>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="button" onClick={recover}>
              Enviar instruções
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
export function ProfilePage() {
  const [following, setFollowing] = useState(false);
  return (
    <Page
      title="Lívia Rocha"
      eyebrow="@liviar · desde março de 2024"
      actions={
        <div className="flex gap-2">
          <Button
            variant={following ? "outline" : "default"}
            onClick={() => setFollowing(!following)}
          >
            <UserPlus />
            {following ? "Seguindo" : "Seguir"}
          </Button>
          <Button variant="outline" asChild>
            <Link to="/mensagens">
              <MessageCircle />
              Chat
            </Link>
          </Button>
        </div>
      }
    >
      <div className="mb-8 grid gap-6 md:grid-cols-[160px_1fr]">
        <div className="grid size-36 place-items-center rounded-full bg-secondary font-display text-5xl font-black text-secondary-foreground">
          LR
        </div>
        <div>
          <p className="max-w-xl text-muted-foreground">
            Apaixonada por garimpos, peças atemporais e novas formas de consumir moda. Todas as
            peças são cuidadas com carinho.
          </p>
          <div className="mt-6 flex flex-wrap gap-7 text-sm">
            {[
              ["4,8", "Avaliação"],
              ["18", "Anúncios"],
              ["328", "Seguidores"],
              ["146", "Seguindo"],
            ].map(([n, l]) => (
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
          <TabsTrigger value="about">Sobre</TabsTrigger>
        </TabsList>
        <TabsContent value="ads" className="mt-7">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="mt-7">
          <div className="grid gap-4">
            {reviews.map((r) => (
              <article key={r.name} className="rounded-lg border bg-card p-5">
                <div className="flex justify-between">
                  <strong>{r.name}</strong>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <p className="my-2 text-highlight">{"★".repeat(r.rating)}</p>
                <p className="text-sm text-muted-foreground">{r.text}</p>
              </article>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="about" className="mt-7">
          <div className="max-w-2xl rounded-lg bg-muted p-6">
            <h2 className="font-display text-xl font-bold">Sobre Lívia</h2>
            <p className="mt-3 text-muted-foreground">
              São Paulo, SP · Responde normalmente em até uma hora. Prefere entregas em locais
              públicos ou envio combinado.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Page>
  );
}
export function FavoritesPage() {
  const { favorites, user } = useApp();
  const { products } = useCatalog();
  const items = products.filter((p) => favorites.includes(p.id));
  return (
    <Page
      title="Seus favoritos"
      eyebrow="Peças que chamaram sua atenção"
      description={`${items.length} item(ns) salvo(s).`}
    >
      {items.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <Empty
          icon={<Heart />}
          title={user ? "Nenhum favorito ainda" : "Entre para ver seus favoritos"}
          text="Explore os anúncios e salve as peças que você ama."
          link={user ? "/anuncios" : "/login"}
          action={user ? "Explorar anúncios" : "Entrar"}
        />
      )}
    </Page>
  );
}
export function NotificationsPage() {
  const [read, setRead] = useState([]);
  return (
    <Page
      title="Notificações"
      eyebrow="Sua comunidade"
      actions={
        <Button variant="outline" onClick={() => setRead(notifications.map((n) => n.id))}>
          Marcar todas como lidas
        </Button>
      }
    >
      <div className="mx-auto max-w-3xl divide-y rounded-lg border bg-card">
        {notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => setRead([...read, n.id])}
            className={`flex w-full items-start gap-4 p-5 text-left hover:bg-muted ${read.includes(n.id) ? "opacity-60" : ""}`}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-primary">
              <Bell className="size-5" />
            </span>
            <span className="flex-1">
              <strong className="block text-sm">{n.text}</strong>
              <span className="mt-1 block text-xs text-muted-foreground">{n.time}</span>
            </span>
            {!read.includes(n.id) && <span className="mt-2 size-2 rounded-full bg-highlight" />}
          </button>
        ))}
      </div>
    </Page>
  );
}
export function MessagesPage() {
  const [active, setActive] = useState(1);
  const [mobileChat, setMobileChat] = useState(false);
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [sent, setSent] = useState({});
  const visible = conversations.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
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
          {visible.map((c) => (
            <Button
              variant="ghost"
              onClick={() => {
                setActive(c.id);
                setMobileChat(true);
              }}
              key={c.id}
              className={`flex h-auto w-full justify-start gap-3 rounded-none border-t p-4 text-left ${active === c.id ? "bg-accent" : "hover:bg-muted"}`}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary font-bold">
                {c.name[0]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex justify-between gap-2">
                  <strong className="truncate text-sm">{c.name}</strong>
                  <small className="shrink-0">{c.time}</small>
                </span>
                <span className="block truncate text-xs text-muted-foreground">{c.message}</span>
              </span>
              {c.unread > 0 && (
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {c.unread}
                </span>
              )}
            </Button>
          ))}
          {visible.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">Nenhuma conversa encontrada.</p>
          )}
        </aside>
        <section
          className={`${mobileChat ? "flex" : "hidden"} min-w-0 min-h-[480px] flex-col md:flex`}
        >
          <header className="flex items-center gap-2 border-b p-4 font-bold">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Voltar às conversas"
              className="md:hidden"
              onClick={() => setMobileChat(false)}
            >
              <ArrowLeft />
            </Button>
            {conversations.find((c) => c.id === active)?.name}
          </header>
          <div className="min-w-0 flex-1 space-y-3 bg-muted/50 p-5">
            <div className="w-fit max-w-[85%] break-words rounded-lg rounded-tl-none bg-card p-3 text-sm shadow-sm">
              Olá! A peça continua disponível?
            </div>
            <div className="ml-auto w-fit max-w-[85%] break-words rounded-lg rounded-tr-none bg-primary p-3 text-sm text-primary-foreground">
              Sim! Está em ótimo estado.
            </div>
            {(sent[active] ?? []).map((msg, i) => (
              <div
                key={i}
                className="ml-auto w-fit max-w-[85%] break-words rounded-lg rounded-tr-none bg-primary p-3 text-sm text-primary-foreground"
              >
                {msg}
              </div>
            ))}
          </div>
          <form
            className="flex min-w-0 gap-2 border-t p-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (text.trim()) {
                setSent((current) => ({
                  ...current,
                  [active]: [...(current[active] ?? []), text.trim()],
                }));
                setText("");
              }
            }}
          >
            <Input
              aria-label="Mensagem"
              className="min-w-0"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escreva uma mensagem..."
            />
            <Button type="submit" size="icon" className="shrink-0" aria-label="Enviar">
              <Send />
            </Button>
          </form>
        </section>
      </div>
    </Page>
  );
}
function Empty({ icon, title, text, link, action }) {
  return (
    <div className="grid min-h-80 place-items-center rounded-lg border border-dashed text-center">
      <div>
        <span className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-muted [&>svg]:size-6">
          {icon}
        </span>
        <h2 className="font-display text-xl font-bold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
        <Button className="mt-5" asChild>
          <Link to={link}>{action}</Link>
        </Button>
      </div>
    </div>
  );
}
export function TradesPage() {
  const { notify } = useApp();
  return (
    <Page
      title="Troca de peças"
      eyebrow="Renove seu estilo"
      description="Renove seu estilo sem deixar suas peças paradas."
    >
      <Tabs defaultValue="mine">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="mine">Minhas ofertas</TabsTrigger>
          <TabsTrigger value="received">Propostas recebidas</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>
        <TabsContent value="mine" className="mt-8">
          <h2 className="mb-5 font-display text-xl font-bold">
            Minhas peças disponíveis para troca
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((p) => (
              <div key={p.id} className="rounded-lg border bg-card p-4">
                <div className="flex gap-4">
                  <img src={p.image} alt={p.name} className="size-24 rounded-md object-cover" />
                  <div>
                    <strong>{p.name}</strong>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Tam. {p.size} · {p.condition}
                    </p>
                    <TradeDialog
                      product={p}
                      onSend={() => notify("Proposta enviada com sucesso.")}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="received" className="mt-8">
          <TradeRow title="Caio quer trocar o Tênis retrô" status="Aguardando resposta" />
          <TradeRow title="Marina ofereceu uma bolsa de couro" status="Nova proposta" />
        </TabsContent>
        <TabsContent value="history" className="mt-8">
          <TradeRow title="Troca com Beatriz concluída" status="Concluída" />
        </TabsContent>
      </Tabs>
    </Page>
  );
}
function TradeDialog({ product, onSend }) {
  const offeredImage = products[1]?.image ?? product.image;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="mt-3">
          Trocar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Monte sua proposta</DialogTitle>
          <DialogDescription>Escolha uma peça para oferecer por {product.name}.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="rounded-lg border p-3 text-center">
            <img
              src={offeredImage}
              alt="Sua peça"
              className="aspect-square rounded-md object-cover"
            />
            <strong className="mt-2 block text-sm">Você oferece</strong>
          </div>
          <Plus className="text-highlight" />
          <div className="rounded-lg border p-3 text-center">
            <img
              src={product.image}
              alt={product.name}
              className="aspect-square rounded-md object-cover"
            />
            <strong className="mt-2 block text-sm">Você recebe</strong>
          </div>
        </div>
        <Button onClick={onSend}>Enviar proposta</Button>
      </DialogContent>
    </Dialog>
  );
}
function TradeRow({ title, status }) {
  return (
    <div className="mb-3 flex items-center justify-between rounded-lg border bg-card p-5">
      <div>
        <strong>{title}</strong>
        <p className="text-sm text-muted-foreground">Atualizado recentemente</p>
      </div>
      <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
        {status}
      </span>
    </div>
  );
}
const emptyListing = {
  title: "",
  categoryId: "",
  brand: "",
  size: "",
  condition: "Excelente",
  style: "",
  city: "",
  state: "",
  description: "",
  deal: "Venda",
  price: "",
  imageUrl: "",
};
// Campos podem vir nulos/vazios do banco (ex.: anúncio criado pelo arquivo .http): sempre virar string
function fromProduct(p) {
  return {
    title: p.name ?? "",
    categoryId: String(p.categoryId ?? ""),
    brand: !p.brand || p.brand === "Sem marca" ? "" : p.brand,
    size: p.size ?? "",
    condition: p.condition ?? "",
    style: p.style ?? "",
    city: p.city ?? "",
    state: p.state ?? "",
    description: p.description ?? "",
    deal: p.deal ?? "Venda",
    price: p.price == null ? "" : String(p.price),
    imageUrl: p.imageIds?.length ? p.images[0] : "",
  };
}
// Tamanho máximo das colunas no banco: [campo, máximo, etapa, nome exibido]
const listingLimits = [
  ["title", 120, 1, "O título"],
  ["brand", 60, 1, "A marca"],
  ["size", 20, 1, "O tamanho"],
  ["style", 40, 1, "O estilo"],
  ["city", 120, 1, "A cidade"],
  ["description", 2000, 1, "A descrição"],
  ["imageUrl", 500, 2, "O link da foto"],
];
// Primeira etapa com problema, para levar o usuário direto ao campo
function validateListing(v) {
  if (!v.title.trim()) return [1, "Informe o título do anúncio."];
  if (!v.categoryId) return [1, "Escolha uma categoria."];
  if (!v.size.trim()) return [1, "Informe o tamanho."];
  if (!v.description.trim()) return [1, "Escreva uma descrição para a peça."];
  const tooLong = listingLimits.find(([field, max]) => v[field].trim().length > max);
  if (tooLong) return [tooLong[2], `${tooLong[3]} deve ter no máximo ${tooLong[1]} caracteres.`];
  if (v.deal !== "Troca" && !(Number(v.price) > 0)) return [3, "Informe um preço válido."];
  // preco é numeric(10,2) no banco
  if (v.deal !== "Troca" && Number(v.price) >= 100_000_000)
    return [3, "O preço deve ser menor que R$ 100.000.000,00."];
  return null;
}
// O vendedor não vai no corpo: a API usa o usuário do token
function toAnuncio(v, status) {
  return {
    titulo: v.title.trim(),
    descricao: v.description.trim(),
    preco: v.deal === "Troca" ? null : Number(v.price),
    marca: v.brand.trim() || null,
    tamanho: v.size.trim(),
    condicao: v.condition,
    estilo: v.style.trim() || null,
    cidade: v.city.trim() || null,
    estado: v.state.trim().toUpperCase().slice(0, 2) || null,
    tipoNegociacao: dealCode(v.deal),
    status,
    categoriaId: Number(v.categoryId),
  };
}
export function ListingForm({ edit = false, id }) {
  const { notify, user } = useApp();
  const navigate = useNavigate();
  const refresh = useRefreshCatalog();
  const { products, categories, isLoading, offline } = useCatalog();
  const existing = edit ? products.find((p) => p.id === id) : undefined;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  // Trava contra clique duplo: o estado "saving" só desabilita o botão depois da nova renderização
  const busy = useRef(false);
  // Anúncio já gravado cuja foto falhou: a nova tentativa atualiza este id em vez de criar outro
  const createdId = useRef(null);
  const [error, setError] = useState("");
  const values = form ?? (existing ? fromProduct(existing) : emptyListing);
  const set = (field) => (value) => setForm({ ...values, [field]: value });
  const deal = values.deal;
  const preview = values.imageUrl.trim() || null;
  const blocked = !user
    ? [
        "Entre na sua conta para anunciar",
        "Seus anúncios ficam ligados ao seu perfil.",
        "/login",
        "Entrar",
      ]
    : offline
      ? [
          "Servidor indisponível",
          "Ligue o back-end do ZYCLOS para publicar anúncios.",
          "/anuncios",
          "Ver anúncios",
        ]
      : edit && !isLoading && !existing
        ? ["Anúncio não encontrado", "Ele pode ter sido removido.", "/anuncios", "Ver anúncios"]
        : edit && existing && existing.sellerId !== user.id
          ? ["Este anúncio não é seu", "Só quem publicou pode editar.", "/anuncios", "Ver anúncios"]
          : null;
  async function save() {
    if (busy.current) return;
    const invalid = validateListing(values);
    if (invalid) {
      setStep(invalid[0]);
      setError(invalid[1]);
      return;
    }
    busy.current = true;
    setError("");
    setSaving(true);
    const body = toAnuncio(values, existing?.status ?? "ATIVO");
    const anuncioId = edit ? id : createdId.current;
    try {
      const saved = anuncioId
        ? await api.put(`/anuncios/${anuncioId}`, body)
        : await api.post("/anuncios", body);
      if (!edit) createdId.current = saved.id;
      const imageId = existing?.imageIds?.[0];
      const image = { url: preview, principal: true, ordem: 0, anuncioId: saved.id };
      if (preview && imageId) await api.put(`/anuncio-imagens/${imageId}`, image);
      else if (preview) await api.post("/anuncio-imagens", image);
      else if (imageId) await api.delete(`/anuncio-imagens/${imageId}`);
      await refresh();
      notify(edit ? "Alterações salvas com sucesso." : "Seu anúncio foi publicado com sucesso!");
      void navigate({ to: "/anuncios/$id", params: { id: String(saved.id) } });
    } catch (err) {
      setError(err.message);
      setSaving(false);
      busy.current = false;
    }
  }
  async function remove() {
    setSaving(true);
    try {
      // Exclusão lógica: o anúncio sai do catálogo, mas favoritos e conversas continuam íntegros
      await api.put(`/anuncios/${id}`, toAnuncio(fromProduct(existing), "INATIVO"));
      await refresh();
      notify("Anúncio excluído.");
      void navigate({ to: "/anuncios", search: {} });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }
  return (
    <Page
      title={edit ? "Editar anúncio" : "Criar anúncio"}
      eyebrow={edit ? "Atualize sua peça" : "Nova peça em movimento"}
    >
      {blocked ? (
        <Empty
          icon={<Upload />}
          title={blocked[0]}
          text={blocked[1]}
          link={blocked[2]}
          action={blocked[3]}
        />
      ) : edit && !existing ? (
        <p className="text-center text-muted-foreground">Carregando anúncio...</p>
      ) : (
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 grid grid-cols-4 gap-2">
            {["Informações", "Fotos", "Preço", "Revisão"].map((label, i) => (
              <button
                key={label}
                onClick={() => setStep(i + 1)}
                className={`border-t-4 py-3 text-xs font-bold ${step >= i + 1 ? "border-primary text-primary" : "border-border text-muted-foreground"}`}
              >
                {i + 1}. {label}
              </button>
            ))}
          </div>
          <div className="rounded-lg border bg-card p-5 sm:p-8">
            {step === 1 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Título" name="title" value={values.title} onChange={set("title")} />
                <label className="text-sm font-semibold">
                  Categoria
                  <select
                    value={values.categoryId}
                    onChange={(e) => set("categoryId")(e.target.value)}
                    className="mt-2 h-11 w-full rounded-md border bg-background px-3 font-normal"
                  >
                    <option value="">Selecione</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </label>
                <Field
                  label="Marca"
                  name="brand"
                  required={false}
                  value={values.brand}
                  onChange={set("brand")}
                />
                <Field label="Tamanho" name="size" value={values.size} onChange={set("size")} />
                <label className="text-sm font-semibold">
                  Condição
                  <select
                    value={values.condition}
                    onChange={(e) => set("condition")(e.target.value)}
                    className="mt-2 h-11 w-full rounded-md border bg-background px-3 font-normal"
                  >
                    {[...new Set([...conditions, values.condition])].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <Field
                  label="Estilo"
                  name="style"
                  required={false}
                  value={values.style}
                  onChange={set("style")}
                />
                <Field
                  label="Cidade"
                  name="city"
                  required={false}
                  value={values.city}
                  onChange={set("city")}
                />
                <Field
                  label="Estado (UF)"
                  name="state"
                  required={false}
                  value={values.state}
                  onChange={set("state")}
                />
                <label className="text-sm font-semibold sm:col-span-2">
                  Descrição
                  <textarea
                    className="mt-2 min-h-28 w-full rounded-md border bg-background p-3 font-normal"
                    value={values.description}
                    onChange={(e) => set("description")(e.target.value)}
                  />
                </label>
                <label className="text-sm font-semibold sm:col-span-2">
                  Tipo de negociação
                  <select
                    value={deal}
                    onChange={(e) => set("deal")(e.target.value)}
                    className="mt-2 h-10 w-full rounded-md border bg-background px-3"
                  >
                    {Object.values(deals).map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            {step === 2 && (
              <div className="grid gap-5">
                <div className="grid min-h-72 place-items-center rounded-lg border-2 border-dashed bg-muted text-center">
                  <div>
                    {preview ? (
                      <img
                        src={preview}
                        alt="Prévia da foto"
                        className="mx-auto mb-4 size-48 rounded-lg object-cover"
                      />
                    ) : (
                      <ImagePlus className="mx-auto mb-4 size-10 text-primary" />
                    )}
                    <strong className="block">Adicione a foto da peça</strong>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      Cole abaixo o link (URL) de uma imagem
                    </span>
                  </div>
                </div>
                <Field
                  label="Link da foto"
                  name="imageUrl"
                  type="url"
                  required={false}
                  value={values.imageUrl}
                  onChange={set("imageUrl")}
                />
              </div>
            )}
            {step === 3 && (
              <div className="space-y-5">
                <div className="rounded-lg bg-accent p-5">
                  <strong>{deal}</strong>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {deal === "Troca"
                      ? "Esta peça ficará disponível para propostas de troca."
                      : "Defina um valor justo para a sua peça."}
                  </p>
                </div>
                {deal !== "Troca" && (
                  <Field
                    label="Preço (R$)"
                    name="price"
                    type="number"
                    value={values.price}
                    onChange={set("price")}
                  />
                )}
              </div>
            )}
            {step === 4 && (
              <div>
                <h2 className="font-display text-xl font-bold">Revise seu anúncio</h2>
                <div className="mt-5 flex gap-5 rounded-lg bg-muted p-4">
                  {preview ? (
                    <img src={preview} alt="Prévia" className="size-28 rounded-md object-cover" />
                  ) : (
                    <div className="grid size-28 place-items-center rounded-md bg-background">
                      <ShirtFallback />
                    </div>
                  )}
                  <div>
                    <strong>{values.title || "Sua nova peça"}</strong>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {deal} ·{" "}
                      {formatPrice(deal === "Troca" || !values.price ? null : Number(values.price))}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {categories.find((c) => String(c.id) === values.categoryId)?.nome ??
                        "Sem categoria"}
                      {values.size && ` · Tam. ${values.size}`} · {values.condition}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <Alert variant="destructive" className="mt-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="mt-8 flex justify-between">
              <Button variant="outline" disabled={step === 1} onClick={() => setStep(step - 1)}>
                <ArrowLeft />
                Voltar
              </Button>
              {step < 4 ? (
                <Button onClick={() => setStep(step + 1)}>Continuar</Button>
              ) : (
                <Button disabled={saving} onClick={() => void save()}>
                  {saving && <LoaderCircle className="animate-spin" />}
                  {edit ? "Salvar alterações" : "Publicar anúncio"}
                </Button>
              )}
            </div>
            {edit && (
              <div className="mt-4 flex justify-between border-t pt-4">
                <Button
                  variant="ghost"
                  onClick={() => void navigate({ to: "/anuncios/$id", params: { id } })}
                >
                  Cancelar
                </Button>
                <Button variant="destructive" disabled={saving} onClick={() => void remove()}>
                  <Trash2 />
                  Excluir anúncio
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </Page>
  );
}
function ShirtFallback() {
  return <Upload className="size-8 text-muted-foreground" />;
}
export function SettingsPage() {
  const { notify } = useApp();
  const sections = [
    [User, "Perfil"],
    [Bell, "Notificações"],
    [MessageCircle, "Mensagens"],
    [Shield, "Segurança"],
    [Leaf, "Aparência"],
  ];
  return (
    <Page title="Configurações" eyebrow="Sua experiência">
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <nav className="space-y-1">
          {sections.map(([Icon, label], i) => (
            <Button
              key={label}
              variant={i === 0 ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <Icon />
              {label}
            </Button>
          ))}
        </nav>
        <div className="rounded-lg border bg-card p-6">
          <h2 className="font-display text-xl font-bold">Preferências da conta</h2>
          <div className="mt-6 divide-y">
            {[
              ["Receber notificações", "Novidades sobre suas trocas e anúncios"],
              ["Receber mensagens", "Avisos de novas conversas"],
              ["Mostrar perfil", "Seu perfil fica visível na comunidade"],
              ["Comunicação", "Receba novidades do ZYCLOS"],
            ].map(([title, text], i) => (
              <label key={title} className="flex items-center justify-between gap-4 py-5">
                <span>
                  <strong className="block text-sm">{title}</strong>
                  <span className="text-xs text-muted-foreground">{text}</span>
                </span>
                <input type="checkbox" defaultChecked={i < 3} className="size-5 accent-primary" />
              </label>
            ))}
          </div>
          <Button className="mt-6" onClick={() => notify("Preferências salvas.")}>
            <Settings />
            Salvar preferências
          </Button>
        </div>
      </div>
    </Page>
  );
}
