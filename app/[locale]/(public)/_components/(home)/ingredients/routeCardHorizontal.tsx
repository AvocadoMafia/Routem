import Image from 'next/image';
import { Link } from "@/i18n/navigation";
import { Route } from '@/lib/types/domain';
import { useTranslations } from 'next-intl';

import { useLocalizedBudget } from '@/lib/client/hooks/useLocalizedBudget';

export type RouteCardHorizontalProps = {
  route: Route;
  isLinkCard?: boolean;
  isFocused?: boolean;
  onClick?: () => void;
}

// 横長のシンプルな旅行ルート サムネイルカード
export default function RouteCardHorizontal({route, isLinkCard = false, isFocused = false, onClick}: RouteCardHorizontalProps){
  const t = useTranslations('routes');
  const bgSrc = route.thumbnail?.url  ?? '/map.jpg';
  const localizedBudget = useLocalizedBudget(route.budget?.amount, route.budget?.localCurrencyCode);
  const daysCount = route.routeDates.length;
  
  const content = (
    <div
      className={`relative w-full max-w-2xl overflow-hidden rounded-lg border-2 shadow-sm hover:shadow-md transition-all cursor-pointer ${
        isFocused ? 'border-accent-0/50' : 'bg-background-1 border-transparent'
      }`}
      style={{ minHeight: '96px' }}
      onClick={onClick}
    >
      {/* 背景画像 (常にレンダリングし、不透明度でアニメーション) */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isFocused ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Image
          src={bgSrc}
          alt={`${route.title} background`}
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
              isFocused ? 'text-white' : 'text-foreground-1'
            }`}
          >
            {route.title}
          </div>
          <div
            className={`mt-1 flex items-center gap-2 text-xs transition-colors duration-300 ${
              isFocused ? 'text-white/90' : 'text-foreground-1/70'
            }`}
          >
            <span className="truncate">@{route.author.name}</span>
            <span
              className={`transition-colors duration-300 ${
                isFocused ? 'text-white/40' : 'text-foreground-1/30'
              }`}
            >
              •
            </span>
            <span className="truncate">{localizedBudget}</span>
            <span
              className={`transition-colors duration-300 ${
                isFocused ? 'text-white/40' : 'text-foreground-1/30'
              }`}
            >
              •
            </span>
            <span className="truncate">{daysCount} {t('daysUnit')}</span>
          </div>
        </div>
        <div className="shrink-0 text-xs">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 transition-all duration-300 ${
              isFocused
                ? 'border-white/40 bg-black/20 text-white'
                : 'border-foreground-1/20 bg-background-0 text-foreground-1'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-3.5 w-3.5 text-accent-0"
              aria-hidden
            >
              <path d="M11.645 20.91l-.007-.003-.022-.01a15.247 15.247 0 01-.383-.173 25.18 25.18 0 01-4.244-2.673C4.688 16.357 2.25 13.852 2.25 10.5A5.25 5.25 0 017.5 5.25a5.23 5.23 0 014.5 2.508 5.23 5.23 0 014.5-2.508 5.25 5.25 0 015.25 5.25c0 3.352-2.438 5.857-4.739 7.551a25.175 25.175 0 01-4.244 2.673 15.247 15.247 0 01-.383.173l-.022.01-.007.003a.752.752 0 01-.614 0z" />
            </svg>
            <span className="tabular-nums">{route.likes?.length ?? 0}</span>
          </span>
        </div>
      </div>
    </div>
  );

  if (isLinkCard) {
    return (
      <Link href={`/routes/${route.id}`} className="block w-full">
        {content}
      </Link>
    );
  }

  return content;
};

