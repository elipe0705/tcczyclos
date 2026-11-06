import { useEffect, useRef, useState } from "react";
import logoAsset from "@/assets/zyclos-logo.png.asset.json";
// O logo completo fica hospedado no Lovable e só carrega dentro dele. Fora do Lovable (rodando
// localmente), a imagem falha e no lugar aparecem o ícone do ZYCLOS (o mesmo do favicon) e o nome
export function Brand({ compact = false }) {
  // Começa sempre com o ícone + nome (nunca aparece imagem quebrada). O logo completo só
  // substitui depois de carregar de verdade (dentro do Lovable)
  const [loaded, setLoaded] = useState(false);
  const img = useRef(null);
  // A imagem pode terminar de carregar antes de o React assumir a página (o onLoad não roda)
  useEffect(() => {
    if (img.current?.complete && img.current.naturalWidth > 0) setLoaded(true);
  }, []);
  return (
    <span className="inline-flex items-center" aria-label="ZYCLOS">
      <img
        ref={img}
        src={logoAsset.url}
        alt=""
        onLoad={() => setLoaded(true)}
        className={
          loaded
            ? compact
              ? "size-10 object-contain"
              : "h-12 w-28 object-contain object-left"
            : "hidden"
        }
      />
      {!loaded && (
        <span className="inline-flex items-center gap-2">
          <img src="/favicon.png" alt="" className="size-9 rounded-md" />
          {!compact && (
            <span className="font-display text-xl font-extrabold tracking-wide">ZYCLOS</span>
          )}
        </span>
      )}
    </span>
  );
}
