import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, Heart, LogIn, LogOut, Menu, MessageCircle, Plus, Search, Settings, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brand } from "./brand";
import { useApp } from "@/context/app-context";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
const links = [
    ["/", "Início"], ["/anuncios", "Anúncios"], ["/trocas", "Trocas"], ["/mensagens", "Mensagens"],
];
export function SiteShell({ children }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const { favorites, toast, user, signOut, notify } = useApp();
    const pathname = useRouterState({ select: state => state.location.pathname });
    const standalone = pathname === "/login" || pathname === "/cadastro" || pathname.startsWith("/admin");
    function submit(event) {
        event.preventDefault();
        void navigate({ to: "/anuncios", search: search ? { q: search } : {} });
        setOpen(false);
    }
    function handleSignOut() { signOut(); notify("Você saiu da sua conta."); void navigate({ to: "/" }); }
    if (standalone)
        return <div className="min-h-screen bg-background text-foreground">{children}{toast && <div role="status" className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-2xl"><MessageCircle className="size-4 text-highlight"/>{toast}</div>}</div>;
    return <div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" aria-label="Página inicial"><Brand /></Link>
        <form onSubmit={submit} className="relative ml-auto hidden max-w-sm flex-1 md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Busque por peças, marcas..." className="pl-9" aria-label="Pesquisar anúncios"/>
        </form>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          {links.map(([to, label]) => <Link key={to} to={to} activeOptions={{ exact: to === "/" }} className="border-b-2 border-transparent px-3 py-5 text-sm font-semibold text-muted-foreground hover:text-foreground" activeProps={{ className: "border-primary text-foreground" }}>{label}</Link>)}
        </nav>
        <div className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" size="icon" asChild><Link to="/favoritos" aria-label={`Favoritos: ${favorites.length}`}><Heart /><span className="sr-only">Favoritos</span></Link></Button>
          <Button variant="ghost" size="icon" asChild><Link to="/notificacoes" aria-label="Notificações"><Bell /></Link></Button>
          {user ? <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="sm"><span className="grid size-6 place-items-center rounded-full bg-primary text-xs text-primary-foreground">{user.name.charAt(0).toUpperCase()}</span>{user.name.split(" ")[0]}</Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56"><DropdownMenuLabel><span className="block">{user.name}</span><span className="block truncate text-xs font-normal text-muted-foreground">{user.email}</span></DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem asChild><Link to="/perfil"><User />Meu perfil</Link></DropdownMenuItem><DropdownMenuItem asChild><Link to="/configuracoes"><Settings />Configurações</Link></DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onSelect={handleSignOut} className="text-destructive"><LogOut />Sair</DropdownMenuItem></DropdownMenuContent></DropdownMenu> : <Button variant="outline" size="sm" asChild><Link to="/login"><LogIn /> Entrar</Link></Button>}
          <Button size="sm" asChild><Link to="/criar-anuncio"><Plus /> Anunciar</Link></Button>
        </div>
        <Button className="ml-auto md:hidden" variant="ghost" size="icon" onClick={() => setOpen(!open)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open}>{open ? <X /> : <Menu />}</Button>
      </div>
      {open && <div className="border-t bg-background p-4 md:hidden">
        <form onSubmit={submit} className="relative mb-3"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar" aria-label="Pesquisar anúncios" className="pl-9 pr-12"/><Button type="submit" variant="ghost" size="icon" aria-label="Buscar" className="absolute right-0 top-1/2 -translate-y-1/2"><Search /></Button></form>
        <nav className="grid gap-1">{links.map(([to, label]) => <Link key={to} to={to} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 font-semibold hover:bg-muted">{label}</Link>)}
          <Link to="/favoritos" onClick={() => setOpen(false)} className="rounded-md px-3 py-3 font-semibold">Favoritos ({favorites.length})</Link>
          <Link to="/notificacoes" onClick={() => setOpen(false)} className="rounded-md px-3 py-3 font-semibold">Notificações</Link>
          {user ? <><Link to="/perfil" onClick={() => setOpen(false)} className="rounded-md px-3 py-3 font-semibold">{user.name}</Link><Button variant="ghost" className="justify-start" onClick={() => { setOpen(false); handleSignOut(); }}><LogOut /> Sair</Button></> : <Button variant="outline" asChild><Link to="/login" onClick={() => setOpen(false)}><LogIn /> Entrar</Link></Button>}
          <Button asChild className="mt-2"><Link to="/criar-anuncio" onClick={() => setOpen(false)}><Plus /> Criar anúncio</Link></Button>
        </nav>
      </div>}
    </header>
    <main>{children}</main>
    <footer className="border-t bg-surface-dark text-primary-foreground"><div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[1.5fr_1fr_1fr]"><div><Brand /><p className="mt-4 max-w-sm text-sm text-primary-foreground/70">Moda circular feita por pessoas. Compre, venda e troque com consciência.</p></div><div><p className="font-bold">Descubra</p><div className="mt-3 grid gap-2 text-sm text-primary-foreground/70"><Link to="/anuncios">Anúncios</Link><Link to="/trocas">Trocas</Link><Link to="/favoritos">Favoritos</Link></div></div><div><p className="font-bold">ZYCLOS</p><div className="mt-3 grid gap-2 text-sm text-primary-foreground/70"><Link to="/configuracoes">Configurações</Link><Link to="/admin">Área administrativa</Link></div></div></div></footer>
    {toast && <div role="status" className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-2xl"><MessageCircle className="size-4 text-highlight"/>{toast}</div>}
  </div>;
}
