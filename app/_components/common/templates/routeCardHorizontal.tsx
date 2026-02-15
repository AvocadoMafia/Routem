import Image from 'next/image';
import {Route} from "@/lib/client/types";

type Props = {
  route: Route;
  isFocused: boolean;
  onClick?: () => void;
}
// 横長のシンプルな旅行ルート サムネイルカード
export default function RouteCardHorizontal(props: Props){
  const bgSrc = props.route.thumbnail?.url  ?? '/map.png';
  return (
    <div
      className={`relative w-full max-w-2xl overflow-hidden rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer ${
        props.isFocused ? 'ring-2 ring-primary border-transparent' : 'bg-background-1'
      }`}
      style={{ minHeight: '96px' }}
      onClick={props.onClick}
    >
      {/* 背景画像 (常にレンダリングし、不透明度でアニメーション) */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          props.isFocused ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Image
          src={bgSrc}
          alt={`${props.route.title} background`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority={false}
          unoptimized
        />
        {/* オーバーレイ（視認性向上） */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/20" />
      </div>

      {/* コンテンツ（オーバーレイ上、または背景色の上） */}
      <div className="relative flex items-center justify-between gap-3 p-3 transition-colors duration-300">
        <div className="min-w-0">
          <div
            className={`truncate text-sm font-semibold transition-colors duration-300 ${
              props.isFocused ? 'text-white' : 'text-foreground-1'
            }`}
          >
            {props.route.title}
          </div>
          <div
            className={`mt-1 flex items-center gap-2 text-xs transition-colors duration-300 ${
              props.isFocused ? 'text-white/90' : 'text-foreground-1/70'
            }`}
          >
            <span className="truncate">@{props.route.author.name}</span>
            <span
              className={`transition-colors duration-300 ${
                props.isFocused ? 'text-white/40' : 'text-foreground-1/30'
              }`}
            >
              •
            </span>
            <span className="truncate">{props.route.category?.name || props.route.category}</span>
          </div>
        </div>
        <div className="shrink-0 text-xs">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 transition-all duration-300 ${
              props.isFocused
                ? 'border-white/40 bg-black/20 text-white'
                : 'border-foreground-1/20 bg-background-0 text-foreground-1'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-3.5 w-3.5 text-rose-400"
              aria-hidden
            >
              <path d="M11.645 20.91l-.007-.003-.022-.01a15.247 15.247 0 01-.383-.173 25.18 25.18 0 01-4.244-2.673C4.688 16.357 2.25 13.852 2.25 10.5A5.25 5.25 0 017.5 5.25a5.23 5.23 0 014.5 2.508 5.23 5.23 0 014.5-2.508 5.25 5.25 0 015.25 5.25c0 3.352-2.438 5.857-4.739 7.551a25.175 25.175 0 01-4.244 2.673 15.247 15.247 0 01-.383.173l-.022.01-.007.003a.752.752 0 01-.614 0z" />
            </svg>
            <span className="tabular-nums">{props.route.likes?.length ?? 0}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

