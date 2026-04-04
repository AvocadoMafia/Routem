"use client";

import { Transportation } from "@/lib/client/types";
import { Footprints, TrainFront, Bus, Car, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

interface TransportationEditorProps {
    item: Transportation;
    onUpdate: (updates: Partial<Transportation>) => void;
}

export default function TransportationEditor({ item, onUpdate }: TransportationEditorProps) {
    const t = useTranslations('transport');

    const transportModes = [
        { id: 'WALK', labelKey: 'walk', icon: <Footprints size={20} /> },
        { id: 'TRAIN', labelKey: 'train', icon: <TrainFront size={20} /> },
        { id: 'BUS', labelKey: 'bus', icon: <Bus size={20} /> },
        { id: 'CAR', labelKey: 'car', icon: <Car size={20} /> },
        { id: 'OTHER', labelKey: 'other', icon: <Sparkles size={20} /> },
    ];

    return (
        <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-bold text-foreground-0">
                {t('mode')}
            </label>
            {/* 交通手段を選択するボタングリッド */}
            <div className="grid grid-cols-5 gap-3">
                {transportModes.map((m) => (
                    <button
                        key={m.id}
                        onClick={() => onUpdate({ method: m.id as any })}
                        className={`
                            flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all
                            ${item.method === m.id 
                                ? 'bg-accent-0 border-accent-0 text-white shadow-[0_8px_20px_rgba(45,31,246,0.2)]' 
                                : 'bg-background-0 text-foreground-1 border-grass hover:border-accent-0/30 hover:bg-background-1'}
                        `}
                    >
                        {/* 選択中のアイコンを少し強調 */}
                        <div className={`${item.method === m.id ? 'scale-110' : ''} transition-transform`}>
                            {m.icon}
                        </div>
                        <span className="text-xs font-bold">{t(m.labelKey as keyof IntlMessages['transport'])}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
