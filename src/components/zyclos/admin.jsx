import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AreaChart, Area, BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3, BellRing, Boxes, Check, CircleAlert, LayoutDashboard, LogOut, Menu, Package, Search, Settings, ShieldAlert, Users, X } from "lucide-react";
import { Brand } from "./brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { adminUsers, categories, products } from "@/data/mock";
import { useApp } from "@/context/app-context";
const nav = [
    ["/admin", "Dashboard", LayoutDashboard],
    ["/admin/anuncios", "Anúncios", Package],
    ["/admin/usuarios", "Usuários", Users],
    ["/admin/categorias", "Categorias", Boxes],
    ["/admin/denuncias", "Denúncias", ShieldAlert],
    ["/admin/relatorios", "Relatórios", BarChart3],
    ["/admin/configuracoes", "Configurações", Settings]
];
const chart = [
    { name: "Abr", users: 180, ads: 130 },
    { name: "Mai", users: 240, ads: 185 },
    { name: "Jun", users: 310, ads: 260 },
    { name: "Jul", users: 420, ads: 330 },
    { name: "Ago", users: 510, ads: 410 },
    { name: "Set", users: 684, ads: 526 }
];
export function AdminLayout({ children }) {
    const [open, setOpen] = useState(false);
    return (<div className="min-h-screen bg-muted/70">
      {/* Backdrop for mobile */}
      {open && (<Button variant="ghost" aria-label="Fechar menu administrativo" className="fixed inset-0 z-40 h-full w-full rounded-none bg-background/70 lg:hidden" onClick={() => setOpen(false)}/>)}
      
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-surface-dark p-5 text-primary-foreground transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between">
          <Brand />
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Fechar menu administrativo" onClick={() => setOpen(false)}>
            <X />
          </Button>
        </div>
        
        <p className="mt-6 text-xs font-semibold uppercase text-primary-foreground/50 tracking-wider">Painel administrativo</p>
        
        <nav className="mt-6 grid gap-1">
          {nav.map(([to, label, Icon]) => (<Link key={to} to={to} onClick={() => setOpen(false)} activeOptions={{ exact: to === "/admin" }} className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground" activeProps={{ className: "!bg-primary !text-primary-foreground !opacity-100" }}>
              <Icon className="size-4"/>
              {label}
            </Link>))}
        </nav>
        
        <div className="mt-auto pt-5">
          <Button variant="ghost" className="w-full justify-start gap-3 text-primary-foreground/70 hover:text-primary-foreground" asChild>
            <Link to="/">
              <LogOut className="size-4"/>
              Sair do painel
            </Link>
          </Button>
        </div>
      </aside>
      
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-5 backdrop-blur">
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu administrativo" onClick={() => setOpen(true)}>
            <Menu />
          </Button>
          <p className="font-display font-bold">Central ZYCLOS</p>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
              <BellRing className="size-5"/>
            </Button>
            <div className="flex items-center gap-2">
              <span className="hidden text-sm font-medium md:block text-muted-foreground">Administrador</span>
              <span className="grid size-9 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">AD</span>
            </div>
          </div>
        </header>
        
        <main className="p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>);
}
function Heading({ title, desc, action }) {
    return (<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>);
}
function SearchBox({ value, onChange }) {
    return (<div className="relative w-full sm:w-64">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
      <Input type="search" value={value} onChange={e => onChange(e.target.value)} className="pl-9" placeholder="Pesquisar..."/>
    </div>);
}
export function Dashboard() {
    const stats = [
        { label: "Total de anúncios", value: "526", Icon: Package, trend: "+8%" },
        { label: "Usuários cadastrados", value: "684", Icon: Users, trend: "+12%" },
        { label: "Trocas realizadas", value: "148", Icon: Check, trend: "+5%" },
        { label: "Denúncias pendentes", value: "12", Icon: CircleAlert, trend: "-2%" }
    ];
    return (<>
      <Heading title="Visão geral" desc="Acompanhe o movimento da comunidade."/>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, Icon, trend }) => (<div key={label} className="rounded-lg border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">{label}</span>
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <Icon className="size-5"/>
              </div>
            </div>
            <p className="mt-4 font-display text-3xl font-black">{value}</p>
            <small className={`font-semibold ${trend.startsWith('+') ? 'text-highlight' : 'text-destructive'}`}>
              {trend} neste mês
            </small>
          </div>))}
      </div>
      
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">Crescimento da comunidade</h2>
          <div className="mt-6 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}/>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}/>
                <Area type="monotone" dataKey="users" stroke="var(--primary)" fill="url(#fillUsers)" strokeWidth={3} animationDuration={1500}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">Atividade recente</h2>
          <div className="mt-6 space-y-6">
            {["Novo anúncio publicado", "Proposta de troca aceita", "Novo usuário cadastrado", "Denúncia recebida"].map((x, i) => (<div key={x} className="flex gap-4">
                <div className="mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-highlight shadow-[0_0_8px_var(--highlight)]"/>
                <div>
                  <p className="text-sm font-bold leading-none">{x}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Há {i + 1} hora(s)</p>
                </div>
              </div>))}
          </div>
          <Button variant="ghost" className="mt-8 w-full border-t pt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-transparent hover:text-primary">
            Ver todo o histórico
          </Button>
        </div>
      </div>
      
      <div className="mt-8">
        <Heading title="Anúncios recentes" desc="Últimas peças publicadas."/>
        <DataTable headers={["Produto", "Usuário", "Categoria", "Preço", "Status"]} rows={products.slice(0, 4).map(p => [
            p.name,
            p.seller,
            p.category,
            p.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
            "Ativo"
        ])}/>
      </div>
    </>);
}
export function Ads() {
    const [q, setQ] = useState("");
    const rows = products
        .filter(p => p.name.toLowerCase().includes(q.toLowerCase()))
        .map(p => [
        p.name,
        p.seller,
        p.category,
        p.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        "Ativo"
    ]);
    return (<>
      <Heading title="Gerenciar anúncios" desc="Revise e acompanhe as peças publicadas." action={<SearchBox value={q} onChange={setQ}/>}/>
      <DataTable headers={["Produto", "Usuário", "Categoria", "Preço", "Status"]} rows={rows}/>
    </>);
}
export function UsersPage() {
    const [q, setQ] = useState("");
    const { notify } = useApp();
    const rows = adminUsers
        .filter(r => r.join(" ").toLowerCase().includes(q.toLowerCase()))
        .map(r => [
        ...r,
        <Button key={r[1]} size="sm" variant="outline" onClick={() => notify(`${r[0]} atualizado(a).`)}>Gerenciar</Button>
    ]);
    return (<>
      <Heading title="Usuários" desc="Gerencie os perfis da comunidade." action={<SearchBox value={q} onChange={setQ}/>}/>
      <DataTable headers={["Nome", "Usuário", "E-mail", "Cadastro", "Status", "Ações"]} rows={rows}/>
    </>);
}
export function Categories() {
    const [items, setItems] = useState(categories);
    const [name, setName] = useState("");
    return (<>
      <Heading title="Categorias" desc="Organize como as peças são encontradas." action={<Dialog>
            <DialogTrigger asChild>
              <Button>Adicionar categoria</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova categoria</DialogTitle>
                <DialogDescription>Ela ficará disponível apenas nesta demonstração.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Nome da categoria"/>
                <Button onClick={() => { if (name) {
            setItems([...items, name]);
            setName("");
        } }}>Adicionar</Button>
              </div>
            </DialogContent>
          </Dialog>}/>
      <DataTable headers={["Nome", "Anúncios", "Status", "Criação", "Ações"]} rows={items.map((c, i) => [
            c,
            String(12 + i * 4),
            "Ativa",
            "12/03/2026",
            <Button key={c} variant="ghost" size="sm">Editar</Button>
        ])}/>
    </>);
}
export function Complaints() {
    const { notify } = useApp();
    const rows = [
        ["Nina Costa", "Calça cargo preta", "Descrição incorreta", "Hoje", "Pendente"],
        ["Ravi Alves", "Camiseta natureza", "Imagem inadequada", "Ontem", "Em análise"],
        ["Caio Mendes", "Tênis retrô", "Conduta no chat", "24/09", "Resolvida"]
    ].map(r => [
        ...r,
        <Button key={r[0]} size="sm" variant="outline" onClick={() => notify("Denúncia atualizada.")}>Resolver</Button>
    ]);
    return (<>
      <Heading title="Denúncias" desc="Analise ocorrências da plataforma."/>
      <DataTable headers={["Usuário", "Anúncio", "Motivo", "Data", "Status", "Ações"]} rows={rows}/>
    </>);
}
export function Reports() {
    const [period, setPeriod] = useState("30 dias");
    return (<>
      <Heading title="Relatórios" desc="Indicadores demonstrativos da atividade." action={<div className="flex flex-wrap gap-2">
            {["Hoje", "7 dias", "30 dias", "12 meses"].map(p => (<Button key={p} size="sm" variant={period === p ? "default" : "outline"} onClick={() => setPeriod(p)}>
                {p}
              </Button>))}
          </div>}/>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">Anúncios e usuários</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}/>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}/>
                <Bar dataKey="ads" fill="var(--primary)" radius={[4, 4, 0, 0]}/>
                <Bar dataKey="users" fill="var(--highlight)" radius={[4, 4, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          {[["Usuários", "+18%"], ["Anúncios", "+24%"], ["Trocas", "+11%"], ["Denúncias", "-6%"]].map(([a, b]) => (<div key={a} className="rounded-lg border bg-card p-6 shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">{a}</p>
              <strong className="mt-3 block font-display text-3xl font-black">{b}</strong>
              <small className="text-muted-foreground">em {period}</small>
            </div>))}
        </div>
      </div>
    </>);
}
export function AdminSettings() {
    const { notify } = useApp();
    return (<>
      <Heading title="Configurações administrativas" desc="Preferências visuais desta demonstração."/>
      <div className="max-w-2xl rounded-lg border bg-card p-8 shadow-sm">
        <div className="divide-y">
          {["Avisos de novas denúncias", "Resumo semanal", "Modo de revisão compacta"].map((x, i) => (<label key={x} className="flex cursor-pointer items-center justify-between py-5 transition-colors hover:bg-muted/30">
              <span className="font-medium">{x}</span>
              <input type="checkbox" defaultChecked={i < 2} className="size-5 accent-primary"/>
            </label>))}
        </div>
        <Button className="mt-8 w-full sm:w-auto" onClick={() => notify("Configurações salvas.")}>
          Salvar alterações
        </Button>
      </div>
    </>);
}
function DataTable({ headers, rows }) {
    return (<div className="relative overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              {headers.map(h => (<th key={h} className="px-6 py-4 font-bold text-muted-foreground">{h}</th>))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row, i) => (<tr key={i} className="transition-colors hover:bg-muted/30">
                {row.map((cell, j) => (<td key={j} className="px-6 py-4 whitespace-nowrap">
                    {j === headers.length - 1 && typeof cell === "string" ? (<span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${cell === "Ativo" || cell === "Resolvida" || cell === "Ativa"
                        ? "bg-highlight/20 text-highlight"
                        : cell === "Pendente" || cell === "Suspenso"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-muted text-muted-foreground"}`}>
                        {cell}
                      </span>) : cell}
                  </td>))}
              </tr>))}
          </tbody>
        </table>
      </div>
      {/* Visual cue for horizontal scroll on small screens */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-card/80 to-transparent sm:hidden"/>
    </div>);
}
