import { RouteItem } from "@/lib/client/types";
import { Footprints, TrainFront, Bus, Car, Sparkles } from "lucide-react";

interface RouteNodeProps {
    item: RouteItem;
    isSelected: boolean;
    onSelect: () => void;
}

export default function RouteNode({ item, isSelected, onSelect }: RouteNodeProps) {
    const isWaypoint = item.type === 'waypoint';

    return (
        <div className="relative flex items-center justify-center z-10 w-full h-full">
            {isWaypoint ? (
                /* 経由地（地点）の表示：円形のノード */
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect();
                    }}
                    className={`
                        w-5 h-5 rounded-full shrink-0 cursor-pointer transition-all duration-300 flex items-center justify-center
                        ${isSelected 
                            ? 'bg-accent-0 ring-4 ring-accent-0/20 scale-110 shadow-[0_0_15px_rgba(45,31,246,0.4)]' 
                            : 'bg-background-1 border-2 border-accent-0 hover:scale-110 hover:border-accent-warning'}
                    `}
                >
                    {isSelected ? (
                        <div className="w-2 h-2 bg-white rounded-full" />
                    ) : (
                        <div className="w-1.5 h-1.5 bg-accent-0 rounded-full transition-colors" />
                    )}
                </div>
            ) : (
                /* 交通手段の表示：移動アイコン入りのボックス */
                <div
                    className={`
                        w-8 h-8 rounded-xl shrink-0 cursor-pointer transition-all duration-300 flex items-center justify-center border-2
                        ${isSelected 
                            ? 'bg-accent-0 border-accent-0 text-white shadow-lg scale-110' 
                            : 'bg-background-1 border-grass text-foreground-1 hover:border-accent-0 hover:text-accent-0'}
                    `}
                    onClick={onSelect}
                >
                    {item.method === 'walk' && <Footprints size={16} />}
                    {item.method === 'train' && <TrainFront size={16} />}
                    {item.method === 'bus' && <Bus size={16} />}
                    {item.method === 'car' && <Car size={16} />}
                    {item.method === 'other' && <Sparkles size={16} />}
                </div>
            )}
        </div>
    );
}
