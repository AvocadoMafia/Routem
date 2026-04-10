type Props = {
    imageSrc: string,
    title_line1: string,
    title_line2: string,
    description: string,
}


export default function SolutionCard({imageSrc, title_line1, title_line2,  description}: Props) {
    
    return (
        <div className={'w-full h-full bg-accent-0 rounded-xl flex flex-col p-3 relative @container'}>
            <div className={'w-full aspect-square overflow-hidden'}>
                <img src={imageSrc} alt={title_line1+title_line2} className={'w-full h-full object-cover rounded-xl'}/>
            </div>
            <div className={'w-full flex-1 flex flex-col gap-2 p-2'}>
                <p className={'text-xl text-white line-clamp-2 font-bold'}>{title_line1}<br/>{title_line2}</p>
                <p className={'text-sm text-gray-50'}>{description}</p>
            </div>
            <img src={'/lp/pinSmall.svg'} className={'w-16 h-16 absolute top-0 right-0'} alt={'pin'}/>
        </div>
    )

}