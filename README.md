# ORIGEN · Catering y eventos — sitio web

Sitio público + panel administrativo. Next.js 15 (App Router) y Supabase (Postgres, Auth, Storage).

## Qué incluye
- **Inicio**: portada, servicios con mini galería, proceso, banda de reservas, pie.
- **/servicios/[slug]**: galería interactiva, ficha y paquetes con platillos sugeridos.
- **/reservas**: formulario con estimado en vivo; guarda en la tabla `reservations`.
- **/admin**: login (Supabase Auth). Tema (colores, tipografías, logo), contacto, secciones y textos, servicios, paquetes, galerías (subir, ordenar, pie de foto, eliminar) y reservas (estado).

## Correr en local
```bash
cp .env.example .env.local   # ya trae la URL y la clave pública del proyecto
npm install
npm run dev
```

## Variables de entorno
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase
Tablas: `site_settings`, `sections`, `services`, `packages`, `gallery_photos`, `reservations`, `admin_users`.
Bucket público: `media`. Toda la escritura está protegida con RLS: solo correos listados en `admin_users` pueden editar.

Para añadir otro administrador: crear el usuario en Authentication → Users y agregar su correo en `admin_users`.

## Despliegue
Vercel: importar el repo, añadir las dos variables de entorno y desplegar.
