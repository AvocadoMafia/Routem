import { getPrisma } from "@/lib/config/server";
import { notFound } from "next/navigation";
import { Route } from "@/lib/client/types";
import RootClient from "./rootClient";

export default async function RouteDetailPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params
  const prisma = getPrisma();
  const route = await prisma.route.findUnique({
    where: { id: resolvedParams.id },
    include: {
      author: {
        include: { icon: true }
      },
      thumbnail: true,
      category: true,
      likes: true,
      views: true,
      routeNodes: {
        orderBy: { order: 'asc' },
        include: {
          spot: true,
          images: true,
          transitSteps: true
        }
      }
    }
  }) as Route | null;

  if (!route) {
    notFound();
  }

  return <RootClient route={route} />;
}
