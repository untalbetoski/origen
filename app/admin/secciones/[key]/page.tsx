import { notFound } from "next/navigation";
import { getSections } from "@/lib/data";
import { SectionForm } from "./SectionForm";

export default async function SeccionPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const sections = await getSections();
  const section = sections[key];
  if (!section) notFound();
  return (
    <>
      <h1>Editar sección</h1>
      <SectionForm section={section} />
    </>
  );
}
