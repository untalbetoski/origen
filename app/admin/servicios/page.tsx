import Link from "next/link";
import { getPhotosByService, getServices, money } from "@/lib/data";

export default async function ServiciosPage() {
  const [services, photos] = await Promise.all([getServices(), getPhotosByService()]);
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <h1>Servicios y galerías</h1>
        <Link href="/admin/servicios/nuevo" className="btn sm">+ Nuevo servicio</Link>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Servicio</th><th>Desde</th><th>Mínimo</th><th>Fotos</th><th>Visible</th><th></th></tr></thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}><td><b>{s.name}</b><br /><span className="small">/servicios/{s.slug}</span></td><td>{money(s.price_from)}</td><td>{s.min_people}</td><td>{photos[s.id]?.length ?? 0}</td><td>{s.visible ? "Sí" : "No"}</td><td><Link href={`/admin/servicios/${s.id}`} className="link">Editar →</Link></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
