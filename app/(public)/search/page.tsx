import RouteCardGraphical from "@/app/_components/common/templates/routeCardGraphical";
import { Route } from "@/lib/client/types";
import { getDataFromServerWithJson } from "@/lib/client/helpers";

export const dynamic = "force-dynamic";

async function fetchRoutes(q: string): Promise<Route[]> {
  const params = await new URLSearchParams();
  if (q) params.set('q', q);
  params.set('limit', '20');

  // Use absolute URL in Server Component
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/v1/routes?${params.toString()}`;

  const res = await getDataFromServerWithJson<Route[]>(url);
  return res || [];
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const params = await searchParams;
  const q = params.q || '';
  const routes = await fetchRoutes(q);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-xl font-bold text-foreground-0">Search results</h1>
      {q && (
        <p className="text-sm text-foreground-1">Query: <span className="font-medium">{q}</span></p>
      )}

      {routes.length === 0 ? (
        <div className="text-foreground-1">No results found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {routes.map((route) => (
            <RouteCardGraphical key={route.id} route={route} />
          ))}
        </div>
      )}
    </div>
  );
}
