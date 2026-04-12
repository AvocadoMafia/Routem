'use client'

import { Route } from "@/lib/types/domain";
import Image from "next/image";
import { HiHeart, HiEye, HiCalendarDays, HiUsers, HiCurrencyDollar } from "react-icons/hi2";
import { Link } from "@/i18n/navigation";
import { formatDateToYmdInTz } from "@/lib/datetime/format";
import { useTranslations } from "next-intl";
import { useLocalizedBudget } from "@/lib/client/hooks/useLocalizedBudget";

export type RouteCardBasicProps = {
    route: Route;
    isLinkCard?: boolean;
    isFocused?: boolean;
    onClick?: () => void;
}

export default function RouteCardBasic({ route, isLinkCard = true, isFocused = false, onClick }: RouteCardBasicProps) {
    const t = useTranslations('routes');
    const localizedBudget = useLocalizedBudget(route.budget?.amount, route.budget?.localCurrencyCode, "---");
    const content = (
        <div
            className={`group w-full h-[440px] sm:h-[320px] overflow-hidden rounded-2xl flex flex-col sm:flex-row shadow-sm hover:shadow-2xl transition-all duration-700 bg-background-0 p-1.5 cursor-pointer ${isFocused ? 'ring-2 ring-accent-0 border-transparent' : ''}`}
            onClick={onClick}
        >
            <div className={'flex-1 min-h-[240px] sm:h-full relative overflow-hidden sm:rounded-l-xl rounded-t-xl bg-background-1'}>
                {/* オーバーレイ（視認性向上） - Smoother blur gradient with masked blur to avoid sharp boundary */}
                <div className="absolute inset-0 z-10 sm:rounded-l-xl rounded-t-xl overflow-hidden
                    backdrop-blur-2xl bg-black/50
                    [mask-image:linear-gradient(to_bottom,transparent_10%,black_80%)]
                    [-webkit-mask-image:linear-gradient(to_bottom,transparent_10%,black_80%)]" />
                <Image
                    src={route.thumbnail?.url ?? '/map.jpg'}
                    alt={route.title}
                    fill
                    className={'object-cover group-hover:scale-110 duration-700 ease-out'}
                    unoptimized
                />
                {/* 画像右上: いいね数/閲覧数（グラス＆rounded-full） */}
                <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/15 text-white backdrop-blur-md shadow-md">
                        <HiHeart className="w-4 h-4 text-accent-0" />
                        <span className="text-xs font-bold">{route.likes?.length ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/15 text-white backdrop-blur-md shadow-md">
                        <HiEye className="w-4 h-4 text-accent-0" />
                        <span className="text-xs font-bold">{route.views?.length ?? 0}</span>
                    </div>
                </div>
                <div className={'absolute left-0 bottom-0 w-full p-6 flex flex-col items-start gap-2 z-15'}>
                    <h2 className={'text-3xl font-bold text-white text-left leading-tight drop-shadow-md'}>{route.title}</h2>
                    <div className={'text-sm font-bold text-white/80 text-left uppercase tracking-[0.2em] flex items-center gap-2'}>
                        <HiCalendarDays className="w-4 h-4 text-white/80" aria-hidden />
                        <span>{formatDateToYmdInTz(route.createdAt)}</span>
                    </div>
                </div>
            </div>
            <div className={'w-full sm:w-[45%] h-full min-w-[160px] flex flex-col gap-4 px-6 sm:py-6 py-3 bg-background-1 sm:rounded-r-xl rounded-b-xl'}>
                {/* 上部: For と Budget を横並び */}
                <div className="w-full flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-background-0/80">
                        <HiUsers className="w-3 h-3 text-foreground-1" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-1">{t('forWho')}</span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-foreground-0 truncate">{route.routeFor.toLowerCase()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-background-0/80">
                        <HiCurrencyDollar className="w-3 h-3 text-foreground-1" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-1">{t('budget')}</span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-foreground-0 truncate">
                            {localizedBudget}
                        </span>
                    </div>
                </div>
                {/* 中段: description（3行制限） */}
                <div className={'w-full text-foreground-1 line-clamp-3 text-sm leading-relaxed'}>
                    {route.description}
                </div>
                {/* 下部: 作成者 */}
                <div className="mt-auto w-full flex items-center justify-end gap-3">
                    <div className="relative sm:w-10 w-7 aspect-square rounded-full overflow-hidden">
                        <Image
                            src={route.author.icon?.url || "/mockImages/userIcon_2.jpg"}
                            alt={route.author.name}
                            fill
                            className="rounded-full object-cover"
                            unoptimized
                        />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h4 className="text-sm font-bold truncate text-foreground-0">{route.author.name}</h4>
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

