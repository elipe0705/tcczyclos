import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Heart, Menu, MessageCircle, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brand } from "./brand";
import { useApp } from "@/context/app-context";

const links = [
  ["/", "Início"], ["/anuncios", "Anúncios"], ["/trocas", "Trocas"], ["/mensagens", "Mensagens"],
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { favorites, toast } = useApp();
  function submit(event: React.FormEvent) {
    event.preventDefault();
    void navigate({ to: "/anuncios", search: search ? { q: search } : {} });
    setOpen(false);
  }
  return <div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" aria-label="Página inicial"><Brand /></Link>
        <form onSubmit={submit} className="relative ml-auto hidden max-w-sm flex-1 md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Busque por peças, marcas..." className="pl-9" aria-label="Pesquisar anúncios" />
        </form>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          {links.map(([to, label]) => <Link key={to} to={to} activeOptions={{ exact: to === "/" }} className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-primary" activeProps={{ className: "bg-muted text-primary" }}>{label}</Link>)}
        </nav>
        <div className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" size="icon" asChild><Link to="/favoritos" aria-label={`Favoritos: ${favorites.length}`}><Heart /><span className="sr-only">Favoritos</span></Link></Button>
          <Button variant="ghost" size="icon" asChild><Link to="/notificacoes" aria-label="Notificações"><Bell /></Link></Button>
          <Button variant="outline" size="sm" asChild><Link to="/perfil">Perfil</Link></Button>
          <Button size="sm" asChild><Link to="/criar-anuncio"><Plus /> Anunciar</Link></Button>
        </div>
        <Button className="ml-auto md:hidden" variant="ghost" size="icon" onClick={() => setOpen(!open)} aria-label="Abrir menu">{open ? <X /> : <Menu />}</Button>
      </div>
      {open && <div className="border-t p-4 md:hidden">
        <form onSubmit={submit} className="relative mb-3"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar" className="pl-9" /></form>
        <nav className="grid gap-1">{links.map(([to, label]) => <Link key={to} to={to} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 font-semibold hover:bg-muted">{label}</Link>)}
          <Link to="/favoritos" onClick={() => setOpen(false)} className="rounded-md px-3 py-3 font-semibold">Favoritos ({favorites.length})</Link>
          <Link to="/notificacoes" onClick={() => setOpen(false)} className="rounded-md px-3 py-3 font-semibold">Notificações</Link>
          <Link to="/perfil" onClick={() => setOpen(false)} className="rounded-md px-3 py-3 font-semibold">Perfil</Link>
          <Button asChild className="mt-2"><Link to="/criar-anuncio" onClick={() => setOpen(false)}><Plus /> Criar anúncio</Link></Button>
        </nav>
      </div>}
    </header>
    <main>{children}</main>
    <footer className="border-t bg-surface-dark text-primary-foreground"><div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[1.5fr_1fr_1fr]"><div><Brand /><p className="mt-4 max-w-sm text-sm text-primary-foreground/70">Moda circular feita por pessoas. Compre, venda e troque com consciência.</p></div><div><p className="font-bold">Descubra</p><div className="mt-3 grid gap-2 text-sm text-primary-foreground/70"><Link to="/anuncios">Anúncios</Link><Link to="/trocas">Trocas</Link><Link to="/favoritos">Favoritos</Link></div></div><div><p className="font-bold">ZYCLOS</p><div className="mt-3 grid gap-2 text-sm text-primary-foreground/70"><Link to="/configuracoes">Configurações</Link><Link to="/admin">Área administrativa</Link></div></div></div></footer>
    {toast && <div role="status" className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-2xl"><MessageCircle className="size-4 text-highlight" />{toast}</div>}
  </div>;
}