"use client";
import { useState, useTransition } from "react";
import { saveContact, saveTheme } from "@/app/admin/actions";
import { ImageField } from "@/components/admin/ImageUploader";
import { SaveBar } from "@/components/admin/SaveBar";
import type { Contact, Theme } from "@/lib/types";
import { DEFAULT_THEME } from "@/lib/types";

const COLORS: { key: keyof Theme; label: string }[] = [
  { key: "paper", label: "Fondo" }, { key: "card", label: "Tarjetas" }, { key: "ink", label: "Texto / tinta" }, { key: "muted", label: "Texto secundario" },
  { key: "olive", label: "Acento olivo" }, { key: "clay", label: "Acento barro" }, { key: "line", label: "Líneas" },
];
const FONTS_DISPLAY = ["Cormorant Garamond", "Playfair Display", "EB Garamond", "Libre Baskerville", "DM Serif Display", "Fraunces", "Manrope", "Inter"];
const FONTS_BODY = ["Manrope", "Inter", "DM Sans", "Work Sans", "Nunito Sans", "Source Sans 3", "Lato", "Cormorant Garamond"];

export function ThemeForm({ theme: initial, contact: initialContact }: { theme: Theme; contact: Contact }) {
  const [t, setT] = useState<Theme>(initial);
  const [c, setC] = useState<Contact>(initialContact);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [msg2, setMsg2] = useState<string | null>(null);

  const submitTheme = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => { const r = await saveTheme(t as unknown as Record<string, string>); setMsg(r.ok ? "Guardado. El sitio ya usa el nuevo tema." : r.error ?? "Error"); });
  };
  const submitContact = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => { const r = await saveContact(c as unknown as Record<string, string>); setMsg2(r.ok ? "Guardado." : r.error ?? "Error"); });
  };

  return (
    <>
      <form onSubmit={submitTheme} className="admin-form card" style={{ padding: 28 }}>
        <div className="eyebrow">Colores</div>
        <div className="swatches">
          {COLORS.map(({ key, label }) => (
            <div className="swatch" key={key}>
              <label htmlFor={`c-${key}`}>{label}</label>
              <input id={`c-${key}`} type="color" value={t[key]} onChange={(e) => setT({ ...t, [key]: e.target.value })} />
              <input type="text" value={t[key]} onChange={(e) => setT({ ...t, [key]: e.target.value })} style={{ minHeight: 36, padding: "6px 10px", fontSize: 12 }} />
            </div>
          ))}
        </div>
        <div className="row">
          <div className="field">
            <label htmlFor="fd">Tipografía de títulos</label>
            <select id="fd" value={t.fontDisplay} onChange={(e) => setT({ ...t, fontDisplay: e.target.value })}>{FONTS_DISPLAY.map((f) => <option key={f}>{f}</option>)}</select>
          </div>
          <div className="field">
            <label htmlFor="fb">Tipografía de texto</label>
            <select id="fb" value={t.fontBody} onChange={(e) => setT({ ...t, fontBody: e.target.value })}>{FONTS_BODY.map((f) => <option key={f}>{f}</option>)}</select>
          </div>
          <div className="field">
            <label htmlFor="rad">Redondeo de esquinas</label>
            <select id="rad" value={t.radius} onChange={(e) => setT({ ...t, radius: e.target.value })}>
              <option value="0px">Recto (0)</option><option value="2px">Mínimo (2px)</option><option value="6px">Suave (6px)</option><option value="12px">Redondeado (12px)</option>
            </select>
          </div>
        </div>
        <ImageField label="Logotipo (opcional)" value={t.logoUrl || null} folder="brand" onChange={(url) => setT({ ...t, logoUrl: url ?? "" })} hint="PNG con fondo transparente o del mismo color que el fondo. Si está vacío se usa el nombre en texto." />
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
          <SaveBar pending={pending} msg={msg} />
          <button type="button" className="btn ghost sm" onClick={() => setT(DEFAULT_THEME)}>Restablecer tema Origen</button>
        </div>
        <div className="card" style={{ padding: 20, background: t.paper, color: t.ink, borderColor: t.line, fontFamily: `'${t.fontBody}', sans-serif`, borderRadius: t.radius }}>
          <div style={{ fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: t.clay, fontWeight: 700 }}>Vista previa</div>
          <div style={{ fontFamily: `'${t.fontDisplay}', serif`, fontSize: 36, marginTop: 6 }}>Catering para cada encuentro.</div>
          <p style={{ color: t.muted, fontSize: 14, marginTop: 6 }}>Cocina cálida y contemporánea, presentación cuidada y hospitalidad.</p>
          <span style={{ display: "inline-block", marginTop: 12, background: t.ink, color: t.paper, padding: "10px 18px", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, borderRadius: t.radius }}>Reservar</span>
          <span style={{ display: "inline-block", marginLeft: 10, color: t.olive, fontFamily: `'${t.fontDisplay}', serif`, fontStyle: "italic", fontSize: 18 }}>El gusto de reunirnos.</span>
        </div>
      </form>

      <form onSubmit={submitContact} className="admin-form card" style={{ padding: 28 }}>
        <div className="eyebrow">Contacto y datos generales</div>
        <div className="row">
          {([["whatsapp", "WhatsApp (10 dígitos)"], ["phone", "Teléfono"], ["email", "Correo"], ["instagram", "Instagram (sin @)"], ["hours", "Horario de atención"], ["area", "Zona de cobertura"], ["responseTime", "Tiempo de respuesta"], ["tagline", "Lema"]] as [keyof Contact, string][]).map(([k, label]) => (
            <div className="field" key={k}><label htmlFor={`k-${k}`}>{label}</label><input id={`k-${k}`} value={c[k] ?? ""} onChange={(e) => setC({ ...c, [k]: e.target.value })} /></div>
          ))}
        </div>
        <SaveBar pending={pending} msg={msg2} />
      </form>
    </>
  );
}
