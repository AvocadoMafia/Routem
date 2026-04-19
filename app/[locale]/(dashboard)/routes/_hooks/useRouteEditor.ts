import { useState, useCallback, useEffect } from "react";
import { SpotSource, TransitMode } from "@prisma/client";
import { RouteItem, Waypoint, Transportation } from "@/lib/types/domain";

export function useRouteEditor() {
    // items[dayIndex][itemIndex]
    const [items, setItems] = useState<RouteItem[][]>([]);
    const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    // 初期化
    useEffect(() => {
        if (items.length === 0) {
            setItems([
                [{ type: 'waypoint', name: "Waypoint 1", memo: "", order: 1, source: SpotSource.USER }],
            ]);
            setCurrentDayIndex(0);
            setSelectedIndex(0);
        }
    }, [items.length]);

    const updateItem = useCallback((index: number, updates: Partial<RouteItem>) => {
        setItems((prev) => {
            const next = [...prev];
            next[currentDayIndex] = next[currentDayIndex].map((item, i) =>
                i === index ? { ...item, ...updates } as RouteItem : item
            );
            return next;
        });
    }, [currentDayIndex]);

    // 指定したアイテムを削除する
    const deleteItem = useCallback((index: number) => {
        setItems((prev) => {
            const nextDays = [...prev];
            const filtered = nextDays[currentDayIndex].filter((_, i) => i !== index);

            // 連続する交通手段を統合 or 削除するなどの正規化
            const next: RouteItem[] = [];
            for (let i = 0; i < filtered.length; i++) {
                const curr = filtered[i];
                const prevItem = next[next.length - 1];

                // 交通手段が連続する場合、2つ目以降はスキップ
                if (curr.type === 'transportation' && prevItem?.type === 'transportation') {
                    continue;
                }
                next.push(curr);
            }

            // 先頭や末尾が交通手段なら削除
            while (next.length > 0 && next[0].type === 'transportation') {
                next.shift();
            }
            while (next.length > 0 && next[next.length - 1].type === 'transportation') {
                next.pop();
            }

            // 削除したアイテムが選択中だった場合、適切にインデックスを調整
            if (index === selectedIndex) {
                setSelectedIndex(Math.max(0, Math.min(index, next.length - 1)));
            } else if (index < selectedIndex) {
                setSelectedIndex((prevIdx) => Math.max(0, prevIdx - 1));
            }
            nextDays[currentDayIndex] = next;
            return nextDays;
        });
    }, [currentDayIndex, selectedIndex]);

    // アイテム（経由地または交通手段）を特定のアイテムの後ろに挿入する
    const addItem = useCallback((afterIndex: number, type: 'waypoint' | 'transportation') => {
        let newItem: RouteItem;

        if (type === 'waypoint') {
            newItem = {
                type: 'waypoint',
                name: 'New Waypoint',
                memo: '',
                order: 0,
                source: SpotSource.USER
            };
        } else {
            newItem = {
                type: 'transportation',
                method: TransitMode.WALK,
                memo: '',
                order: 0
            };
        }

        setItems((prev) => {
            const next = [...prev];
            const dayItems = [...next[currentDayIndex]];
            dayItems.splice(afterIndex + 1, 0, newItem);
            next[currentDayIndex] = dayItems;
            return next;
        });
        setSelectedIndex(afterIndex + 1);
    }, [currentDayIndex]);

    // リストの最後に新しい経由地を追加する（必要に応じて交通手段も自動挿入）
    const addWaypoint = useCallback(() => {
        const dayItems = items[currentDayIndex] || [];
        const newWaypoint: Waypoint = {
            type: 'waypoint',
            name: `New Waypoint`,
            memo: "",
            order: dayItems.length + 1,
            source: SpotSource.MAPBOX
        };

        setItems((prev) => {
            const next = [...prev];
            const currentDayItems = [...next[currentDayIndex]];
            if (currentDayItems.length > 0) {
                const newTransport: Transportation = {
                    type: 'transportation',
                    method: TransitMode.WALK,
                    memo: "",
                    order: 0,
                };
                next[currentDayIndex] = [...currentDayItems, newTransport, newWaypoint];
            } else {
                next[currentDayIndex] = [...currentDayItems, newWaypoint];
            }
            return next;
        });
        setSelectedIndex(dayItems.length > 0 ? dayItems.length + 1 : 0);
    }, [currentDayIndex, items]);

    const addDay = useCallback(() => {
        if (items.length >= 10) return;
        setItems(prev => [...prev, [{ type: 'waypoint', name: "Waypoint 1", memo: "", order: 1, source: SpotSource.USER }]]);
        setCurrentDayIndex(items.length);
        setSelectedIndex(0);
    }, [items.length]);

    const removeDay = useCallback((dayIndex: number) => {
        if (items.length <= 1) return;
        setItems(prev => {
            const next = prev.filter((_, i) => i !== dayIndex);
            return next;
        });
        setCurrentDayIndex(prev => Math.max(0, Math.min(prev, items.length - 2)));
        setSelectedIndex(0);
    }, [items.length]);

    const selectedItem = items[currentDayIndex]?.[selectedIndex];

    return {
        items,
        setItems,
        currentDayIndex,
        setCurrentDayIndex,
        selectedIndex,
        setSelectedIndex,
        selectedItem,
        updateItem,
        deleteItem,
        addItem,
        addWaypoint,
        addDay,
        removeDay
    };
}
