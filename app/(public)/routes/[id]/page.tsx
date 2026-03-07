import { getPrisma } from "@/lib/config/server";
import { notFound } from "next/navigation";
import { Route } from "@/lib/client/types";
import RootClient from "./rootClient";

import { createClient } from "@/lib/auth/supabase/server";
import { headers } from "next/headers";

export default async function RoutePage({ params }: { params: { id: string } }) {
  const resolvedParams = await params
  // Route.id は UUID なので、モック等から数値IDが来た場合は DB を引かず 404 にする
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(resolvedParams.id)) {
    notFound();
  }
  const prisma = getPrisma();
  
  // get headers to satisfy createClient requirement if needed, 
  // but since we are in page.tsx (Server Component), we can use dummy request if we really need it.
  // Actually, lib/auth/supabase/server.ts expects NextRequest.
  // Let's check if there is a version of createClient that doesn't require request.
  const { headers: nextHeaders } = await import("next/headers");
  const headersList = await nextHeaders();
  
  // createClient in lib/auth/supabase/server.ts needs a request object.
  // We can mock it or use a simplified version.
  const supabase = await createClient({
    headers: headersList
  } as any);
  const { data: { user } } = await supabase.auth.getUser();

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

  return <RootClient route={route} currentUser={user} />;
}
