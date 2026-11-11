import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Photo } from "@/components/Photo";
import { getPhotosByService, getSections, getServices, getSettings, money, waLink } from "@/lib/data";

type Step = { title: string; text: string };
type Stat = { value: string; label: string };

export default async function Home() {
  const [{ theme, contact }, sections, services, photos] = await Promise.all([getSettings(), getSections(), getServices(), getPhotosByService()]);
  const hero = sections.hero, sv = sections.services, pr = sections.process, cta = sections.cta;
  const heroImgs = ((hero?.data?.images as string[]) ?? []);
  const stats = ((hero?.data?.stats as Stat[]) ?? []);
  const steps = ((pr?.data?.steps as Step[]) ?? []);
  const visible = services.filter((s) => s.visible);

  return (
    <div className="container">
      <SiteHeader theme={theme} />

      {hero?.visible && (
        <section className="hero">
          <div className="span-6" style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <div className="eyebrow">{hero.eyebrow}</div>
            <h1>{hero.title}</h1>
            <p className="lead">{hero.body}</p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", paddingTop: 6 }}>
              <Link href="/reservas" className="btn">{String(hero.data.cta_primary ?? "Reservar")}</Link>
              <Link href="/#servicios" className="btn ghost">{String(hero.data.cta_secondary ?? "Ver servicios")}</Link>
            </div>
            {stats.length > 0 && (
              <div className="stats" style={{ paddingTop: 12 }}>
                {stats.map((s, i) => <div className="stat" key={i}><b>{s.value}</b><span>{s.label}</span></div>)}
              </div>
            )}
          </div>
          <div className="span-6 grid grid-2" style={{ gap: 12 }}>
            <Photo src={heroImgs[0]} label="Mesa montada" tone={0} style={{ gridColumn: "span 2", aspectRatio: "16 / 10" }} />
            <Photo src={heroImgs[1]} label="Canapés de autor" tone={1} style={{ aspectRatio: "1 / 1" }} />
            <Photo src={heroImgs[2]} label="Parrilla en vivo" tone={2} style={{ aspectRatio: "1 / 1" }} />
          </div>
        </section>
      )}

      {theme.logoUrl && (
        <section style={{ display: "flex", justifyContent: "center", padding: "10px 0 30px" }}>
          <img src={theme.logoUrl} alt="ORIGEN" style={{ width: 300, height: 140, objectFit: "contain" }} />
        </section>
      )}

      <section id="servicios" className="section">
        <div className="section-head">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="eyebrow">{sv?.eyebrow}</div>
            <h2>{sv?.title}</h2>
          </div>
          <p className="lead" style={{ maxWidth: 460 }}>{sv?.body}</p>
        </div>
        <div className="grid grid-2">
          {visible.map((s, i) => {
            const pics = (photos[s.id] ?? []).slice(0, 3);
            return (
              <article className="card service-card" key={s.id}>
                <div className="thumbs">
                  {[0, 1, 2].map((k) => <Photo key={k} src={pics[k]?.url} alt={pics[k]?.caption} label={s.name} tone={(i * 3 + k) % 8} />)}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <h3>{s.name}</h3>
                  <p className="small" style={{ fontSize: 13.5 }}>{s.tagline} {s.description.split(". ")[0]}.</p>
                </div>
                <div className="foot">
                  <div className="price"><small>desde </small><b>{money(s.price_from)}</b><small> / persona</small></div>
                  <Link href={`/servicios/${s.slug}`} className="link">Ver menús →</Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {pr?.visible && (
        <section id="proceso" className="grid grid-12" style={{ padding: "48px 0 24px" }}>
          <div className="span-4" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="eyebrow">{pr.eyebrow}</div>
            <h2 style={{ fontSize: 40 }}>{pr.title}</h2>
            <p className="lead" style={{ maxWidth: 320 }}>{pr.body}</p>
          </div>
          <div className="span-8 steps">
            {steps.map((st, i) => (
              <div className="step" key={i}>
                <div className="n">{String(i + 1).padStart(2, "0")}</div>
                <h3>{st.title}</h3>
                <p className="small" style={{ fontSize: 13.5 }}>{st.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {cta?.visible && (
        <section className="cta-band">
          <div className="span-7" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="eyebrow">{cta.eyebrow}</div>
            <h2>{cta.title}</h2>
            <p style={{ fontSize: 15, lineHeight: 1.65, maxWidth: 520 }}>{cta.body}</p>
          </div>
          <div className="span-5" style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
            <Link href="/reservas" className="btn light">{String(cta.data.button ?? "Solicitar reserva")}</Link>
            {contact.whatsapp && <a href={waLink(contact.whatsapp, "Hola, me interesa cotizar un servicio de Origen.")} style={{ fontSize: 13, color: "#D8CCC0", minHeight: 44, display: "inline-flex", alignItems: "center" }}>{String(cta.data.secondary ?? "o escríbenos por WhatsApp →")}</a>}
          </div>
        </section>
      )}

      <SiteFooter contact={contact} services={visible} section={sections.footer} />
    </div>
  );
}
