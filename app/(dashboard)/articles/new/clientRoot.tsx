"use client";

import { useState, useEffect } from "react";
import NodeLinkDiagram from "@/app/(dashboard)/articles/new/templates/nodeLinkDiagram";
import RouteEditingSection from "@/app/(dashboard)/articles/new/templates/routeEditingSection";
import RouteSettingsSection from "@/app/(dashboard)/articles/new/templates/routeSettingsSection";
import ActionBar from "@/app/(dashboard)/articles/new/ingredients/actionBar";
import {Transportation, Waypoint, RouteItem} from "@/lib/client/types";
import { CheckCircle2, AlertCircle } from "lucide-react";
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
    const [items, setItems] = useState<RouteItem[]>([]);

    // 初期化時に最初のWaypointを追加する
    useEffect(() => {
        const initialId = Math.random().toString(36).substr(2, 9);
        setItems([
            { id: initialId, type: 'waypoint', name: "Waypoint 1", memo: "", order: 1 },
        ]);
        setSelectedItemId(initialId);
    }, []);

    // 現在編集中のアイテムID
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    // 投稿状態
    const [publishing, setPublishing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // -------------------------------------------------------------------------
    // ロジック
    // -------------------------------------------------------------------------

    // 各バリデーション項目の個別判定
    const isTitleSet = title.trim() !== "";
    const isBioSet = bio.trim() !== "";
    const isThumbnailSet = thumbnailImageSrc !== undefined;
    const isWaypointsSet = items.filter(it => it.type === 'waypoint').length >= 2;

    // 公開設定が完了しているか確認
    const isSettingsComplete = isTitleSet && isBioSet && isThumbnailSet && isWaypointsSet;

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
        if (!isSettingsComplete) return;

        // 追加バリデーション: 最初のアイテムと最後のアイテムがWaypointであること
        const waypoints = items.filter(it => it.type === 'waypoint');
        if (waypoints.length < 2) {
            setMessage("At least 2 waypoints are required.");
            return;
        }

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
                router.push(`/`);
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
            const filtered = prev.filter((item) => item.id !== id);

            // 連続する交通手段を統合 or 削除するなどの正規化
            const next: RouteItem[] = [];
            for (let i = 0; i < filtered.length; i++) {
                const curr = filtered[i];
                const prevItem = next[next.length - 1];

                // 交通手段が連続する場合、2つ目以降はスキップ（または統合の余地ありだが、一旦シンプルに1つ残す）
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
                    isTitleSet={isTitleSet}
                    isBioSet={isBioSet}
                    isThumbnailSet={isThumbnailSet}
                    isWaypointsSet={isWaypointsSet}
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    handlePublish={handlePublish}
                    publishing={publishing}
                />
                <div className="h-fit">
                    {message && (
                        <div className={`mx-10 mt-4 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${message.includes('fail') || message.includes('error') || message.includes('required') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-accent-2/10 text-accent-2 border border-accent-2/20'}`}>
                            {message.includes('fail') || message.includes('error') || message.includes('required') ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                            <span className="text-sm font-bold">{message}</span>
                        </div>
                    )}
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
