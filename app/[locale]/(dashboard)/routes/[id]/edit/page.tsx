import ClientRoot from "./clientRoot";
import { getPrisma } from "@/lib/config/server";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/auth/supabase/server";
import { headers } from "next/headers";
import { RouteCollaboratorPolicy } from "@prisma/client";

export default async function Page({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const prisma = getPrisma();
  const nextHeaders = await headers();
  
  const supabase = await createClient({
    headers: nextHeaders
  } as any);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const route = await prisma.route.findUnique({
    where: { id: resolvedParams.id },
    include: {
      author: {
        include: { icon: true }
      },
      thumbnail: true,
      likes: true,
      views: true,
      tags: true,
      budget: true,
      routeDates: {
        orderBy: { day: 'asc' },
        include: {
          routeNodes: {
            orderBy: { order: 'asc' },
            include: {
              spot: true,
              images: true,
              transitSteps: {
                orderBy: { order: 'asc' }
              }
            }
          }
        }
      },
      collaborators: true,
    }
  });

  if (!route) {
    notFound();
  }

  // Author check or collaborator check
  const isAuthor = route.authorId === user.id;
  const isCollaborator = route.collaborators.some((c: { userId: string }) => c.userId === user.id);
  
  // Requirement: collaborators can edit if policy is CAN_EDIT
  const canEdit = isAuthor || (isCollaborator && route.collaboratorPolicy === RouteCollaboratorPolicy.CAN_EDIT);

  if (!canEdit) {
    notFound(); // or redirect
  }

  // Decimal シリアライズ問題の回避
  const serializedRoute = JSON.parse(JSON.stringify(route));

  return (
    <div className="w-full h-full">
      <ClientRoot route={serializedRoute} />
    </div>
  );
}
