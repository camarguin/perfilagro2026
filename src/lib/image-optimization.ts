/**
 * Compresses an image file to WebP format using the browser's Canvas API.
 * 
 * @param file - The original image File object.
 * @param quality - The quality of the WebP image (0 to 1). Default is 0.8.
 * @returns A Promise that resolves to the compressed WebP File object.
 */
export async function compressImage(file: File, quality = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Optional: Resize if too large (e.g., max width 1920px)
                const MAX_WIDTH = 1920;
                if (width > MAX_WIDTH) {
                    height = Math.round((height * MAX_WIDTH) / width);
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Could not create WebP blob'));
                            return;
                        }

                        // Create a new File with the .webp extension
                        const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                        const compressedFile = new File([blob], fileName, {
                            type: 'image/webp',
                            lastModified: Date.now(),
                        });

                        resolve(compressedFile);
                    },
                    'image/webp',
                    quality
                );
            };

            img.onerror = (error) => reject(error);
        };

        reader.onerror = (error) => reject(error);
    });
}
