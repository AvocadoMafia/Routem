import { ReactNode } from "react";
import SectionHeaderMobile from "./sectionHeaderMobile";
import SectionErrorState from "@/app/[locale]/_components/common/ingredients/sectionErrorState";

interface Props {
    title: string;
    icon: ReactNode;
    error: any;
    retry: () => void;
    isEmpty: boolean;
    emptyView: ReactNode;
    isLoading?: boolean;
    loadingView?: ReactNode;
    children: ReactNode;
    headerSticky?: boolean;
}

export default function SectionContentWrapper({
    title,
    icon,
    error,
    retry,
    isEmpty,
    emptyView,
    isLoading,
    loadingView,
    children,
    headerSticky = true
}: Props) {
    // 1. Loading
    if (isLoading && loadingView) {
        return (
            <div className="w-full h-full relative">
                <SectionHeaderMobile title={title} icon={icon} sticky={headerSticky} />
                {loadingView}
            </div>
        );
    }

    // 2. Error (初回取得失敗)
    if (error && isEmpty) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-6 px-4 relative">
                <SectionHeaderMobile title={title} icon={icon} sticky={headerSticky} className={headerSticky ? "" : "absolute"} />
                <div className="w-full max-w-md">
                    <SectionErrorState error={error} onRetry={retry} />
                </div>
            </div>
        );
    }

    // 3. Empty
    if (!isLoading && isEmpty) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 relative">
                <SectionHeaderMobile title={title} icon={icon} sticky={headerSticky} className={headerSticky ? "" : "absolute"} />
                {emptyView}
            </div>
        );
    }

    // 4. Normal
    return (
        <div className="w-full h-full md:h-full h-fit flex flex-col md:flex-row relative">
            <SectionHeaderMobile title={title} icon={icon} sticky={headerSticky} />
            {children}
        </div>
    );
}
