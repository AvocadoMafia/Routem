import SolutionCard from "@/app/[locale]/(public)/about/_components/ingredients/solutionCard";

export default function SolutionSectionMobile() {
    return (
        <section className={'md:hidden flex w-full h-fit bg-background-0/75 backdrop-blur-sm flex justify-center relative @container'}>
            <img className={'w-full object-cover'} src={'/lp/mapMobile.svg'}/>
            <img className={'absolute w-[10cqw] top-[12cqw] left-[36.2cqw]'} src={'/lp/pinBig.svg'}/>
            <h3 className={'absolute text-[5cqw] top-[16cqw] left-[48cqw] rotate-[-2deg] leading-tight font-extrabold text-[#48484e]'}>旅行の計画って<br/>なんか面倒じゃない？</h3>
            <img className={'absolute w-[10cqw] top-[32cqw] left-[33.4cqw]'} src={'/lp/pinBig.svg'}/>
            <h3 className={'absolute text-[5cqw] top-[34cqw] left-[47cqw] rotate-[-2deg] leading-tight font-extrabold text-[#48484e]'}>とっておきのルート、<br/>シェアしてみない？</h3>
            <img className={'absolute w-[12cqw] top-[50cqw] left-[30cqw]'} src={'/lp/pinBig.svg'}/>
            <h3 className={'absolute text-[7cqw] top-[50cqw] left-[45cqw] rotate-[-2deg] leading-tight font-extrabold text-accent-0'}>それ全部、<br/>Routemで解決。</h3>
            <div className={'absolute w-full h-fit bg-background-0/75 backdrop-blur-sm z-20 top-[75cqw] flex justify-center'}>
                <div className={'w-full max-w-[1000px] flex items-center px-6 py-3'}>
                    <p className={'flex-1 h-fit text-foreground-0 text-sm font-bold leading-relaxed'}>旅行計画が面倒。<br/>気になるあの子と同じ旅をしたい。<br/>自分のとっておきのルートを共有したい。<br/>これ全部、<span className={'font-josefin-sans uppercase mr-2 text-accent-0 text-[1.1em]'}>Routem</span>で解決してみない？</p>
                    <div className={'lg:w-[400px] md:w-[300px] w-[250px] grid grid-cols-4 grid-rows-1 gap-3 overflow-hidden items-center'}>
                        <div className={' col-span-3'}>
                            <img className={'w-full'} src={'/lp/pc.png'}/>
                        </div>
                        <div className={''}>
                            <img className={'w-full'} src={'/lp/phone.png'}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className={'w-[50svw] h-[90svw] absolute top-[110cqw] left-[15cqw]'}>
                <SolutionCard imageSrc={'/mockImages/Fuji.jpg'} title_line1={'地図上で作る、'} title_line2={'地図上で伝える。'} description={'地図上の施設情報を結んでルートを作成。道のり・移動手段を可視化し、写真や感想を各スポットに添付。投稿者はブログ感覚でルートの詳細説明を書くこともできます。'}/>
            </div>
        </section>
    )

}