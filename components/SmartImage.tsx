'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface SmartImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  fill?: boolean;
  unoptimized?: boolean;
  sizes?: string;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=1200&auto=format&fit=crop';

export function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/\/(?:file\/d\/|d\/|open\?id=)([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

export function formatGoogleDriveUrl(url: string, attempt: number = 0): string {
  if (!url) return FALLBACK_IMAGE;
  const fileId = extractGoogleDriveId(url);
  if (fileId) {
    if (attempt === 0) {
      return `https://lh3.googleusercontent.com/d/${fileId}=s1600`;
    } else if (attempt === 1) {
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
    } else if (attempt === 2) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }
  return url;
}

export function SmartImage({
  src,
  alt,
  width = 800,
  height = 600,
  priority = false,
  className = '',
  fill = false,
  unoptimized,
  sizes,
}: SmartImageProps) {
  const [prevSrc, setPrevSrc] = useState<string>(src);
  const [attempt, setAttempt] = useState<number>(0);
  const [overrideSrc, setOverrideSrc] = useState<string | null>(null);

  if (prevSrc !== src) {
    setPrevSrc(src);
    setAttempt(0);
    setOverrideSrc(null);
  }

  const imgSrc = overrideSrc ?? formatGoogleDriveUrl(src, attempt);

  const handleError = () => {
    const fileId = extractGoogleDriveId(src);
    if (fileId && attempt < 2) {
      const nextAttempt = attempt + 1;
      setAttempt(nextAttempt);
      setOverrideSrc(formatGoogleDriveUrl(src, nextAttempt));
    } else if (imgSrc !== FALLBACK_IMAGE) {
      setOverrideSrc(FALLBACK_IMAGE);
    }
  };

  const isGoogleDrive = Boolean(extractGoogleDriveId(src) || (imgSrc && (imgSrc.includes('googleusercontent.com') || imgSrc.includes('drive.google.com'))));
  // Local /images/* files (1600x1200 webp masters) go through the Next image
  // optimizer so phones get right-sized AVIF/WebP via srcset instead of the full
  // master — this was the main LCP + "improve image delivery" cost. Only Google
  // Drive / external URLs and SVGs bypass it.
  const isSvg = typeof imgSrc === 'string' && /\.svg(\?|$)/i.test(imgSrc);
  const shouldUnoptimize =
    unoptimized !== undefined ? unoptimized : isGoogleDrive || isSvg;

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? '100vw'}
        className={className}
        referrerPolicy="no-referrer"
        unoptimized={shouldUnoptimize}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes ?? `${width}px`}
      className={className}
      referrerPolicy="no-referrer"
      unoptimized={shouldUnoptimize}
      onError={handleError}
    />
  );
}

