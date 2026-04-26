"use client";

import { useState, useEffect } from "react";
import NodeLinkDiagram from "./templates/nodeLinkDiagram";
import RouteEditingSection from "./templates/routeEditingSection";
import RouteSettingsSection from "./templates/routeSettingsSection";
import ActionBar from "./ingredients/actionBar";
import { X } from "lucide-react";
import ModalFullSize from "@/app/[locale]/_components/common/templates/modalFullSize";
import { useRouter } from "next/navigation";
import { useUiStore } from "@/lib/stores/uiStore";
import { useRouteEditor } from "../_hooks/useRouteEditor";
import { getDataFromServerWithJson, postDataToServerWithJson, patchDataToServerWithJson } from "@/lib/api/client";
import { convertToWebP } from "@/lib/utils/image";
import { toSpotSource, toTransitMode } from "@/lib/utils/enum";
import { Route, RouteItem } from "@/lib/types/domain";
import {
    CurrencyCode,
    RouteCollaboratorPolicy,
    RouteFor,
    RouteVisibility,
    SpotSource,
    TransitMode,
} from "@prisma/client";
import {useTranslations} from "next-intl";

interface RouteEditorClientProps {
    initialRoute?: Route;
    mode: 'create' | 'edit';
}

export default function RouteEditorClient({ initialRoute, mode }: RouteEditorClientProps) {
    const router = useRouter();
    const isMobile = useUiStore((state) => state.isMobile);
    const t = useTranslations('routeEditor');

    // -------------------------------------------------------------------------
    // 状態管理
    // -------------------------------------------------------------------------

    const [activeSection, setActiveSection] = useState<'edit' | 'settings'>('edit');
    const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    // ルート全体のメタ情報
    const [title, setTitle] = useState(initialRoute?.title || "");
    const [description, setDescription] = useState(initialRoute?.description || "");
    const [visibility, setVisibility] = useState<RouteVisibility>(initialRoute?.visibility || RouteVisibility.PUBLIC);
    const [collaboratorPolicy, setCollaboratorPolicy] = useState<RouteCollaboratorPolicy>(initialRoute?.collaboratorPolicy || RouteCollaboratorPolicy.DISABLED);
    const [thumbnailImageSrc, setThumbnailImageSrc] = useState<string | undefined>(initialRoute?.thumbnail?.url);

    // 追加されたパラメータ
    const [routeFor, setRouteFor] = useState<RouteFor>(initialRoute?.routeFor || RouteFor.EVERYONE);
    const [date, setDate] = useState<string>(initialRoute?.date ? new Date(initialRoute.date).toISOString() : new Date().toISOString());
    const [budget, setBudget] = useState<{ currencyCode: CurrencyCode; amount: number; note?: string }>({
        currencyCode: initialRoute?.budget?.localCurrencyCode || CurrencyCode.JPY,
        amount: Number(initialRoute?.budget?.amount) || 0,
        note: undefined
    });
    const [tags, setTags] = useState<string[]>(initialRoute?.tags?.map((t: { name: string }) => t.name) || []);

    // ルート編集ロジック（カスタムフック）
    const {
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
    } = useRouteEditor();

    // -------------------------------------------------------------------------
    // 取り込み機能 (localStorage)
    // -------------------------------------------------------------------------
    useEffect(() => {
        const importedData = localStorage.getItem("imported_route_data");
        if (importedData) {
            try {
                const route = JSON.parse(importedData) as Route;
                setTitle(route.title || "");
                setDescription(route.description || "");
                setVisibility(route.visibility || RouteVisibility.PUBLIC);
                setCollaboratorPolicy(route.collaboratorPolicy || RouteCollaboratorPolicy.DISABLED);
                setRouteFor(route.routeFor || RouteFor.EVERYONE);
                setTags(route.tags?.map((t: { name: string }) => t.name) || []);
                if (route.thumbnail?.url) {
                    setThumbnailImageSrc(route.thumbnail.url);
                }

                if (route.budget) {
                    setBudget({
                        currencyCode: route.budget.localCurrencyCode || CurrencyCode.JPY,
                        amount: Number(route.budget.amount) || 0,
                    });
                }

                if (route.routeDates && Array.isArray(route.routeDates) && route.routeDates.length > 0) {
                    const sortedRouteDates = [...route.routeDates].sort((a, b) => (a.day || 0) - (b.day || 0));
                    const newItems: RouteItem[][] = sortedRouteDates.map((date) => {
                        const dayItems: RouteItem[] = [];
                        if (date.routeNodes) {
                            const sortedNodes = [...(date.routeNodes as RouteNodeData[])].sort((a, b) => a.order - b.order);
                            sortedNodes.forEach((node) => {
                                dayItems.push({
                                    type: 'waypoint',
                                    id: Math.random().toString(36).substr(2, 9), // 新規作成として扱うためIDを振り直す
                                    name: node.spot.name,
                                    lat: node.spot.latitude || 0,
                                    lng: node.spot.longitude || 0,
                                    memo: node.details || '',
                                    images: node.images?.map((img) => img.url) || [],
                                    source: toSpotSource(node.spot.source),
                                    sourceId: node.spot.sourceId || undefined,
                                    order: node.order
                                });

                                if (node.transitSteps) {
                                    const sortedSteps = [...node.transitSteps].sort((a, b) => a.order - b.order);
                                    sortedSteps.forEach((step) => {
                                        dayItems.push({
                                            type: 'transportation',
                                            id: Math.random().toString(36).substr(2, 9),
                                            method: toTransitMode(step.mode),
                                            memo: step.memo || '',
                                            distance: step.distance || undefined,
                                            duration: step.duration || undefined,
                                            order: step.order
                                        });
                                    });
                                }
                            });
                        }
                        return dayItems;
                    });
                    setItems(newItems);
                }
            } catch (error) {
                console.error("Failed to parse imported route data:", error);
            } finally {
                localStorage.removeItem("imported_route_data");
            }
        }
    }, [setItems]);

    // RouteNode型定義（Prismaベース）
    type RouteNodeData = {
        id: string;
        order: number;
        details: string | null;
        spot: { name: string; latitude: number | null; longitude: number | null; source: string | null; sourceId: string | null };
        images: { url: string }[];
        transitSteps: { id: string; mode: string; memo: string | null; distance: number | null; duration: number | null; order: number }[];
    };

    // 初期値をセットする（編集時、または初期データがある場合）
    useEffect(() => {
        if (initialRoute?.routeDates && Array.isArray(initialRoute.routeDates) && initialRoute.routeDates.length > 0) {
            const initialDays: RouteItem[][] = [];
            const sortedRouteDates = [...initialRoute.routeDates].sort((a, b) => (a.day || 0) - (b.day || 0));

            sortedRouteDates.forEach((date) => {
                const dayItems: RouteItem[] = [];
                const sortedNodes = [...(date.routeNodes as RouteNodeData[])].sort((a, b) => a.order - b.order);

                sortedNodes.forEach((node) => {
                    dayItems.push({
                        type: 'waypoint',
                        id: node.id,
                        name: node.spot.name,
                        lat: node.spot.latitude || 0,
                        lng: node.spot.longitude || 0,
                        memo: node.details || '',
                        images: node.images?.map((img) => img.url) || [],
                        source: toSpotSource(node.spot.source),
                        sourceId: node.spot.sourceId || undefined,
                        order: node.order
                    });

                    if (node.transitSteps) {
                        const sortedSteps = [...node.transitSteps].sort((a, b) => a.order - b.order);
                        sortedSteps.forEach((step) => {
                            dayItems.push({
                                type: 'transportation',
                                id: step.id,
                                method: toTransitMode(step.mode),
                                memo: step.memo || '',
                                distance: step.distance || undefined,
                                duration: step.duration || undefined,
                                order: step.order
                            });
                        });
                    }
                });
                initialDays.push(dayItems);
            });
            setItems(initialDays);
        } else if ((initialRoute as any)?.routeNodes) {
            // 後方互換性（旧スキーマ用）
            const dayItems: RouteItem[] = [];
            const routeNodes = (initialRoute as any).routeNodes as RouteNodeData[];
            const sortedNodes = [...routeNodes].sort((a, b) => a.order - b.order);

            sortedNodes.forEach((node) => {
                dayItems.push({
                    type: 'waypoint',
                    id: node.id,
                    name: node.spot.name,
                    lat: node.spot.latitude || 0,
                    lng: node.spot.longitude || 0,
                    memo: node.details || '',
                    images: node.images?.map((img) => img.url) || [],
                    source: toSpotSource(node.spot.source),
                    sourceId: node.spot.sourceId || undefined,
                    order: node.order
                });

                if (node.transitSteps) {
                    const sortedSteps = [...node.transitSteps].sort((a, b) => a.order - b.order);
                    sortedSteps.forEach((step) => {
                        dayItems.push({
                            type: 'transportation',
                            id: step.id,
                            method: toTransitMode(step.mode),
                            memo: step.memo || '',
                            distance: step.distance || undefined,
                            duration: step.duration || undefined,
                            order: step.order
                        });
                    });
                }
            });
            setItems([dayItems]);
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
    const isWaypointsSet = items.every(dayItems => dayItems.filter(it => it.type === 'waypoint').length >= 2);
    const isTagsSet = tags.length >= 1;
    const isSettingsComplete = isTitleSet && isDescriptionSet && isThumbnailSet && isWaypointsSet && isTagsSet;

    // 画像アップロード処理
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setMessage(null);
        try {
            // WebPに変換
            const webpBlob = await convertToWebP(file, { quality: 0.85, maxSide: 2560 });

            const params = new URLSearchParams({
                fileName: file.name,
                contentType: 'image/webp',
                type: 'route-thumbnails'
            });

            const data = await getDataFromServerWithJson<{ uploadUrl: string, publicUrl: string }>(`/api/v1/images/uploads?${params.toString()}`);
            if (!data) throw new Error('Failed to get upload URL');
            const { uploadUrl, publicUrl } = data;

            const uploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                body: webpBlob,
                headers: { 'Content-Type': 'image/webp' }
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

        const normalizedItems = items.map((dayItems) => {
            return dayItems.map((item, index) => {
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
                        source: item.source ?? SpotSource.USER
                    };
                } else {
                    return {
                        ...(isUuid ? { id } : {}),
                        ...rest,
                        order: index
                    };
                }
            });
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
                who: routeFor,
                date,
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
            console.error('Save error:', e);
            if (e?.code === 'VALIDATION_ERROR' && e?.details?.issues) {
                const issues = e.details.issues as any[];
                const detailMsg = issues.map((issue: any) => {
                    const path = issue.path.join('.');
                    return `${path}: ${issue.message}`;
                }).join(', ');
                setMessage(`Validation Error: ${detailMsg}`);
            } else {
                setMessage(e?.message ?? 'Save failed');
            }
        } finally {
            setPublishing(false);
        }
    };

    return (
        <div className="w-full md:h-full h-fit flex flex-row">
            {/* 左側：ダイアグラム */}
            <NodeLinkDiagram
                items={items[currentDayIndex] || []}
                allDaysItems={items}
                currentDayIndex={currentDayIndex}
                onSelectDay={(index) => {
                    setCurrentDayIndex(index);
                    setSelectedIndex(0);
                }}
                onAddDay={addDay}
                onRemoveDay={removeDay}
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
                                date={date}
                                setDate={setDate}
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
                <ModalFullSize onBackgroundClick={() => setIsEditorModalOpen(false)}>
                    <div className="flex flex-col w-screen h-fit bg-background-0 shadow-2xl animate-in slide-in-from-bottom-4 duration-200 min-h-full">
                        <div className="sticky z-10 bg-background-1 backdrop-blur-md border-b border-grass px-4 md:px-5 py-3 flex items-center justify-between top-0">
                            <div className="text-base font-bold text-foreground-0">{selectedItem.type === 'waypoint' ?  t('editWaypoint') : t('editTransportation')}</div>
                            <button className="p-2 -mr-2 text-foreground-1 hover:text-foreground-0 active:scale-95" onClick={() => setIsEditorModalOpen(false)}>
                                <X size={22} />
                            </button>
                        </div>
                        <RouteEditingSection selectedItem={selectedItem} onUpdateItem={(updates) => updateItem(selectedIndex, updates)} />
                    </div>
                </ModalFullSize>
            )}

            {/* モバイル用設定モーダル */}
            {isMobile && isSettingsModalOpen && (
                <ModalFullSize onBackgroundClick={() => setIsSettingsModalOpen(false)}>
                    <div className="flex flex-col w-screen h-fit bg-background-0 shadow-2xl animate-in slide-in-from-bottom-4 duration-200 min-h-full">
                        <div className="sticky z-10 bg-background-1/80 backdrop-blur-md border-b border-grass px-4 md:px-5 py-3 flex items-center justify-between top-0">
                            <div className="text-base font-bold text-foreground-0">{t('publicationSettings')}</div>
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
                            date={date}
                            setDate={setDate}
                            budget={budget}
                            setBudget={setBudget}
                            tags={tags}
                            setTags={setTags}
                        />
                    </div>
                </ModalFullSize>
            )}
        </div>
    );
}
