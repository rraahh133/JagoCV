import React from 'react';
import { cn } from '../../utils/cn';
import { compressImage, CompressOptions } from '../../utils/imageCompressor';

interface FileUploadProps {
  variant?: 'avatar' | 'banner';
  label?: string;
  accept?: string;
  /** Callback dipanggil dengan data URL hasil kompresi */
  onImageReady?: (dataUrl: string) => void;
  /** Callback raw onChange (digunakan jika tidak pakai onImageReady) */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl?: string;
  className?: string;
  /** Opsi kompresi. Jika tidak diisi, pakai default sesuai variant */
  compressOptions?: CompressOptions;
}

export default function FileUpload({
  variant = 'avatar',
  label,
  accept = 'image/*',
  onImageReady,
  onChange,
  previewUrl,
  className,
  compressOptions,
}: FileUploadProps) {
  const isAvatar = variant === 'avatar';
  const defaultLabel = isAvatar ? 'Foto Profil' : 'Gambar Banner (Opsional)';

  // Default compress options per variant
  const defaultCompressOptions: CompressOptions = isAvatar
    ? { maxWidth: 400, maxHeight: 400, targetSizeKB: 200 }
    : { maxWidth: 1920, maxHeight: 600, targetSizeKB: 400 };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Jika ada onImageReady, gunakan auto-compress pipeline
    if (onImageReady) {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const result = await compressImage(file, compressOptions ?? defaultCompressOptions);
        onImageReady(result.dataUrl);
      } catch (err) {
        console.error('FileUpload: gagal kompresi gambar', err);
      }
      return;
    }

    // Fallback ke onChange biasa
    onChange?.(e);
  };

  return (
    <label className={cn(
      'flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700/80 bg-slate-50 dark:bg-[#0B1221]/30 hover:bg-slate-100 dark:hover:bg-white/5 hover:border-cyan-500 cursor-pointer transition-all group relative overflow-hidden',
      isAvatar ? 'w-32 h-32 rounded-full shrink-0' : 'w-full h-32 rounded-2xl',
      className
    )}>
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        title={label || defaultLabel}
      />
      {previewUrl ? (
        <img src={previewUrl} alt="Preview" className={cn('w-full h-full object-cover', isAvatar && 'rounded-full')} />
      ) : (
        <>
          <svg className="w-8 h-8 text-slate-400 group-hover:text-cyan-500 mb-2 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isAvatar ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0V20a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h10l4 4v10z" />
            )}
          </svg>
          <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">{label || defaultLabel}</span>
        </>
      )}
    </label>
  );
}
