"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setReservationStatus } from "@/app/admin/actions";

export function StatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <select value={status} disabled={pending} style={{ minHeight: 36, padding: "6px 10px", fontSize: 12 }}
      onChange={(e) => start(async () => { await setReservationStatus(id, e.target.value); router.refresh(); })}>
      <option value="nueva">Nueva</option><option value="cotizada">Cotizada</option><option value="confirmada">Confirmada</option><option value="cancelada">Cancelada</option>
    </select>
  );
}
