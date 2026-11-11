"use client";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/** Sube una imagen al bucket `media` y devuelve { path, url }. */
export async function uploadImage(file: File, folder: string) {
  const supabase = createClient();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export function ImageField({ label, value, folder, onChange, hint }: { label: string; value: string | null; folder: string; onChange: (url: string | null) => void; hint?: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setErr(null);
    try {
      const { url } = await uploadImage(file, folder);
      onChange(url);
    } catch (ex) {
      setErr((ex as Error).message);
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  };
  return (
    <div className="field">
      <label>{label}</label>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div className="photo preview-img" style={{ background: "var(--line)" }}>{value && <img src={value} alt="" />}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input ref={ref} type="file" accept="image/*" onChange={pick} disabled={busy} style={{ minHeight: 0, padding: 8 }} />
          {value && <button type="button" className="btn danger sm" onClick={() => onChange(null)}>Quitar imagen</button>}
          {busy && <span className="small">Subiendo…</span>}
          {err && <span className="notice">{err}</span>}
          {hint && <span className="small">{hint}</span>}
        </div>
      </div>
    </div>
  );
}
