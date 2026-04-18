'use client'

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Route } from "@/lib/client/types";
import { getDataFromServerWithJson } from "@/lib/client/helpers";
import { HiHashtag } from "react-icons/hi2";
import RouteCardBasic from "@/app/[locale]/_components/common/templates/routeCardBasic";
import RouteCardBasicSkeleton from "@/app/[locale]/_components/common/ingredients/routeCardBasicSkeleton";
import SectionErrorState from "@/app/[locale]/_components/common/ingredients/sectionErrorState";
import { CursorResponse, useInfiniteScroll } from "@/lib/client/hooks/useInfiniteScroll";

type TagRoutesResponse = CursorResponse<Route> & { totalCount?: number };

export default function RootClient({ name }: { name: string }) {
    const tEmpty = useTranslations('empty');
    const [totalCount, setTotalCount] = useState<number | null>(null);

    const { items: routes, hasMore, observerTarget, error, retry } = useInfiniteScroll<Route>({
        fetcher: async (cursor) => {
            const url = `/api/v1/routes?tag=${encodeURIComponent(name)}&limit=15${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`;
            const res = await getDataFromServerWithJson<TagRoutesResponse>(url);
            // 初回のみtotalCountを取り込み
            if (!cursor && res && typeof res.totalCount === 'number') {
                setTotalCount(res.totalCount);
            }
            return res;
        },
        deps: [name],
    });

    // タグが変わった時はtotalCountをリセット
    useEffect(() => { setTotalCount(null) }, [name]);

    return (
        <div className={'w-full max-w-[1600px] h-full flex flex-col items-center md:px-8 px-4 py-8 gap-8'}>
            <header className={'w-full flex flex-col gap-2 items-start'}>
                <div className={'flex items-center gap-3'}>
                    <div className={'w-12 h-12 rounded-full bg-background-1 flex items-center justify-center border border-grass/20'}>
                        <HiHashtag className={'w-6 h-6 text-grass'}/>
                    </div>
                    <h1 className={'text-3xl md:text-4xl font-black text-foreground-0 break-all'}>{name}</h1>
                </div>
                <p className={'text-xs font-bold uppercase tracking-[0.2em] text-foreground-1/60 pl-15'}>
                    {error && totalCount === null
                        ? '—'
                        : totalCount === null
                            ? 'LOADING...'
                            : `${totalCount.toLocaleString()} ${totalCount === 1 ? 'POST' : 'POSTS'}`}
                </p>
            </header>

            <section className={'w-full h-fit flex flex-col gap-3'}>
                {error && (!routes || routes.length === 0) ? (
                    // 初回取得失敗: セクション全体を error UI に差し替え
                    <SectionErrorState error={error} onRetry={retry}/>
                ) : routes === null ? (
                    // loading
                    <div className={'w-full grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3'}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <RouteCardBasicSkeleton key={`initial-${i}`} />
                        ))}
                    </div>
                ) : routes.length === 0 ? (
                    // empty
                    <div className="w-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-grass/10 rounded-3xl">
                        <p className="text-foreground-1/60 text-sm font-bold uppercase tracking-widest">{tEmpty('noRoutesForTag')}</p>
                    </div>
                ) : (
                    // data
                    <div className={'w-full grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3'}>
                        {routes.map((r) => (
                            <RouteCardBasic route={r} key={r.id} />
                        ))}
                        {hasMore && !error && Array.from({ length: 6 }).map((_, i) => (
                            <RouteCardBasicSkeleton
                                key={`more-${i}`}
                                isFirst={i === 0}
                                observerTarget={observerTarget}
                            />
                        ))}
                        {error && (
                            // 追加ロード失敗: リスト末尾に inline retry
                            <div className="col-span-full">
                                <SectionErrorState variant="inline" error={error} onRetry={retry}/>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
