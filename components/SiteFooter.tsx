import Link from "next/link";
import type { Contact, Section, Service } from "@/lib/types";
import { fmtPhone, waLink } from "@/lib/data";

export function SiteFooter({ contact, services, section }: { contact: Contact; services: Service[]; section?: Section }) {
  return (
    <footer id="contacto" className="site-footer">
      <div className="grid grid-4">
        <div className="col">
          <div className="brand"><span className="word">ORIGEN</span></div>
          <p className="small">{section?.title || "Catering y eventos."}</p>
          <div className="display" style={{ fontStyle: "italic", fontSize: 18, color: "var(--olive)" }}>{contact.tagline}</div>
        </div>
        <div className="col">
          <div className="eyebrow">Servicios</div>
          {services.map((s) => <Link key={s.id} href={`/servicios/${s.slug}`}>{s.name}</Link>)}
        </div>
        <div className="col">
          <div className="eyebrow">Contacto</div>
          {contact.whatsapp && <a href={waLink(contact.whatsapp)}>WhatsApp · {fmtPhone(contact.whatsapp)}</a>}
          {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
          {contact.instagram && <a href={`https://instagram.com/${contact.instagram}`}>Instagram · @{contact.instagram}</a>}
        </div>
        <div className="col">
          <div className="eyebrow">Horario de atención</div>
          <p className="small">{contact.hours}<br />Respondemos cotizaciones en menos de {contact.responseTime}.</p>
        </div>
      </div>
      <div className="legal">
        <span>© {new Date().getFullYear()} Origen Catering y Eventos · {contact.area}</span>
        <span>Precios en MXN más IVA · Sujetos a cotización</span>
      </div>
    </footer>
  );
}
