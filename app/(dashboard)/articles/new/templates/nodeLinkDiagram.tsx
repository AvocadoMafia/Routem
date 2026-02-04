import { useState, useEffect, useRef } from "react";
import { RouteItem } from "@/lib/client/types";
import { Plus } from "lucide-react";
import WaypointCard from "../ingredients/WaypointCard";
import TransportationCard from "../ingredients/TransportationCard";
import RouteNode from "../ingredients/RouteNode";
import InlineAddMenu from "../ingredients/InlineAddMenu";

interface NodeLinkDiagramProps {
    items: RouteItem[];
    selectedItemId: string | null;
    onSelectItem: (id: string) => void;
    onAddWaypoint: () => void;
    onDeleteWaypoint: (id: string) => void;
    onAddItem: (afterId: string, type: 'waypoint' | 'transportation') => void;
}

export default function NodeLinkDiagram({
    items,
    selectedItemId,
    onSelectItem,
    onAddWaypoint,
    onDeleteWaypoint,
    onAddItem
}: NodeLinkDiagramProps) {
    const [addingAfterId, setAddingAfterId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setAddingAfterId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="w-[450px] h-full bg-background-0/50 backdrop-blur-md border-r border-grass flex flex-col no-scrollbar overflow-y-auto">
            <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-foreground-0">Route Structure</h2>
                    <span className="text-xs font-medium px-2 py-1 bg-grass rounded-full text-foreground-1">
                        {items.filter(i => i.type === 'waypoint').length} Waypoints
                    </span>
                </div>

                <div className="relative grid grid-cols-[48px_1fr] gap-6 flex-1 pb-10">
                    {/* Background Line (covers from first node to last node) */}
                    {items.length > 1 && (
                        <div
                            style={{
                                gridRow: `2 / ${items.length * 2}`,
                                gridColumn: '1'
                            }}
                            className="w-0.5 justify-self-center bg-accent-0/30 pointer-events-none"
                        />
                    )}

                    {items.map((item, index) => {
                        const isSelected = selectedItemId === item.id;
                        const isWaypoint = item.type === 'waypoint';

                        // Each item takes 2 grid rows
                        const startRow = index * 2 + 1;

                        return (
                            <div key={item.id} className="contents group/item">
                                {/* Left Column: Node Area (Spans 2 rows) */}
                                <div
                                    style={{ gridRow: `${startRow} / span 2`, gridColumn: '1' }}
                                    className="relative flex items-center justify-center z-10"
                                >
                                    <RouteNode
                                        item={item}
                                        isSelected={isSelected}
                                        onSelect={() => onSelectItem(item.id)}
                                    />
                                </div>

                                {/* Right Column: Card Area (Spans 2 rows) */}
                                <div
                                    style={{ gridRow: `${startRow} / span 2`, gridColumn: '2' }}
                                    className="flex items-center"
                                >
                                    {isWaypoint ? (
                                        <WaypointCard
                                            item={item}
                                            isSelected={isSelected}
                                            onSelect={() => onSelectItem(item.id)}
                                            onDelete={() => onDeleteWaypoint(item.id)}
                                        />
                                    ) : (
                                        <TransportationCard
                                            item={item}
                                            isSelected={isSelected}
                                            onSelect={() => onSelectItem(item.id)}
                                            onDelete={() => onDeleteWaypoint(item.id)}
                                        />
                                    )}
                                </div>

                                {/* Link Area: Bridge between item i and i+1 (Spans 2nd row of i and 1st row of i+1) */}
                                {index < items.length - 1 && (
                                    <div
                                        style={{ gridRow: `${startRow + 1} / span 2`, gridColumn: '1' }}
                                        className="relative flex items-center justify-center group/link z-20"
                                    >
                                        <InlineAddMenu
                                            isAdding={addingAfterId === item.id}
                                            menuRef={menuRef}
                                            onToggle={() => setAddingAfterId(addingAfterId === item.id ? null : item.id)}
                                            onAddItem={(type) => {
                                                onAddItem(item.id, type);
                                                setAddingAfterId(null);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 追加ボタン */}
            <div className="p-6 bg-background-1/80 backdrop-blur-sm border-t border-grass sticky bottom-0 mt-auto">
                <button
                    onClick={onAddWaypoint}
                    className="w-full py-4 bg-accent-0 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-accent-0/90 active:scale-[0.98] transition-all shadow-[0_10px_20px_rgba(45,31,246,0.2)]"
                >
                    <Plus size={20} strokeWidth={3} />
                    <span>Add Waypoint</span>
                </button>
            </div>
        </div>
    )
}
