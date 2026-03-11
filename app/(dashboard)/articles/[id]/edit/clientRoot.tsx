"use client";

import { useState, useEffect } from "react";
import NodeLinkDiagram from "@/app/(dashboard)/articles/new/templates/nodeLinkDiagram";
import RouteEditingSection from "@/app/(dashboard)/articles/new/templates/routeEditingSection";
import RouteSettingsSection from "@/app/(dashboard)/articles/new/templates/routeSettingsSection";
import ActionBar from "@/app/(dashboard)/articles/new/ingredients/actionBar";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";
import { isMobileAtom } from "@/lib/client/atoms";
import { useRouteEditor } from "@/app/(dashboard)/articles/new/hooks/useRouteEditor";
import { getDataFromServerWithJson, postDataToServerWithJson, patchDataToServerWithJson } from "@/lib/client/helpers";
import { Category, Route, RouteItem } from "@/lib/client/types";

export default function ClientRoot({ route }: { route: Route }) {
    const router = useRouter();
    const isMobile = useAtomValue(isMobileAtom);

    const [activeSection, setActiveSection] = useState<'edit' | 'settings'>('edit');
    const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    const [title, setTitle] = useState(route.title);
    const [description, setDescription] = useState(route.description);
    const [category, setCategory] = useState<Category>(route.category);
    const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE'>(route.visibility);
    const [collaboratorPolicy, setCollaboratorPolicy] = useState<'DISABLED' | 'VIEW_ONLY' | 'CAN_EDIT'>(route.collaboratorPolicy);
    const [thumbnailImageSrc, setThumbnailImageSrc] = useState<string | undefined>(route.thumbnail?.url);

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

    // Initialize items from the existing route
    useEffect(() => {
        if (route.routeNodes) {
            const initialItems: RouteItem[] = [];
            route.routeNodes.forEach((node) => {
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
    }, [route, setItems]);

    const [publishing, setPublishing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const isTitleSet = title.trim() !== "";
    const isDescriptionSet = description.trim() !== "";
    const isThumbnailSet = thumbnailImageSrc !== undefined;
    const isWaypointsSet = items.filter(it => it.type === 'waypoint').length >= 2;
    const isSettingsComplete = isTitleSet && isDescriptionSet && isThumbnailSet && isWaypointsSet;

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

    const handleUpdate = async () => {
        if (!isSettingsComplete) return;

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
            const result = await patchDataToServerWithJson<any>(`/api/v1/routes`, {
                id: route.id,
                title,
                description,
                categoryId: category.id,
                visibility,
                collaboratorPolicy,
                thumbnailImageSrc,
                items: normalizedItems
            });

            if (result) {
                setMessage(`Updated! Redirecting...`);
                router.push(`/routes/${route.id}`);
            } else {
                throw new Error('Failed to update');
            }
        } catch (e: any) {
            setMessage(e?.message ?? 'Update failed');
        } finally {
            setPublishing(false);
        }
    };

    return (
        <div className="relative w-full h-full flex flex-row">
            <NodeLinkDiagram
                items={items}
                selectedIndex={selectedIndex}
                onSelectItem={(index) => {
                    setSelectedIndex(index);
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
                onPublish={handleUpdate}
                publishing={publishing}
                isSettingsComplete={isSettingsComplete}
                title={title}
            />
            <div className="hidden md:flex flex-1 h-full overflow-y-auto shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-10 flex-col">
                <ActionBar
                    isSettingsComplete={isSettingsComplete}
                    isTitleSet={isTitleSet}
                    isDescriptionSet={isDescriptionSet}
                    isThumbnailSet={isThumbnailSet}
                    isWaypointsSet={isWaypointsSet}
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    handlePublish={handleUpdate}
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
                                category={category}
                                setCategory={setCategory}
                                visibility={visibility}
                                setVisibility={setVisibility}
                                collaboratorPolicy={collaboratorPolicy}
                                setCollaboratorPolicy={setCollaboratorPolicy}
                                thumbnailImageSrc={thumbnailImageSrc}
                                handleImageUpload={handleImageUpload}
                                uploading={uploading}
                                routeId={route.id}
                            />
                        </div>
                    )}
                </div>
            </div>

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
                            category={category}
                            setCategory={setCategory}
                            visibility={visibility}
                            setVisibility={setVisibility}
                            collaboratorPolicy={collaboratorPolicy}
                            setCollaboratorPolicy={setCollaboratorPolicy}
                            thumbnailImageSrc={thumbnailImageSrc}
                            handleImageUpload={handleImageUpload}
                            uploading={uploading}
                            routeId={route.id}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
