import Image from "next/image";

type MediaSlotProps = {
  step: string;
  label: string;
  src?: string;
  alt?: string;
  className?: string;
};

/**
 * Placeholder frame for a feature shot that will later be replaced with a
 * generated video/render. Pass `src` once the asset exists — layout stays
 * the same either way.
 */
export default function MediaSlot({ step, label, src, alt, className = "" }: MediaSlotProps) {
  if (src) {
    return (
      <div className={`relative overflow-hidden rounded-2xl border border-border ${className}`}>
        <Image
          src={src}
          alt={alt ?? label}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-dashed border-border bg-muted text-center ${className}`}
    >
      <span className="eyebrow text-xs uppercase text-accent">{step}</span>
      <span className="max-w-[220px] text-sm text-foreground/50">{label}</span>
    </div>
  );
}
