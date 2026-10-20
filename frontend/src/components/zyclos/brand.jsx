import logoAsset from "@/assets/zyclos-logo.png.asset.json";
export function Brand({ compact = false }) {
  return (
    <span className="inline-flex items-center" aria-label="ZYCLOS">
      <img
        src={logoAsset.url}
        alt="Zyclos"
        className={compact ? "size-10 object-contain" : "h-12 w-28 object-contain object-left"}
      />
    </span>
  );
}
