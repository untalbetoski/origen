import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminHome() {
  const supabase = await createClient();
  const [{ count: nuevas }, { count: fotos }, { count: servicios }, { data: recientes }] = await Promise.all([
    supabase.from("reservations").select("*", { count: "exact", head: true }).eq("status", "nueva"),
    supabase.from("gallery_photos").select("*", { count: "exact", head: true }),
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("reservations").select("folio,name,package_name,event_date,status,created_at").order("created_at", { ascending: false }).limit(5),
  ]);
  const Tile = ({ n, label, href }: { n: number | null; label: string; href: string }) => (
    <Link href={href} className="card" style={{ padding: 22, display: "flex", flexDirection: "column", gap: 4 }}>
      <b className="display" style={{ fontSize: 40, fontWeight: 600 }}>{n ?? 0}</b><span className="small">{label}</span>
    </Link>
  );
  return (
    <>
      <h1>Hola de nuevo.</h1>
      <div className="grid grid-3">
        <Tile n={nuevas} label="reservas nuevas por atender" href="/admin/reservas" />
        <Tile n={servicios} label="servicios publicados" href="/admin/servicios" />
        <Tile n={fotos} label="fotos en galerías" href="/admin/servicios" />
      </div>
      <div className="card" style={{ padding: 22 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Últimas solicitudes</div>
        <table className="table">
          <thead><tr><th>Folio</th><th>Nombre</th><th>Paquete</th><th>Fecha</th><th>Estado</th></tr></thead>
          <tbody>
            {(recientes ?? []).map((r) => <tr key={r.folio}><td>{r.folio}</td><td>{r.name}</td><td>{r.package_name}</td><td>{r.event_date ?? "—"}</td><td><span className="pill">{r.status}</span></td></tr>)}
            {(recientes ?? []).length === 0 && <tr><td colSpan={5} className="small">Aún no hay solicitudes.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
