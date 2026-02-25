import ClientRoot from "@/app/(dashboard)/articles/new/clientRoot";

export default function Page(){
    return (
        //このページは各コンポーネントごとにスクロールを制御する
        <div className={'w-full h-full'}>
            <ClientRoot/>
        </div>
    )
}
