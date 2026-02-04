"use client";

import { Waypoint } from "@/lib/client/types";
import { Image as ImageIcon, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";

interface WaypointEditorProps {
    item: Waypoint;
    onUpdate: (updates: Partial<Waypoint>) => void;
}

export default function WaypointEditor({ item, onUpdate }: WaypointEditorProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const images = item.images ?? [];
    const MAX_IMAGES = 3;

    // Convert any image File/Blob to WebP Blob on the client
    async function convertToWebP(file: File, opts?: { quality?: number; maxSide?: number }): Promise<Blob> {
        const quality = opts?.quality ?? 0.85; // 0..1
        const maxSide = opts?.maxSide ?? 2560; // clamp long side

        // Prefer createImageBitmap when available for performance and orientation handling
        let bitmap: ImageBitmap;
        try {
            // Some browsers support orientation from EXIF via imageOrientation option
            // @ts-ignore - imageOrientation may be experimental
            bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
        } catch {
            // Fallback: load via HTMLImageElement
            const dataUrl = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
                reader.readAsDataURL(file);
            });
            bitmap = await new Promise<ImageBitmap>((resolve, reject) => {
                const img = new Image();
                img.onload = async () => {
                    try {
                        // draw to canvas below; convert image element to bitmap-like flow
                        // We'll just use width/height from img
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        if (!ctx) return reject(new Error('Canvasがサポートされていません'));
                        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
                        const w = Math.max(1, Math.round(img.width * scale));
                        const h = Math.max(1, Math.round(img.height * scale));
                        canvas.width = w;
                        canvas.height = h;
                        ctx.drawImage(img, 0, 0, w, h);
                        const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/webp', quality));
                        if (!blob) return reject(new Error('WEBPへの変換に失敗しました'));
                        // Create a bitmap from the already scaled webp blob just to unify return type
                        const wb = await createImageBitmap(blob);
                        resolve(wb);
                    } catch (e) {
                        reject(e);
                    }
                };
                img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
                img.src = dataUrl;
            });
        }

        // Draw to canvas with resize
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvasがサポートされていません');
        const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
        const w = Math.max(1, Math.round(bitmap.width * scale));
        const h = Math.max(1, Math.round(bitmap.height * scale));
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(bitmap, 0, 0, w, h);

        const out = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/webp', quality));
        if (!out) throw new Error('WEBPへの変換に失敗しました');
        return out;
    }

    const handleClick = () => {
        setError(null);
        if (images.length >= MAX_IMAGES) {
            setError(`画像は最大${MAX_IMAGES}枚までです。`);
            return;
        }
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setError(null);

        if (images.length >= MAX_IMAGES) {
            setError(`画像は最大${MAX_IMAGES}枚までです。`);
            return;
        }

        // Basic validations
        const maxSize = 10 * 1024 * 1024; // 10MB (converted WEBP size 上限)
        if (!file.type.startsWith('image/')) {
            setError("画像ファイルを選択してください。");
            return;
        }

        try {
            setUploading(true);

            // 0) 任意形式 → WEBP へクライアント変換
            const webpBlob = await convertToWebP(file, { quality: 0.85, maxSide: 2560 });
            if (webpBlob.size > maxSize) {
                throw new Error('変換後ファイルが大きすぎます（最大10MB）。');
            }

            // 1) get presigned URL via GET with query params, force image/webp
            const qs = new URLSearchParams({ fileName: file.name, contentType: 'image/webp' }).toString();
            const presignRes = await fetch(`/api/v1/uploads/routeThumbnail?${qs}`, { method: 'GET' });
            const presignData = await presignRes.json();
            if (!presignRes.ok) throw new Error(presignData?.error || 'アップロード用URLの取得に失敗しました');

            const { uploadUrl, publicUrl } = presignData as { uploadUrl: string; publicUrl?: string };
            if (!uploadUrl) throw new Error('uploadUrl が取得できませんでした');

            // 2) PUT to presigned URL (image/webp) with converted blob
            const putRes = await fetch(uploadUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'image/webp' },
                body: webpBlob,
            });
            if (!putRes.ok) throw new Error('画像のアップロードに失敗しました');

            // 3) Update current item images[]
            if (publicUrl) {
                const next = [...images, publicUrl].slice(0, MAX_IMAGES);
                onUpdate({ images: next });
            }
        } catch (err: any) {
            setError(err?.message ?? '画像のアップロードに失敗しました');
        } finally {
            setUploading(false);
            // allow re-selecting the same file
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemoveImage = (url: string) => {
        const next = (images || []).filter((u) => u !== url);
        onUpdate({ images: next.length ? next : undefined });
    };

    return (
        <div className="grid grid-cols-1 gap-10">
            {/* 経由地名の入力フィールド */}
            <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-foreground-0">
                    Waypoint Name
                </label>
                <input
                    type="text"
                    value={item.name}
                    onChange={(e) => onUpdate({ name: e.target.value })}
                    className="w-full px-5 py-4 bg-background-0 border border-grass rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-0/20 focus:border-accent-0 transition-all text-lg font-medium"
                    placeholder="Where are you going?"
                />
            </div>

            {/* 画像アップロード・表示エリア */}
            <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-foreground-0">
                    <ImageIcon size={16} /> Visuals
                </label>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
                <div
                    className="group relative border-2 border-dashed border-grass rounded-3xl p-10 flex flex-col items-center justify-center text-foreground-1 hover:bg-background-0 hover:border-accent-0/30 cursor-pointer transition-all min-h-[240px] overflow-hidden"
                    onClick={handleClick}
                >
                    {images.length > 0 ? (
                        <>
                            <div className="absolute inset-0 grid grid-cols-3 gap-2 p-4">
                                {images.map((url) => (
                                    <div key={url} className="relative rounded-xl overflow-hidden">
                                        <img src={url} alt={item.name} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            className="absolute top-2 right-2 z-10 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                                            onClick={(e) => { e.stopPropagation(); handleRemoveImage(url); }}
                                            aria-label="Remove image"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                {images.length < MAX_IMAGES && (
                                    <div className="rounded-xl border border-dashed border-grass/60 flex items-center justify-center text-sm text-foreground-1" >
                                        {uploading ? <Loader2 className="animate-spin" size={20} /> : '+ Add'}
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-grass rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                {uploading ? <Loader2 className="animate-spin text-foreground-1" size={28} /> : <ImageIcon size={32} className="text-foreground-1" />}
                            </div>
                            <span className="font-bold">Add Image</span>
                            <span className="text-xs text-foreground-1/60 mt-1">Any image accepted; saved as WEBP (max 3)</span>
                        </>
                    )}
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        </div>
    );
}
