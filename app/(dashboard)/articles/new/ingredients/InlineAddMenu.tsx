import { Plus, MapPin, Navigation } from "lucide-react";
import { RefObject } from "react";

interface InlineAddMenuProps {
    isAdding: boolean;
    menuRef: RefObject<HTMLDivElement | null>;
    onToggle: () => void;
    onAddItem: (type: 'waypoint' | 'transportation') => void;
}

export default function InlineAddMenu({ isAdding, menuRef, onToggle, onAddItem }: InlineAddMenuProps) {
    return (
        <div className="relative flex items-center justify-center group/link z-20 w-full h-full">
            {/* 
              クリック判定用の透明なエリア
              - ホバー時にメニューを表示するためのトリガーとなる
              - onMouseDown={(e) => e.stopPropagation()} は、
                メニュー外クリック検知ロジックと競合してメニューが即座に閉じるのを防ぐために重要
            */}
            <div
                className="w-4 h-full cursor-pointer bg-transparent"
                onClick={onToggle}
                onMouseDown={(e) => e.stopPropagation()}
            />

            {/* 中点に配置される「＋」ボタン */}
            <div
                className={`
                    absolute left-1/2 -translate-x-1/2 transition-all duration-200
                    ${isAdding ? 'opacity-100 scale-110' : 'opacity-0 group-hover/link:opacity-100'}
                `}
                onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                }}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-all
                    bg-accent-0 text-white hover:scale-110 active:scale-95
                    cursor-pointer
                `}>
                    <Plus 
                        size={14} 
                        strokeWidth={3} 
                        className={`transition-transform duration-200 ${isAdding ? 'rotate-45' : ''}`} 
                    />
                </div>

                {/* 
                  選択メニュー（ポップアップ）
                  - Waypoint または Transport を選択して挿入できる
                */}
                {isAdding && (
                    <div
                        ref={menuRef}
                        className="absolute left-8 top-1/2 -translate-y-1/2 bg-background-1 border border-grass rounded-2xl shadow-xl p-2 flex gap-2 animate-in fade-in zoom-in slide-in-from-left-4 duration-200 pointer-events-auto"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        {/* Waypoint追加ボタン */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddItem('waypoint');
                            }}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-accent-0/10 rounded-xl transition-colors whitespace-nowrap group/btn"
                        >
                            <div className="w-8 h-8 bg-accent-0/10 rounded-lg flex items-center justify-center text-accent-0 group-hover/btn:scale-110 transition-transform">
                                <MapPin size={16} />
                            </div>
                            <span className="text-xs font-bold text-foreground-0">Waypoint</span>
                        </button>

                        <div className="w-px bg-grass my-1" />

                        {/* Transport追加ボタン */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddItem('transportation');
                            }}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-accent-1/10 rounded-xl transition-colors whitespace-nowrap group/btn"
                        >
                            <div className="w-8 h-8 bg-accent-1/10 rounded-lg flex items-center justify-center text-accent-1 group-hover/btn:scale-110 transition-transform">
                                <Navigation size={16} />
                            </div>
                            <span className="text-xs font-bold text-foreground-0">Transport</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
