import React, { useState, useEffect, useRef } from 'react';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=360&q=60';

/**
 * Reusable progressive image component with:
 * - Dynamic Unsplash size/quality optimization (drastically cuts payload)
 * - Shimmer skeleton placeholder to prevent layout shifts
 * - Instant rendering for priority images and browser-cached assets
 * - Priority hints (fetchPriority="high" & loading="eager")
 * - Graceful error fallback
 */
export default function OptimizedImage({
  src,
  alt = '',
  className = '',
  containerClassName = '',
  width = 360,
  height = null,
  quality = 60,
  priority = false,
  fallbackSrc = DEFAULT_FALLBACK,
  style = {},
  imgStyle = {},
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Compute optimized URL
  const optimizedUrl = getOptimizedImageUrl(hasError ? fallbackSrc : src, {
    width,
    height,
    quality,
  });

  // Check if image is already cached/complete on mount or ref attach
  const handleRef = (el) => {
    imgRef.current = el;
    if (el && el.complete && el.naturalWidth > 0) {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [optimizedUrl]);

  return (
    <div
      className={`relative overflow-hidden bg-stone-100 ${containerClassName}`}
      style={style}
    >
      {/* Background skeleton: only show if not loaded and not priority */}
      {!isLoaded && !priority && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-stone-200/70 via-stone-100 to-stone-200/70 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] pointer-events-none z-0"
          aria-hidden="true"
        />
      )}

      {/* Actual image */}
      <img
        ref={handleRef}
        src={optimizedUrl}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!hasError) {
            setHasError(true);
          } else {
            setIsLoaded(true);
          }
        }}
        className={`w-full h-full transition-opacity duration-200 ease-out ${
          isLoaded || priority ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        style={imgStyle}
        {...props}
      />
    </div>
  );
}
