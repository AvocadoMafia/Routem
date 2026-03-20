"use client";

import { useState, useEffect } from "react";
import NodeLinkDiagram from "./templates/nodeLinkDiagram";
import RouteEditingSection from "./templates/routeEditingSection";
import RouteSettingsSection from "./templates/routeSettingsSection";
import ActionBar from "./ingredients/actionBar";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";
import { isMobileAtom } from "@/lib/client/atoms";
import { useRouteEditor } from "../_hooks/useRouteEditor";
import { getDataFromServerWithJson, postDataToServerWithJson, patchDataToServerWithJson } from "@/lib/client/helpers";
import { Route, RouteItem } from "@/lib/client/types";

interface RouteEditorClientProps {
    initialRoute?: Route;
    mode: 'create' | 'edit';
}

export default function RouteEditorClient({ initialRoute, mode }: RouteEditorClientProps) {
    const router = useRouter();
    const isMobile = useAtomValue(isMobileAtom);

    // -------------------------------------------------------------------------
    // 状態管理
    // -------------------------------------------------------------------------

    const [activeSection, setActiveSection] = useState<'edit' | 'settings'>('edit');
    const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    // ルート全体のメタ情報
    const [title, setTitle] = useState(initialRoute?.title || "");
    const [description, setDescription] = useState(initialRoute?.description || "");
    const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE'>(initialRoute?.visibility || 'PUBLIC');
    const [collaboratorPolicy, setCollaboratorPolicy] = useState<'DISABLED' | 'VIEW_ONLY' | 'CAN_EDIT'>(initialRoute?.collaboratorPolicy || 'DISABLED');
    const [thumbnailImageSrc, setThumbnailImageSrc] = useState<string | undefined>(initialRoute?.thumbnail?.url);

    // 追加されたパラメータ
    const [routeFor, setRouteFor] = useState<'EVERYONE' | 'FAMILY' | 'FRIENDS' | 'COUPLE' | 'SOLO'>(initialRoute?.routeFor || 'EVERYONE');
    const [month, setMonth] = useState<number>(initialRoute?.month ?? 0);
    const [budget, setBudget] = useState<{ currency: string; amount: number; note?: string }>({
        currency: initialRoute?.budget?.currency || 'JPY',
        amount: Number(initialRoute?.budget?.amount) || 0,
        note: initialRoute?.budget?.note || undefined
    });
    const [tags, setTags] = useState<string[]>(initialRoute?.tags?.map(t => t.name) || []);

    // ルート編集ロジック（カスタムフック）
    const {
        items,
        setItems,
        selectedIndex,
        setSelectedIndex,
        selectedItem,
        updateItem,
        deleteItem,
        addItem,
        addWaypoint
    } = useRouteEditor();

    // 初期値をセットする（編集時、または初期データがある場合）
    useEffect(() => {
        if (initialRoute?.routeNodes) {
            const initialItems: RouteItem[] = [];
            initialRoute.routeNodes.forEach((node) => {
                initialItems.push({
                    type: 'waypoint',
                    id: node.id,
                    name: node.spot.name,
                    lat: node.spot.latitude || 0,
                    lng: node.spot.longitude || 0,
                    memo: node.details || '',
                    images: node.images?.map(img => img.url) || [],
                    source: node.spot.source || 'USER',
                    sourceId: node.spot.sourceId || undefined,
                    order: node.order
                });
                if (node.transitSteps) {
                    node.transitSteps.forEach(step => {
                        initialItems.push({
                            type: 'transportation',
                            id: step.id,
                            method: step.mode,
                            memo: step.memo || '',
                            distance: step.distance || undefined,
                            duration: step.duration || undefined,
                            order: step.order
                        });
                    });
                }
            });
            setItems(initialItems);
        }
    }, [initialRoute, setItems]);

    // ESCでモーダルを閉じる
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


    // 背景スクロールをロック
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


    // 投稿・アップロード状態
    const [publishing, setPublishing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // バリデーション
    const isTitleSet = title.trim() !== "";
    const isDescriptionSet = description.trim() !== "";
    const isThumbnailSet = thumbnailImageSrc !== undefined;
    const isWaypointsSet = items.filter(it => it.type === 'waypoint').length >= 2;
    const isTagsSet = tags.length >= 1;
    const isSettingsComplete = isTitleSet && isDescriptionSet && isThumbnailSet && isWaypointsSet && isTagsSet;

    // 画像アップロード処理
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setMessage(null);
        try {
            const params = new URLSearchParams({
                fileName: file.name,
                contentType: file.type,
                type: 'route-thumbnails'
            });

            const data = await getDataFromServerWithJson<{ uploadUrl: string, publicUrl: string }>(`/api/v1/uploads?${params.toString()}`);
            if (!data) throw new Error('Failed to get upload URL');
            const { uploadUrl, publicUrl } = data;

            const uploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type }
            });

            if (!uploadRes.ok) throw new Error('Failed to upload image');

            setThumbnailImageSrc(publicUrl);
            setMessage('Image uploaded successfully!');
        } catch (e: any) {
            setMessage(e?.message ?? 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    // 保存・更新処理
    const handleSave = async () => {
        if (!isSettingsComplete) {
            if (isMobile) {
                setIsSettingsModalOpen(true);
            } else {
                setActiveSection('settings');
            }
            setMessage("Please complete all required fields before publishing.");
            return;
        }

        const waypoints = items.filter(it => it.type === 'waypoint');
        if (waypoints.length < 2) {
            setMessage("At least 2 waypoints are required.");
            return;
        }

        if (items[0].type !== 'waypoint' || items[items.length - 1].type !== 'waypoint') {
            setMessage("Route must start and end with a waypoint.");
            return;
        }

        const normalizedItems = items.map((item, index) => {
            const { id, ...rest } = item;
            const isUuid = id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(id));

            if (item.type === 'waypoint') {
                if (typeof item.lat !== 'number' || typeof item.lng !== 'number') {
                    throw new Error(`Waypoint "${item.name}" has no coordinates.`);
                }
                return {
                    ...(isUuid ? { id } : {}),
                    ...rest,
                    order: index,
                    source: item.source || 'USER'
                };
            } else {
                return {
                    ...(isUuid ? { id } : {}),
                    ...rest,
                    order: index
                };
            }
        });

        setPublishing(true);
        setMessage(null);
        try {
            let result;
            const payload = {
                title,
                description,
                visibility,
                collaboratorPolicy,
                thumbnailImageSrc,
                items: normalizedItems,
                routeFor,
                month,
                budget,
                tags
            };

            if (mode === 'create') {
                result = await postDataToServerWithJson<{ id: string }>('/api/v1/routes', payload);
            } else {
                result = await patchDataToServerWithJson<any>(`/api/v1/routes`, {
                    id: initialRoute?.id,
                    ...payload
                });
            }

            if (result) {
                setMessage(mode === 'create' ? `Published! Redirecting...` : `Updated! Redirecting...`);
                router.push(`/routes/${result.id || initialRoute?.id}`);
            } else {
                throw new Error('Failed to save');
            }
        } catch (e: any) {
            setMessage(e?.message ?? 'Save failed');
        } finally {
            setPublishing(false);
        }
    };

    return (
        <div className="relative w-full h-full flex flex-row">
            {/* 左側：ダイアグラム */}
            <NodeLinkDiagram
                items={items}
                selectedIndex={selectedIndex}
                onSelectItem={(index) => {
                    setSelectedIndex(index);
                    if (isMobile) {
                        setIsSettingsModalOpen(false);
                        setIsEditorModalOpen(true);
                    } else {
                        setActiveSection('edit');
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
                onOpenEdit={() => {
                    if (isMobile) {
                        setIsSettingsModalOpen(false);
                        setIsEditorModalOpen(false);
                    } else {
                        setActiveSection('edit');
                    }
                }}
                activeSection={activeSection}
                onPublish={handleSave}
                publishing={publishing}
                isSettingsComplete={isSettingsComplete}
                title={title}
            />

            {/* 右側：編集パネル */}
            <div className="hidden md:flex flex-1 h-full overflow-y-auto shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-10 flex-col">
                <ActionBar
                    isSettingsComplete={isSettingsComplete}
                    isTitleSet={isTitleSet}
                    isDescriptionSet={isDescriptionSet}
                    isThumbnailSet={isThumbnailSet}
                    isWaypointsSet={isWaypointsSet}
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    handlePublish={handleSave}
                    publishing={publishing}
                    message={message}
                    onClearMessage={() => setMessage(null)}
                />
                <div className="w-full flex-1">
                    {activeSection === 'edit' ? (
                        <div className="w-full h-full animate-in fade-in duration-300">
                            <RouteEditingSection
                                selectedItem={selectedItem}
                                onUpdateItem={(updates) => updateItem(selectedIndex, updates)}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full animate-in fade-in duration-300">
                            <RouteSettingsSection
                                title={title}
                                setTitle={setTitle}
                                description={description}
                                setDescription={setDescription}
                                visibility={visibility}
                                setVisibility={setVisibility}
                                collaboratorPolicy={collaboratorPolicy}
                                setCollaboratorPolicy={setCollaboratorPolicy}
                                thumbnailImageSrc={thumbnailImageSrc}
                                handleImageUpload={handleImageUpload}
                                uploading={uploading}
                                routeId={initialRoute?.id}
                                routeFor={routeFor}
                                setRouteFor={setRouteFor}
                                month={month}
                                setMonth={setMonth}
                                budget={budget}
                                setBudget={setBudget}
                                tags={tags}
                                setTags={setTags}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* モバイル用エディタモーダル */}
            {isMobile && isEditorModalOpen && selectedItem && (
                <div className="absolute inset-0 z-50 flex md:hidden" aria-modal="true" role="dialog">
                    <div className="flex flex-col w-screen h-fit bg-background-0 shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
                        <div className="sticky z-10 bg-background-1 backdrop-blur-md border-b border-grass px-4 md:px-5 py-3 flex items-center justify-between top-0">
                            <div className="text-base font-bold text-foreground-0">{selectedItem.type === 'waypoint' ? 'Edit Waypoint' : 'Edit Transportation'}</div>
                            <button className="p-2 -mr-2 text-foreground-1 hover:text-foreground-0 active:scale-95" onClick={() => setIsEditorModalOpen(false)}>
                                <X size={22} />
                            </button>
                        </div>
                        <RouteEditingSection selectedItem={selectedItem} onUpdateItem={(updates) => updateItem(selectedIndex, updates)} />
                    </div>
                </div>
            )}

            {/* モバイル用設定モーダル */}
            {isMobile && isSettingsModalOpen && (
                <div className="absolute inset-0 z-50 flex md:hidden" aria-modal="true" role="dialog">
                    <div className="flex flex-col w-screen h-fit bg-background-0 shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
                        <div className="sticky z-10 bg-background-1/80 backdrop-blur-md border-b border-grass px-4 md:px-5 py-3 flex items-center justify-between top-0">
                            <div className="text-base font-bold text-foreground-0">Publication Settings</div>
                            <button className="p-2 -mr-2 text-foreground-1 hover:text-foreground-0 active:scale-95" onClick={() => setIsSettingsModalOpen(false)}>
                                <X size={22} />
                            </button>
                        </div>
                        <RouteSettingsSection
                            title={title}
                            setTitle={setTitle}
                            description={description}
                            setDescription={setDescription}
                            visibility={visibility}
                            setVisibility={setVisibility}
                            collaboratorPolicy={collaboratorPolicy}
                            setCollaboratorPolicy={setCollaboratorPolicy}
                            thumbnailImageSrc={thumbnailImageSrc}
                            handleImageUpload={handleImageUpload}
                            uploading={uploading}
                            routeId={initialRoute?.id}
                            routeFor={routeFor}
                            setRouteFor={setRouteFor}
                            month={month}
                            setMonth={setMonth}
                            budget={budget}
                            setBudget={setBudget}
                            tags={tags}
                            setTags={setTags}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
