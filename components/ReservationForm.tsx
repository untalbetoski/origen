"use client";
import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Photo } from "@/components/Photo";
import { createReservation } from "@/app/reservas/actions";
import type { Package, Service } from "@/lib/types";

const money = (n: number) => "$" + n.toLocaleString("es-MX");

export function ReservationForm({ services, packages, initialService, initialPackage, disclaimer, coverByService }: {
  services: Service[]; packages: Package[]; initialService?: string; initialPackage?: string; disclaimer: string; coverByService: Record<string, string | undefined>;
}) {
  const firstSlug = services.find((s) => s.slug === initialService)?.slug ?? services[0]?.slug ?? "";
  const [servicio, setServicio] = useState(firstSlug);
  const service = services.find((s) => s.slug === servicio);
  const pkgs = useMemo(() => packages.filter((p) => p.service_id === service?.id), [packages, service]);
  const [paquete, setPaquete] = useState(() => (pkgs.find((p) => p.name === initialPackage)?.name) ?? pkgs[0]?.name ?? "");
  const [f, setF] = useState({ fecha: "", hora: "", invitados: "", lugar: "", notas: "", nombre: "", correo: "", telefono: "" });
  const [pending, start] = useTransition();
  const [result, setResult] = useState<{ folio?: string; error?: string } | null>(null);

  const pkg = pkgs.find((p) => p.name === paquete) ?? pkgs[0];
  const guests = parseInt(f.invitados, 10) || 0;
  const min = pkg?.min_people ?? 0;
  const calc = Math.max(guests, min);
  const price = pkg?.price ?? 0;

  const changeService = (slug: string) => {
    setServicio(slug);
    const s = services.find((x) => x.slug === slug);
    const first = packages.find((p) => p.service_id === s?.id);
    setPaquete(first?.name ?? "");
  };
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const r = await createReservation({
        service_slug: servicio, package_name: pkg?.name ?? "", event_date: f.fecha, event_time: f.hora, guests,
        location: f.lugar, notes: f.notas, name: f.nombre, email: f.correo, phone: f.telefono,
      });
      setResult(r.ok ? { folio: r.folio } : { error: r.error });
    });
  };

  const fechaView = f.fecha ? new Date(f.fecha + "T12:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" }) : "Por definir";

  if (result?.folio) {
    return (
      <section className="grid grid-12" style={{ alignItems: "start" }}>
        <div className="span-7 card" style={{ padding: 40, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--olive)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--paper)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
          </div>
          <h2 style={{ fontSize: 40 }}>Recibimos tu solicitud, {f.nombre}.</h2>
          <p className="lead">Te escribiremos a <strong style={{ color: "var(--ink)" }}>{f.correo}</strong> y por WhatsApp al <strong style={{ color: "var(--ink)" }}>{f.telefono}</strong> en menos de 48 horas con la propuesta para <strong style={{ color: "var(--ink)" }}>{pkg?.name}</strong> el <strong style={{ color: "var(--ink)" }}>{fechaView}</strong>.</p>
          <p className="small">Folio de solicitud: <strong style={{ color: "var(--ink)" }}>{result.folio}</strong>. Si necesitas cambiar algo, respóndenos por correo o WhatsApp.</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", paddingTop: 8 }}>
            <button type="button" className="btn ghost" onClick={() => { setResult(null); setF({ fecha: "", hora: "", invitados: "", lugar: "", notas: "", nombre: "", correo: "", telefono: "" }); }}>Hacer otra solicitud</button>
            <Link href="/" className="btn ghost">Volver al inicio</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="grid grid-12" style={{ alignItems: "start" }}>
      <form onSubmit={submit} className="span-7" style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        <fieldset>
          <legend>1 · El servicio</legend>
          <div className="grid grid-2" style={{ gap: 16 }}>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="servicio">Tipo de servicio</label>
              <select id="servicio" value={servicio} onChange={(e) => changeService(e.target.value)}>
                {services.map((s) => <option key={s.id} value={s.slug}>{s.name} · desde {money(s.price_from)}</option>)}
              </select>
            </div>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="paquete">Paquete</label>
              <select id="paquete" value={pkg?.name ?? ""} onChange={(e) => setPaquete(e.target.value)}>
                {pkgs.map((p) => <option key={p.id} value={p.name}>{p.name} · desde {money(p.price)} · mín. {p.min_people}</option>)}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>2 · El evento</legend>
          <div className="grid grid-2" style={{ gap: 16 }}>
            <div className="field"><label htmlFor="fecha">Fecha</label><input id="fecha" type="date" value={f.fecha} onChange={set("fecha")} required /></div>
            <div className="field"><label htmlFor="hora">Hora de inicio</label><input id="hora" type="time" value={f.hora} onChange={set("hora")} /></div>
            <div className="field"><label htmlFor="invitados">Número de invitados</label><input id="invitados" type="number" min={10} step={1} value={f.invitados} onChange={set("invitados")} required /></div>
            <div className="field"><label htmlFor="lugar">Municipio o alcaldía</label><input id="lugar" type="text" placeholder="Ej. Naucalpan, Polanco…" value={f.lugar} onChange={set("lugar")} required /></div>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="notas">Ocasión, alergias o detalles (opcional)</label>
              <textarea id="notas" rows={3} placeholder="Cumpleaños, junta trimestral, boda civil… ¿algún invitado vegetariano o con alergias?" value={f.notas} onChange={set("notas")} />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>3 · Tus datos</legend>
          <div className="grid grid-2" style={{ gap: 16 }}>
            <div className="field" style={{ gridColumn: "1 / -1" }}><label htmlFor="nombre">Nombre completo</label><input id="nombre" type="text" value={f.nombre} onChange={set("nombre")} required /></div>
            <div className="field"><label htmlFor="correo">Correo electrónico</label><input id="correo" type="email" value={f.correo} onChange={set("correo")} required /></div>
            <div className="field"><label htmlFor="telefono">WhatsApp</label><input id="telefono" type="tel" placeholder="55 0000 0000" value={f.telefono} onChange={set("telefono")} required /></div>
          </div>
        </fieldset>

        {result?.error && <p className="notice">{result.error}</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <button type="submit" className="btn" disabled={pending} style={{ alignSelf: "flex-start", minHeight: 52 }}>{pending ? "Enviando…" : "Enviar solicitud de reserva"}</button>
          <p className="small" style={{ maxWidth: 560 }}>{disclaimer}</p>
        </div>
      </form>

      <aside className="span-5 card summary">
        <Photo src={coverByService[servicio]} label={service?.name} tone={services.findIndex((s) => s.slug === servicio)} style={{ aspectRatio: "16 / 9", borderRadius: 0 }} />
        <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div className="eyebrow">Resumen de tu reserva</div>
            <div className="display" style={{ fontSize: 30, fontWeight: 600, marginTop: 4 }}>{pkg?.name ?? "—"}</div>
          </div>
          <dl>
            <dt>Fecha</dt><dd>{fechaView}</dd>
            <dt>Invitados</dt><dd>{guests ? `${guests} personas` : "Por definir"}</dd>
            <dt>Mínimo</dt><dd>{min} personas</dd>
            <dt>Lugar</dt><dd>{f.lugar || "Por definir"}</dd>
          </dl>
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span className="eyebrow" style={{ color: "var(--muted)" }}>Estimado</span>
              <span className="display" style={{ fontSize: 34, fontWeight: 600 }}>{money(price * calc)}</span>
            </div>
            <p className="small" style={{ fontSize: 11.5, marginTop: 4 }}>{money(price)} × {calc} personas. Referencia en MXN antes de IVA y traslado; no es una cotización definitiva.</p>
          </div>
          {guests > 0 && guests < min && <p className="notice">Este paquete tiene un mínimo de {min} personas; el estimado se calcula sobre ese mínimo.</p>}
        </div>
      </aside>
    </section>
  );
}
