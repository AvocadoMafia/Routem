"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { RouteItem } from "@/lib/types/domain";
import WaypointCard from "../ingredients/WaypointCard";
import TransportationCard from "../ingredients/TransportationCard";
import RouteNode from "../ingredients/RouteNode";
import InlineAddMenu from "../ingredients/InlineAddMenu";
import DiagramHeaderMobile from "../ingredients/DiagramHeaderMobile";
import DayTabs from "../ingredients/DayTabs";
import AddWaypointButton from "../ingredients/AddWaypointButton";
import { useUiStore } from "@/lib/stores/uiStore";
import { useTranslations } from "next-intl";

interface NodeLinkDiagramProps {
    items: RouteItem[];
    allDaysItems: RouteItem[][];
    currentDayIndex: number;
    onSelectDay: (index: number) => void;
    onAddDay: () => void;
    onRemoveDay: (index: number) => void;
    selectedIndex: number;
    onSelectItem: (index: number) => void;
    onAddWaypoint: () => void;
    onDeleteWaypoint: (index: number) => void;
    onAddItem: (afterIndex: number, type: 'waypoint' | 'transportation') => void;
    // New header actions
    onOpenSettings: () => void;
    onPublish: () => void;
    publishing: boolean;
    isSettingsComplete: boolean;
    title?: string;
    activeSection?: 'edit' | 'settings';
    onOpenEdit?: () => void;
}

export default function NodeLinkDiagram({
    items,
    allDaysItems,
    currentDayIndex,
    onSelectDay,
    onAddDay,
    onRemoveDay,
    selectedIndex,
    onSelectItem,
    onAddWaypoint,
    onDeleteWaypoint,
    onAddItem,
    onOpenSettings,
    onPublish,
    publishing,
    isSettingsComplete,
    title,
    activeSection,
    onOpenEdit
}: NodeLinkDiagramProps) {
    // 挿入メニューを表示しているアイテムのインデックス
    const [addingAfterIndex, setAddingAfterIndex] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const t = useTranslations('common');
    const tRoutes = useTranslations('routes');
    const tRouteEditor = useTranslations('routeEditor');

    const scrollDirection = useUiStore((state) => state.scrollDirection);
    const [yOffset, setYOffset] = useState(0);

    const updateOffset = useCallback(() => {
        if (window.innerWidth >= 768) {
            setYOffset(60);
        } else {
            setYOffset(50);
        }
    }, []);

    useEffect(() => {
        updateOffset();
        window.addEventListener('resize', updateOffset);
        return () => window.removeEventListener('resize', updateOffset);
    }, [updateOffset]);


    // メニューの外側をクリックした時にメニューを閉じる
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setAddingAfterIndex(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="w-full md:w-[450px] md:h-full h-fit md:border-r-1 border-grass flex flex-col md:overflow-y-scroll md:pb-0 pb-12">
            <DiagramHeaderMobile
                onOpenEdit={onOpenEdit}
                onOpenSettings={onOpenSettings}
                onPublish={onPublish}
                publishing={publishing}
                isSettingsComplete={isSettingsComplete}
                waypointCount={items.filter(i => i.type === 'waypoint').length}
            />

            <DayTabs
                allDaysItems={allDaysItems}
                currentDayIndex={currentDayIndex}
                onSelectDay={onSelectDay}
                onRemoveDay={onRemoveDay}
                onAddDay={onAddDay}
            />

            <div className="p-6 md:p-8 flex flex-col flex-1">
                {/*
                  ダイアグラムのコア：CSS Gridを使用したレイアウト
                  - 1列目 (48px): ノード（点）と垂直線
                  - 2列目 (1fr): カード（情報パネル）
                  各アイテム（経由地/交通手段）は2つのグリッド行を占有します。
                */}
                <div className="relative grid grid-cols-[48px_1fr] gap-6 flex-1 pb-10">

                    {/* 背景の垂直線（最初のノードから最後のノードまでを貫通） */}
                    {items.length > 1 && (
                        <div
                            style={{
                                gridRow: `2 / ${items.length * 2}`, // 2行目から開始し、最後のアイテムの行まで伸ばす
                                gridColumn: '1'
                            }}
                            className="w-0.5 justify-self-center bg-accent-0/30 pointer-events-none"
                        />
                    )}

                    {items.map((item, index) => {
                        const isSelected = selectedIndex === index;
                        const isWaypoint = item.type === 'waypoint';

                        // このアイテムが開始するグリッド行のインデックス
                        const startRow = index * 2 + 1;

                        return (
                            <div key={index} className="contents group/item">
                                {/* 左列：ノードエリア (2行分を占有して中央配置を容易にする) */}
                                <div
                                    style={{ gridRow: `${startRow} / span 2`, gridColumn: '1' }}
                                    className="relative flex items-center justify-center z-10"
                                >
                                    <RouteNode
                                        item={item}
                                        isSelected={isSelected}
                                        onSelect={() => onSelectItem(index)}
                                    />
                                </div>

                                {/* 右列：カードエリア (2行分を占有) */}
                                <div
                                    style={{ gridRow: `${startRow} / span 2`, gridColumn: '2' }}
                                    className="flex items-center min-w-0 flex-1"
                                >
                                    {isWaypoint ? (
                                        <WaypointCard
                                            item={item}
                                            isSelected={isSelected}
                                            onSelect={() => onSelectItem(index)}
                                            onDelete={() => onDeleteWaypoint(index)}
                                        />
                                    ) : (
                                        <TransportationCard
                                            item={item}
                                            isSelected={isSelected}
                                            onSelect={() => onSelectItem(index)}
                                            onDelete={() => onDeleteWaypoint(index)}
                                        />
                                    )}
                                </div>

                                {/*
                                  インライン追加エリア:
                                  アイテム i と i+1 の間の隙間に配置。
                                  前のアイテムの2行目と、次のアイテムの1行目にまたがることで、
                                  カードの高さに関わらず幾何学的な中央に「＋」ボタンを配置します。
                                */}
                                {index < items.length - 1 && (
                                    <div
                                        style={{ gridRow: `${startRow + 1} / span 2`, gridColumn: '1' }}
                                        className="relative flex items-center justify-center group/link z-20"
                                    >
                                        <InlineAddMenu
                                            isAdding={addingAfterIndex === index}
                                            menuRef={menuRef}
                                            onToggle={() => {
                                                setAddingAfterIndex(addingAfterIndex === index ? null : index);
                                            }}
                                            onAddItem={(type) => {
                                                onAddItem(index, type);
                                                setAddingAfterIndex(null);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <AddWaypointButton onAddWaypoint={onAddWaypoint} />
        </div>
    )
}
