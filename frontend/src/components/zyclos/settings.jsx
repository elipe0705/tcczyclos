import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Save, User } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useApp } from "@/context/app-context";
import { api } from "@/lib/api";
import { Empty, Loading, QueryError, UserAvatar } from "./common";
import { Page } from "./page";
// Mesmos limites das colunas da tabela usuario (e da validação do UsuarioService)
const profileSchema = z
  .object({
    nome: z
      .string()
      .trim()
      .min(2, "Digite seu nome completo.")
      .max(100, "O nome deve ter no máximo 100 caracteres."),
    username: z
      .string()
      .trim()
      .min(3, "O nome de usuário deve ter ao menos 3 caracteres.")
      .max(30, "O nome de usuário deve ter no máximo 30 caracteres.")
      .regex(
        /^[a-zA-Z0-9._]+$/,
        "Use apenas letras, números, ponto ou sublinhado no nome de usuário.",
      ),
    email: z.string().trim().email("Digite um e-mail válido.").max(255),
    avatarUrl: z.string().trim().max(500, "O link da foto deve ter no máximo 500 caracteres."),
    bio: z.string().trim().max(500, "A bio deve ter no máximo 500 caracteres."),
    cidade: z.string().trim().max(120, "A cidade deve ter no máximo 120 caracteres."),
    estado: z
      .string()
      .trim()
      .regex(/^([a-zA-Z]{2})?$/, "Use a sigla do estado com 2 letras (ex.: SP)."),
    senha: z.string(),
    confirmacao: z.string(),
  })
  .refine((v) => !v.senha || v.senha.length >= 8, {
    message: "A nova senha deve ter pelo menos 8 caracteres.",
    path: ["senha"],
  })
  .refine((v) => v.senha.length <= 72, {
    message: "A nova senha deve ter no máximo 72 caracteres.",
    path: ["senha"],
  })
  .refine((v) => v.senha === v.confirmacao, {
    message: "A confirmação não confere com a nova senha.",
    path: ["confirmacao"],
  });
export function SettingsPage() {
  const { user } = useApp();
  return (
    <Page title="Editar perfil" eyebrow="Configurações">
      {user ? (
        <ProfileForm user={user} />
      ) : (
        <Empty icon={<User />} title="Entre para editar seu perfil" link="/login" action="Entrar" />
      )}
    </Page>
  );
}
function ProfileForm({ user }) {
  const query = useQuery({
    queryKey: ["usuario", user.id],
    queryFn: () => api.get(`/usuarios/${user.id}`),
  });
  if (query.isPending) return <Loading text="Carregando seus dados..." />;
  if (query.error)
    return (
      <QueryError
        error={query.error}
        message="Não foi possível carregar seus dados."
        onRetry={query.refetch}
      />
    );
  // key: depois de salvar, o formulário recomeça com os dados gravados
  return <ProfileFormFields key={JSON.stringify(query.data)} usuario={query.data} />;
}
function ProfileFormFields({ usuario }) {
  const { updateUser, notify } = useApp();
  const queryClient = useQueryClient();
  const [values, setValues] = useState({
    nome: usuario.nome ?? "",
    username: usuario.username ?? "",
    email: usuario.email ?? "",
    avatarUrl: usuario.avatarUrl ?? "",
    bio: usuario.bio ?? "",
    cidade: usuario.cidade ?? "",
    estado: usuario.estado ?? "",
    senha: "",
    confirmacao: "",
  });
  const [error, setError] = useState("");
  const set = (field) => (e) => setValues({ ...values, [field]: e.target.value });
  // PUT /usuarios/{id} grava TODOS os campos: o corpo sempre leva o perfil completo.
  // Senha vazia mantém a atual
  const save = useMutation({
    mutationFn: (data) =>
      api.put(`/usuarios/${usuario.id}`, {
        nome: data.nome,
        username: data.username,
        email: data.email,
        avatarUrl: data.avatarUrl || null,
        bio: data.bio || null,
        cidade: data.cidade || null,
        estado: data.estado ? data.estado.toUpperCase() : null,
        senha: data.senha || null,
      }),
    onSuccess: (saved) => {
      updateUser(saved);
      void queryClient.invalidateQueries({ queryKey: ["usuario"] });
      void queryClient.invalidateQueries({ queryKey: ["perfil"] });
      void queryClient.invalidateQueries({ queryKey: ["catalog"] });
      notify("Perfil atualizado.");
    },
    onError: (err) => setError(err.message),
  });
  function submit(e) {
    e.preventDefault();
    setError("");
    const result = profileSchema.safeParse(values);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Revise os dados informados.");
      return;
    }
    save.mutate(result.data);
  }
  const preview = values.avatarUrl.trim();
  return (
    <form className="mx-auto grid max-w-3xl gap-6" onSubmit={submit} noValidate>
      <section className="rounded-lg border bg-card p-6">
        <h2 className="font-display text-xl font-bold">Dados do perfil</h2>
        <div className="mt-6 flex items-center gap-4">
          <UserAvatar name={values.nome} src={preview} className="size-16 text-xl" />
          <div className="min-w-0 flex-1">
            <TextField
              label="Link da foto de perfil (opcional)"
              type="url"
              value={values.avatarUrl}
              onChange={set("avatarUrl")}
            />
          </div>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <TextField
            label="Nome completo"
            value={values.nome}
            onChange={set("nome")}
            autoComplete="name"
          />
          <TextField
            label="Nome de usuário"
            value={values.username}
            onChange={set("username")}
            autoComplete="username"
          />
          <TextField
            label="E-mail"
            type="email"
            value={values.email}
            onChange={set("email")}
            autoComplete="email"
            className="sm:col-span-2"
          />
          <label className="text-sm font-semibold sm:col-span-2">
            Bio (opcional)
            <textarea
              maxLength={500}
              value={values.bio}
              onChange={set("bio")}
              className="mt-2 min-h-24 w-full rounded-md border bg-background p-3 font-normal"
            />
            <span className="mt-1 block text-right text-xs font-normal text-muted-foreground">
              {values.bio.length}/500
            </span>
          </label>
          <TextField label="Cidade (opcional)" value={values.cidade} onChange={set("cidade")} />
          <TextField
            label="Estado (UF)"
            value={values.estado}
            onChange={set("estado")}
            maxLength={2}
          />
        </div>
      </section>
      <section className="rounded-lg border bg-card p-6">
        <h2 className="font-display text-xl font-bold">Alterar senha</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Deixe em branco para manter a senha atual.
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <TextField
            label="Nova senha"
            type="password"
            value={values.senha}
            onChange={set("senha")}
            autoComplete="new-password"
          />
          <TextField
            label="Confirmar nova senha"
            type="password"
            value={values.confirmacao}
            onChange={set("confirmacao")}
            autoComplete="new-password"
          />
        </div>
      </section>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-wrap justify-between gap-3">
        <Button variant="outline" asChild>
          <Link to="/perfil">Ver meu perfil</Link>
        </Button>
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? <LoaderCircle className="animate-spin" /> : <Save />}
          Salvar alterações
        </Button>
      </div>
    </form>
  );
}
function TextField({ label, className = "", ...props }) {
  return (
    <label className={`text-sm font-semibold ${className}`}>
      {label}
      <Input className="mt-2 h-11 font-normal" {...props} />
    </label>
  );
}
