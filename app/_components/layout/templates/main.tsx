'use client'

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Main({children}: {children: React.ReactNode}) {
    const containerRef = useRef<HTMLDivElement>(null);


    return (
        //今回はメインでスクロール検知を行わない。より上位のdivにて行う。
        <div ref={containerRef} className={'shrink-0 w-full !h-[100svh] overflow-y-scroll overscroll-contain'}>
            {children}
        </div>
    );
}
