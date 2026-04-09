import {useRouter} from "next/navigation";

export default function PageTitle() {
  const router = useRouter()
  return (
      <div className={'w-fit h-fit flex flex-row items-center gap-2 cursor-pointer'} onClick={() => router.push('/')}>
          <img src={'/logo.svg'} alt={'logo'} className={'w-8 h-8'}/>
        <h1 className={'text-2xl text-foreground-0 font-semibold font-outfit'}>
          Routem
        </h1>
      </div>
  )
}
