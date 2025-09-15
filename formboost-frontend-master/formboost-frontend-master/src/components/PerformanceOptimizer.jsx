import { useEffect } from 'react';

const PerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload Google Fonts
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap';
      fontLink.as = 'style';
      fontLink.onload = function() { this.rel = 'stylesheet'; };
      document.head.appendChild(fontLink);

      // Preload critical images
      const criticalImages = [
        'https://formboom.site/og-image.png',
        'https://res.cloudinary.com/dsqpc6sp6/image/upload/v1757609151/yellow_black_bg_snaqd7.jpg',
        'https://res.cloudinary.com/dsqpc6sp6/image/upload/v1757609752/WhatsApp_Image_2025-09-11_at_22.25.02_3871f916_jzseqo.jpg',
        'https://res.cloudinary.com/dsqpc6sp6/image/upload/v1757918282/Screenshot_2025-09-15_120750_mvbvsc.png'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'image';
        document.head.appendChild(link);
      });
    };

    // Optimize images with lazy loading
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[loading="lazy"]');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src || img.src;
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          });
        });

        images.forEach(img => imageObserver.observe(img));
      }
    };

    // Optimize Core Web Vitals
    const optimizeCoreWebVitals = () => {
      // Reduce layout shift by setting image dimensions
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.width || !img.height) {
          img.style.aspectRatio = '1';
        }
      });

      // Optimize First Input Delay
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          // Defer non-critical JavaScript
          const scripts = document.querySelectorAll('script[data-defer]');
          scripts.forEach(script => {
            const newScript = document.createElement('script');
            newScript.src = script.src;
            newScript.async = true;
            document.head.appendChild(newScript);
          });
        });
      }
    };

    // Service Worker for caching (if supported)
    const registerServiceWorker = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      }
    };

    // DNS prefetch for external domains
    const prefetchDNS = () => {
      const domains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://res.cloudinary.com',
        'https://api.formboom.site'
      ];

      domains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      });
    };

    // Execute optimizations
    preloadCriticalResources();
    optimizeImages();
    optimizeCoreWebVitals();
    prefetchDNS();
    
    // Register service worker after page load
    window.addEventListener('load', registerServiceWorker);

    // Cleanup
    return () => {
      window.removeEventListener('load', registerServiceWorker);
    };
  }, []);

  return null;
};

export default PerformanceOptimizer;
