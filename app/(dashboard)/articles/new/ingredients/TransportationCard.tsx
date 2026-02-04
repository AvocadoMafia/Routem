import { Transportation } from "@/lib/client/types";
import { X } from "lucide-react";

interface TransportationCardProps {
    item: Transportation;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
}

export default function TransportationCard({ item, isSelected, onSelect, onDelete }: TransportationCardProps) {
    return (
        <div
            className={`
                flex-1 p-3 pr-12 my-1 rounded-xl cursor-pointer transition-all duration-300 border-l-4 flex items-center justify-between relative
                ${isSelected 
                    ? 'bg-accent-0/5 border-accent-0 shadow-sm' 
                    : 'bg-grass/20 border-grass hover:bg-grass/40'}
            `}
            onClick={onSelect}
        >
            <div className="flex flex-col">
                <span className={`text-xs font-bold ${isSelected ? 'text-accent-0' : 'text-foreground-1'}`}>
                    {item.method === 'walk' && 'Walk'}
                    {item.method === 'train' && 'Train'}
                    {item.method === 'bus' && 'Bus'}
                    {item.method === 'car' && 'Car'}
                    {item.method === 'other' && 'Other'}
                </span>
                {item.memo && <div className="text-[10px] text-foreground-1/70 truncate mt-0.5">{item.memo}</div>}
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
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
