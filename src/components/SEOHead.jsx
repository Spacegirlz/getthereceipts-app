import React from 'react';
import { Helmet } from 'react-helmet';

const SEOHead = ({ 
  title = "Get The Receipts - Decode Any Text Message Instantly",
  description = "Decode confusing text messages instantly with AI. Get expert dating advice, spot red flags, and understand what they really mean. Free analysis + premium insights.",
  keywords = "text message decoder, what does his text mean, dating advice AI, decode text messages, relationship red flags, mixed signals, breadcrumbing, dating coach, text analysis, get the receipts",
  canonical = "https://www.getthereceipts.com",
  ogImage = "https://www.getthereceipts.com/og-image.png",
  ogType = "website",
  jsonLd = null,
  noIndex = false
}) => {
  const defaultJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": canonical,
    "publisher": {
      "@type": "Organization",
      "name": "Get The Receipts",
      "url": "https://www.getthereceipts.com"
    },
    "mainEntity": {
      "@type": "WebApplication",
      "name": "Get The Receipts",
      "description": "AI-powered text message decoder for modern dating",
      "url": "https://www.getthereceipts.com",
      "applicationCategory": "LifestyleApplication",
      "operatingSystem": "Any"
    }
  };

  const schemaData = jsonLd || defaultJsonLd;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />
      
      {/* Robots */}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="Get The Receipts" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Additional Meta */}
      <meta name="author" content="Get The Receipts" />
      <meta name="language" content="English" />
      <meta name="distribution" content="global" />
      <meta name="target" content="all" />
      <meta name="coverage" content="Worldwide" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default SEOHead;