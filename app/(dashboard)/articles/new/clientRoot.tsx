"use client";

import { useState } from "react";
import NodeLinkDiagram from "@/app/(dashboard)/articles/new/templates/nodeLinkDiagram";
import RouteEditingSection from "@/app/(dashboard)/articles/new/templates/routeEditingSection";
import {Transportation, Waypoint, RouteItem} from "@/lib/client/types";


export default function ClientRoot() {
    const [items, setItems] = useState<RouteItem[]>([
        { id: "1", type: 'waypoint', name: "Waypoint 1", memo: "Note 1", order: 1 },
    ]);
    const [selectedItemId, setSelectedItemId] = useState<string | null>("1");

    const updateItem = (id: string, updates: Partial<RouteItem>) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...updates } as RouteItem : item))
        );
    };

    const deleteItem = (id: string) => {
        setItems((prev) => {
            const next = prev.filter((item) => item.id !== id);
            if (selectedItemId === id) {
                setSelectedItemId(next.length > 0 ? next[0].id : null);
            }
            return next;
        });
    };

    const addItem = (afterId: string, type: 'waypoint' | 'transportation') => {
        const index = items.findIndex(item => item.id === afterId);
        if (index === -1) return;

        const newId = Math.random().toString(36).substr(2, 9);
        let newItem: RouteItem;

        if (type === 'waypoint') {
            newItem = {
                id: newId,
                type: 'waypoint',
                name: 'New Waypoint',
                memo: '',
                order: 0
            };
        } else {
            newItem = {
                id: newId,
                type: 'transportation',
                method: 'walk',
                memo: '',
                order: 0
            };
        }

        const newItems = [...items];
        newItems.splice(index + 1, 0, newItem);
        setItems(newItems);
        setSelectedItemId(newId);
    };

    const selectedItem = items.find((item) => item.id === selectedItemId);

    const addWaypoint = () => {
        const newWaypointId = Math.random().toString(36).substr(2, 9);
        const newWaypoint: Waypoint = {
            id: newWaypointId,
            type: 'waypoint',
            name: `New Waypoint`,
            memo: "",
            order: items.length + 1,
        };

        if (items.length > 0) {
            // すでにアイテムがある場合、交通手段を自動挿入する
            const newTransportId = Math.random().toString(36).substr(2, 9);
            const newTransport: Transportation = {
                id: newTransportId,
                type: 'transportation',
                method: 'walk',
                memo: "",
                order: 0,
            };
            setItems([...items, newTransport, newWaypoint]);
        } else {
            setItems([...items, newWaypoint]);
        }
        
        setSelectedItemId(newWaypointId);
    };

    const addTransportation = (afterId: string) => {
        const index = items.findIndex(item => item.id === afterId);
        if (index === -1) return;

        const newId = Math.random().toString(36).substr(2, 9);
        const newTransport: Transportation = {
            id: newId,
            type: 'transportation',
            method: 'walk',
            memo: "",
            order: 0, // orderは後で振り直すか、単に配列順にする
        };

        const newItems = [...items];
        newItems.splice(index + 1, 0, newTransport);
        setItems(newItems);
        setSelectedItemId(newId);
    };

    return (
        <div className="w-full h-full flex flex-row bg-background-0">
            <NodeLinkDiagram
                items={items}
                selectedItemId={selectedItemId}
                onSelectItem={setSelectedItemId}
                onAddWaypoint={addWaypoint}
                onDeleteWaypoint={deleteItem}
                onAddItem={addItem}
            />
            <div className="flex-1 h-full overflow-hidden shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-10">
                <RouteEditingSection
                    selectedItem={selectedItem}
                    onUpdateItem={(updates) => selectedItemId && updateItem(selectedItemId, updates)}
                />
            </div>
        </div>
    )

}
