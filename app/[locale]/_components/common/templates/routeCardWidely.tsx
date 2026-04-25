import {Route} from "@/lib/types/domain";
import Image from "next/image";
import {HiHeart, HiEye} from "react-icons/hi2";
import { Link } from "@/i18n/navigation";

export type RouteCardWidelyProps = {
    route: Route;
    isLinkCard?: boolean;
    isFocused?: boolean;
    onClick?: () => void;
}

export default function RouteCardWidely({route, isLinkCard = true, isFocused = false, onClick}: RouteCardWidelyProps) {

    const content = (
        <div className={`w-full h-32 bg-background-0 text-foreground-1 rounded-2xl p-1.5 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] ${isFocused ? 'ring-2 ring-accent-0 border-transparent' : ''}`} onClick={onClick}>
            <div className={`w-full h-full flex flex-row rounded-xl overflow-hidden bg-background-1`}>
                <div className="relative h-full aspect-square">
                    <Image
                        className={'h-full w-full object-cover'}
                        src={route.thumbnail?.url ?? 'https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/initial-thumbnail.webp'}
                        alt={route.title}
                        fill
                        unoptimized
                    />
                </div>
                <div className={'flex-1 h-full px-4 py-3 flex flex-col justify-between overflow-hidden'}>
                    <div className="flex flex-col gap-1">
                        <h2 className={'font-bold text-sm line-clamp-2 leading-tight text-foreground-0'}>{route.title}</h2>
                        <span className="text-[10px] text-foreground-1 font-medium">by @{route.author.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <HiHeart className="w-3 h-3 text-accent-0" />
                            <span className="text-[10px] font-bold text-foreground-1">{route.likes?.length ?? 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <HiEye className="w-3 h-3 text-accent-0" />
                            <span className="text-[10px] font-bold text-foreground-1">{route.views?.length ?? 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (isLinkCard) {
        return (
            <Link href={`/routes/${route.id}`} className="block w-full">
                {content}
            </Link>
        );
    }

    return content;
}
