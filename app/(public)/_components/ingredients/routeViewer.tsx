'use client'

import Image from 'next/image';
import {Route} from "@/lib/client/types";

type Props = {
  focusedIndex: number;
  routes: Route[]
};

export default function RouteViewer(props: Props) {
  const route = props.focusedIndex !== null ? props.routes[props.focusedIndex] : null;

  return (
    <div className={'flex w-[400px] h-full flex-col gap-6 backdrop-blur-xs overflow-y-scroll bg-background-1/50 p-6 border-l border-grass/20'}>
      {route ? (
        <>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
            <Image
              src={route.thumbnailImageSrc ?? '/map.png'}
              alt={route.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground-1 leading-tight">
                {route.title}
              </h2>
              <p className="text-foreground-1/60 mt-1">
                by @{route.user.name} • {route.category}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-sm font-medium text-rose-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M11.645 20.91l-.007-.003-.022-.01a15.247 15.247 0 01-.383-.173 25.18 25.18 0 01-4.244-2.673C4.688 16.357 2.25 13.852 2.25 10.5A5.25 5.25 0 017.5 5.25a5.23 5.23 0 014.5 2.508 5.23 5.23 0 014.5-2.508 5.25 5.25 0 015.25 5.25c0 3.352-2.438 5.857-4.739 7.551a25.175 25.175 0 01-4.244 2.673 15.247 15.247 0 01-.383.173l-.022.01-.007.003a.752.752 0 01-.614 0z" />
                </svg>
                {route.likesThisWeek} Likes
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-foreground-1">Description</h3>
              <p className="text-foreground-1/80 leading-relaxed">
                This is a beautiful route through {route.category} focused spots.
                Enjoy the amazing views and local culture curated by @{route.user.name}.
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-foreground-1">Route Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-background-0 border border-grass/10">
                  <span className="block text-foreground-1/40">Distance</span>
                  <span className="font-medium text-foreground-1">5.2 km</span>
                </div>
                <div className="p-3 rounded-lg bg-background-0 border border-grass/10">
                  <span className="block text-foreground-1/40">Duration</span>
                  <span className="font-medium text-foreground-1">2.5 hours</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-full items-center justify-center text-foreground-1/40 italic">
          Select a route to view details
        </div>
      )}
    </div>
  );
}
