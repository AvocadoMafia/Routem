import ClientRoot from "./clientRoot";

export default function Page(){
    return (
        //このページは各コンポーネントごとにスクロールを制御する
        <div className={'w-full h-full'}>
            <ClientRoot/>
        </div>
    )
}
