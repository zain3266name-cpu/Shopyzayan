import { useState } from 'react';
import { Package } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export function ProductImage({
  src,
  alt,
  title,
  className = '',
  loading = 'lazy',
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#F4F4F5] dark:bg-[#26223D] text-zinc-500 dark:text-[#B8B3D1] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Package className="w-8 h-8 mb-2 stroke-[1.5] text-zinc-400 dark:text-[#8E89A8]" />
        <span className="text-xs font-medium text-zinc-600 dark:text-[#F4F2FF] line-clamp-2 max-w-[180px]">
          {title || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
