import { notFound } from "next/navigation";
import RootClient from "./rootClient";
import { createClient } from "@/lib/auth/supabase/server";
import { headers } from "next/headers";
import { routesService } from "@/features/routes/service";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const route = await routesService.getRouteDetail(id, null);

  if (!route) {
    return {
      title: "Route Not Found",
    };
  }

  return {
    title: `${route.title} | Rootem`,
    description: route.description || "Check out this route on Rootem",
    openGraph: {
      title: route.title,
      description: route.description || "Check out this route on Rootem",
      type: "website",
    },
  };
}

export default async function RoutePage({ params }: Props) {
  const { id } = await params;
  const headersList = await headers();

  const supabase = await createClient({
    headers: headersList,
  } as any);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const route = await routesService.getRouteDetail(id, user?.id ?? null);

  if (!route) {
    notFound();
  }

  return <RootClient route={route as any} currentUser={user} />;
}
