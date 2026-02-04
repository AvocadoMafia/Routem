import {LuMapPin} from "react-icons/lu";

export default function PhotoContainer(props: { test: number }) {
    const title =
        props.test === 1
            ? "Mt. Fuji"
            : props.test === 2
                ? "Kyoto"
                : "Tokyo";

    return (
        <div
            className="group relative w-full overflow-hidden transition-shadow duration-300 hover:shadow-xl">
            {/* 画像 */}
            <img
                src={
                    props.test === 1
                        ? "/mockImages/Fuji.jpg"
                        : props.test === 2
                            ? "/mockImages/Kyoto.jpg"
                            : "/mockImages/Tokyo.jpg"
                }
                className="
          w-full
          object-cover
          transition-transform
          duration-500
          ease-out
          group-hover:scale-105
        "
            />

            {/* 黒マスク */}
            <div
                className="
          pointer-events-none
          absolute inset-0
          bg-black/40
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
            />

            {/* タイトル（右下） */}
            <div
                className="
          absolute
          bottom-0
          right-0
          opacity-0
          translate-y-2
          transition-all
          duration-300
          ease-out
          group-hover:opacity-100
          group-hover:translate-y-0
          flex flex-col md:gap-4 gap-1 items-end
          p-4
        "
            >
                <div className={'flex items-center gap-2 text-white text-md sm:text-lg md:text-3xl font-bold'}>
                    <LuMapPin/>
                    <span>Kyoto, Japan</span>
                </div>
                <p className={'text-gray-200 text-sm sm:text-md md:text-2xl font-bold line-clamp-2'}>from Kyoto Old Town Walk</p>
                <div className={'flex items-center gap-2 text-gray-200 text-xs sm:text-sm md:text-lg'}>
                    <span>by</span>
                    <img className={'w-5 md:w-7 h-5 md:h-7 rounded-full'} src={'/mockImages/userIcon_1.jpg'}/>
                    <span>mock_user</span>
                </div>
            </div>
        </div>
    );
}
