import { Waypoint } from "@/lib/client/types";
import { Image as ImageIcon } from "lucide-react";

interface WaypointEditorProps {
    item: Waypoint;
    onUpdate: (updates: Partial<Waypoint>) => void;
}

export default function WaypointEditor({ item, onUpdate }: WaypointEditorProps) {
    return (
        <div className="grid grid-cols-1 gap-10">
            {/* Waypoint Name */}
            <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-foreground-0">
                    Waypoint Name
                </label>
                <input
                    type="text"
                    value={item.name}
                    onChange={(e) => onUpdate({ name: e.target.value })}
                    className="w-full px-5 py-4 bg-background-0 border border-grass rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-0/20 focus:border-accent-0 transition-all text-lg font-medium"
                    placeholder="Where are you going?"
                />
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-foreground-0">
                    <ImageIcon size={16} /> Visuals
                </label>
                <div className="group relative border-2 border-dashed border-grass rounded-3xl p-10 flex flex-col items-center justify-center text-foreground-1 hover:bg-background-0 hover:border-accent-0/30 cursor-pointer transition-all min-h-[240px] overflow-hidden">
                    {item.image ? (
                        <>
                            <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                                <span className="text-white font-bold flex items-center gap-2">
                                    <ImageIcon size={20} /> Change Image
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-grass rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <ImageIcon size={32} className="text-foreground-1" />
                            </div>
                            <span className="font-bold">Add Image</span>
                            <span className="text-xs text-foreground-1/60 mt-1">Upload a photo of your trip memories</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
