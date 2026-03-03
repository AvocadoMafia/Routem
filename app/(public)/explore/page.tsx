"use client";


import ExploreCard from "@/app/(public)/explore/_components/templates/exploreCard";

export default function ExplorePage() {




    return (
        <div className="w-full h-full relative">
            {/* 背景画像 */}
            {/* 背景画像 */}
            {/* 背景画像 */}
            <div className="absolute inset-0 z-0">

                {/* クレジット */}
                <div className="absolute bottom-4 left-4 w-fit h-fit px-4 py-1
                  bg-background-1/40 border-background-1/60
                  border rounded-full text-foreground-1 z-20">
                    Mt.fuji taken by @lychee
                </div>

                {/* 画像 */}
                <img
                    className="w-full h-full object-cover"
                    src="/mockImages/mountain.jpg"
                    alt="background"
                />
                <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",

                        /* 黒グラデーション（下のみ） */
                        background: `
      linear-gradient(
        to top,
        rgba(0,0,0,0.65) 0%,
        rgba(0,0,0,0.35) 25%,
        rgba(0,0,0,0.15) 40%,
        transparent 55%
      )
    `,

                        /* 🔥 上55%は完全に透明（＝ブラーなし） */
                        maskImage: `
      linear-gradient(
        to bottom,
        transparent 0%,
        transparent 55%,
        rgba(0,0,0,0.4) 70%,
        black 100%
      )
    `,
                        WebkitMaskImage: `
      linear-gradient(
        to bottom,
        transparent 0%,
        transparent 55%,
        rgba(0,0,0,0.4) 70%,
        black 100%
      )
    `,
                    }}
                />

            </div>

            <div className="absolute w-full h-full flex items-center justify-center px-4">
                {/*カード*/}
                <ExploreCard />
            </div>
        </div>
    );
}