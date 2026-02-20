import {useRouter} from "next/navigation";

export default function PageTitle() {
  const router = useRouter()
  return (
      <div className={'w-fit h-fit flex flex-row items-center'}>
        <img className={'h-12'} src={'/logo5.svg'} alt={'Routem'}/>
        <h1 className={'text-3xl text-foreground-0 font-bold cursor-pointer'} onClick={() => router.push('/')}>
          Routem
        </h1>
      </div>
  )

}
