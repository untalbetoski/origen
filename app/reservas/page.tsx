import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ReservationForm } from "@/components/ReservationForm";
import { getAllPackages, getPhotosByService, getSections, getServices, getSettings } from "@/lib/data";

export default async function ReservasPage({ searchParams }: { searchParams: Promise<{ servicio?: string; paquete?: string }> }) {
  const sp = await searchParams;
  const [{ theme, contact }, sections, services, packages, photos] = await Promise.all([getSettings(), getSections(), getServices(), getAllPackages(), getPhotosByService()]);
  const sec = sections.reservations;
  const visible = services.filter((s) => s.visible);
  const coverByService: Record<string, string | undefined> = {};
  visible.forEach((s) => (coverByService[s.slug] = s.cover_url ?? photos[s.id]?.[0]?.url));

  return (
    <div className="container">
      <SiteHeader theme={theme} active="reservar" />
      <section style={{ display: "flex", flexDirection: "column", gap: 14, padding: "48px 0 36px", maxWidth: 680 }}>
        <div className="eyebrow">{sec?.eyebrow ?? "Reservas"}</div>
        <h1 style={{ fontSize: "clamp(40px, 5vw, 60px)" }}>{sec?.title ?? "Reserva tu servicio."}</h1>
        <p className="lead" style={{ maxWidth: 600 }}>{sec?.body}</p>
      </section>
      <ReservationForm services={visible} packages={packages} initialService={sp.servicio} initialPackage={sp.paquete} disclaimer={String(sec?.data?.disclaimer ?? "")} coverByService={coverByService} />
      <SiteFooter contact={contact} services={visible} section={sections.footer} />
    </div>
  );
}
