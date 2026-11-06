import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeDollarSign,
  Leaf,
  MessageCircle,
  Recycle,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { acceptsTrade, useCatalog } from "@/data/catalog";
import hero from "@/assets/hero-urban-young.jpg";
// Página "Sobre": objetivo, justificativa e ODS 12 do projeto.
// Para usar o texto oficial do TCC, troque só os textos abaixo (o layout não muda)
const objetivo =
  "Criar uma plataforma de moda circular em que qualquer pessoa possa comprar, vender e trocar roupas e " +
  "acessórios usados, de pessoa para pessoa, prolongando a vida útil das peças.";
const justificativa = [
  "A indústria da moda produz grandes volumes de roupas, e muitas peças em bom estado ficam paradas no " +
    "guarda-roupa ou são descartadas antes do fim da sua vida útil.",
  "Comprar, vender e trocar peças usadas reduz a necessidade de produzir roupas novas e diminui o descarte, " +
    "além de ser um jeito mais econômico e pessoal de renovar o estilo.",
  "O ZYCLOS reúne essas formas de circular a moda num só lugar, com conversa direta entre as pessoas, propostas " +
    "de troca e uma comunidade com perfis e avaliações.",
];
const ods = {
  numero: 12,
  nome: "Consumo e Produção Responsáveis",
  texto:
    "A ODS 12 da ONU busca assegurar padrões de produção e de consumo sustentáveis. Entre suas metas está " +
    "reduzir substancialmente a geração de resíduos por meio da prevenção, redução, reciclagem e reúso (meta 12.5).",
  ligacao:
    "Cada peça que troca de dono no ZYCLOS é uma peça que deixa de ser descartada e uma roupa nova que não " +
    "precisa ser produzida: reúso na prática.",
};
const funcionalidades = [
  [ShoppingBag, "Compre", "Encontre peças únicas no catálogo, com busca e filtros."],
  [BadgeDollarSign, "Venda", "Anuncie em poucos passos o que você não usa mais."],
  [RefreshCcw, "Troque", "Ofereça uma peça sua em troca de outra, sem dinheiro."],
  [MessageCircle, "Converse", "Combine os detalhes direto com quem anunciou."],
  [ShieldCheck, "Confie", "Perfis com avaliações, denúncias e moderação."],
];
export function AboutPage() {
  const { products, isLoading, error } = useCatalog();
  // Números reais do catálogo (somem se a API estiver fora do ar)
  const stats = [
    [products.length, "anúncios ativos"],
    [products.filter(acceptsTrade).length, "peças disponíveis para troca"],
  ];
  return (
    <>
      <section className="relative overflow-hidden bg-background">
        <img
          src={hero}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover object-[67%_center] opacity-40"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <p className="mb-4 text-xs font-bold uppercase text-secondary">Sobre o ZYCLOS</p>
          <h1 className="max-w-2xl font-display text-4xl font-black leading-[1.05] sm:text-6xl">
            Roupas que continuam em movimento.
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground">
            Moda circular, consciente e de pessoa para pessoa.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2">
        <div>
          <span className="grid size-12 place-items-center rounded-md bg-primary text-primary-foreground">
            <Target />
          </span>
          <h2 className="mt-5 font-display text-3xl font-extrabold">Objetivo</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{objetivo}</p>
        </div>
        <div>
          <span className="grid size-12 place-items-center rounded-md bg-highlight text-highlight-foreground">
            <Recycle />
          </span>
          <h2 className="mt-5 font-display text-3xl font-extrabold">Justificativa</h2>
          <div className="mt-4 space-y-3 leading-relaxed text-muted-foreground">
            {justificativa.map((paragrafo) => (
              <p key={paragrafo}>{paragrafo}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-highlight text-highlight-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[auto_1fr] md:items-center">
          <div className="grid size-40 place-items-center rounded-2xl border-4 border-highlight-foreground/40 text-center">
            <div>
              <p className="text-sm font-bold uppercase">ODS</p>
              <p className="font-display text-7xl font-black leading-none">{ods.numero}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold uppercase text-highlight-foreground/80">
              Objetivo de Desenvolvimento Sustentável
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold">{ods.nome}</h2>
            <p className="mt-4 max-w-3xl text-highlight-foreground/90">{ods.texto}</p>
            <p className="mt-4 flex max-w-3xl gap-2 font-semibold">
              <Leaf className="mt-0.5 size-5 shrink-0" />
              {ods.ligacao}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-xs font-bold uppercase text-secondary">Como funciona</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold">Tudo o que você faz no ZYCLOS</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {funcionalidades.map(([Icon, titulo, texto]) => (
            <div key={titulo} className="rounded-lg border bg-card p-5">
              <Icon className="size-6 text-highlight" />
              <h3 className="mt-3 font-display font-bold">{titulo}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{texto}</p>
            </div>
          ))}
        </div>
        {!error && (
          <div className="mt-10 flex flex-wrap gap-8 border-t pt-8">
            {stats.map(([n, label]) => (
              <p key={label}>
                <strong className="block font-display text-4xl font-black">
                  {isLoading ? "—" : n}
                </strong>
                <span className="text-sm text-muted-foreground">{label}</span>
              </p>
            ))}
          </div>
        )}
        <div className="mt-10 flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link to="/anuncios">
              Ver anúncios <ArrowRight />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/criar-anuncio">Vender uma peça</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
