import { useState, useEffect, useRef, useCallback } from "react";
import { RouteItem } from "@/lib/client/types";
import { Plus, Settings as SettingsIcon, Loader2, Edit3, Rocket, ChevronRight } from "lucide-react";
import WaypointCard from "../ingredients/WaypointCard";
import TransportationCard from "../ingredients/TransportationCard";
import RouteNode from "../ingredients/RouteNode";
import InlineAddMenu from "../ingredients/InlineAddMenu";
import { useAtomValue } from "jotai";
import { scrollDirectionAtom } from "@/lib/client/atoms";
import { motion } from "framer-motion";

interface NodeLinkDiagramProps {
    items: RouteItem[];
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

    const scrollDirection = useAtomValue(scrollDirectionAtom);
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
        <div className="w-full md:w-[450px] h-full bg-background-0/50 backdrop-blur-md border-b md:border-b-0 md:border-r border-grass flex flex-col overflow-y-scroll">
            {/* Sticky header for diagram actions */}
            <div
                className="sticky top-0 z-20 bg-background-1/80 backdrop-blur-md border-b border-grass px-4 md:px-5 py-3 md:hidden flex items-center justify-between"
            >
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                    {/* Step 1: Edit */}
                    <button
                        onClick={onOpenEdit}
                        className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-all active:scale-90 bg-background-0 text-foreground-1 border-grass"
                        aria-label="Edit Route"
                    >
                        <Edit3 size={18} />
                    </button>

                    <div className="shrink-0 text-grass">
                        <ChevronRight size={14} />
                    </div>

                    {/* Step 2: Settings */}
                    <button
                        onClick={onOpenSettings}
                        className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-all active:scale-90 bg-background-0 text-foreground-1 border-grass"
                        aria-label="Route Settings"
                    >
                        <SettingsIcon size={18} />
                    </button>

                    <div className="shrink-0 text-grass">
                        <ChevronRight size={14} />
                    </div>

                    {/* Step 3: Publish */}
                    <button
                        onClick={onPublish}
                        disabled={publishing}
                        className={`shrink-0 px-4 h-10 rounded-xl font-bold text-sm text-white flex items-center gap-2 active:scale-90 shadow-md transition-all ${(!isSettingsComplete || publishing) ? 'bg-foreground-1/40 grayscale' : 'bg-accent-2 hover:bg-accent-2/90'}`}
                        aria-label="Publish"
                    >
                        {publishing ? (
                            <Loader2 className="animate-spin" size={16} />
                        ) : (
                            <Rocket size={16} className={isSettingsComplete ? 'animate-bounce' : ''} />
                        )}
                        <span>{publishing ? '...' : 'Publish'}</span>
                    </button>
                </div>

                <div className="flex items-center gap-2 pl-2 border-l border-grass/30 ml-2">
                    <span className="shrink-0 text-[10px] font-black px-2 py-1 bg-accent-2/10 text-accent-2 rounded-lg border border-accent-2/20">
                        {items.filter(i => i.type === 'waypoint').length}W
                    </span>
                </div>
            </div>

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

            {/* 下部の「経由地を追加」ボタン */}
            <motion.div
                className="p-6 bg-background-1/80 backdrop-blur-sm border-t border-grass sticky bottom-0 mt-auto z-50"
            >
                <button
                    onClick={onAddWaypoint}
                    className="w-full py-4 bg-accent-0 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-accent-0/90 active:scale-[0.98] transition-all shadow-[0_10px_20px_rgba(45,31,246,0.2)]"
                >
                    <Plus size={20} strokeWidth={3} />
                    <span>Add Waypoint</span>
                </button>
            </motion.div>
        </div>
    )
}
