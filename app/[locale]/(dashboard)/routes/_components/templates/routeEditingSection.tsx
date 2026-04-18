"use client";

import { RouteItem } from "@/lib/client/types";
import { MapPin, Navigation, MessageSquare } from "lucide-react";
import WaypointEditor from "../ingredients/WaypointEditor";
import TransportationEditor from "../ingredients/TransportationEditor";
import { useTranslations } from "next-intl";

interface RouteEditingSectionProps {
    selectedItem?: RouteItem;
    onUpdateItem: (updates: Partial<RouteItem>) => void;
}

export default function RouteEditingSection({ selectedItem, onUpdateItem }: RouteEditingSectionProps) {
    const t = useTranslations('routeEditor');
    const tRoutes = useTranslations('routes');

    // アイテムが選択されていない場合の空状態表示
    if (!selectedItem) {
        return (
            <div className="w-full h-full flex-1 flex flex-col items-center justify-center text-foreground-1 bg-background-1/30 animate-pulse">
                <div className="w-16 h-16 bg-grass rounded-full flex items-center justify-center mb-4">
                    <Navigation size={32} className="text-foreground-1" />
                </div>
                <p className="text-sm font-medium">{t('selectToEdit')}</p>
            </div>
        );
    }

    const isWaypoint = selectedItem.type === 'waypoint';

    return (
        <div className="w-full h-full md:min-h-0 min-h-[100svh] flex-1 bg-background-1 p-10 ">
            <div className="max-w-3xl mx-auto space-y-12 pb-20">
                {/* ヘッダーセクション: 現在編集中のアイテムの種類を表示 */}
                <div className="flex items-end justify-between border-b border-grass pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            {isWaypoint ? <MapPin size={18} className="text-accent-0" /> : <Navigation size={18} className="text-accent-0" />}
                            <span className="text-xs font-bold uppercase tracking-widest text-accent-0">
                                {isWaypoint ? tRoutes('waypoint') : tRoutes('transportation')}
                            </span>
                        </div>
                        <h2 className="text-3xl font-black text-foreground-0 tracking-tight">
                            {isWaypoint ? t('editWaypoint') : t('editTransportation')}
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-10">
                    {/*
                      アイテムの種類に応じて、経由地用エディタまたは交通手段用エディタを切り替える
                    */}
                    {isWaypoint ? (
                        <WaypointEditor
                            item={selectedItem}
                            onUpdate={onUpdateItem}
                        />
                    ) : (
                        <TransportationEditor
                            item={selectedItem}
                            onUpdate={onUpdateItem}
                        />
                    )}

                    {/* 共通のメモ入力エリア */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-bold text-foreground-0">
                            <MessageSquare size={16} /> {t('notesDetails')}
                        </label>
                        <textarea
                            value={selectedItem.memo}
                            onChange={(e) => onUpdateItem({ memo: e.target.value })}
                            className="w-full px-5 py-4 bg-background-0 border border-grass rounded-2xl h-48 focus:outline-none focus:ring-2 focus:ring-accent-0/20 focus:border-accent-0 transition-all text-base leading-relaxed resize-none"
                            placeholder={isWaypoint ? t('waypointPlaceholder') : t('transportPlaceholder')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
