import type { Metadata } from "next";
import "./globals.css";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "ORIGEN · Catering y eventos",
  description: "Catering para cada encuentro. Coffee breaks, desayunos, recepciones y banquetes en el Estado de México y zona metropolitana.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { theme } = await getSettings();
  const fontsParam = [theme.fontDisplay, theme.fontBody]
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:ital,wght@0,400;0,500;0,600;0,700;1,500`)
    .join("&");
  const cssVars = `:root{--paper:${theme.paper};--card:${theme.card};--ink:${theme.ink};--muted:${theme.muted};--olive:${theme.olive};--clay:${theme.clay};--line:${theme.line};--font-display:'${theme.fontDisplay}',Georgia,serif;--font-body:'${theme.fontBody}','Helvetica Neue',Arial,sans-serif;--radius:${theme.radius};}`;
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={`https://fonts.googleapis.com/css2?${fontsParam}&display=swap`} rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
