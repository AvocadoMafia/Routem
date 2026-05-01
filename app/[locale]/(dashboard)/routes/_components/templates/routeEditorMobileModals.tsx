import ModalFullSize from "@/app/[locale]/_components/common/templates/modalFullSize";
import { X } from "lucide-react";
import RouteEditingSection from "./routeEditingSection";
import RouteSettingsSection from "./routeSettingsSection";
import { RouteItem } from "@/lib/types/domain";
import { CurrencyCode, RouteCollaboratorPolicy, RouteVisibility, RouteFor } from "@prisma/client";

interface Props {
    isEditorModalOpen: boolean;
    setIsEditorModalOpen: (open: boolean) => void;
    isSettingsModalOpen: boolean;
    setIsSettingsModalOpen: (open: boolean) => void;
    selectedItem: RouteItem | null;
    selectedIndex: number;
    updateItem: (index: number, updates: Partial<RouteItem>) => void;
    t: any; // translate function
    
    // Settings related
    title: string;
    setTitle: (val: string) => void;
    description: string;
    setDescription: (val: string) => void;
    visibility: RouteVisibility;
    setVisibility: (val: RouteVisibility) => void;
    collaboratorPolicy: RouteCollaboratorPolicy;
    setCollaboratorPolicy: (val: RouteCollaboratorPolicy) => void;
    thumbnailImageSrc: string | undefined;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    uploading: boolean;
    routeId?: string;
    routeFor: RouteFor;
    setRouteFor: (val: RouteFor) => void;
    date: string;
    setDate: (val: string) => void;
    budget: { currencyCode: CurrencyCode; amount: number; note?: string };
    setBudget: (val: { currencyCode: CurrencyCode; amount: number; note?: string }) => void;
    tags: string[];
    setTags: (val: string[]) => void;
    handleSave: () => void;
    publishing: boolean;
    isSettingsComplete: boolean;
}

export default function RouteEditorMobileModals({
    isEditorModalOpen,
    setIsEditorModalOpen,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    selectedItem,
    selectedIndex,
    updateItem,
    t,
    title,
    setTitle,
    description,
    setDescription,
    visibility,
    setVisibility,
    collaboratorPolicy,
    setCollaboratorPolicy,
    thumbnailImageSrc,
    handleImageUpload,
    uploading,
    routeId,
    routeFor,
    setRouteFor,
    date,
    setDate,
    budget,
    setBudget,
    tags,
    setTags,
    handleSave,
    publishing,
    isSettingsComplete
}: Props) {
    return (
        <>
            {/* モバイル用エディタモーダル */}
            {isEditorModalOpen && selectedItem && (
                <ModalFullSize onBackgroundClick={() => setIsEditorModalOpen(false)}>
                    <div className="flex flex-col w-screen h-fit bg-background-0 shadow-2xl animate-in slide-in-from-bottom-4 duration-200 min-h-full">
                        <div className="sticky z-10 bg-background-1/80 backdrop-blur-sm border-b border-grass px-4 md:px-5 py-3 flex items-center justify-between top-0">
                            <div className="text-base font-bold text-foreground-0">{selectedItem.type === 'waypoint' ? t('editWaypoint') : t('editTransportation')}</div>
                            <button className="p-2 -mr-2 text-foreground-1 hover:text-foreground-0 active:scale-95" onClick={() => setIsEditorModalOpen(false)}>
                                <X size={22} />
                            </button>
                        </div>
                        <RouteEditingSection selectedItem={selectedItem} onUpdateItem={(updates) => updateItem(selectedIndex, updates)} />
                    </div>
                </ModalFullSize>
            )}

            {/* モバイル用設定モーダル */}
            {isSettingsModalOpen && (
                <ModalFullSize onBackgroundClick={() => setIsSettingsModalOpen(false)}>
                    <div className="flex flex-col w-screen h-fit bg-background-0 shadow-2xl animate-in slide-in-from-bottom-4 duration-200 min-h-full">
                        <div className="sticky z-10 bg-background-1/80 backdrop-blur-sm border-b border-grass px-4 md:px-5 py-3 flex items-center justify-between top-0">
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
                            routeId={routeId}
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
        </>
    );
}
