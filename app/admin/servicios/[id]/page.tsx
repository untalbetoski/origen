import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Package, Photo, Service } from "@/lib/types";
import { ServiceForm } from "./ServiceForm";
import { PackagesEditor } from "./PackagesEditor";
import { GalleryManager } from "./GalleryManager";

export default async function ServicioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "nuevo") {
    return (<><h1>Nuevo servicio</h1><ServiceForm service={null} /></>);
  }
  const supabase = await createClient();
  const { data: service } = await supabase.from("services").select("*").eq("id", id).maybeSingle();
  if (!service) notFound();
  const [{ data: packages }, { data: photos }] = await Promise.all([
    supabase.from("packages").select("*").eq("service_id", id).order("sort"),
    supabase.from("gallery_photos").select("*").eq("service_id", id).order("sort"),
  ]);
  return (
    <>
      <h1>{service.name}</h1>
      <ServiceForm service={service as Service} />
      <GalleryManager serviceId={id} slug={service.slug} photos={(photos ?? []) as Photo[]} />
      <PackagesEditor serviceId={id} packages={(packages ?? []) as Package[]} />
    </>
  );
}
