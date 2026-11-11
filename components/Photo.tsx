const TONES = ["#C9A98E", "#8E9A7A", "#B9826A", "#A8A091", "#D4B8A2", "#7C8468", "#C3917A", "#9E8B7B"];

export function Photo({ src, alt, label, tone = 0, className = "", style }: {
  src?: string | null; alt?: string; label?: string; tone?: number; className?: string; style?: React.CSSProperties;
}) {
  if (src) {
    return (
      <div className={`photo ${className}`} style={style}>
        <img src={src} alt={alt ?? label ?? ""} loading="lazy" />
      </div>
    );
  }
  return (
    <div className={`photo ${className}`} style={{ background: TONES[tone % TONES.length], ...style }} aria-label={label} role="img">
      <div className="ph">
        <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 70 Q 25 50 50 68 T 100 62 L100 100 L0 100Z" fill="#000" /></svg>
        <span>Foto · {label ?? "pendiente"}</span>
      </div>
    </div>
  );
}
