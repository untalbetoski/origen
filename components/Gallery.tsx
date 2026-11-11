"use client";
import { useState } from "react";
import { Photo } from "@/components/Photo";
import type { Photo as PhotoT } from "@/lib/types";

export function Gallery({ photos, fallbackLabel }: { photos: PhotoT[]; fallbackLabel: string }) {
  const [active, setActive] = useState(0);
  if (photos.length === 0) {
    return <Photo label={fallbackLabel} tone={2} className="gallery-main" />;
  }
  const main = photos[Math.min(active, photos.length - 1)];
  return (
    <div>
      <Photo src={main.url} alt={main.caption || fallbackLabel} className="gallery-main" />
      {photos.length > 1 && (
        <div className="gallery-thumbs" role="tablist" aria-label="Galería">
          {photos.map((p, i) => (
            <button key={p.id} type="button" className={i === active ? "active" : undefined} onClick={() => setActive(i)} aria-label={`Ver foto ${i + 1}${p.caption ? `: ${p.caption}` : ""}`}>
              <img src={p.url} alt="" />
            </button>
          ))}
        </div>
      )}
      <p className="small" style={{ marginTop: 6 }}>{active + 1} / {photos.length}{main.caption ? ` · ${main.caption}` : ""}</p>
    </div>
  );
}
