"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteService, saveService } from "@/app/admin/actions";
import { ImageField } from "@/components/admin/ImageUploader";
import { SaveBar } from "@/components/admin/SaveBar";
import type { Service } from "@/lib/types";

const empty = { slug: "", name: "", tagline: "", description: "", price_from: 0, min_people: 30, duration: "", includes: "", cover_url: null as string | null, sort: 99, visible: true };

export function ServiceForm({ service }: { service: Service | null }) {
  const [s, setS] = useState(service ?? empty);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();
  const up = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setS({ ...s, [k]: e.target.type === "number" ? Number(e.target.value) : e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const slug = s.slug || s.name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const r = await saveService(service?.id ?? null, { ...s, slug });
      if (r.ok && !service) router.push(`/admin/servicios/${r.id}`);
      setMsg(r.ok ? "Guardado." : r.error ?? "Error");
    });
  };

  return (
    <form onSubmit={submit} className="admin-form card" style={{ padding: 28 }}>
      <div className="eyebrow">Datos del servicio</div>
      <div className="row">
        <div className="field"><label>Nombre</label><input value={s.name} onChange={up("name")} required /></div>
        <div className="field"><label>Slug (URL)</label><input value={s.slug} onChange={up("slug")} placeholder="se genera del nombre" /></div>
        <div className="field"><label>Frase corta</label><input value={s.tagline} onChange={up("tagline")} /></div>
        <div className="field"><label>Orden</label><input type="number" value={s.sort} onChange={up("sort")} /></div>
      </div>
      <div className="field"><label>Descripción</label><textarea rows={3} value={s.description} onChange={up("description")} /></div>
      <div className="row">
        <div className="field"><label>Precio desde (MXN)</label><input type="number" value={s.price_from} onChange={up("price_from")} /></div>
        <div className="field"><label>Mínimo de personas</label><input type="number" value={s.min_people} onChange={up("min_people")} /></div>
        <div className="field"><label>Duración</label><input value={s.duration} onChange={up("duration")} placeholder="2 a 3 horas de servicio" /></div>
        <div className="field"><label>Incluye</label><input value={s.includes} onChange={up("includes")} placeholder="Montaje, loza y personal" /></div>
      </div>
      <ImageField label="Imagen de portada" value={s.cover_url} folder={`services/${s.slug || "nuevo"}`} onChange={(url) => setS({ ...s, cover_url: url })} hint="Se usa en reservas; si está vacía se toma la primera foto de la galería." />
      <label style={{ display: "flex", gap: 10, alignItems: "center", textTransform: "none", letterSpacing: 0, fontSize: 13 }}>
        <input type="checkbox" checked={s.visible} onChange={(e) => setS({ ...s, visible: e.target.checked })} style={{ width: "auto", minHeight: 0 }} /> Visible en el sitio
      </label>
      <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
        <SaveBar pending={pending} msg={msg} />
        {service && <button type="button" className="btn danger sm" onClick={() => { if (confirm("¿Eliminar este servicio, sus paquetes y fotos?")) start(async () => { await deleteService(service.id); }); }}>Eliminar servicio</button>}
      </div>
    </form>
  );
}
