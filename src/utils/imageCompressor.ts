/**
 * imageCompressor.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Utility untuk kompresi gambar di sisi klien sebelum disimpan sebagai base64.
 *
 * Cara kerja:
 *  1. Baca file asli sebagai data URL via FileReader
 *  2. Gambar di-render ke HTMLCanvasElement
 *  3. Jika dimensi melebihi maxWidth/maxHeight → di-scale down secara proporsional
 *  4. Canvas di-export kembali ke JPEG/WebP dengan kualitas yang bisa dikonfigurasi
 *  5. Jika ukuran hasil masih > targetSizeKB → turunkan kualitas secara iteratif
 *
 * Semua proses berjalan di browser (tidak ada upload ke server).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface CompressOptions {
  /** Lebar maksimum output dalam piksel. Default: 1200 */
  maxWidth?: number;
  /** Tinggi maksimum output dalam piksel. Default: 1200 */
  maxHeight?: number;
  /** Kualitas awal kompresi (0–1). Default: 0.85 */
  quality?: number;
  /** Target ukuran maksimum output dalam KB. Default: 500 */
  targetSizeKB?: number;
  /** Format output. Default: 'image/jpeg' */
  outputFormat?: 'image/jpeg' | 'image/webp';
}

export interface CompressResult {
  /** Data URL hasil kompresi */
  dataUrl: string;
  /** Ukuran file asli dalam KB */
  originalSizeKB: number;
  /** Ukuran file hasil kompresi dalam KB */
  compressedSizeKB: number;
  /** Apakah gambar benar-benar dikompresi (false = sudah kecil, tidak perlu kompresi) */
  wasCompressed: boolean;
}

/**
 * Kompresi gambar dari File object.
 *
 * @param file         File gambar yang akan dikompresi
 * @param options      Opsi kompresi (opsional)
 * @returns            Promise<CompressResult>
 *
 * @example
 * const result = await compressImage(file, { targetSizeKB: 300 });
 * updateField('photoUrl', result.dataUrl);
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<CompressResult> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.85,
    targetSizeKB = 500,
    outputFormat = 'image/jpeg',
  } = options;

  const originalSizeKB = file.size / 1024;

  // Jika file sudah kecil dari target, langsung baca tanpa kompresi
  if (originalSizeKB <= targetSizeKB) {
    const dataUrl = await readFileAsDataURL(file);
    return {
      dataUrl,
      originalSizeKB,
      compressedSizeKB: originalSizeKB,
      wasCompressed: false,
    };
  }

  // Load gambar ke HTMLImageElement
  const originalDataUrl = await readFileAsDataURL(file);
  const img = await loadImage(originalDataUrl);

  // Hitung dimensi baru dengan mempertahankan aspect ratio
  const { width, height } = calculateDimensions(img.width, img.height, maxWidth, maxHeight);

  // Gambar ke canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context tidak tersedia');

  ctx.drawImage(img, 0, 0, width, height);

  // Kompresi iteratif: turunkan kualitas sampai ukuran <= targetSizeKB
  let currentQuality = quality;
  let dataUrl = canvas.toDataURL(outputFormat, currentQuality);
  let compressedSizeKB = getDataUrlSizeKB(dataUrl);

  while (compressedSizeKB > targetSizeKB && currentQuality > 0.1) {
    currentQuality -= 0.05;
    dataUrl = canvas.toDataURL(outputFormat, currentQuality);
    compressedSizeKB = getDataUrlSizeKB(dataUrl);
  }

  return {
    dataUrl,
    originalSizeKB,
    compressedSizeKB,
    wasCompressed: true,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Gagal memuat gambar'));
    img.src = src;
  });
}

function calculateDimensions(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let width = srcWidth;
  let height = srcHeight;

  if (width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }
  if (height > maxHeight) {
    width = Math.round((width * maxHeight) / height);
    height = maxHeight;
  }

  return { width, height };
}

/** Hitung ukuran data URL dalam KB (base64 overhead ~33%) */
function getDataUrlSizeKB(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1] || '';
  return (base64.length * 3) / 4 / 1024;
}
