import React, { useState, useEffect } from 'react';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=70';

/**
 * Reusable progressive image component with:
 * - Dynamic Unsplash size/quality optimization (drastically cuts payload)
 * - Shimmer skeleton placeholder to prevent layout shifts
 * - Smooth fade-in transition once loaded
 * - Priority hints (fetchPriority="high" & loading="eager" for LCP)
 * - Graceful error fallback
 */
export default function OptimizedImage({
  src,
  alt = '',
  className = '',
  containerClassName = '',
  width = 400,
  height = null,
  quality = 70,
  priority = false,
  fallbackSrc = DEFAULT_FALLBACK,
  style = {},
  imgStyle = {},
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Compute optimized URL
  const optimizedUrl = getOptimizedImageUrl(hasError ? fallbackSrc : src, {
    width,
    height,
    quality,
  });

  // Reset loading status if src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden ${containerClassName}`}
      style={style}
    >
      {/* Shimmer skeleton placeholder displayed while loading */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] pointer-events-none z-0"
          aria-hidden="true"
        />
      )}

      {/* Actual optimized image */}
      <img
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
        className={`w-full h-full transition-opacity duration-300 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        style={imgStyle}
        {...props}
      />
    </div>
  );
}
