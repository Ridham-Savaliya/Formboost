// Performance monitoring and optimization utilities

// Core Web Vitals monitoring
export const measureCoreWebVitals = () => {
  const vitals = {
    FCP: null, // First Contentful Paint
    LCP: null, // Largest Contentful Paint
    FID: null, // First Input Delay
    CLS: null, // Cumulative Layout Shift
    TTFB: null // Time to First Byte
  };

  // Measure FCP
  const fcpObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
    if (fcpEntry) {
      vitals.FCP = fcpEntry.startTime;
      console.log('FCP:', vitals.FCP);
    }
  });
  fcpObserver.observe({ entryTypes: ['paint'] });

  // Measure LCP
  const lcpObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    vitals.LCP = lastEntry.startTime;
    console.log('LCP:', vitals.LCP);
  });
  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

  // Measure FID
  const fidObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach(entry => {
      vitals.FID = entry.processingStart - entry.startTime;
      console.log('FID:', vitals.FID);
    });
  });
  fidObserver.observe({ entryTypes: ['first-input'] });

  // Measure CLS
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach(entry => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    });
    vitals.CLS = clsValue;
    console.log('CLS:', vitals.CLS);
  });
  clsObserver.observe({ entryTypes: ['layout-shift'] });

  // Measure TTFB
  const navigationEntry = performance.getEntriesByType('navigation')[0];
  if (navigationEntry) {
    vitals.TTFB = navigationEntry.responseStart - navigationEntry.requestStart;
    console.log('TTFB:', vitals.TTFB);
  }

  return vitals;
};

// Bundle size analyzer
export const analyzeBundleSize = () => {
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  const bundleInfo = {
    scripts: [],
    styles: [],
    totalSize: 0
  };

  scripts.forEach(script => {
    if (script.src) {
      bundleInfo.scripts.push({
        src: script.src,
        async: script.async,
        defer: script.defer
      });
    }
  });

  styles.forEach(style => {
    if (style.href) {
      bundleInfo.styles.push({
        href: style.href,
        media: style.media
      });
    }
  });

  console.log('Bundle Analysis:', bundleInfo);
  return bundleInfo;
};

// Performance optimization recommendations
export const getPerformanceRecommendations = (vitals) => {
  const recommendations = [];

  if (vitals.FCP > 1800) {
    recommendations.push({
      metric: 'FCP',
      issue: 'First Contentful Paint is slow',
      solutions: [
        'Optimize critical rendering path',
        'Reduce server response time',
        'Eliminate render-blocking resources',
        'Minify CSS and JavaScript'
      ]
    });
  }

  if (vitals.LCP > 2500) {
    recommendations.push({
      metric: 'LCP',
      issue: 'Largest Contentful Paint is slow',
      solutions: [
        'Optimize images and use modern formats (WebP, AVIF)',
        'Preload important resources',
        'Reduce server response times',
        'Use CDN for static assets'
      ]
    });
  }

  if (vitals.FID > 100) {
    recommendations.push({
      metric: 'FID',
      issue: 'First Input Delay is high',
      solutions: [
        'Reduce JavaScript execution time',
        'Break up long tasks',
        'Use web workers for heavy computations',
        'Remove unused JavaScript'
      ]
    });
  }

  if (vitals.CLS > 0.1) {
    recommendations.push({
      metric: 'CLS',
      issue: 'Cumulative Layout Shift is high',
      solutions: [
        'Include size attributes on images and videos',
        'Reserve space for ads and embeds',
        'Avoid inserting content above existing content',
        'Use transform animations instead of layout-triggering properties'
      ]
    });
  }

  return recommendations;
};

// Resource loading optimization
export const optimizeResourceLoading = () => {
  // Preload critical resources
  const criticalResources = [
    { href: '/src/main.jsx', as: 'script' },
    { href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap', as: 'style' }
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    document.head.appendChild(link);
  });

  // Prefetch next page resources
  const prefetchResources = [
    '/signup',
    '/login',
    '/dashboard'
  ];

  prefetchResources.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  });
};

// Image optimization checker
export const checkImageOptimization = () => {
  const images = Array.from(document.querySelectorAll('img'));
  const issues = [];

  images.forEach((img, index) => {
    // Check for missing alt text
    if (!img.alt) {
      issues.push({
        element: `Image ${index + 1}`,
        issue: 'Missing alt attribute',
        impact: 'SEO and accessibility'
      });
    }

    // Check for large images
    if (img.naturalWidth > 1920 || img.naturalHeight > 1080) {
      issues.push({
        element: `Image ${index + 1}`,
        issue: 'Image resolution too high',
        impact: 'Performance',
        recommendation: 'Resize to appropriate dimensions'
      });
    }

    // Check for lazy loading
    if (!img.loading || img.loading !== 'lazy') {
      issues.push({
        element: `Image ${index + 1}`,
        issue: 'Not using lazy loading',
        impact: 'Performance',
        recommendation: 'Add loading="lazy" attribute'
      });
    }

    // Check for modern formats
    if (img.src && !img.src.includes('.webp') && !img.src.includes('.avif')) {
      issues.push({
        element: `Image ${index + 1}`,
        issue: 'Not using modern image format',
        impact: 'Performance',
        recommendation: 'Convert to WebP or AVIF'
      });
    }
  });

  return issues;
};

// Main performance audit function
export const runPerformanceAudit = () => {
  console.log('🚀 Running FormBoost Performance Audit...');
  
  const vitals = measureCoreWebVitals();
  const bundleInfo = analyzeBundleSize();
  const imageIssues = checkImageOptimization();
  const recommendations = getPerformanceRecommendations(vitals);

  const audit = {
    timestamp: new Date().toISOString(),
    vitals,
    bundleInfo,
    imageIssues,
    recommendations,
    score: calculatePerformanceScore(vitals)
  };

  console.log('📊 Performance Audit Complete:', audit);
  return audit;
};

// Calculate performance score (0-100)
const calculatePerformanceScore = (vitals) => {
  let score = 100;
  
  // FCP scoring
  if (vitals.FCP > 3000) score -= 25;
  else if (vitals.FCP > 1800) score -= 15;
  else if (vitals.FCP > 1000) score -= 5;

  // LCP scoring
  if (vitals.LCP > 4000) score -= 25;
  else if (vitals.LCP > 2500) score -= 15;
  else if (vitals.LCP > 1500) score -= 5;

  // FID scoring
  if (vitals.FID > 300) score -= 25;
  else if (vitals.FID > 100) score -= 15;
  else if (vitals.FID > 50) score -= 5;

  // CLS scoring
  if (vitals.CLS > 0.25) score -= 25;
  else if (vitals.CLS > 0.1) score -= 15;
  else if (vitals.CLS > 0.05) score -= 5;

  return Math.max(0, score);
};

export default {
  measureCoreWebVitals,
  analyzeBundleSize,
  getPerformanceRecommendations,
  optimizeResourceLoading,
  checkImageOptimization,
  runPerformanceAudit
};
