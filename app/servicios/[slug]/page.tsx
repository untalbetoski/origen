import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Gallery } from "@/components/Gallery";
import { getSections, getServiceBySlug, getServices, getSettings, money, waLink } from "@/lib/data";

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [{ theme, contact }, data, services, sections] = await Promise.all([getSettings(), getServiceBySlug(slug), getServices(), getSections()]);
  if (!data) notFound();
  const { service, packages, photos } = data;
  const idx = services.findIndex((s) => s.id === service.id);

  return (
    <div className="container">
      <SiteHeader theme={theme} active="servicios" />
      <nav aria-label="Ruta" style={{ padding: "22px 0 0", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", display: "flex", gap: 10 }}>
        <Link href="/">Inicio</Link><span>/</span><Link href="/#servicios">Servicios</Link><span>/</span><span style={{ color: "var(--ink)" }}>{service.name}</span>
      </nav>

      <section className="grid grid-12" style={{ padding: "36px 0 24px", alignItems: "start", gap: 40 }}>
        <div className="span-7">
          <Gallery photos={photos} fallbackLabel={service.name} />
        </div>
        <div className="span-5" style={{ display: "flex", flexDirection: "column", gap: 22, paddingTop: 8 }}>
          <div className="eyebrow">{String(idx + 1).padStart(2, "0")} · {service.name}</div>
          <h1 style={{ fontSize: "clamp(40px, 5vw, 54px)" }}>{service.tagline}</h1>
          <p className="lead" style={{ maxWidth: 440 }}>{service.description}</p>
          <div className="spec">
            <div><span>Desde</span><b>{money(service.price_from)} <small>/ persona</small></b></div>
            <div><span>Mínimo</span><b>{service.min_people} <small>personas</small></b></div>
            <div><span>Duración</span><strong style={{ fontSize: 14 }}>{service.duration}</strong></div>
            <div><span>Incluye</span><strong style={{ fontSize: 14 }}>{service.includes}</strong></div>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href={`/reservas?servicio=${service.slug}`} className="btn">Reservar este servicio</Link>
            {contact.whatsapp && <a href={waLink(contact.whatsapp, `Hola, me interesa el servicio "${service.name}" de Origen.`)} className="btn ghost">Preguntar por WhatsApp</a>}
          </div>
        </div>
      </section>

      <section className="section">
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
          <div className="eyebrow">Paquetes</div>
          <h2 style={{ fontSize: 40 }}>Elige tu formato.</h2>
        </div>
        <div className="grid grid-2" style={{ gap: 18 }}>
          {packages.filter((p) => p.visible).map((p) => (
            <div className={`card pkg${p.badge ? " featured" : ""}`} key={p.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                <h3>{p.name}</h3>
                {p.badge ? <span className="badge">{p.badge}</span> : <span className="small" style={{ fontSize: 11 }}>{p.min_people} pers. mín. · {p.duration}</span>}
              </div>
              {p.badge && <span className="small" style={{ fontSize: 11 }}>{p.min_people} pers. mín. · {p.duration}</span>}
              <div className="price"><small>desde </small><b>{money(p.price)}</b><small> / persona</small></div>
              <p className="small" style={{ fontSize: 13, color: "var(--ink)" }}>{p.description}</p>
              {p.dishes.length > 0 && (
                <div style={{ borderTop: "1px dashed var(--line)", paddingTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div className="eyebrow" style={{ color: "var(--olive)", fontSize: 9 }}>Sugerencia de platillos</div>
                  <ul>{p.dishes.map((d, i) => <li key={i}>{d}</li>)}</ul>
                </div>
              )}
              <Link href={`/reservas?servicio=${service.slug}&paquete=${encodeURIComponent(p.name)}`} className="link">Reservar este paquete →</Link>
            </div>
          ))}
        </div>
        <p className="small" style={{ marginTop: 18 }}>Precios de referencia por persona en MXN, más IVA y traslado. Los platillos sugeridos son una guía; la selección final se confirma en la cotización. Opciones vegetarianas sin costo adicional.</p>
      </section>

      <SiteFooter contact={contact} services={services.filter((s) => s.visible)} section={sections.footer} />
    </div>
  );
}
