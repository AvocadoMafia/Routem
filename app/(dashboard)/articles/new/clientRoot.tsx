"use client";

import { useState } from "react";
import NodeLinkDiagram from "@/app/(dashboard)/articles/new/templates/nodeLinkDiagram";
import RouteEditingSection from "@/app/(dashboard)/articles/new/templates/routeEditingSection";
import {Transportation, Waypoint, RouteItem} from "@/lib/client/types";


export default function ClientRoot() {
    // -------------------------------------------------------------------------
    // 状態管理
    // -------------------------------------------------------------------------

    // ルートを構成するアイテム（経由地・交通手段）のリスト
    const [items, setItems] = useState<RouteItem[]>([
        { id: "1", type: 'waypoint', name: "Waypoint 1", memo: "Note 1", order: 1 },
    ]);

    // 現在編集中のアイテムID
    const [selectedItemId, setSelectedItemId] = useState<string | null>("1");

    // 投稿状態
    const [publishing, setPublishing] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // -------------------------------------------------------------------------
    // ロジック
    // -------------------------------------------------------------------------

    // 投稿処理: 現在の items を API に送信
    const handlePublish = async () => {
        setPublishing(true);
        setMessage(null);
        try {
            // order を振り直す（配列順を優先）
            const normalizedItems = items.map((it, idx) => ({ ...it, order: idx }));
            const res = await fetch('/api/v1/routems', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: normalizedItems })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.error || 'Failed to publish');
            }
            setMessage(`Published! routeId=${data.routeId}`);
            // TODO: 必要に応じて遷移など実装: router.push(`/routes/${data.routeId}`)
            console.log('Created route:', data);
        } catch (e: any) {
            setMessage(e?.message ?? 'Publish failed');
        } finally {
            setPublishing(false);
        }
    };

    // 指定したアイテムの内容を更新する
    const updateItem = (id: string, updates: Partial<RouteItem>) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...updates } as RouteItem : item))
        );
    };

    // 指定したアイテムを削除する
    const deleteItem = (id: string) => {
        setItems((prev) => {
            const next = prev.filter((item) => item.id !== id);
            // 削除したアイテムが選択中だった場合、他のアイテムを選択状態にする
            if (selectedItemId === id) {
                setSelectedItemId(next.length > 0 ? next[0].id : null);
            }
            return next;
        });
    };

    // アイテム（経由地または交通手段）を特定のアイテムの後ろに挿入する
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
        // 追加したアイテムを即座に編集状態にする
        setSelectedItemId(newId);
    };

    // 現在選択されているアイテムのオブジェクトを取得
    const selectedItem = items.find((item) => item.id === selectedItemId);

    // リストの最後に新しい経由地を追加する（必要に応じて交通手段も自動挿入）
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
            // すでにアイテムがある場合、地点間の移動をスムーズにするため交通手段（徒歩）を自動挿入する
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

    // 指定したアイテムの後に交通手段を追加する（直接呼び出し用）
    const addTransportation = (afterId: string) => {
        const index = items.findIndex(item => item.id === afterId);
        if (index === -1) return;

        const newId = Math.random().toString(36).substr(2, 9);
        const newTransport: Transportation = {
            id: newId,
            type: 'transportation',
            method: 'walk',
            memo: "",
            order: 0,
        };

        const newItems = [...items];
        newItems.splice(index + 1, 0, newTransport);
        setItems(newItems);
        setSelectedItemId(newId);
    };

    return (
        <div className="w-full h-full flex flex-row bg-background-0">
            {/* 左側：ルート構成の可視化と操作 */}
            <NodeLinkDiagram
                items={items}
                selectedItemId={selectedItemId}
                onSelectItem={setSelectedItemId}
                onAddWaypoint={addWaypoint}
                onDeleteWaypoint={deleteItem}
                onAddItem={addItem}
            />
            {/* 右側：詳細情報の編集フォーム＋投稿アクション */}
            <div className="flex-1 h-full overflow-hidden shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-10 flex flex-col">
                {/* アクションバー */}
                <div className="flex items-center justify-between p-4 border-b border-grass bg-background-1/60 backdrop-blur sticky top-0 z-20">
                    <div className="text-sm text-foreground-1">
                        {message ? <span>{message}</span> : <span>Prepare your route and click Publish</span>}
                    </div>
                    <button
                        onClick={handlePublish}
                        disabled={publishing}
                        className={`px-4 py-2 rounded-xl font-bold text-white shadow ${publishing ? 'bg-accent-0/50 cursor-not-allowed' : 'bg-accent-0 hover:bg-accent-0/90 active:scale-[0.98]'} `}
                    >
                        {publishing ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
                <div className="flex-1">
                    <RouteEditingSection
                        selectedItem={selectedItem}
                        onUpdateItem={(updates) => selectedItemId && updateItem(selectedItemId, updates)}
                    />
                </div>
            </div>
        </div>
    )

}
