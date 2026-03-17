
import RootClient from "@/app/(public)/search/rootClient";


export default async function Page({ searchParams }: { searchParams: { q?: string } }) {
  const params = await searchParams;
  const q = params.q || '';


  return (
    <div className="w-full h-full p-4">
      <RootClient q={q} />
    </div>
  );
}
