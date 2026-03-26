'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { Route } from "@/lib/client/types";
import { getDataFromServerWithJson } from "@/lib/client/helpers";
import SearchHeader from "@/app/(public)/search/_components/ingredients/searchHeader";
import SearchFilters from "@/app/(public)/search/_components/templates/searchFilters";
import ResultsGrid from "@/app/(public)/search/_components/ingredients/resultsGrid";

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
        <div className="min-h-screen bg-slate-50">
            <SearchHeader
                query={props.q}
                total={total}
                showFilters={showFilters}
                onToggleFilters={() => setShowFilters(!showFilters)}
            />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {/* Filters Sidebar */}
                    {showFilters && (
                        <div className="md:col-span-1 lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                                    <SearchFilters
                                        filters={filters}
                                        onFiltersChange={setFilters}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results Grid */}
                    <div className="md:col-span-3 lg:col-span-4">
                        <ResultsGrid
                            routes={routes}
                            isFetching={isFetching}
                            hasMore={hasMore}
                            total={total}
                            observerTarget={observerTarget}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
