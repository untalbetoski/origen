import { createClient } from "@/lib/supabase/server";
import { DEFAULT_CONTACT, DEFAULT_THEME, type Package, type Photo, type Section, type Service, type Settings } from "@/lib/types";

export async function getSettings(): Promise<Settings> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("theme, contact").eq("id", 1).maybeSingle();
  return {
    theme: { ...DEFAULT_THEME, ...((data?.theme as object) ?? {}) },
    contact: { ...DEFAULT_CONTACT, ...((data?.contact as object) ?? {}) },
  };
}

export async function getSections(): Promise<Record<string, Section>> {
  const supabase = await createClient();
  const { data } = await supabase.from("sections").select("*").order("sort");
  const map: Record<string, Section> = {};
  (data ?? []).forEach((s) => (map[s.key] = s as Section));
  return map;
}

export async function getServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("services").select("*").order("sort");
  return (data ?? []) as Service[];
}

export async function getServiceBySlug(slug: string) {
  const supabase = await createClient();
  const { data: service } = await supabase.from("services").select("*").eq("slug", slug).maybeSingle();
  if (!service) return null;
  const [{ data: packages }, { data: photos }] = await Promise.all([
    supabase.from("packages").select("*").eq("service_id", service.id).order("sort"),
    supabase.from("gallery_photos").select("*").eq("service_id", service.id).order("sort"),
  ]);
  return { service: service as Service, packages: (packages ?? []) as Package[], photos: (photos ?? []) as Photo[] };
}

export async function getPhotosByService(): Promise<Record<string, Photo[]>> {
  const supabase = await createClient();
  const { data } = await supabase.from("gallery_photos").select("*").order("sort");
  const map: Record<string, Photo[]> = {};
  (data ?? []).forEach((p) => {
    (map[p.service_id] ||= []).push(p as Photo);
  });
  return map;
}

export async function getAllPackages(): Promise<Package[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("packages").select("*").eq("visible", true).order("sort");
  return (data ?? []) as Package[];
}

export const money = (n: number) => "$" + n.toLocaleString("es-MX");
export const waLink = (num: string, text?: string) =>
  `https://wa.me/52${num.replace(/\D/g, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
export const fmtPhone = (num: string) => num.replace(/\D/g, "").replace(/(\d{2})(\d{4})(\d{4})/, "$1 $2 $3");
