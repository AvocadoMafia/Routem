import {useRouter} from "next/navigation";

export default function PageTitle() {
  const router = useRouter()
  return (
      <div className={'w-fit h-fit flex flex-row items-center gap-2 cursor-pointer'} onClick={() => router.push('/')}>
        <img className={'h-9 w-9'} src={'/logo.svg'} alt={'Routem'}/>
        <h1 className={'text-2xl text-foreground-0 font-bold tracking-tight'}>
          Routem
        </h1>
      </div>
  )
}
