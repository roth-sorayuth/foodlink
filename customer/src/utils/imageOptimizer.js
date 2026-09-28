/**
 * Utility for optimizing image URLs, especially Unsplash CDN images,
 * by requesting modern formats (WebP/AVIF), exact dimensions, and balanced compression.
 */

export function getOptimizedImageUrl(url, options = {}) {
  if (!url || typeof url !== 'string') {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=360&q=60';
  }

  // Handle local public assets or data URLs directly
  if (url.startsWith('/') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  // Optimize Unsplash images via their dynamic URL API
  if (url.includes('images.unsplash.com')) {
    try {
      const parsedUrl = new URL(url);
      const {
        width = 360,
        height = null,
        quality = 60,
        fit = 'crop',
        format = 'auto',
      } = options;

      parsedUrl.searchParams.set('auto', format);
      parsedUrl.searchParams.set('q', String(quality));
      parsedUrl.searchParams.set('w', String(width));

      if (height) {
        parsedUrl.searchParams.set('h', String(height));
        parsedUrl.searchParams.set('fit', fit);
      } else if (!parsedUrl.searchParams.has('fit')) {
        parsedUrl.searchParams.set('fit', fit);
      }

      return parsedUrl.toString();
    } catch {
      return url;
    }
  }

  return url;
}

/**
 * Returns a tiny low-quality placeholder URL for progressive blur-up loading
 */
export function getBlurPlaceholderUrl(url) {
  if (!url || typeof url !== 'string' || !url.includes('images.unsplash.com')) {
    return null;
  }
  try {
    const parsedUrl = new URL(url);
    parsedUrl.searchParams.set('auto', 'format');
    parsedUrl.searchParams.set('w', '20');
    parsedUrl.searchParams.set('q', '20');
    parsedUrl.searchParams.set('blur', '10');
    return parsedUrl.toString();
  } catch {
    return null;
  }
}
