import { createClient } from "@/lib/supabase/server";
import type { Reservation } from "@/lib/types";
import { StatusSelect } from "./StatusSelect";

export default async function ReservasAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.from("reservations").select("*").order("created_at", { ascending: false });
  const rows = (data ?? []) as Reservation[];
  return (
    <>
      <h1>Reservas</h1>
      <p className="lead">Solicitudes recibidas desde el sitio. Cambia el estado conforme avances.</p>
      <div className="card" style={{ overflowX: "auto" }}>
        <table className="table">
          <thead><tr><th>Folio</th><th>Cliente</th><th>Evento</th><th>Paquete</th><th>Notas</th><th>Estado</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><b>{r.folio}</b><br /><span className="small">{new Date(r.created_at).toLocaleDateString("es-MX")}</span></td>
                <td>{r.name}<br /><a href={`mailto:${r.email}`} className="small">{r.email}</a><br /><a href={`https://wa.me/52${r.phone.replace(/\D/g, "")}`} className="small">{r.phone}</a></td>
                <td>{r.event_date ?? "—"} {r.event_time ?? ""}<br /><span className="small">{r.guests ?? "?"} personas · {r.location ?? "—"}</span></td>
                <td>{r.package_name}<br /><span className="small">{r.service_slug}</span></td>
                <td className="small" style={{ maxWidth: 220 }}>{r.notes ?? "—"}</td>
                <td><StatusSelect id={r.id} status={r.status} /></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={6} className="small">Aún no hay solicitudes.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
