import { getSettings } from "@/lib/data";
import { ThemeForm } from "./ThemeForm";

export default async function TemaPage() {
  const { theme, contact } = await getSettings();
  return (
    <>
      <h1>Tema y colores</h1>
      <p className="lead">Los cambios se aplican a todo el sitio al guardar.</p>
      <ThemeForm theme={theme} contact={contact} />
    </>
  );
}
