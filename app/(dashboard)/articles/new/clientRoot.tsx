"use client";

import { useState } from "react";
import NodeLinkDiagram from "@/app/(dashboard)/articles/new/templates/nodeLinkDiagram";
import RouteEditingSection from "@/app/(dashboard)/articles/new/templates/routeEditingSection";
import RouteSettingsSection from "@/app/(dashboard)/articles/new/templates/routeSettingsSection";
import ActionBar from "@/app/(dashboard)/articles/new/ingredients/actionBar";
import {Transportation, Waypoint, RouteItem} from "@/lib/client/types";
import { useRouter } from "next/navigation";


export default function ClientRoot() {
    const router = useRouter();
    // -------------------------------------------------------------------------
    // 状態管理
    // -------------------------------------------------------------------------

    // セクションの切り替え ('edit' | 'settings')
    const [activeSection, setActiveSection] = useState<'edit' | 'settings'>('edit');

    // ルート全体のメタ情報
    const [title, setTitle] = useState("");
    const [bio, setBio] = useState("");
    const [category, setCategory] = useState("General");
    const [visibility, setVisibility] = useState<'public' | 'private'>('private');
    const [thumbnailImageSrc, setThumbnailImageSrc] = useState<string | undefined>(undefined);

    // ルートを構成するアイテム（経由地・交通手段）のリスト
    const [items, setItems] = useState<RouteItem[]>([
        { id: "1", type: 'waypoint', name: "Waypoint 1", memo: "", order: 1 },
    ]);

    // 現在編集中のアイテムID
    const [selectedItemId, setSelectedItemId] = useState<string | null>("1");

    // 投稿状態
    const [publishing, setPublishing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // -------------------------------------------------------------------------
    // ロジック
    // -------------------------------------------------------------------------

    // 公開設定が完了しているか確認
    const isSettingsComplete = title.trim() !== "" && bio.trim() !== "" && thumbnailImageSrc !== undefined;

    // 画像アップロード処理
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setMessage(null);
        try {
            // 1) 署名付きURLを取得
            const params = new URLSearchParams({
                fileName: file.name,
                contentType: file.type,
                type: 'route-thumbnails'
            });
            const res = await fetch(`/api/v1/uploads?${params.toString()}`);
            const { uploadUrl, publicUrl } = await res.json();

            if (!res.ok) throw new Error('Failed to get upload URL');

            // 2) S3(MinIO)に直接アップロード
            const uploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type
                }
            });

            if (!uploadRes.ok) throw new Error('Failed to upload image');

            // 3) 公開URLを状態にセット
            setThumbnailImageSrc(publicUrl);
            setMessage('Image uploaded successfully!');
        } catch (e: any) {
            setMessage(e?.message ?? 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

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
                body: JSON.stringify({
                    title,
                    bio,
                    category,
                    visibility,
                    thumbnailImageSrc,
                    items: normalizedItems
                })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.error || 'Failed to publish');
            }
            setMessage(`Published! Redirecting...`);

            // 正常に投稿が完了したら、ルートページに遷移
            if (data.routeId) {
                router.push(`/routes/${data.routeId}`);
            }
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
            <div className="flex-1 h-full overflow-y-auto no-scrollbar shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-10 flex flex-col">
                <ActionBar
                    isSettingsComplete={isSettingsComplete}
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    handlePublish={handlePublish}
                    publishing={publishing}
                />
                <div className="h-fit">
                    {activeSection === 'edit' ? (
                        <div className="w-full h-full animate-in fade-in duration-300">
                            <RouteEditingSection
                                selectedItem={selectedItem}
                                onUpdateItem={(updates) => selectedItemId && updateItem(selectedItemId, updates)}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full animate-in fade-in duration-300">
                            <RouteSettingsSection
                                title={title}
                                setTitle={setTitle}
                                bio={bio}
                                setBio={setBio}
                                category={category}
                                setCategory={setCategory}
                                visibility={visibility}
                                setVisibility={setVisibility}
                                thumbnailImageSrc={thumbnailImageSrc}
                                handleImageUpload={handleImageUpload}
                                uploading={uploading}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

}
