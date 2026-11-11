"use server";
import { createClient } from "@/lib/supabase/server";

export type ReservationResult = { ok: true; folio: string } | { ok: false; error: string };

export async function createReservation(input: {
  service_slug: string; package_name: string; event_date: string; event_time: string; guests: number;
  location: string; notes: string; name: string; email: string; phone: string;
}): Promise<ReservationResult> {
  if (!input.name || !input.email || !input.phone || !input.event_date) return { ok: false, error: "Faltan datos obligatorios." };
  const supabase = await createClient();
  const { data, error } = await supabase.from("reservations").insert({
    service_slug: input.service_slug, package_name: input.package_name, event_date: input.event_date, event_time: input.event_time || null,
    guests: input.guests || null, location: input.location || null, notes: input.notes || null, name: input.name, email: input.email, phone: input.phone,
  }).select("folio").single();
  if (error) return { ok: false, error: "No pudimos registrar la solicitud. Intenta de nuevo o escríbenos por WhatsApp." };
  return { ok: true, folio: data.folio };
}
