"use client";
import { useActionState } from "react";
import { signIn } from "@/app/admin/actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, null as null | { error: string });
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <form action={action} className="card" style={{ width: "100%", maxWidth: 400, padding: 36, display: "flex", flexDirection: "column", gap: 18 }}>
        <div className="brand"><span className="word">ORIGEN</span><span className="sub">Panel administrativo</span></div>
        <div className="field"><label htmlFor="email">Correo</label><input id="email" name="email" type="email" required autoComplete="username" /></div>
        <div className="field"><label htmlFor="password">Contraseña</label><input id="password" name="password" type="password" required autoComplete="current-password" /></div>
        {state?.error && <p className="notice">{state.error}</p>}
        <button className="btn" type="submit" disabled={pending}>{pending ? "Entrando…" : "Entrar"}</button>
      </form>
    </main>
  );
}
