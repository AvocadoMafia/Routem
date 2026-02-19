'use client'

import React from "react";

export default function Main({children}: {children: React.ReactNode}) {
    return (
        //今回はメインでスクロール検知を行わない。より上位のdivにて行う。
        <div className={'w-full h-[100svh] overflow-y-scroll overscroll-contain'}>
            {children}
        </div>
    )
}
