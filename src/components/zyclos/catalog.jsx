import { useMemo, useState } from "react";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, products } from "@/data/mock";
import { ProductCard } from "./product-card";
import { Page } from "./page";
export function CatalogPage({ initialQuery = "", initialCategory = "Todos" }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [deal, setDeal] = useState("Todos");
  const [sort, setSort] = useState("recentes");
  const [filters, setFilters] = useState(false);
  const [brand, setBrand] = useState("Todas as marcas");
  const [size, setSize] = useState("Todos");
  const [condition, setCondition] = useState("Todas");
  const filtered = useMemo(
    () =>
      products
        .filter(
          (product) =>
            (category === "Todos" || product.category === category) &&
            (deal === "Todos" || product.deal === deal) &&
            (brand === "Todas as marcas" || product.brand === brand) &&
            (size === "Todos" || product.size === size) &&
            (condition === "Todas" || product.condition === condition) &&
            product.name.toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "menor" ? a.price - b.price : sort === "maior" ? b.price - a.price : 0,
        ),
    [category, deal, brand, size, condition, query, sort],
  );
  const panel = (
    <div className="space-y-7">
      <div>
        <p className="mb-3 font-bold">Categorias</p>
        <div className="grid gap-1">
          {["Todos", ...categories].map((item) => (
            <Button
              key={item}
              variant={category === item ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setCategory(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 font-bold">Tipo de negociação</p>
        <div className="grid gap-2">
          {["Todos", "Venda", "Troca", "Venda ou troca"].map((item) => (
            <label key={item} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="deal"
                checked={deal === item}
                onChange={() => setDeal(item)}
                className="accent-primary"
              />
              {item}
            </label>
          ))}
        </div>
      </div>
      <div className="grid gap-3">
        <label className="text-sm font-bold">
          Marca
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="mt-2 h-10 w-full rounded-md border bg-background px-3 font-normal"
          >
            {["Todas as marcas", ...new Set(products.map((p) => p.brand))].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-bold">
          Tamanho
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="mt-2 h-10 w-full rounded-md border bg-background px-3 font-normal"
          >
            {["Todos", ...new Set(products.map((p) => p.size))].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-bold">
          Condição
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="mt-2 h-10 w-full rounded-md border bg-background px-3 font-normal"
          >
            {["Todas", ...new Set(products.map((p) => p.condition))].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
      </div>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setCategory("Todos");
          setDeal("Todos");
          setBrand("Todas as marcas");
          setSize("Todos");
          setCondition("Todas");
          setQuery("");
        }}
      >
        <X /> Limpar filtros
      </Button>
    </div>
  );
  return (
    <Page
      title="Todos os anúncios"
      eyebrow="Garimpe seu próximo favorito"
      description="Peças únicas, prontas para viver novas histórias."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar anúncios"
          />
        </div>
        <Button variant="outline" className="lg:hidden" onClick={() => setFilters(!filters)}>
          <Filter /> Filtros
        </Button>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="recentes">Mais recentes</option>
          <option value="menor">Menor preço</option>
          <option value="maior">Maior preço</option>
          <option value="relevantes">Mais relevantes</option>
        </select>
      </div>
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className={`${filters ? "block" : "hidden"} rounded-lg border bg-card p-5 lg:block`}>
          {panel}
          <Button className="mt-5 w-full lg:hidden" onClick={() => setFilters(false)}>
            Ver {filtered.length} anúncios
          </Button>
        </aside>
        <section>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">{filtered.length}</strong> anúncios encontrados
            </p>
            <SlidersHorizontal className="size-4 text-muted-foreground" />
          </div>
          {filtered.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid min-h-80 place-items-center rounded-lg border border-dashed text-center">
              <div>
                <Search className="mx-auto mb-3 size-8 text-muted-foreground" />
                <h2 className="font-bold">Nenhum anúncio encontrado.</h2>
                <Button
                  className="mt-4"
                  onClick={() => {
                    setCategory("Todos");
                    setDeal("Todos");
                    setBrand("Todas as marcas");
                    setSize("Todos");
                    setCondition("Todas");
                    setQuery("");
                  }}
                >
                  Limpar filtros
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </Page>
  );
}
