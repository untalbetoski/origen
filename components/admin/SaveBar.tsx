"use client";
export function SaveBar({ pending, msg }: { pending: boolean; msg?: string | null }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <button type="submit" className="btn" disabled={pending}>{pending ? "Guardando…" : "Guardar cambios"}</button>
      {msg && <span className={`notice${msg.startsWith("Guardado") ? " ok" : ""}`}>{msg}</span>}
    </div>
  );
}
