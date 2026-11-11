import Link from "next/link";
import { getSections } from "@/lib/data";

const NAMES: Record<string, string> = { hero: "Portada (hero)", services: "Encabezado de servicios", process: "Cómo trabajamos", cta: "Banda de reservas", reservations: "Página de reservas", footer: "Pie de página" };

export default async function SeccionesPage() {
  const sections = await getSections();
  return (
    <>
      <h1>Secciones y textos</h1>
      <p className="lead">Edita títulos, textos, imágenes y visibilidad de cada sección del sitio.</p>
      <div className="card">
        <table className="table">
          <thead><tr><th>Sección</th><th>Título actual</th><th>Visible</th><th></th></tr></thead>
          <tbody>
            {Object.values(sections).map((s) => (
              <tr key={s.key}><td><b>{NAMES[s.key] ?? s.key}</b></td><td>{s.title}</td><td>{s.visible ? "Sí" : "No"}</td><td><Link href={`/admin/secciones/${s.key}`} className="link">Editar →</Link></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
