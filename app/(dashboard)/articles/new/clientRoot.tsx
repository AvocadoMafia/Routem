"use client";

import { useState, useEffect, useRef } from "react";
import NodeLinkDiagram from "@/app/(dashboard)/articles/new/templates/nodeLinkDiagram";
import RouteEditingSection from "@/app/(dashboard)/articles/new/templates/routeEditingSection";
import RouteSettingsSection from "@/app/(dashboard)/articles/new/templates/routeSettingsSection";
import ActionBar from "@/app/(dashboard)/articles/new/ingredients/actionBar";
import { Transportation, Waypoint, RouteItem } from "@/lib/client/types";
import { CheckCircle2, AlertCircle, X, Settings as SettingsIcon } from "lucide-react";
import { useRouter } from "next/navigation";


export default function ClientRoot() {
    const router = useRouter();
    // -------------------------------------------------------------------------
    // 状態管理
    // -------------------------------------------------------------------------

    // セクションの切り替え ('edit' | 'settings')
    const [activeSection, setActiveSection] = useState<'edit' | 'settings'>('edit');

    // レスポンシブ: モバイル判定とモーダル表示
    const [isMobile, setIsMobile] = useState(false);
    const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);


    // ルート全体のメタ情報
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("General");
    const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
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

    // 画面幅によるモバイル判定
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mql = window.matchMedia('(max-width: 767px)');
        const onChange = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
        };
        // 初期判定
        setIsMobile(mql.matches);
        // 変更検知
        if (mql.addEventListener) {
            mql.addEventListener('change', onChange);
        } else {
            // Legacy browsers
            mql.addListener(onChange as any);
        }
        return () => {
            if (mql.removeEventListener) {
                mql.removeEventListener('change', onChange);
            } else {
                // Legacy browsers
                mql.removeListener(onChange as any);
            }
        };
    }, []);

    // ESCでモーダルを閉じる（編集/設定）
    useEffect(() => {
        if (!isEditorModalOpen && !isSettingsModalOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isSettingsModalOpen) setIsSettingsModalOpen(false);
                else if (isEditorModalOpen) setIsEditorModalOpen(false);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isEditorModalOpen, isSettingsModalOpen]);


    // 背景スクロールをロック（いずれかのモーダルが開いている時・モバイル時）
    useEffect(() => {
        if (!isMobile) return;
        const originalOverflow = document.body.style.overflow;
        if (isEditorModalOpen || isSettingsModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = originalOverflow || '';
        }
        return () => {
            document.body.style.overflow = originalOverflow || '';
        };
    }, [isMobile, isEditorModalOpen, isSettingsModalOpen]);

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
    const isDescriptionSet = description.trim() !== "";
    const isThumbnailSet = thumbnailImageSrc !== undefined;
    const isWaypointsSet = items.filter(it => it.type === 'waypoint').length >= 2;

    // 公開設定が完了しているか確認
    const isSettingsComplete = isTitleSet && isDescriptionSet && isThumbnailSet && isWaypointsSet;

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
            const res = await fetch('/api/v1/routes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    category,
                    visibility,
                    thumbnailImageSrc,
                    items
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
                method: 'WALK',
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
                method: 'WALK',
                memo: "",
                order: 0,
            };
            setItems([...items, newTransport, newWaypoint]);
        } else {
            setItems([...items, newWaypoint]);
        }

        setSelectedItemId(newWaypointId);
    };

    return (
        <div className="relative w-full h-full flex flex-row ">
            {/* 左側：ルート構成の可視化と操作 */}
            <NodeLinkDiagram
                items={items}
                selectedItemId={selectedItemId}
                onSelectItem={(id) => {
                    setSelectedItemId(id);
                    if (isMobile) {
                        setIsSettingsModalOpen(false);
                        setIsEditorModalOpen(true);
                    }
                }}
                onAddWaypoint={addWaypoint}
                onDeleteWaypoint={deleteItem}
                onAddItem={addItem}
                onOpenSettings={() => {
                    if (isMobile) {
                        setIsEditorModalOpen(false);
                        setIsSettingsModalOpen(true);
                    } else {
                        setActiveSection('settings');
                    }
                }}
                onPublish={handlePublish}
                publishing={publishing}
                isSettingsComplete={isSettingsComplete}
                title={title}
            />
            {/* 右側：詳細情報の編集フォーム＋投稿アクション（モバイルでは非表示） */}
            <div className="hidden md:flex flex-1 h-full overflow-y-auto no-scrollbar shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-10 flex-col">
                <ActionBar
                    isSettingsComplete={isSettingsComplete}
                    isTitleSet={isTitleSet}
                    isDescriptionSet={isDescriptionSet}
                    isThumbnailSet={isThumbnailSet}
                    isWaypointsSet={isWaypointsSet}
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    handlePublish={handlePublish}
                    publishing={publishing}
                />
                <div className="w-full flex-1">
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
                                description={description}
                                setDescription={setDescription}
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

            {/* モバイル用エディタモーダル（フルスクリーン） */}
            {isMobile && isEditorModalOpen && selectedItem && (
                <div className="absolute inset-0 z-50 flex md:hidden" aria-modal="true" role="dialog">

                    {/* Full-screen panel */}
                    <div className="flex flex-col w-screen h-fit bg-background-0 shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
                        {/* Header */}
                        <div className="sticky z-10 bg-background-1 backdrop-blur-md border-b border-grass px-4 md:px-5 py-3 flex items-center justify-between top-0">
                            <div className="text-base font-bold text-foreground-0">{selectedItem.type === 'waypoint' ? 'Edit Waypoint' : 'Edit Transportation'}</div>
                            <button
                                className="p-2 -mr-2 text-foreground-1 hover:text-foreground-0 active:scale-95"
                                onClick={() => setIsEditorModalOpen(false)}
                                aria-label="Close editor"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <RouteEditingSection
                            selectedItem={selectedItem}
                            onUpdateItem={(updates) => selectedItemId && updateItem(selectedItemId, updates)}
                        />
                    </div>
                </div>
            )}

            {/* モバイル用設定モーダル（フルスクリーン） */}
            {isMobile && isSettingsModalOpen && (
                <div className="absolute inset-0 z-50 flex md:hidden" aria-modal="true" role="dialog">
                    {/* Full-screen panel */}
                    <div className="flex flex-col w-screen h-fit bg-background-0 shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
                        {/* Header */}
                        <div className="sticky z-10 bg-background-1/80 backdrop-blur-md border-b border-grass px-4 md:px-5 py-3 flex items-center justify-between top-0">
                            <div className="text-base font-bold text-foreground-0">Publication Settings</div>
                            <button
                                className="p-2 -mr-2 text-foreground-1 hover:text-foreground-0 active:scale-95"
                                onClick={() => setIsSettingsModalOpen(false)}
                                aria-label="Close settings"
                            >
                                <X size={22} />
                            </button>
                        </div>
                        <RouteSettingsSection
                            title={title}
                            setTitle={setTitle}
                            description={description}
                            setDescription={setDescription}
                            category={category}
                            setCategory={setCategory}
                            visibility={visibility}
                            setVisibility={setVisibility}
                            thumbnailImageSrc={thumbnailImageSrc}
                            handleImageUpload={handleImageUpload}
                            uploading={uploading}
                        />
                    </div>
                </div>
            )}

        </div>
    )

}
