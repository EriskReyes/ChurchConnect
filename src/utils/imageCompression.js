import imageCompression from 'browser-image-compression';

const OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

const IMAGE_MIME = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
const MAX_5MB = 5 * 1024 * 1024;
const MAX_4MB = 4 * 1024 * 1024;

// Compress if image, return original if not (PDF, audio, etc.)
export async function compressIfImage(file) {
  if (!IMAGE_MIME.includes(file.type)) return file;
  try {
    return await imageCompression(file, OPTIONS);
  } catch {
    return file;
  }
}

// Promise wrapper for FileReader
export function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export { MAX_5MB, MAX_4MB };
