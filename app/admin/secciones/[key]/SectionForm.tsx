"use client";
import { useState, useTransition } from "react";
import { saveSection } from "@/app/admin/actions";
import { ImageField } from "@/components/admin/ImageUploader";
import { SaveBar } from "@/components/admin/SaveBar";
import type { Section } from "@/lib/types";

type Step = { title: string; text: string };
type Stat = { value: string; label: string };

export function SectionForm({ section }: { section: Section }) {
  const [s, setS] = useState(section);
  const data = s.data as Record<string, unknown>;
  const setData = (patch: Record<string, unknown>) => setS({ ...s, data: { ...data, ...patch } });
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const steps = (data.steps as Step[]) ?? [];
  const stats = (data.stats as Stat[]) ?? [];
  const images = (data.images as string[]) ?? [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const r = await saveSection(s.key, { eyebrow: s.eyebrow, title: s.title, subtitle: s.subtitle, body: s.body, image_url: s.image_url, visible: s.visible, data: s.data });
      setMsg(r.ok ? "Guardado." : r.error ?? "Error");
    });
  };

  return (
    <form onSubmit={submit} className="admin-form card" style={{ padding: 28 }}>
      <div className="eyebrow">{s.key}</div>
      <div className="row">
        <div className="field"><label htmlFor="eyebrow">Antetítulo</label><input id="eyebrow" value={s.eyebrow} onChange={(e) => setS({ ...s, eyebrow: e.target.value })} /></div>
        <div className="field"><label htmlFor="title">Título</label><input id="title" value={s.title} onChange={(e) => setS({ ...s, title: e.target.value })} /></div>
      </div>
      <div className="field"><label htmlFor="body">Texto</label><textarea id="body" rows={4} value={s.body} onChange={(e) => setS({ ...s, body: e.target.value })} /></div>

      {s.key === "hero" && (
        <>
          <div className="row">
            <div className="field"><label>Botón principal</label><input value={String(data.cta_primary ?? "")} onChange={(e) => setData({ cta_primary: e.target.value })} /></div>
            <div className="field"><label>Botón secundario</label><input value={String(data.cta_secondary ?? "")} onChange={(e) => setData({ cta_secondary: e.target.value })} /></div>
          </div>
          <div className="eyebrow">Cifras</div>
          {stats.map((st, i) => (
            <div className="row" key={i}>
              <div className="field"><label>Valor</label><input value={st.value} onChange={(e) => { const n = [...stats]; n[i] = { ...st, value: e.target.value }; setData({ stats: n }); }} /></div>
              <div className="field"><label>Etiqueta</label><input value={st.label} onChange={(e) => { const n = [...stats]; n[i] = { ...st, label: e.target.value }; setData({ stats: n }); }} /></div>
            </div>
          ))}
          <div className="eyebrow">Imágenes de portada (3)</div>
          <div className="row">
            {[0, 1, 2].map((i) => (
              <ImageField key={i} label={i === 0 ? "Imagen grande" : `Imagen ${i + 1}`} value={images[i] ?? null} folder="hero" onChange={(url) => { const n = [...images]; n[i] = url ?? ""; setData({ images: n }); }} />
            ))}
          </div>
        </>
      )}

      {s.key === "process" && (
        <>
          <div className="eyebrow">Pasos</div>
          {steps.map((st, i) => (
            <div className="row" key={i}>
              <div className="field"><label>Paso {i + 1} · Título</label><input value={st.title} onChange={(e) => { const n = [...steps]; n[i] = { ...st, title: e.target.value }; setData({ steps: n }); }} /></div>
              <div className="field"><label>Texto</label><textarea rows={2} value={st.text} onChange={(e) => { const n = [...steps]; n[i] = { ...st, text: e.target.value }; setData({ steps: n }); }} /></div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="btn ghost sm" onClick={() => setData({ steps: [...steps, { title: "", text: "" }] })}>+ Añadir paso</button>
            {steps.length > 1 && <button type="button" className="btn danger sm" onClick={() => setData({ steps: steps.slice(0, -1) })}>Quitar último</button>}
          </div>
        </>
      )}

      {s.key === "cta" && (
        <div className="row">
          <div className="field"><label>Botón</label><input value={String(data.button ?? "")} onChange={(e) => setData({ button: e.target.value })} /></div>
          <div className="field"><label>Enlace secundario</label><input value={String(data.secondary ?? "")} onChange={(e) => setData({ secondary: e.target.value })} /></div>
        </div>
      )}

      {s.key === "reservations" && (
        <div className="field"><label>Aviso bajo el botón</label><textarea rows={2} value={String(data.disclaimer ?? "")} onChange={(e) => setData({ disclaimer: e.target.value })} /></div>
      )}

      {!["hero"].includes(s.key) && (
        <ImageField label="Imagen (opcional)" value={s.image_url} folder={`sections/${s.key}`} onChange={(url) => setS({ ...s, image_url: url })} />
      )}

      <label style={{ display: "flex", gap: 10, alignItems: "center", textTransform: "none", letterSpacing: 0, fontSize: 13 }}>
        <input type="checkbox" checked={s.visible} onChange={(e) => setS({ ...s, visible: e.target.checked })} style={{ width: "auto", minHeight: 0 }} /> Sección visible en el sitio
      </label>
      <SaveBar pending={pending} msg={msg} />
    </form>
  );
}
