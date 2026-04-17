import RootClient from "./rootClient";

type Props = {
  params: Promise<{ name: string }>
}

export default async function TagPage({ params }: Props) {
  const { name } = await params;
  return <RootClient name={decodeURIComponent(name)} />;
}
