import { useState, useRef, useEffect } from 'react';

// Optimized image component with lazy loading, WebP support, and responsive sizing
const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  sizes = '100vw',
  priority = false,
  quality = 75,
  placeholder = 'blur',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [imageSrc, setImageSrc] = useState(priority ? src : '');
  const imgRef = useRef(null);

  // Generate WebP and fallback sources
  const getOptimizedSrc = (originalSrc, format = 'webp') => {
    if (!originalSrc) return '';
    
    // If it's already a WebP or optimized format, return as is
    if (originalSrc.includes('.webp') || originalSrc.includes('.avif')) {
      return originalSrc;
    }
    
    // For local images, we'll assume they can be converted to WebP
    // In a real implementation, you'd have a build process to generate these
    const extension = originalSrc.split('.').pop();
    return originalSrc.replace(`.${extension}`, `.webp`);
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setImageSrc(src);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.1
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [src, priority]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Handle image error (fallback to original format)
  const handleError = () => {
    if (imageSrc.includes('.webp')) {
      setImageSrc(src); // Fallback to original format
    }
  };

  // Generate responsive srcSet for different screen sizes
  const generateSrcSet = (baseSrc) => {
    if (!baseSrc) return '';
    
    const sizes = [480, 768, 1024, 1280, 1920];
    return sizes
      .map(size => `${baseSrc}?w=${size}&q=${quality} ${size}w`)
      .join(', ');
  };

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder/Loading state */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}

      {/* Optimized Image */}
      {isInView && (
        <picture>
          {/* WebP source for modern browsers */}
          <source
            srcSet={generateSrcSet(getOptimizedSrc(src, 'webp'))}
            sizes={sizes}
            type="image/webp"
          />
          
          {/* AVIF source for even better compression (future) */}
          <source
            srcSet={generateSrcSet(getOptimizedSrc(src, 'avif'))}
            sizes={sizes}
            type="image/avif"
          />
          
          {/* Fallback to original format */}
          <img
            src={imageSrc}
            srcSet={generateSrcSet(src)}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
            {...props}
          />
        </picture>
      )}
    </div>
  );
};

export default OptimizedImage;
