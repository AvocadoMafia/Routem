
import RootClient from "@/app/(public)/search/rootClient";


export default async function Page({ searchParams }: { searchParams: { q?: string } }) {
  const params = await searchParams;
  const q = params.q || '';

  return (
    <main className="w-full min-h-screen">
      <RootClient q={q} />
    </main>
  );
}
