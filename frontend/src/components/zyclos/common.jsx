import { Link } from "@tanstack/react-router";
import { AlertTriangle, ImageOff, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initials } from "@/lib/format";
// Peças reutilizadas por várias telas: estado vazio, erro de carregamento, foto do anúncio e avatar

export function Empty({ icon, title, text, link, action, search }) {
  return (
    <div className="grid min-h-80 place-items-center rounded-lg border border-dashed p-6 text-center">
      <div>
        <span className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-muted [&>svg]:size-6">
          {icon}
        </span>
        <h2 className="font-display text-xl font-bold">{title}</h2>
        {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
        {link && (
          <Button className="mt-5" asChild>
            <Link to={link} search={search}>
              {action}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

// Erro de uma consulta à API, com a mensagem que ela devolveu e o botão para tentar de novo
export function QueryError({ error, message, onRetry, className = "" }) {
  return (
    <div
      role="alert"
      className={`grid min-h-48 place-items-center rounded-lg border border-dashed p-6 text-center ${className}`}
    >
      <div>
        <AlertTriangle className="mx-auto mb-3 size-8 text-destructive" />
        <p className="font-bold">{message ?? "Não foi possível carregar os dados."}</p>
        {error?.message && error.message !== message && (
          <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
        )}
        {onRetry && (
          <Button className="mt-4" variant="outline" onClick={() => void onRetry()}>
            Tentar novamente
          </Button>
        )}
      </div>
    </div>
  );
}

// Erro do catálogo (GET /anuncios/catalogo): normalmente o back-end está desligado
export function CatalogError({ error, onRetry, className }) {
  return (
    <QueryError
      error={error?.status === 0 ? null : error}
      message="Não foi possível carregar os anúncios. Verifique se o servidor está no ar."
      onRetry={onRetry}
      className={className}
    />
  );
}

export function Loading({ text = "Carregando..." }) {
  return (
    <p className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
      <LoaderCircle className="size-4 animate-spin" />
      {text}
    </p>
  );
}

// Foto do anúncio; sem foto, mostra um quadro neutro (nunca a foto de outra peça)
export function ListingImage({ src, alt, className = "", iconClassName = "size-8", ...props }) {
  if (!src)
    return (
      <div
        role="img"
        aria-label="Sem foto"
        className={`grid place-items-center bg-muted text-muted-foreground ${className}`}
      >
        <ImageOff className={iconClassName} />
      </div>
    );
  return <img src={src} alt={alt} className={`object-cover ${className}`} {...props} />;
}

// Foto de perfil (avatarUrl) ou as iniciais do nome
export function UserAvatar({ name, src, className = "size-10 text-sm" }) {
  if (src)
    return (
      <img
        src={src}
        alt={`Foto de ${name ?? "usuário"}`}
        className={`rounded-full object-cover ${className}`}
      />
    );
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-secondary font-bold text-secondary-foreground ${className}`}
    >
      {initials(name)}
    </span>
  );
}
