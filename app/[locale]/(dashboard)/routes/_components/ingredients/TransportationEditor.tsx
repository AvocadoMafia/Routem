"use client";

import { Transportation } from "@/lib/client/types";
import { Bike, Bus, Car, Footprints, Plane, Ship, Sparkles, TrainFront } from "lucide-react";
import { useTranslations } from "next-intl";
import { TransitMode } from "@prisma/client";

interface TransportationEditorProps {
    item: Transportation;
    onUpdate: (updates: Partial<Transportation>) => void;
}

// UIに出すモードの一覧。全TransitModeに対応するアイコン・翻訳キーを定義する。
// Prisma enum側を正として、新しいmodeが追加された時にここが型エラーで検知される形にしている。
type TransportModeOption = {
    id: TransitMode;
    labelKey: 'walk' | 'train' | 'bus' | 'car' | 'bike' | 'flight' | 'ship' | 'other';
    icon: React.ReactNode;
};

const TRANSPORT_MODES: TransportModeOption[] = [
    { id: TransitMode.WALK, labelKey: 'walk', icon: <Footprints size={20} /> },
    { id: TransitMode.TRAIN, labelKey: 'train', icon: <TrainFront size={20} /> },
    { id: TransitMode.BUS, labelKey: 'bus', icon: <Bus size={20} /> },
    { id: TransitMode.CAR, labelKey: 'car', icon: <Car size={20} /> },
    { id: TransitMode.BIKE, labelKey: 'bike', icon: <Bike size={20} /> },
    { id: TransitMode.FLIGHT, labelKey: 'flight', icon: <Plane size={20} /> },
    { id: TransitMode.SHIP, labelKey: 'ship', icon: <Ship size={20} /> },
    { id: TransitMode.OTHER, labelKey: 'other', icon: <Sparkles size={20} /> },
];

export default function TransportationEditor({ item, onUpdate }: TransportationEditorProps) {
    const t = useTranslations('transport');

    return (
        <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-bold text-foreground-0">
                {t('mode')}
            </label>
            {/* 交通手段を選択するボタングリッド */}
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {TRANSPORT_MODES.map((m) => (
                    <button
                        key={m.id}
                        onClick={() => onUpdate({ method: m.id })}
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
                        <span className="text-xs font-bold">{t(m.labelKey)}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
