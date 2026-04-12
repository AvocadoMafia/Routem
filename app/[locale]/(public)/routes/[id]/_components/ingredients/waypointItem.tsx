"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

type WaypointItemProps = {
  idx: number;
  data: any;
  isFocused: boolean;
};

export default function WaypointItem({ idx, data, isFocused }: WaypointItemProps) {
  const t = useTranslations('routes');
  return (
    <div
      className={`transition-all duration-700 ease-[0.22,1,0.36,1] ${
        isFocused ? "opacity-100" : "opacity-40"
      }`}
    >
      <div className="max-w-4xl overflow-x-hidden">
        <div className="flex flex-col gap-4 mb-16">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-accent-0" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground-1">
              {t('waypoint')} {Math.floor(idx / 2) + 1}
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-medium text-foreground-0 tracking-[0.05em] uppercase leading-tight break-words">
            {data.spot?.name || t('waypoint')}
          </h2>
        </div>

        {data.images && data.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            {data.images.map((img: any, i: number) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative aspect-[16/10] overflow-hidden"
              >
                <Image
                  src={img.url}
                  alt="spot image"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </motion.div>
            ))}
          </div>
        )}

        <div className="max-w-2xl">
          <p className="text-lg md:text-xl leading-relaxed text-foreground-0/80 font-normal whitespace-pre-wrap break-words">
            {data.details || t('noDescription')}
          </p>
        </div>
      </div>
    </div>
  );
}
