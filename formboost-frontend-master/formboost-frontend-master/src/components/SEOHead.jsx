import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEOHead = ({ 
  title = "FormBoost — Build forms that convert like crazy", 
  description = "Create stunning forms, collect valuable leads, and automate your entire workflow—all without writing a single line of code. Join 10,000+ teams already boosting their conversions.",
  keywords = "form builder, online forms, lead generation, form automation, no-code forms, contact forms, survey builder, form analytics, workflow automation, form integrations",
  image = "https://formboom.site/og-image.png",
  type = "website",
  author = "FormBoost",
  structuredData = null
}) => {
  const location = useLocation();
  const currentUrl = `https://formboom.site${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', keywords);
    updateMetaTag('name', 'author', author);
    updateMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // Open Graph tags
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:image', image);
    updateMetaTag('property', 'og:url', currentUrl);
    updateMetaTag('property', 'og:type', type);
    updateMetaTag('property', 'og:site_name', 'FormBoost');
    updateMetaTag('property', 'og:locale', 'en_US');

    // Twitter Card tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', image);
    updateMetaTag('name', 'twitter:site', '@FormBoost');
    updateMetaTag('name', 'twitter:creator', '@FormBoost');

    // Additional SEO tags
    updateMetaTag('name', 'theme-color', '#0080FF');
    updateMetaTag('name', 'msapplication-TileColor', '#0080FF');
    updateMetaTag('name', 'apple-mobile-web-app-capable', 'yes');
    updateMetaTag('name', 'apple-mobile-web-app-status-bar-style', 'default');

    // Canonical URL
    updateCanonicalLink(currentUrl);

    // Structured Data
    if (structuredData) {
      updateStructuredData(structuredData);
    }

    // Language and region
    updateMetaTag('name', 'language', 'English');
    updateMetaTag('name', 'geo.region', 'US');
    updateMetaTag('name', 'geo.placename', 'United States');

  }, [title, description, keywords, image, type, author, currentUrl, structuredData]);

  const updateMetaTag = (attribute, attributeValue, content) => {
    let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, attributeValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  const updateCanonicalLink = (url) => {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  };

  const updateStructuredData = (data) => {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  };

  return null;
};

export default SEOHead;
