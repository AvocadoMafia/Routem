import {LuMapPin} from "react-icons/lu";
import Image from "next/image";

export default function PhotoContainer(props: { test: number }) {
    const images = [
        "/mockImages/Tokyo.jpg",
        "/mockImages/Fuji.jpg",
        "/mockImages/Kyoto.jpg"
    ];

    const locations = [
        "Tokyo, Japan",
        "Mt. Fuji, Japan",
        "Kyoto, Japan"
    ];

    const routeTitles = [
        "Shibuya Night Walk",
        "Five Lakes Trail",
        "Kyoto Old Town Walk"
    ];

    const imgSrc = images[props.test % images.length];
    const location = locations[props.test % locations.length];
    const routeTitle = routeTitles[props.test % routeTitles.length];

    return (
        <div
            className="group relative w-full overflow-hidden rounded-2xl transition-shadow duration-700 hover:shadow-2xl bg-background-1 border border-foreground-0/5 cursor-pointer">
            {/* 画像 */}
            <div className="relative w-full overflow-hidden">
                <Image
                    src={imgSrc}
                    alt={location}
                    width={800}
                    height={1000}
                    className="
                      w-full
                      h-auto
                      object-cover
                      transition-transform
                      duration-700
                      ease-[0.22,1,0.36,1]
                      group-hover:scale-110
                    "
                    unoptimized
                />
            </div>

            {/* グラデーション (Hover時) */}
            <div
                className="
                  pointer-events-none
                  absolute inset-0
                  opacity-0
                  transition-opacity
                  duration-500
                  group-hover:opacity-100
                  z-10
                  will-change-opacity
                "
            >
                {/* 背景グラデーション */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transform-gpu" />
            </div>

            {/* タイトル・情報 (Hover時) */}
            <div
                className="
                  absolute
                  inset-0
                  z-20
                  opacity-0
                  translate-y-4
                  transition-all
                  duration-500
                  ease-[0.22,1,0.36,1]
                  group-hover:opacity-100
                  group-hover:translate-y-0
                  flex flex-col justify-end
                  p-6
                "
            >
                <div className="flex flex-col gap-3 items-start">
                    <div className={'flex items-center gap-2'}>
                        <LuMapPin className={'text-accent-0 w-3.5 h-3.5'}/>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
                            {location}
                        </span>
                    </div>

                    <h3 className={'text-xl md:text-2xl font-bold text-white leading-tight'}>
                        {routeTitle}
                    </h3>

                    <div className="w-full h-px bg-white/10 my-1" />

                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/20">
                                <Image
                                    src="/mockImages/userIcon_1.jpg"
                                    alt="user"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                            <span className="text-xs font-bold text-white/80">@mock_user</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/40 mb-0.5">Explore</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-1">View Route →</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
