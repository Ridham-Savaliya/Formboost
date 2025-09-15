// CSS optimization utilities for better performance

// Critical CSS classes that should always be included
export const criticalCSS = [
  // Layout essentials
  'flex', 'grid', 'block', 'inline-block', 'hidden',
  'relative', 'absolute', 'fixed', 'sticky',
  
  // Spacing (most commonly used)
  'p-4', 'p-6', 'p-8', 'm-4', 'm-6', 'm-8',
  'px-4', 'px-6', 'px-8', 'py-4', 'py-6', 'py-8',
  'mx-auto', 'space-x-2', 'space-x-4', 'space-y-4', 'space-y-6',
  
  // Typography
  'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl',
  'font-medium', 'font-semibold', 'font-bold',
  'text-gray-600', 'text-gray-700', 'text-gray-900', 'text-white',
  'text-blue-500', 'text-blue-600', 'text-red-500',
  
  // Backgrounds
  'bg-white', 'bg-gray-50', 'bg-gray-100', 'bg-blue-500', 'bg-blue-600',
  'bg-gradient-to-br', 'from-blue-500', 'to-blue-600',
  
  // Borders & Rounded
  'border', 'border-gray-200', 'border-gray-300',
  'rounded', 'rounded-lg', 'rounded-xl', 'rounded-full',
  
  // Interactive states
  'hover:bg-gray-100', 'hover:text-blue-600', 'hover:shadow-lg',
  'transition-all', 'transition-colors', 'duration-200',
  
  // Responsive
  'sm:px-6', 'md:hidden', 'lg:px-8', 'xl:col-span-1'
];

// Function to extract used CSS classes from components
export const extractUsedClasses = (componentContent) => {
  const classRegex = /className=["']([^"']+)["']/g;
  const usedClasses = new Set();
  
  let match;
  while ((match = classRegex.exec(componentContent)) !== null) {
    const classes = match[1].split(/\s+/);
    classes.forEach(cls => {
      if (cls.trim()) {
        usedClasses.add(cls.trim());
      }
    });
  }
  
  return Array.from(usedClasses);
};

// CSS minification helper
export const minifyCSS = (css) => {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/;\s*}/g, '}') // Remove last semicolon in blocks
    .replace(/\s*{\s*/g, '{') // Clean up braces
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*;\s*/g, ';') // Clean up semicolons
    .replace(/\s*,\s*/g, ',') // Clean up commas
    .trim();
};

// Performance optimization recommendations
export const performanceOptimizations = {
  // Defer non-critical CSS
  deferNonCriticalCSS: () => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.onload = function() {
      this.onload = null;
      this.rel = 'stylesheet';
    };
    return link;
  },
  
  // Preload critical resources
  preloadCriticalResources: (resources) => {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      document.head.appendChild(link);
    });
  },
  
  // Remove unused CSS at runtime (for development)
  removeUnusedCSS: (usedClasses) => {
    const styleSheets = Array.from(document.styleSheets);
    
    styleSheets.forEach(sheet => {
      try {
        const rules = Array.from(sheet.cssRules || sheet.rules);
        rules.forEach((rule, index) => {
          if (rule.type === CSSRule.STYLE_RULE) {
            const selector = rule.selectorText;
            const isUsed = usedClasses.some(cls => 
              selector.includes(`.${cls}`) || 
              criticalCSS.includes(cls)
            );
            
            if (!isUsed) {
              sheet.deleteRule(index);
            }
          }
        });
      } catch (e) {
        // Cross-origin stylesheets can't be accessed
        console.warn('Cannot access stylesheet:', sheet.href);
      }
    });
  }
};

export default {
  criticalCSS,
  extractUsedClasses,
  minifyCSS,
  performanceOptimizations
};
