import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Camera,
  Eye,
  EyeOff,
  Heart,
  ImagePlus,
  LoaderCircle,
  Lock,
  Mail,
  Recycle,
  Trash2,
  Upload,
  User,
  UserPlus,
} from "lucide-react";
import { z } from "zod";
import { Brand } from "./brand";
import { Page } from "./page";
import { ProductCard } from "./product-card";
import { CatalogError, Empty, Loading } from "./common";
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
            {!signup && (
              <label className="flex items-center gap-2 text-xs">
                <input name="remember" type="checkbox" className="accent-primary" /> Lembrar de mim
              </label>
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
export function FavoritesPage() {
  const { favorites, user } = useApp();
  const { products, isLoading, error, refetch } = useCatalog();
  const items = products.filter((p) => favorites.includes(p.id));
  return (
    <Page
      title="Seus favoritos"
      eyebrow="Peças que chamaram sua atenção"
      description={user && !isLoading && !error ? `${items.length} item(ns) salvo(s).` : undefined}
    >
      {user && error ? (
        <CatalogError error={error} onRetry={refetch} />
      ) : user && isLoading ? (
        <Loading text="Carregando favoritos..." />
      ) : items.length ? (
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
  const { products, categories, isLoading, error: catalogError } = useCatalog();
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
    : catalogError
      ? [
          "Servidor indisponível",
          "Não foi possível carregar as categorias e os anúncios. Verifique se o servidor está no ar.",
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
