import { Heart, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-context";
export function ProductCard({ product }) {
    const { favorites, toggleFavorite, notify } = useApp();
    const liked = favorites.includes(product.id);
    return (<article className="group min-w-0 overflow-hidden rounded-lg border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img src={product.image} alt={product.name} width={1024} height={1024} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"/>
        <Button variant="secondary" size="icon" aria-label={liked ? "Remover dos favoritos" : "Adicionar aos favoritos"} className="absolute right-3 top-3 shadow-sm" onClick={() => { toggleFavorite(product.id); notify(liked ? "Produto removido dos favoritos." : "Produto adicionado aos favoritos."); }}>
          <Heart className={liked ? "fill-highlight text-highlight" : "text-foreground"}/>
        </Button>
        <span className="absolute bottom-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">{product.deal}</span>
      </div>
      <div className="space-y-3 p-4">
        <div><p className="text-xs font-medium uppercase text-muted-foreground">{product.brand} · Tam. {product.size}</p><h3 className="mt-1 truncate font-display font-bold text-foreground">{product.name}</h3></div>
        <p className="font-display text-xl font-extrabold text-primary">{product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
        <div className="flex items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
          <span className="flex min-w-0 items-center gap-1 truncate"><MapPin className="size-3.5 shrink-0"/>{product.location}</span>
          <Link to="/anuncios/$id" params={{ id: product.id }} className="font-bold text-primary hover:text-secondary">Ver peça</Link>
        </div>
      </div>
    </article>);
}
