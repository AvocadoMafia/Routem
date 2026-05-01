import { ReactNode } from "react";

interface Props {
    title: string;
    icon: ReactNode;
    sticky?: boolean;
    className?: string;
}

export default function SectionHeaderMobile({ title, icon, sticky = true, className = "" }: Props) {
    return (
        <div className={`md:hidden ${sticky ? 'sticky' : 'absolute'} top-0 z-30 bg-background-1/80 backdrop-blur-sm border-b border-grass/30 px-2 py-3 flex items-center gap-2 w-full ${className}`}>
            <span className="text-accent-0 w-5 h-5 flex items-center justify-center">{icon}</span>
            <h1 className="text-base font-black tracking-[0.2em] uppercase text-foreground-0">{title}</h1>
        </div>
    );
}
