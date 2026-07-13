import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { services, servicesList } from "@/data/services";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export function generateStaticParams() {
  return servicesList.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services[slug];
  if (!service) return {};
  return {
    title: `${service.title} — Startle Labs`,
    description: service.heroIntro,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services[slug];
  if (!service) notFound();

  return <ServicePageTemplate service={service} />;
}
