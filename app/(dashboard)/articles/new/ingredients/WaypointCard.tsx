import { Waypoint } from "@/lib/client/types";
import { X } from "lucide-react";

interface WaypointCardProps {
    item: Waypoint;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
}

export default function WaypointCard({ item, isSelected, onSelect, onDelete }: WaypointCardProps) {
    return (
        <div
            className={`
                flex-1 p-5 pr-12 my-1 rounded-2xl cursor-pointer transition-all duration-300 border relative
                ${isSelected 
                    ? 'bg-background-1 border-accent-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] -translate-y-0.5' 
                    : 'bg-background-1/40 border-grass hover:border-accent-0/30 hover:bg-background-1 hover:shadow-sm'}
            `}
            onClick={onSelect}
        >
            <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                    {/* 地名：長い場合は truncate で省略 */}
                    <div className={`font-bold transition-colors ${isSelected ? 'text-accent-0' : 'text-foreground-0'} truncate`}>
                        {item.name || "Untitled"}
                    </div>
                    {/* メモのプレビュー：2行まで表示 */}
                    <div className="text-xs text-foreground-1 line-clamp-2 mt-1.5 leading-relaxed">
                        {item.memo || "Enter details..."}
                    </div>
                </div>
                {/* 画像が設定されている場合のみ表示 */}
                {item.image && (
                    <div className="ml-3 shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-grass overflow-hidden">
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}
            </div>

            {/* 
              削除ボタン:
              - 常に右側の固定位置（中央）に配置
              - 親要素（group/item）にホバーした時のみ表示される
            */}
            <button
                onClick={(e) => {
                    e.stopPropagation(); // 親要素の onClick (選択処理) を防ぐ
                    onDelete();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity p-2 text-foreground-1 hover:text-accent-warning"
                title="Delete"
            >
                <X size={16} />
            </button>
        </div>
    );
}
