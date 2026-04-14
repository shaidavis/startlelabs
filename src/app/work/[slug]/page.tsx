import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { CaseStudyTemplate } from "@/components/templates/CaseStudyTemplate";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return <CaseStudyTemplate project={project} />;
}
