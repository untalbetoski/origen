import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/admin/actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <>{children}</>;
  const { data: admin } = await supabase.from("admin_users").select("email").eq("email", user.email ?? "").maybeSingle();

  return (
    <div className="admin">
      <aside className="admin-side">
        <div className="brand" style={{ color: "var(--paper)" }}><span className="word">ORIGEN</span><span className="sub" style={{ color: "#C9B8A8" }}>Panel administrativo</span></div>
        <nav>
          <Link href="/admin">Inicio</Link>
          <Link href="/admin/reservas">Reservas</Link>
          <Link href="/admin/servicios">Servicios y galerías</Link>
          <Link href="/admin/secciones">Secciones y textos</Link>
          <Link href="/admin/tema">Tema y colores</Link>
          <Link href="/" target="_blank">Ver sitio ↗</Link>
        </nav>
        <form action={signOut} style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          <span className="small" style={{ color: "#C9B8A8" }}>{user.email}</span>
          <button className="btn light sm" type="submit">Cerrar sesión</button>
        </form>
      </aside>
      <main className="admin-main">
        {!admin && <p className="notice">Tu cuenta ({user.email}) no está en la lista de administradores: puedes ver pero no guardar cambios.</p>}
        {children}
      </main>
    </div>
  );
}
