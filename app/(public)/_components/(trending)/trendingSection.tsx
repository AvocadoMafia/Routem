'use client'

import TrendingRoutesList from "@/app/(public)/_components/(trending)/templates/trendingRoutesList";
import TrendingUsersList from "@/app/(public)/_components/(trending)/templates/trendingUsersList";
import TrendingTagsList from "@/app/(public)/_components/(trending)/templates/trendingTagsList";

export default function TrendingSection() {
    return (
        <div className={'w-full h-full overflow-hidden flex flex-row'}>
            <TrendingRoutesList />
            <div className={'flex-1 h-full flex flex-col gap-2 overflow-y-scroll'}>
                <TrendingUsersList/>
                <TrendingTagsList/>
            </div>
        </div>
    );
}
