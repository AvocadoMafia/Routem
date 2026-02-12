import { getPrisma } from "@/lib/config/server";
import { notFound } from "next/navigation";
import InitialModal from "@/app/(public)/routes/[id]/_components/templates/initialModal";
import RouteViewer from "@/app/(public)/routes/[id]/_components/ingredients/routeViewer";
import { Route } from "@/lib/client/types";

export default async function RouteDetailPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params
  const prisma = getPrisma();
  const route = await prisma.route.findUnique({
    where: { id: resolvedParams.id },
    include: {
      author: {
        include: { profileImage: true }
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

  return (
    <div className="w-full min-h-screen relative">
      <InitialModal route={route} />
      <RouteViewer route={route} />
    </div>
  );
}
