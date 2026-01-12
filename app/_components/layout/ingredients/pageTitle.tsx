import {useRouter} from "next/navigation";

export default function PageTitle() {
  const router = useRouter()
  return <h1 className={'text-3xl text-foreground-0 font-bold font-serif cursor-pointer'} onClick={() => router.push('/')}>Rootem</h1>;
}
