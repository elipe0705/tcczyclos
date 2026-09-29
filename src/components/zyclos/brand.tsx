import { Recycle } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 font-display text-xl font-extrabold text-primary" aria-label="ZYCLOS">
      <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground"><Recycle className="size-5" /></span>
      {!compact && <span>ZYCLOS</span>}
    </span>
  );
}