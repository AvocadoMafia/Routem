'use client'

import MapViewerOnLaptop from "@/app/(public)/_components/(home)/templates/mapViewerOnLaptop";
import MapViewerOnMobile from "@/app/(public)/_components/(home)/templates/mapViewerOnMobile";
import TopRoutesList from "@/app/(public)/_components/(home)/templates/topRoutesList";
import TopUsersList from "@/app/(public)/_components/(home)/templates/topUsersList";
import RecommendedRoutesList from "@/app/(public)/_components/(home)/templates/recommendedRoutesList";
import { Route, User } from "@/lib/client/types";

type Props = {
    routes: Route[];
    users: User[] | null;
    loading: boolean;
    error: string | null;
};

export default function HomeSection({ routes, users, loading, error }: Props) {
    return (
        <div className={'w-full h-fit flex flex-col items-center gap-20 py-6'}>
            {error && <div className={'w-full text-red-500 text-sm'}>{error}</div>}
            {loading ? (
                <div className={'w-full text-foreground-1 text-sm'}>Loading routes...</div>
            ) : (
                <>
                    <MapViewerOnLaptop routes={routes}/>
                    <MapViewerOnMobile routes={routes}/>
                    <TopRoutesList routes={routes} />
                    {/* TopUsersList */}
                    {users && users.length >= 5 && (
                        <TopUsersList users={users} />
                    )}
                    <RecommendedRoutesList routes={routes}/>
                </>
            )}
        </div>
    );
}
