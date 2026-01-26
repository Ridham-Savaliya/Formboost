// Structured Data for Formboom - Rich Snippets and SEO

export const getOrganizationStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Formboom",
  "alternateName": "Formboom - Form Builder",
  "url": "https://formboom.site",
  "logo": "https://formboom.site/og-image.png",
  "description": "Create stunning forms, collect valuable leads, and automate your entire workflow—all without writing a single line of code.",
  "foundingDate": "2026",
  "founder": {
    "@type": "Person",
    "name": "Ridham Savaliya",
    "jobTitle": "Full Stack Developer"
  },
  "sameAs": [
    "https://github.com/Ridham-Savaliya",
    "https://www.linkedin.com/in/ridham-savaliya-8984a1241",
    "https://x.com/"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "url": "https://formboom.site"
  }
});

export const getWebsiteStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Formboom",
  "url": "https://formboom.site",
  "description": "Build forms that convert like crazy. Create stunning forms, collect valuable leads, and automate your entire workflow—all without writing a single line of code.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://formboom.site/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Formboom"
  }
});

export const getSoftwareApplicationStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Formboom",
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "Form Builder",
  "operatingSystem": "Web Browser",
  "url": "https://formboom.site",
  "description": "Create stunning forms, collect valuable leads, and automate your entire workflow—all without writing a single line of code. Join 10,000+ teams already boosting their conversions.",
  "offers": [
    {
      "@type": "Offer",
      "name": "Free Plan",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Up to 5 forms, 100 submissions/month, basic form builder",
      "availability": "https://schema.org/InStock"
    },
    {
      "@type": "Offer",
      "name": "Pro Plan",
      "price": "19",
      "priceCurrency": "USD",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "19",
        "priceCurrency": "USD",
        "billingPeriod": "P1M"
      },
      "description": "Unlimited forms, 10,000 submissions/month, advanced features",
      "availability": "https://schema.org/PreOrder"
    },
    {
      "@type": "Offer",
      "name": "Enterprise Plan",
      "price": "99",
      "priceCurrency": "USD",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "99",
        "priceCurrency": "USD",
        "billingPeriod": "P1M"
      },
      "description": "Everything in Pro, unlimited submissions, white-label solution",
      "availability": "https://schema.org/PreOrder"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "150",
    "bestRating": "5",
    "worstRating": "1"
  },
  "author": {
    "@type": "Person",
    "name": "Ridham Savaliya",
    "jobTitle": "Full Stack Developer"
  },
  "creator": {
    "@type": "Organization",
    "name": "Formboom"
  },
  "featureList": [
    "Drag & Drop Form Builder",
    "Real-time Analytics",
    "Smart Integrations",
    "Enterprise Security",
    "Smart Automation",
    "Global Performance",
    "GDPR Compliance",
    "Webhook Integrations",
    "Custom Branding",
    "API Access"
  ]
});

export const getProductStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Formboom Form Builder",
  "description": "Create stunning forms, collect valuable leads, and automate your entire workflow—all without writing a single line of code.",
  "brand": {
    "@type": "Brand",
    "name": "Formboom"
  },
  "category": "Software > Business Software > Form Builder",
  "url": "https://formboom.site",
  "image": "https://formboom.site/og-image.png",
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "0",
    "highPrice": "99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://formboom.site/pricing"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "150",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Ridham Savaliya"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "From idea to live form in 5 minutes. The analytics insights are game-changing."
    },
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Shashank Das"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "Formboom helped us increase lead conversion by 40%. The integrations are seamless!"
    },
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Arya Shah"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "Best form builder i've used til now. Clean design, powerful features, amazing support."
    }
  ]
});

export const getFAQStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Formboom?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Formboom is a powerful form builder that allows you to create stunning forms, collect valuable leads, and automate your entire workflow—all without writing a single line of code."
      }
    },
    {
      "@type": "Question",
      "name": "Is Formboom free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Formboom offers a generous free plan that includes up to 5 forms, 100 submissions per month, basic form builder, email notifications, and more."
      }
    },
    {
      "@type": "Question",
      "name": "What integrations does Formboom support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Formboom integrates with Slack, Google Sheets, Zapier, and 50+ other tools to automate your workflow and streamline your data collection process."
      }
    },
    {
      "@type": "Question",
      "name": "Is Formboom GDPR compliant?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Formboom is fully GDPR compliant with advanced spam protection and role-based access controls to ensure your data is secure and compliant."
      }
    },
    {
      "@type": "Question",
      "name": "How fast can I create a form with Formboom?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "With Formboom's intuitive drag-and-drop builder, you can create a professional form in just 2 minutes. Setup is quick and requires no technical knowledge."
      }
    }
  ]
});

export const getBreadcrumbStructuredData = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const getHowToStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Create a Form with Formboom",
  "description": "Learn how to create a professional form in minutes using Formboom's drag-and-drop builder",
  "image": "https://formboom.site/how-to-create-form.png",
  "totalTime": "PT2M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "supply": [
    {
      "@type": "HowToSupply",
      "name": "Formboom Account"
    },
    {
      "@type": "HowToSupply",
      "name": "Web Browser"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "name": "Sign Up",
      "text": "Create your free Formboom account in seconds",
      "url": "https://formboom.site/signup"
    },
    {
      "@type": "HowToStep",
      "name": "Choose Template",
      "text": "Select from our library of pre-made templates or start from scratch",
      "url": "https://formboom.site/dashboard"
    },
    {
      "@type": "HowToStep",
      "name": "Customize Form",
      "text": "Use our drag-and-drop builder to customize your form fields, design, and logic",
      "url": "https://formboom.site/dashboard"
    },
    {
      "@type": "HowToStep",
      "name": "Publish & Share",
      "text": "Publish your form and share it via link, embed code, or integrate with your website",
      "url": "https://formboom.site/dashboard"
    }
  ]
});
