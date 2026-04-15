import React from 'react'
import { HiHeart, HiEye, HiClock, HiBanknotes } from 'react-icons/hi2'
import Image from 'next/image';
import { Link } from "@/i18n/navigation";
import { Route } from '@/lib/types/domain';
import { useLocalizedBudget } from '@/lib/client/hooks/useLocalizedBudget';
import { useTranslations } from 'next-intl';

export type RouteCardGraphicalProps = {
  route: Route;
  isLinkCard?: boolean;
  isFocused?: boolean;
  onClick?: () => void;
  rank?: number;
}

export default function RouteCardGraphical({route, isLinkCard = true, isFocused = false, onClick, rank}: RouteCardGraphicalProps) {
  const t = useTranslations('routes');
  const localizedBudget = useLocalizedBudget(route?.budget?.amount, route?.budget?.localCurrencyCode, "---");
  const daysCount = route?.routeDates?.length ?? 0;

  const content = (
    <div
      onClick={onClick}
      className={`group relative block w-full h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 bg-background-0 p-1.5 cursor-pointer ${isFocused ? 'ring-2 ring-accent-0 border-transparent' : ''}`}
      aria-label={route?.title}
    >
      {/* Background Thumbnail Image with Margin (via container padding) */}
      <div className="relative w-full h-full rounded-xl overflow-hidden">
        <Image
          src={route?.thumbnail?.url || '/map.jpg'}
          alt={`${route?.title} thumbnail`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          unoptimized
        />

        {/* Gradient Mask Overlay (Top to Bottom) with Smooth Blur - Inside the image container */}
        <div className="absolute inset-0 rounded-lg
      backdrop-blur-2xl bg-black/50
      [mask-image:linear-gradient(to_bottom,transparent_10%,black_80%)]
      [-webkit-mask-image:linear-gradient(to_bottom,transparent_10%,black_80%)]" />

        {/* Content Container (Padding around edges) - Inside the image container */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
          {/* Top section: Rank on the right */}
          <div className="flex justify-end items-start">
            {/* rank props used to be here, but we should probably pass it explicitly if needed */}
              {rank && (
                  <span className="theme-reversed w-8 h-8 flex items-center justify-center rounded-full bg-background-1 text-foreground-0 text-xs font-bold border border-black/10 shadow-sm">
                #{rank}
              </span>
              )}
          </div>

          {/* Bottom section: Title and Meta Info */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h4 className="text-lg font-bold leading-tight drop-shadow-sm line-clamp-2">
                {route?.title}
              </h4>
              <div className="flex items-center gap-1.5 truncate mr-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/90">
                <span className="text-xs font-bold normal-case tracking-normal">@{route?.author.name}</span>
                <span className="text-white/30">•</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-0">For {route?.routeFor}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 shrink-0 text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">
                  <HiHeart className="w-4 h-4 text-accent-0" />
                  <span className="tabular-nums">{route?.likes?.length ?? 0}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0 text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">
                  <HiEye className="w-4 h-4 text-accent-0" />
                  <span className="tabular-nums">{route?.views?.length ?? 0}</span>
                </div>
              </div>

            </div>

            {/* Duration and Cost area (Button-like) */}
            <div className="flex gap-2">
              <div className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 backdrop-blur-md rounded-full shadow-inner bg-background-1 text-foreground-0 transition-colors">
                <HiClock className="w-4 h-4 text-foreground-0" />
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase">{daysCount} {t('daysUnit')}</span>
              </div>
              <div className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 backdrop-blur-md rounded-full shadow-inner bg-background-1 text-foreground-0 transition-colors">
                <HiBanknotes className="w-4 h-4 text-foreground-0" />
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase">{localizedBudget}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLinkCard) {
    return (
      <Link href={`/routes/${route?.id}`} className="block w-full h-full">
        {content}
      </Link>
    );
  }

  return content;
}
