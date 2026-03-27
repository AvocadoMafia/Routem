'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Route } from "@/lib/client/types";
import { getDataFromServerWithJson } from "@/lib/client/helpers";
import SearchHeader from "@/app/(public)/search/_components/templates/searchHeader";
import SearchFilters from "@/app/(public)/search/_components/templates/searchFilters";
import ResultsGrid from "@/app/(public)/search/_components/templates/resultsGrid";
import ModalFullSize from "@/app/_components/common/templates/modalFullSize";

type SearchResponse = { items: Route[]; total: number };

type Props = {
    q: string
}

type FilterState = {
    orderBy: string;
    routeFor: string;
    month: string;
}

export default function RootClient(props: Props) {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [total, setTotal] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState<FilterState>({ orderBy: "relevant", routeFor: "", month: "" });
    const [showFilters, setShowFilters] = useState(true);
    const limit = 12;
    const observerTarget = useRef<HTMLDivElement>(null);
    
    // Refs to avoid stale closure in IntersectionObserver
    const isFetchingRef = useRef(false);
    const hasMoreRef = useRef(true);

    useEffect(() => {
        isFetchingRef.current = isFetching;
    }, [isFetching]);

    useEffect(() => {
        hasMoreRef.current = hasMore;
    }, [hasMore]);

    // モーダル表示時の背後スクロール防止
    useEffect(() => {
        if (showFilters) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [showFilters]);

    const fetchSearchResults = useCallback(async (offset: number) => {
        if (isFetchingRef.current || !hasMoreRef.current) return;
        
        setIsFetching(true);
        try {
            const params = new URLSearchParams({
                q: props.q,
                limit: limit.toString(),
                offset: offset.toString(),
                orderBy: filters.orderBy,
                ...(filters.routeFor && { routeFor: filters.routeFor }),
                ...(filters.month && { month: filters.month }),
            });

            const res = await getDataFromServerWithJson<SearchResponse>(
                `/api/v1/routes/search?${params.toString()}`
            );

            if (!res) return;

            setTotal(res.total);
            
            if (offset === 0) {
                setRoutes(res.items);
            } else {
                setRoutes(prev => [...prev, ...res.items]);
            }

            const nextHasMore = (offset + limit) < res.total;
            setHasMore(nextHasMore);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setIsFetching(false);
        }
    }, [props.q, filters, limit]);

    // Initial search
    useEffect(() => {
        setRoutes([]);
        setHasMore(true);
        hasMoreRef.current = true;
        fetchSearchResults(0);
    }, [fetchSearchResults]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMoreRef.current && !isFetchingRef.current) {
                    fetchSearchResults(routes.length);
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [routes.length]);

    return (
        <div className="w-full h-full md:overflow-hidden flex relative">
            {/* Filters Sidebar - Desktop */}
            <div className={'hidden md:block w-[400px] h-full bg-background-0 overflow-y-scroll border-r border-grass'}>
                <SearchFilters filters={filters} onFiltersChange={setFilters} />
            </div>

            {/* Filters ModalFullSize - Mobile */}
            {showFilters && (
                <ModalFullSize onBackgroundClick={() => setShowFilters(false)}>
                    <div className="flex flex-col w-full h-full bg-background-0 shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
                        <div className="sticky z-10 bg-background-1/80 backdrop-blur-md border-b border-grass px-4 py-3 flex items-center justify-between top-0">
                            <div className="text-base font-bold text-foreground-0">Filters</div>
                            <button className="p-2 -mr-2 text-foreground-1 hover:text-foreground-0 active:scale-95 transition-transform" onClick={() => setShowFilters(false)}>
                                <X size={22} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto pb-6">
                            <SearchFilters filters={filters} onFiltersChange={setFilters} />
                        </div>
                    </div>
                </ModalFullSize>
            )}
            <div className={'flex-1 md:h-full h-fit md:overflow-y-scroll flex flex-col'}>
                <SearchHeader
                    query={props.q}
                    total={total}
                    showFilters={showFilters}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                />
                <ResultsGrid routes={routes} isFetching={isFetching} hasMore={hasMore} total={total} observerTarget={observerTarget}/>
            </div>
            {/*<SearchHeader*/}
            {/*    query={props.q}*/}
            {/*    total={total}*/}
            {/*    showFilters={showFilters}*/}
            {/*    onToggleFilters={() => setShowFilters(!showFilters)}*/}
            {/*/>*/}

            {/*/!* Main Content *!/*/}
            {/*<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">*/}
            {/*    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">*/}
            {/*        /!* Filters Sidebar *!/*/}
            {/*        {showFilters && (*/}
            {/*            <div className="md:col-span-1 lg:col-span-1">*/}
            {/*                <div className="sticky top-24 space-y-6">*/}
            {/*                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">*/}
            {/*                        <SearchFilters*/}
            {/*                            filters={filters}*/}
            {/*                            onFiltersChange={setFilters}*/}
            {/*                        />*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        )}*/}

            {/*        /!* Results Grid *!/*/}
            {/*        <div className="md:col-span-3 lg:col-span-4">*/}
            {/*            <ResultsGrid*/}
            {/*                routes={routes}*/}
            {/*                isFetching={isFetching}*/}
            {/*                hasMore={hasMore}*/}
            {/*                total={total}*/}
            {/*                observerTarget={observerTarget}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    )
}
