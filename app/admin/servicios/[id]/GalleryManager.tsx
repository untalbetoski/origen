"use client";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addPhoto, deletePhoto, reorderPhotos, updatePhoto } from "@/app/admin/actions";
import { uploadImage } from "@/components/admin/ImageUploader";
import type { Photo } from "@/lib/types";

export function GalleryManager({ serviceId, slug, photos }: { serviceId: string; slug: string; photos: Photo[] }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErr(null);
    try {
      for (let i = 0; i < files.length; i++) {
        setBusy(`Subiendo ${i + 1} de ${files.length}…`);
        const { path, url } = await uploadImage(files[i], `gallery/${slug}`);
        const r = await addPhoto(serviceId, path, url, "");
        if (!r.ok) throw new Error(r.error);
      }
      router.refresh();
    } catch (ex) {
      setErr((ex as Error).message);
    } finally {
      setBusy(null);
      if (ref.current) ref.current.value = "";
    }
  };

  const move = (i: number, dir: -1 | 1) => {
    const ids = photos.map((p) => p.id);
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    start(async () => { await reorderPhotos(ids); router.refresh(); });
  };

  return (
    <section className="card" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div className="eyebrow">Galería de fotos ({photos.length})</div>
        <span className="small">Las 3 primeras aparecen en la portada; todas en la página del servicio.</span>
      </div>
      <label className="dropzone" style={{ cursor: "pointer", textTransform: "none", letterSpacing: 0, fontSize: 13, color: "var(--ink)" }}
        onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}>
        <input ref={ref} type="file" accept="image/*" multiple onChange={(e) => onFiles(e.target.files)} style={{ display: "none" }} />
        {busy ?? "Arrastra fotos aquí o haz clic para seleccionarlas (JPG, PNG, WebP · varias a la vez)"}
      </label>
      {err && <p className="notice">{err}</p>}
      <div className="media-grid">
        {photos.map((p, i) => (
          <div className="media-item" key={p.id}>
            <div className="photo"><img src={p.url} alt={p.caption} /></div>
            <input defaultValue={p.caption} placeholder="Pie de foto" style={{ minHeight: 36, padding: "6px 10px", fontSize: 12 }}
              onBlur={(e) => { if (e.target.value !== p.caption) start(async () => { await updatePhoto(p.id, { caption: e.target.value }); router.refresh(); }); }} />
            <div className="actions">
              <button type="button" className="icon-btn" aria-label="Mover antes" onClick={() => move(i, -1)} disabled={pending || i === 0}>←</button>
              <button type="button" className="icon-btn" aria-label="Mover después" onClick={() => move(i, 1)} disabled={pending || i === photos.length - 1}>→</button>
              <button type="button" className="icon-btn" aria-label="Eliminar foto" style={{ color: "var(--clay)", marginLeft: "auto" }} onClick={() => { if (confirm("¿Eliminar esta foto?")) start(async () => { await deletePhoto(p.id, p.storage_path); router.refresh(); }); }} disabled={pending}>✕</button>
            </div>
          </div>
        ))}
        {photos.length === 0 && <p className="small">Aún no hay fotos. Mientras tanto el sitio muestra marcadores de color.</p>}
      </div>
    </section>
  );
}
