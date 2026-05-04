type Props = {
    imageSrc: string,
    title_line1: string,
    title_line2: string,
    description: string,
}


export default function SolutionCard({imageSrc, title_line1, title_line2,  description}: Props) {

    return (
        <div className={'group w-full aspect-[3/4] relative overflow-hidden rounded-[2rem] @container cursor-pointer'}>
            {/* Background Image */}
            <div className={'absolute inset-0'}>
                <img
                    src={imageSrc}
                    alt={title_line1+title_line2}
                    className={'w-full h-full object-cover transition-all duration-[800ms] ease-out group-hover:scale-110 group-hover:brightness-75'}
                />
            </div>

            {/* Gradient Overlays */}
            <div className={'absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80'}/>
            <div className={'absolute inset-0 bg-gradient-to-tr from-accent-0/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700'}/>

            {/* Content */}
            <div className={'absolute inset-0 flex flex-col justify-between p-[6cqw]'}>
                {/* Title */}
                <div>
                    <h3 className={'text-[7cqw] text-white font-black leading-[1.1] tracking-tight drop-shadow-2xl'}>
                        {title_line1}<br/>{title_line2}
                    </h3>
                </div>

                {/* Description */}
                <div className={'translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out'}>
                    <p className={'text-[4.5cqw] text-white/90 leading-relaxed font-light backdrop-blur-sm'}>{description}</p>
                </div>
            </div>
        </div>
    )

}
