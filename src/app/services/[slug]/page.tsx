import { notFound } from "next/navigation";
import { services, servicesList } from "@/data/services";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export function generateStaticParams() {
  return servicesList.map((s) => ({ slug: s.slug }));
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services[slug];
  if (!service) notFound();

  return <ServicePageTemplate service={service} />;
}
