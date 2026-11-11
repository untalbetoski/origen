"use client";
import { useState, useTransition } from "react";
import { deletePackage, savePackage } from "@/app/admin/actions";
import type { Package } from "@/lib/types";

type Draft = Omit<Package, "id" | "service_id"> & { id?: string };
const blank = (sort: number): Draft => ({ name: "", price: 0, min_people: 30, duration: "", description: "", dishes: [], badge: null, sort, visible: true });

function PackageRow({ serviceId, pkg, onDone }: { serviceId: string; pkg: Draft; onDone: () => void }) {
  const [p, setP] = useState<Draft>(pkg);
  const [dishesText, setDishesText] = useState(pkg.dishes.join("\n"));
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const up = (k: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setP({ ...p, [k]: e.target.type === "number" ? Number(e.target.value) : e.target.value });

  const save = () => start(async () => {
    const dishes = dishesText.split("\n").map((d) => d.trim()).filter(Boolean);
    const r = await savePackage(p.id ?? null, { service_id: serviceId, name: p.name, price: p.price, min_people: p.min_people, duration: p.duration, description: p.description, dishes, badge: p.badge || null, sort: p.sort, visible: p.visible });
    setMsg(r.ok ? "Guardado." : r.error ?? "Error");
    if (r.ok) onDone();
  });

  return (
    <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
      <div className="admin-form">
        <div className="row">
          <div className="field"><label>Nombre</label><input value={p.name} onChange={up("name")} /></div>
          <div className="field"><label>Etiqueta (opcional)</label><input value={p.badge ?? ""} onChange={up("badge")} placeholder="Recomendado, Favorito, Premium…" /></div>
          <div className="field"><label>Precio por persona</label><input type="number" value={p.price} onChange={up("price")} /></div>
          <div className="field"><label>Mínimo</label><input type="number" value={p.min_people} onChange={up("min_people")} /></div>
          <div className="field"><label>Duración</label><input value={p.duration} onChange={up("duration")} placeholder="2 h" /></div>
          <div className="field"><label>Orden</label><input type="number" value={p.sort} onChange={up("sort")} /></div>
        </div>
        <div className="field"><label>Descripción</label><textarea rows={2} value={p.description} onChange={up("description")} /></div>
        <div className="field"><label>Platillos sugeridos (uno por línea)</label><textarea rows={3} value={dishesText} onChange={(e) => setDishesText(e.target.value)} /></div>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <button type="button" className="btn sm" onClick={save} disabled={pending}>{pending ? "Guardando…" : p.id ? "Guardar paquete" : "Crear paquete"}</button>
        <label style={{ display: "flex", gap: 8, alignItems: "center", textTransform: "none", letterSpacing: 0, fontSize: 13 }}><input type="checkbox" checked={p.visible} onChange={(e) => setP({ ...p, visible: e.target.checked })} style={{ width: "auto", minHeight: 0 }} /> Visible</label>
        {p.id && <button type="button" className="btn danger sm" onClick={() => { if (confirm("¿Eliminar paquete?")) start(async () => { await deletePackage(p.id!); onDone(); }); }}>Eliminar</button>}
        {msg && <span className="small">{msg}</span>}
      </div>
    </div>
  );
}

export function PackagesEditor({ serviceId, packages }: { serviceId: string; packages: Package[] }) {
  const [adding, setAdding] = useState(false);
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="eyebrow">Paquetes ({packages.length})</div>
        <button type="button" className="btn ghost sm" onClick={() => setAdding(true)}>+ Añadir paquete</button>
      </div>
      {adding && <PackageRow serviceId={serviceId} pkg={blank(packages.length + 1)} onDone={() => setAdding(false)} />}
      {packages.map((p) => <PackageRow key={p.id} serviceId={serviceId} pkg={p} onDone={() => {}} />)}
    </section>
  );
}
