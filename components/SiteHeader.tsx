import Link from "next/link";
import type { Theme } from "@/lib/types";

export function SiteHeader({ theme, active }: { theme: Theme; active?: string }) {
  const cls = (k: string) => (active === k ? "active" : undefined);
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="ORIGEN, inicio">
        {theme.logoUrl ? (
          <img src={theme.logoUrl} alt="ORIGEN" style={{ height: 48, width: "auto" }} />
        ) : (
          <>
            <span className="word">ORIGEN</span>
            <span className="sub">Catering y eventos</span>
          </>
        )}
      </Link>
      <nav className="site-nav" aria-label="Principal">
        <Link href="/#servicios" className={cls("servicios")}>Servicios</Link>
        <Link href="/#proceso" className={cls("proceso")}>Cómo trabajamos</Link>
        <Link href="/#contacto" className={cls("contacto")}>Contacto</Link>
        <Link href="/reservas" className="btn">Reservar</Link>
      </nav>
    </header>
  );
}
