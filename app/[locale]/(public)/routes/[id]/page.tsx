import { notFound } from "next/navigation";
import { Route } from "@/lib/client/types";
import RootClient from "./rootClient";

import { createClient } from "@/lib/auth/supabase/server";
import { headers } from "next/headers";

export default async function RoutePage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const apiUrl = `${protocol}://${host}/api/v1/routes/${id}`;

  const res = await fetch(apiUrl, {
    headers: {
      cookie: headersList.get("cookie") || "",
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    if (res.status === 404 || res.status === 401) {
      notFound();
    }
    throw new Error(`Failed to fetch route: ${res.status}`);
  }

  const route = (await res.json()) as Route;

  const supabase = await createClient({
    headers: headersList,
  } as any);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <RootClient route={route} currentUser={user} />;
}
