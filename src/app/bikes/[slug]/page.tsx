import {
  VehicleDetailsPage,
  vdpMetadata,
  vdpStaticParams,
} from "@/components/vdp/VehicleDetailsPage";

export async function generateStaticParams() {
  return vdpStaticParams("BIKE");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return vdpMetadata(slug);
}

export default async function BikeDetailsRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <VehicleDetailsPage slug={slug} expectedType="BIKE" />;
}
