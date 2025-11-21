
export const cleanBase64 = (dataUrl: string): string => {
  return dataUrl.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

export const getMimeType = (dataUrl: string): string => {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z]+);base64,/);
  return match ? match[1] : 'image/png';
};

export const compressImage = async (dataUrl: string, quality = 0.7, maxWidth = 1920): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Resize if too large to save space
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      // Convert to JPEG to save space (lossy compression)
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = (e) => reject(e);
    img.src = dataUrl;
  });
};
