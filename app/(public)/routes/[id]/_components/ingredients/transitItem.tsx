"use client";

import { Clock } from "lucide-react";
import TransitIcon from "./transitIcon";

type TransitItemProps = {
  data: any;
  isFocused: boolean;
  itemRef: (el: HTMLDivElement | null) => void;
};

export default function TransitItem({ data, isFocused, itemRef }: TransitItemProps) {
  return (
    <div
      ref={itemRef}
      className={`transition-all duration-700 ease-[0.22,1,0.36,1] ${
        isFocused ? "opacity-100" : "opacity-40"
      }`}
    >
      <div className="max-w-4xl overflow-x-hidden">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-6 md:gap-12 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="text-accent-0">
                <TransitIcon mode={data.mode} />
              </div>
              <h2 className="text-xl font-bold text-foreground-0 tracking-widest uppercase">
                {data.mode}
              </h2>
            </div>
            {data.duration && (
              <div className="flex items-center gap-3 text-foreground-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                  {data.duration} min
                </span>
              </div>
            )}
          </div>
          {data.memo && (
            <p className="text-sm text-foreground-1 font-medium italic">
              {data.memo}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
