"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function revalidateAll() {
  revalidatePath("/", "layout");
}

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

export async function signIn(_: unknown, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email")), password: String(formData.get("password")),
  });
  if (error) return { error: "Correo o contraseña incorrectos." };
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function saveTheme(theme: Record<string, string>) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("site_settings").update({ theme, updated_at: new Date().toISOString() }).eq("id", 1);
  if (error) return { error: error.message };
  revalidateAll();
  return { ok: true };
}

export async function saveContact(contact: Record<string, string>) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("site_settings").update({ contact, updated_at: new Date().toISOString() }).eq("id", 1);
  if (error) return { error: error.message };
  revalidateAll();
  return { ok: true };
}

export async function saveSection(key: string, patch: { eyebrow: string; title: string; subtitle: string; body: string; image_url: string | null; visible: boolean; data: Record<string, unknown> }) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("sections").update({ ...patch, updated_at: new Date().toISOString() }).eq("key", key);
  if (error) return { error: error.message };
  revalidateAll();
  return { ok: true };
}

export async function saveService(id: string | null, patch: { slug: string; name: string; tagline: string; description: string; price_from: number; min_people: number; duration: string; includes: string; cover_url: string | null; sort: number; visible: boolean }) {
  const supabase = await requireAdmin();
  const q = id
    ? supabase.from("services").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id).select("id").single()
    : supabase.from("services").insert(patch).select("id").single();
  const { data, error } = await q;
  if (error) return { error: error.message };
  revalidateAll();
  return { ok: true, id: data.id as string };
}

export async function deleteService(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  redirect("/admin/servicios");
}

export async function savePackage(id: string | null, patch: { service_id: string; name: string; price: number; min_people: number; duration: string; description: string; dishes: string[]; badge: string | null; sort: number; visible: boolean }) {
  const supabase = await requireAdmin();
  const q = id ? supabase.from("packages").update(patch).eq("id", id) : supabase.from("packages").insert(patch);
  const { error } = await q;
  if (error) return { error: error.message };
  revalidateAll();
  return { ok: true };
}

export async function deletePackage(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("packages").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return { ok: true };
}

export async function addPhoto(service_id: string, storage_path: string, url: string, caption: string) {
  const supabase = await requireAdmin();
  const { data: last } = await supabase.from("gallery_photos").select("sort").eq("service_id", service_id).order("sort", { ascending: false }).limit(1).maybeSingle();
  const { error } = await supabase.from("gallery_photos").insert({ service_id, storage_path, url, caption, sort: (last?.sort ?? 0) + 1 });
  if (error) return { error: error.message };
  revalidateAll();
  return { ok: true };
}

export async function updatePhoto(id: string, patch: { caption?: string; sort?: number }) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("gallery_photos").update(patch).eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return { ok: true };
}

export async function reorderPhotos(ids: string[]) {
  const supabase = await requireAdmin();
  await Promise.all(ids.map((id, i) => supabase.from("gallery_photos").update({ sort: i + 1 }).eq("id", id)));
  revalidateAll();
  return { ok: true };
}

export async function deletePhoto(id: string, storage_path: string) {
  const supabase = await requireAdmin();
  await supabase.storage.from("media").remove([storage_path]);
  const { error } = await supabase.from("gallery_photos").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return { ok: true };
}

export async function setReservationStatus(id: string, status: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("reservations").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/reservas");
  return { ok: true };
}
