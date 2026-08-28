import QuoteRequestForm from "@/components/QuoteRequestForm";
import { serviceCategories } from "@/data/providers";

interface ProvidersPageProps {
  searchParams: Promise<{ service?: string | string[] }>;
}

export default async function ProvidersPage({ searchParams }: ProvidersPageProps) {
  const params = await searchParams;
  const requestedService = Array.isArray(params.service) ? params.service[0] : params.service;
  const initialService =
    serviceCategories.find(
      (category) => category.toLowerCase() === requestedService?.toLowerCase(),
    ) || serviceCategories[0];

  return <QuoteRequestForm initialService={initialService} />;
}
