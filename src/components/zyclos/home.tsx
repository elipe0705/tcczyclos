import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgeDollarSign, Leaf, RefreshCcw, ShoppingBag, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero-fashion.jpg";
import { categories, products } from "@/data/mock";
import { ProductCard } from "./product-card";

const pillars = [
  [ShoppingBag, "Compre", "Encontre peças que combinam com você."],
  [BadgeDollarSign, "Venda", "Dê uma nova vida ao que você não usa."],
  [RefreshCcw, "Troque", "Renove seu estilo com a comunidade."],
  [Leaf, "Sustentabilidade", "Prolongue a vida útil das roupas."],
] as const;

export function HomePage() {
  return <>
    <section className="relative min-h-[calc(100vh-4.5rem)] overflow-hidden bg-primary text-primary-foreground lg:min-h-[720px]">
      <img src={hero} alt="Mulher usando moda reaproveitada em um ateliê" width={1280} height={1536} className="absolute inset-0 size-full object-cover object-center lg:left-auto lg:w-[54%]" />
      <div className="absolute inset-0 bg-hero-overlay lg:w-[70%]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-7xl items-end px-6 pb-14 pt-24 lg:min-h-[720px] lg:items-center lg:py-24">
        <div className="max-w-2xl"><p className="mb-5 text-sm font-bold uppercase">Moda circular · De pessoa para pessoa</p><h1 className="font-display text-5xl font-black leading-[1.02] sm:text-6xl lg:text-7xl">Moda que continua em movimento.</h1><p className="mt-6 max-w-xl text-lg text-primary-foreground/85">Compre, venda e troque peças com histórias. Um jeito mais consciente, econômico e pessoal de renovar seu estilo.</p><div className="mt-8 flex flex-wrap gap-3"><Button size="lg" variant="secondary" asChild><Link to="/anuncios">Explorar anúncios <ArrowRight /></Link></Button><Button size="lg" variant="outlineOnDark" asChild><Link to="/criar-anuncio">Vender uma peça</Link></Button></div></div>
      </div>
    </section>
    <section className="border-b bg-background"><div className="mx-auto grid max-w-7xl divide-y px-6 py-6 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">{pillars.map(([Icon, title, text]) => <div key={title} className="flex gap-4 px-4 py-5"><Icon className="size-6 shrink-0 text-highlight" /><div><h2 className="font-display font-bold">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{text}</p></div></div>)}</div></section>
    <section className="mx-auto max-w-7xl px-6 py-16"><div className="mb-8 flex items-end justify-between"><div><p className="text-xs font-bold uppercase text-secondary">Encontre seu estilo</p><h2 className="mt-2 font-display text-3xl font-extrabold">Explore por categoria</h2></div><Link to="/anuncios" className="hidden items-center gap-1 text-sm font-bold text-primary sm:flex">Ver todas <ArrowRight className="size-4" /></Link></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">{categories.map((category) => <Link key={category} to="/anuncios" search={{ categoria: category }} className="group grid aspect-square place-items-center rounded-lg border bg-card p-3 text-center transition hover:border-primary hover:bg-muted"><Shirt className="mb-2 size-7 text-secondary transition group-hover:scale-110" /><span className="text-sm font-bold">{category}</span></Link>)}</div></section>
    <section className="bg-muted/60"><div className="mx-auto max-w-7xl px-6 py-16"><div className="mb-8 flex items-end justify-between"><div><p className="text-xs font-bold uppercase text-secondary">Curadoria da comunidade</p><h2 className="mt-2 font-display text-3xl font-extrabold">Anúncios em destaque</h2></div><Button variant="outline" asChild><Link to="/anuncios">Ver todos</Link></Button></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div></div></section>
    <section className="bg-highlight text-highlight-foreground"><div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 md:items-center"><div><Leaf className="size-9" /><h2 className="mt-5 font-display text-3xl font-extrabold">Dar uma nova vida para uma peça também é cuidar do planeta.</h2><p className="mt-4 text-highlight-foreground/80">Indicadores demonstrativos desta versão do ZYCLOS.</p></div><div className="grid grid-cols-2 gap-3">{[["12", "Peças reaproveitadas"], ["7", "Trocas realizadas"], ["9", "Anúncios publicados"], ["~", "Recursos poupados"]].map(([n, label]) => <div key={label} className="border-l border-highlight-foreground/30 p-4"><p className="font-display text-3xl font-black">{n}</p><p className="text-sm">{label}</p></div>)}</div></div></section>
  </>;
}