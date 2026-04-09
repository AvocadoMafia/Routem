'use client'

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Main({children}: {children: React.ReactNode}) {
    const containerRef = useRef<HTMLDivElement>(null);


    return (
        //今回はメインでスクロール検知を行わない。より上位のdivにて行う。
        <div ref={containerRef} className={'w-full h-full shrink-0'}>
            {children}
        </div>
    );
}
