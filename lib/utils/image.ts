// Browser-side image processing helpers.
// 旧 lib/client/helpers.ts から convertToWebP のみを切り出し。

/**
 * Browser-side image conversion to WebP
 */
export async function convertToWebP(
    file: File,
    opts?: { quality?: number; maxSide?: number },
): Promise<Blob> {
    const quality = opts?.quality ?? 0.85; // 0..1
    const maxSide = opts?.maxSide ?? 2560; // clamp long side

    // Prefer createImageBitmap when available for performance and orientation handling
    let bitmap: ImageBitmap;
    try {
        // Some browsers support orientation from EXIF via imageOrientation option
        // @ts-ignore - imageOrientation may be experimental
        bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
        // Fallback: load via HTMLImageElement
        const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsDataURL(file);
        });
        bitmap = await new Promise<ImageBitmap>((resolve, reject) => {
            const img = new Image();
            img.onload = async () => {
                try {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    if (!ctx) return reject(new Error("Canvas not supported"));
                    const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
                    const w = Math.max(1, Math.round(img.width * scale));
                    const h = Math.max(1, Math.round(img.height * scale));
                    canvas.width = w;
                    canvas.height = h;
                    ctx.drawImage(img, 0, 0, w, h);
                    const blob = await new Promise<Blob | null>((res) =>
                        canvas.toBlob(res, "image/webp", quality),
                    );
                    if (!blob) return reject(new Error("Conversion failed"));
                    const wb = await createImageBitmap(blob);
                    resolve(wb);
                } catch (e) {
                    reject(e);
                }
            };
            img.onerror = () => reject(new Error("Failed to load image"));
            img.src = dataUrl;
        });
    }

    // Draw to canvas with resize
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(bitmap, 0, 0, w, h);

    const out = await new Promise<Blob | null>((res) =>
        canvas.toBlob(res, "image/webp", quality),
    );
    if (!out) throw new Error("Conversion failed");
    return out;
}
