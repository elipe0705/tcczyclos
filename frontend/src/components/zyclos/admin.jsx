import { useMemo, useState } from "react";
import { Link, Navigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  format,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  BarChart3,
  Boxes,
  Check,
  CircleAlert,
  LayoutDashboard,
  LoaderCircle,
  Lock,
  LogOut,
  Menu,
  Package,
  Pencil,
  Plus,
  Search,
  ShieldAlert,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { Brand } from "./brand";
import { Loading, QueryError } from "./common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { formatPrice } from "@/data/catalog";
import {
  REPORT_STATUSES,
  combineQueries,
  indexById,
  slugify,
  statusLabels,
  useAdminCategories,
  useAdminListings,
  useAdminReports,
  useAdminTrades,
  useAdminUsers,
  useRefreshAdmin,
} from "@/data/admin";
import { api } from "@/lib/api";
import { formatDate, formatRelative, initials } from "@/lib/format";
const nav = [
  ["/admin", "Dashboard", LayoutDashboard],
  ["/admin/anuncios", "Anúncios", Package],
  ["/admin/usuarios", "Usuários", Users],
  ["/admin/categorias", "Categorias", Boxes],
  ["/admin/denuncias", "Denúncias", ShieldAlert],
  ["/admin/relatorios", "Relatórios", BarChart3],
];
// Cores das séries dos gráficos (validadas contra o fundo escuro do painel)
const SERIES = {
  users: { color: "var(--secondary)", label: "Novos usuários" },
  ads: { color: "oklch(0.66 0.2 42)", label: "Novos anúncios" },
};
// A API já exige ADMIN nas listas completas; aqui só evitamos mostrar uma tela que não carregaria
export function AdminLayout({ children }) {
  const { user, ready } = useApp();
  if (!ready)
    return (
      <div className="grid min-h-screen place-items-center">
        <Loading text="Carregando..." />
      </div>
    );
  if (!user) return <Navigate to="/login" />;
  if (user.type !== "ADMIN")
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <span className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-muted">
            <Lock className="size-6" />
          </span>
          <h1 className="font-display text-2xl font-bold">Acesso restrito</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            O painel administrativo é só para contas de administrador.
          </p>
          <Button className="mt-5" asChild>
            <Link to="/">Voltar ao início</Link>
          </Button>
        </div>
      </div>
    );
  return <AdminShell user={user}>{children}</AdminShell>;
}
function AdminShell({ user, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-muted/70">
      {/* Backdrop for mobile */}
      {open && (
        <Button
          variant="ghost"
          aria-label="Fechar menu administrativo"
          className="fixed inset-0 z-40 h-full w-full rounded-none bg-background/70 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-surface-dark p-5 text-primary-foreground transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between">
          <Brand />
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Fechar menu administrativo"
            onClick={() => setOpen(false)}
          >
            <X />
          </Button>
        </div>

        <p className="mt-6 text-xs font-semibold uppercase text-primary-foreground/50 tracking-wider">
          Painel administrativo
        </p>

        <nav className="mt-6 grid gap-1">
          {nav.map(([to, label, Icon]) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: to === "/admin" }}
              className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
              activeProps={{ className: "!bg-primary !text-primary-foreground !opacity-100" }}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-5">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-primary-foreground/70 hover:text-primary-foreground"
            asChild
          >
            <Link to="/">
              <LogOut className="size-4" />
              Sair do painel
            </Link>
          </Button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-5 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Abrir menu administrativo"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </Button>
          <p className="font-display font-bold">Central ZYCLOS</p>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm font-medium md:block text-muted-foreground">
              {user.name}
            </span>
            <span className="grid size-9 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {initials(user.name)}
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
function Heading({ title, desc, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      </div>
      {action && <div className="flex flex-wrap items-center gap-2">{action}</div>}
    </div>
  );
}
function SearchBox({ value, onChange, placeholder = "Pesquisar..." }) {
  return (
    <div className="relative w-full sm:w-64">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  );
}
// Carregando / erro das consultas do painel (o erro mostra a mensagem da API)
function AdminState({ state, children }) {
  if (state.isPending) return <Loading text="Carregando dados..." />;
  if (state.error)
    return (
      <QueryError
        error={state.error}
        message="Não foi possível carregar os dados do painel."
        onRetry={state.refetch}
      />
    );
  return children();
}
const inLast = (date, from) => date && new Date(date) >= from;
// Contagem por mês (ou por dia) a partir do dataCadastro, incluindo os períodos sem registros
function timeSeries(buckets, unit, series) {
  const key = (d) => format(d, unit === "day" ? "yyyy-MM-dd" : "yyyy-MM");
  const rows = buckets.map((d) => ({
    name:
      unit === "day"
        ? format(d, "dd/MM")
        : format(d, buckets.length > 12 ? "MMM/yy" : "MMM", { locale: ptBR }).replace(/^./, (c) =>
            c.toUpperCase(),
          ),
    key: key(d),
    ...Object.fromEntries(Object.keys(series).map((s) => [s, 0])),
  }));
  const index = Object.fromEntries(rows.map((r, i) => [r.key, i]));
  for (const [s, list] of Object.entries(series))
    for (const item of list) {
      if (!item.dataCadastro) continue;
      const i = index[key(new Date(item.dataCadastro))];
      if (i != null) rows[i][s] += 1;
    }
  return rows;
}
const lastMonths = (n) =>
  eachMonthOfInterval({ start: startOfMonth(subMonths(new Date(), n - 1)), end: new Date() });
function GrowthChart({ data, label }) {
  return (
    <div className="mt-6 h-80 w-full" role="img" aria-label={label}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          barGap={2}
          barCategoryGap="25%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.4 }}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--popover)",
              color: "var(--popover-foreground)",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value) => <span style={{ color: "var(--muted-foreground)" }}>{value}</span>}
          />
          {Object.entries(SERIES).map(([key, s]) => (
            <Bar
              key={key}
              dataKey={key}
              name={s.label}
              fill={s.color}
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
export function Dashboard() {
  const users = useAdminUsers();
  const listings = useAdminListings();
  const categories = useAdminCategories();
  const reports = useAdminReports();
  const trades = useAdminTrades();
  const state = combineQueries(users, listings, categories, reports, trades);
  return (
    <>
      <Heading title="Visão geral" desc="Acompanhe o movimento da comunidade." />
      <AdminState state={state}>
        {() => {
          const userById = indexById(users.data);
          const categoryById = indexById(categories.data);
          const stats = [
            {
              label: "Anúncios ativos",
              value: listings.data.filter((a) => a.status === "ATIVO" && a.codStatus).length,
              Icon: Package,
            },
            { label: "Usuários cadastrados", value: users.data.length, Icon: Users },
            {
              label: "Trocas aceitas",
              value: trades.data.filter((t) => t.status === "ACEITA").length,
              Icon: Check,
            },
            {
              label: "Denúncias pendentes",
              value: reports.data.filter((d) => d.status === "PENDENTE").length,
              Icon: CircleAlert,
            },
          ];
          const growth = timeSeries(lastMonths(6), "month", {
            users: users.data,
            ads: listings.data,
          });
          // Os 6 acontecimentos mais recentes entre cadastros, anúncios e denúncias
          const activity = [
            ...users.data.map((u) => ({
              id: `u${u.id}`,
              title: "Novo usuário cadastrado",
              detail: u.nome,
              date: u.dataCadastro,
            })),
            ...listings.data.map((a) => ({
              id: `a${a.id}`,
              title: "Novo anúncio publicado",
              detail: a.titulo,
              date: a.dataCadastro,
            })),
            ...reports.data.map((d) => ({
              id: `d${d.id}`,
              title: "Denúncia recebida",
              detail: d.motivo,
              date: d.dataCadastro,
            })),
          ]
            .sort((a, b) => String(b.date).localeCompare(String(a.date)))
            .slice(0, 6);
          return (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map(({ label, value, Icon }) => (
                  <div key={label} className="rounded-lg border bg-card p-5 shadow-sm">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">{label}</span>
                      <div className="rounded-md bg-primary/10 p-2 text-primary">
                        <Icon className="size-5" />
                      </div>
                    </div>
                    <p className="mt-4 font-display text-3xl font-black">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <h2 className="text-lg font-bold">Crescimento da comunidade</h2>
                  <p className="text-sm text-muted-foreground">
                    Novos usuários e anúncios por mês (últimos 6 meses)
                  </p>
                  <GrowthChart
                    data={growth}
                    label="Novos usuários e anúncios por mês nos últimos 6 meses"
                  />
                </div>

                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <h2 className="text-lg font-bold">Atividade recente</h2>
                  {activity.length ? (
                    <div className="mt-6 space-y-6">
                      {activity.map((x) => (
                        <div key={x.id} className="flex gap-4">
                          <div className="mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-highlight" />
                          <div className="min-w-0">
                            <p className="text-sm font-bold leading-none">{x.title}</p>
                            <p className="mt-1 truncate text-sm text-muted-foreground">
                              {x.detail}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {formatRelative(x.date)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-6 text-sm text-muted-foreground">Nenhuma atividade ainda.</p>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <Heading title="Anúncios recentes" desc="Últimas peças publicadas." />
                <ListingsTable
                  rows={listings.data.slice(0, 5)}
                  userById={userById}
                  categoryById={categoryById}
                />
              </div>
            </>
          );
        }}
      </AdminState>
    </>
  );
}
function ListingsTable({ rows, userById, categoryById }) {
  return (
    <DataTable
      headers={["Produto", "Vendedor", "Categoria", "Preço", "Publicado em", "Status"]}
      empty="Nenhum anúncio publicado ainda."
      rows={rows.map((a) => [
        a.titulo,
        userById[a.vendedorId]?.nome ?? `Usuário #${a.vendedorId}`,
        categoryById[a.categoriaId]?.nome ?? "—",
        formatPrice(a.preco),
        formatDate(a.dataCadastro),
        <StatusBadge key="s" value={a.status} />,
      ])}
    />
  );
}
// Só leitura: a API deixa só o dono editar o anúncio
export function Ads() {
  const [q, setQ] = useState("");
  const listings = useAdminListings();
  const users = useAdminUsers();
  const categories = useAdminCategories();
  return (
    <>
      <Heading
        title="Anúncios"
        desc="Todas as peças publicadas, ativas e inativas."
        action={<SearchBox value={q} onChange={setQ} placeholder="Buscar por título ou vendedor" />}
      />
      <AdminState state={combineQueries(listings, users, categories)}>
        {() => {
          const userById = indexById(users.data);
          const term = q.trim().toLowerCase();
          const rows = listings.data.filter(
            (a) =>
              a.titulo.toLowerCase().includes(term) ||
              (userById[a.vendedorId]?.nome ?? "").toLowerCase().includes(term),
          );
          return (
            <ListingsTable
              rows={rows}
              userById={userById}
              categoryById={indexById(categories.data)}
            />
          );
        }}
      </AdminState>
    </>
  );
}
// Só leitura: a API não deixa o ADMIN editar outros usuários
export function UsersPage() {
  const [q, setQ] = useState("");
  const users = useAdminUsers();
  return (
    <>
      <Heading
        title="Usuários"
        desc="Contas cadastradas na comunidade."
        action={<SearchBox value={q} onChange={setQ} placeholder="Buscar por nome ou e-mail" />}
      />
      <AdminState state={users}>
        {() => {
          const term = q.trim().toLowerCase();
          const rows = users.data.filter((u) =>
            [u.nome, u.username, u.email].join(" ").toLowerCase().includes(term),
          );
          return (
            <DataTable
              headers={["Nome", "Usuário", "E-mail", "Cadastro", "Tipo", "Status"]}
              empty="Nenhum usuário encontrado."
              rows={rows.map((u) => [
                u.nome,
                `@${u.username}`,
                u.email,
                formatDate(u.dataCadastro),
                u.tipoUsuario === "ADMIN" ? "Administrador" : "Usuário",
                <StatusBadge key="s" value={u.codStatus ? "ATIVO" : "INATIVO"} />,
              ])}
            />
          );
        }}
      </AdminState>
    </>
  );
}
export function Categories() {
  const categories = useAdminCategories();
  const listings = useAdminListings();
  const refresh = useRefreshAdmin();
  const { notify } = useApp();
  // null = fechado; {} = nova categoria; {id...} = editar
  const [editing, setEditing] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [error, setError] = useState("");
  const toggle = useMutation({
    mutationFn: (c) => api.put(`/categorias/${c.id}`, { ...c, codStatus: !c.codStatus }),
    onSuccess: (c) => {
      notify(c.codStatus ? "Categoria ativada." : "Categoria desativada.");
      return refresh("categorias");
    },
    onError: (err) => setError(err.message),
  });
  const remove = useMutation({
    mutationFn: (c) => api.delete(`/categorias/${c.id}`),
    onSuccess: () => {
      notify("Categoria excluída.");
      return refresh("categorias");
    },
    // 409: há anúncios nesta categoria
    onError: (err) => setError(err.message),
  });
  return (
    <>
      <Heading
        title="Categorias"
        desc="Organize como as peças são encontradas."
        action={
          <Button onClick={() => setEditing({})}>
            <Plus /> Adicionar categoria
          </Button>
        }
      />
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <AdminState state={combineQueries(categories, listings)}>
        {() => {
          const count = {};
          for (const a of listings.data) count[a.categoriaId] = (count[a.categoriaId] ?? 0) + 1;
          return (
            <DataTable
              headers={["Nome", "Slug", "Descrição", "Anúncios", "Status", "Ações"]}
              empty="Nenhuma categoria cadastrada."
              rows={[...categories.data]
                .sort((a, b) => a.nome.localeCompare(b.nome))
                .map((c) => [
                  c.nome,
                  c.slug,
                  <span key="d" className="block max-w-64 truncate" title={c.descricao ?? ""}>
                    {c.descricao || "—"}
                  </span>,
                  String(count[c.id] ?? 0),
                  <StatusBadge key="s" value={c.codStatus ? "ATIVO" : "INATIVO"} feminine />,
                  <div key="a" className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setError("");
                        setEditing(c);
                      }}
                    >
                      <Pencil /> Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={toggle.isPending}
                      onClick={() => {
                        setError("");
                        toggle.mutate(c);
                      }}
                    >
                      {c.codStatus ? "Desativar" : "Ativar"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => {
                        setError("");
                        setRemoving(c);
                      }}
                    >
                      <Trash2 /> Excluir
                    </Button>
                  </div>,
                ])}
            />
          );
        }}
      </AdminState>
      {editing && (
        <CategoryDialog
          key={editing.id ?? "nova"}
          category={editing}
          onClose={() => setEditing(null)}
          onSaved={() => refresh("categorias")}
        />
      )}
      <AlertDialog open={removing != null} onOpenChange={(open) => !open && setRemoving(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir a categoria {removing?.nome}?</AlertDialogTitle>
            <AlertDialogDescription>
              Só é possível excluir categorias sem anúncios. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={() => remove.mutate(removing)}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
function CategoryDialog({ category, onClose, onSaved }) {
  const { notify } = useApp();
  const isNew = category.id == null;
  const [nome, setNome] = useState(category.nome ?? "");
  const [slug, setSlug] = useState(category.slug ?? "");
  // Na criação, o slug acompanha o nome até ser editado à mão
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [descricao, setDescricao] = useState(category.descricao ?? "");
  const save = useMutation({
    mutationFn: () => {
      const body = { nome: nome.trim(), slug: slug.trim(), descricao: descricao.trim() || null };
      // PUT grava o objeto completo (inclusive codStatus)
      return isNew
        ? api.post("/categorias", body)
        : api.put(`/categorias/${category.id}`, { ...category, ...body });
    },
    onSuccess: async () => {
      await onSaved();
      notify(isNew ? "Categoria criada." : "Categoria atualizada.");
      onClose();
    },
  });
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? "Nova categoria" : `Editar ${category.nome}`}</DialogTitle>
          <DialogDescription>
            O slug é usado em endereços: letras minúsculas, números e hífens.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <label className="text-sm font-semibold">
            Nome
            <Input
              className="mt-2"
              maxLength={60}
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
            />
          </label>
          <label className="text-sm font-semibold">
            Slug
            <Input
              className="mt-2"
              maxLength={60}
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
            />
          </label>
          <label className="text-sm font-semibold">
            Descrição (opcional)
            <textarea
              maxLength={255}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="mt-2 min-h-20 w-full rounded-md border bg-background p-3 font-normal"
            />
          </label>
          {save.error && (
            <Alert variant="destructive">
              <AlertDescription>{save.error.message}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" disabled={save.isPending || !nome.trim() || !slug.trim()}>
            {save.isPending && <LoaderCircle className="animate-spin" />}
            {isNew ? "Criar categoria" : "Salvar alterações"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export function Complaints() {
  const reports = useAdminReports();
  const users = useAdminUsers();
  const listings = useAdminListings();
  const [analyzing, setAnalyzing] = useState(null);
  return (
    <>
      <Heading title="Denúncias" desc="Analise ocorrências da plataforma." />
      <AdminState state={combineQueries(reports, users, listings)}>
        {() => {
          const userById = indexById(users.data);
          const listingById = indexById(listings.data);
          return (
            <DataTable
              headers={["Denunciante", "Alvo", "Motivo", "Data", "Status", "Ações"]}
              empty="Nenhuma denúncia."
              rows={reports.data.map((d) => [
                userById[d.denuncianteId]?.nome ?? `Usuário #${d.denuncianteId}`,
                <ReportTarget
                  key="t"
                  report={d}
                  listing={listingById[d.anuncioId]}
                  user={userById[d.usuarioDenunciadoId]}
                />,
                d.motivo,
                formatDate(d.dataCadastro),
                <StatusBadge key="s" value={d.status} />,
                <Button key="a" size="sm" variant="outline" onClick={() => setAnalyzing(d)}>
                  Analisar
                </Button>,
              ])}
            />
          );
        }}
      </AdminState>
      {analyzing && (
        <ReportDialog
          key={analyzing.id}
          report={analyzing}
          reporter={users.data && indexById(users.data)[analyzing.denuncianteId]}
          listing={listings.data && indexById(listings.data)[analyzing.anuncioId]}
          onClose={() => setAnalyzing(null)}
        />
      )}
    </>
  );
}
function ReportTarget({ report, listing, user }) {
  return (
    <span className="block">
      {report.anuncioId != null &&
        (listing ? (
          <span className="block">{listing.titulo}</span>
        ) : (
          <span className="block">Anúncio #{report.anuncioId}</span>
        ))}
      {report.usuarioDenunciadoId != null && (
        <span className="block text-xs text-muted-foreground">
          {user ? `${user.nome} (@${user.username})` : `Usuário #${report.usuarioDenunciadoId}`}
        </span>
      )}
      {report.anuncioId == null && report.usuarioDenunciadoId == null && "—"}
    </span>
  );
}
function ReportDialog({ report, reporter, listing, onClose }) {
  const { notify } = useApp();
  const refresh = useRefreshAdmin();
  const [status, setStatus] = useState(report.status);
  const [resposta, setResposta] = useState(report.respostaModeracao ?? "");
  const save = useMutation({
    // PUT com o objeto completo; a data de resolução é preenchida ao resolver ou rejeitar
    mutationFn: () =>
      api.put(`/denuncias/${report.id}`, {
        ...report,
        status,
        respostaModeracao: resposta.trim() || null,
        dataResolucao:
          status === "RESOLVIDA" || status === "REJEITADA"
            ? (report.dataResolucao ?? format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"))
            : null,
      }),
    onSuccess: async () => {
      await refresh("denuncias");
      notify("Denúncia atualizada.");
      onClose();
    },
  });
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Analisar denúncia</DialogTitle>
          <DialogDescription>
            {reporter ? `Enviada por ${reporter.nome}` : "Denúncia"} em{" "}
            {formatDate(report.dataCadastro)}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 rounded-md bg-muted p-4 text-sm">
          <p>
            <strong>Motivo:</strong> {report.motivo}
          </p>
          {report.anuncioId != null && (
            <p>
              <strong>Anúncio:</strong>{" "}
              {listing?.status === "ATIVO" ? (
                <Link
                  to="/anuncios/$id"
                  params={{ id: String(report.anuncioId) }}
                  className="text-secondary underline"
                  target="_blank"
                >
                  {listing.titulo}
                </Link>
              ) : (
                (listing?.titulo ?? `#${report.anuncioId}`)
              )}
            </p>
          )}
          {report.descricao && (
            <p className="whitespace-pre-line text-muted-foreground">{report.descricao}</p>
          )}
        </div>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <label className="text-sm font-semibold">
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-2 h-10 w-full rounded-md border bg-background px-3 font-normal"
            >
              {REPORT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s][0]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Resposta da moderação (opcional)
            <textarea
              maxLength={1000}
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              className="mt-2 min-h-24 w-full rounded-md border bg-background p-3 font-normal"
            />
            <span className="mt-1 block text-right text-xs font-normal text-muted-foreground">
              {resposta.length}/1000
            </span>
          </label>
          {save.error && (
            <Alert variant="destructive">
              <AlertDescription>{save.error.message}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" disabled={save.isPending}>
            {save.isPending && <LoaderCircle className="animate-spin" />}
            Salvar análise
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
const periods = [
  ["7 dias", 7],
  ["30 dias", 30],
  ["12 meses", 365],
  ["Tudo", null],
];
export function Reports() {
  const [period, setPeriod] = useState("30 dias");
  const users = useAdminUsers();
  const listings = useAdminListings();
  const categories = useAdminCategories();
  const reports = useAdminReports();
  const trades = useAdminTrades();
  const state = combineQueries(users, listings, categories, reports, trades);
  return (
    <>
      <Heading
        title="Relatórios"
        desc="Atividade da comunidade no período escolhido."
        action={periods.map(([label]) => (
          <Button
            key={label}
            size="sm"
            variant={period === label ? "default" : "outline"}
            onClick={() => setPeriod(label)}
          >
            {label}
          </Button>
        ))}
      />
      <AdminState state={state}>
        {() => (
          <ReportView
            days={periods.find(([label]) => label === period)[1]}
            period={period}
            users={users.data}
            listings={listings.data}
            categories={categories.data}
            reports={reports.data}
            trades={trades.data}
          />
        )}
      </AdminState>
    </>
  );
}
function ReportView({ days, period, users, listings, categories, reports, trades }) {
  const data = useMemo(() => {
    const all = [...users, ...listings, ...reports, ...trades]
      .map((x) => x.dataCadastro)
      .filter(Boolean)
      .sort();
    const now = new Date();
    // "Tudo": desde o primeiro registro
    const from =
      days == null
        ? startOfMonth(all.length ? new Date(all[0]) : now)
        : days === 365
          ? startOfMonth(subMonths(now, 11))
          : startOfDay(subDays(now, days - 1));
    const within = (list) => list.filter((x) => inLast(x.dataCadastro, from));
    const newListings = within(listings);
    // Troca aceita conta pela data em que foi aceita (dataAtualizacao)
    const accepted = trades.filter(
      (t) => t.status === "ACEITA" && inLast(t.dataAtualizacao ?? t.dataCadastro, from),
    );
    const unit = days != null && days <= 30 ? "day" : "month";
    const buckets =
      unit === "day"
        ? eachDayOfInterval({ start: from, end: now })
        : eachMonthOfInterval({ start: from, end: now });
    const perCategory = categories
      .map((c) => ({
        name: c.nome,
        total: newListings.filter((a) => a.categoriaId === c.id).length,
      }))
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total);
    return {
      cards: [
        ["Novos usuários", within(users).length],
        ["Novos anúncios", newListings.length],
        ["Propostas de troca", within(trades).length],
        ["Trocas aceitas", accepted.length],
        ["Denúncias", within(reports).length],
      ],
      series: timeSeries(buckets, unit, { users: within(users), ads: newListings }),
      unit,
      perCategory,
      maxCategory: Math.max(1, ...perCategory.map((c) => c.total)),
    };
  }, [days, users, listings, categories, reports, trades]);
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {data.cards.map(([label, value]) => (
          <div key={label} className="rounded-lg border bg-card p-5 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <strong className="mt-3 block font-display text-3xl font-black">{value}</strong>
            <small className="text-muted-foreground">
              {period === "Tudo" ? "desde o início" : `nos últimos ${period}`}
            </small>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">Novos usuários e anúncios</h2>
          <p className="text-sm text-muted-foreground">Por {data.unit === "day" ? "dia" : "mês"}</p>
          <GrowthChart
            data={data.series}
            label={`Novos usuários e anúncios por ${data.unit === "day" ? "dia" : "mês"}`}
          />
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">Anúncios por categoria</h2>
          <p className="text-sm text-muted-foreground">Publicados no período</p>
          {data.perCategory.length ? (
            <ul className="mt-6 grid gap-4">
              {data.perCategory.map((c) => (
                <li key={c.name}>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">{c.name}</span>
                    <span className="text-muted-foreground">{c.total}</span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(c.total / data.maxCategory) * 100}%`,
                        background: SERIES.ads.color,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">
              Nenhum anúncio publicado no período.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
const badgeTone = {
  ok: "bg-highlight/20 text-highlight",
  warn: "bg-secondary/20 text-secondary",
  alert: "bg-destructive/10 text-destructive",
  off: "bg-muted text-muted-foreground",
};
// Selo de status com o texto em português (ATIVO -> Ativo; feminine: Ativa/Inativa para categorias)
function StatusBadge({ value, feminine = false }) {
  const [label, tone] = statusLabels[value] ?? [value, "off"];
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${badgeTone[tone]}`}>
      {feminine ? label.replace(/o$/, "a") : label}
    </span>
  );
}
function DataTable({ headers, rows, empty = "Nenhum registro." }) {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-6 py-4 font-bold text-muted-foreground">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-6 py-10 text-center text-muted-foreground"
                >
                  {empty}
                </td>
              </tr>
            )}
            {rows.map((row, i) => (
              <tr key={i} className="transition-colors hover:bg-muted/30">
                {row.map((cell, j) => (
                  <td key={j} className="px-6 py-4 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Visual cue for horizontal scroll on small screens */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-card/80 to-transparent sm:hidden" />
    </div>
  );
}
