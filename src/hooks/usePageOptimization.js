import { useEffect, useState } from 'react';
import { analytics, trackPageView } from '@/utils/analytics';

export const usePageOptimization = (pageTitle, pageDescription) => {
  const [isLoading, setIsLoading] = useState(true);
  const [performanceMetrics, setPerformanceMetrics] = useState({});

  useEffect(() => {
    const startTime = performance.now();

    // Track page view
    trackPageView(window.location.pathname, pageTitle);

    // Optimize images loading
    const images = document.querySelectorAll('img');
    let loadedImages = 0;

    const checkImagesLoaded = () => {
      loadedImages++;
      if (loadedImages === images.length) {
        const loadTime = performance.now() - startTime;
        setPerformanceMetrics(prev => ({
          ...prev,
          imageLoadTime: loadTime
        }));
      }
    };

    images.forEach(img => {
      if (img.complete) {
        checkImagesLoaded();
      } else {
        img.addEventListener('load', checkImagesLoaded);
        img.addEventListener('error', checkImagesLoaded);
      }
    });

    // Preload critical resources
    const criticalResources = [
      '/sage-purple-swirl-circle.png',
      '/sage-landing.png',
      '/sage-dark-circle.png'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = 'image';
      document.head.appendChild(link);
    });

    // Set up intersection observer for lazy loading
    const observerOptions = {
      rootMargin: '50px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          // Lazy load images
          if (element.dataset.src) {
            element.src = element.dataset.src;
            element.removeAttribute('data-src');
            observer.unobserve(element);
          }
          
          // Track element visibility for analytics
          analytics.trackSEOEvent('element_viewed', {
            element_type: element.tagName.toLowerCase(),
            element_class: element.className,
            element_id: element.id
          });
        }
      });
    }, observerOptions);

    // Observe lazy-loadable elements
    document.querySelectorAll('[data-src]').forEach(element => {
      observer.observe(element);
    });

    // Performance monitoring
    const performanceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const metrics = {};

      entries.forEach(entry => {
        switch (entry.entryType) {
          case 'navigation':
            metrics.domContentLoaded = entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
            metrics.loadComplete = entry.loadEventEnd - entry.loadEventStart;
            break;
          case 'paint':
            if (entry.name === 'first-paint') {
              metrics.firstPaint = entry.startTime;
            } else if (entry.name === 'first-contentful-paint') {
              metrics.firstContentfulPaint = entry.startTime;
            }
            break;
        }
      });

      setPerformanceMetrics(prev => ({ ...prev, ...metrics }));
    });

    performanceObserver.observe({ entryTypes: ['navigation', 'paint'] });

    // Mark as loaded after initial render
    setTimeout(() => {
      setIsLoading(false);
      const totalLoadTime = performance.now() - startTime;
      
      analytics.trackEvent('page_performance', {
        page_path: window.location.pathname,
        load_time: Math.round(totalLoadTime),
        page_title: pageTitle
      });
    }, 100);

    // Cleanup
    return () => {
      observer.disconnect();
      performanceObserver.disconnect();
      
      // Track engagement time when leaving page
      analytics.trackEngagementTime();
    };
  }, [pageTitle]);

  return {
    isLoading,
    performanceMetrics
  };
};

// Hook for optimizing images
export const useImageOptimization = () => {
  const optimizeImage = (src, options = {}) => {
    const {
      width,
      height,
      quality = 80,
      format = 'webp'
    } = options;

    // For production, you might use a service like Cloudinary or ImageKit
    // For now, return the original src with lazy loading attributes
    return {
      src: src,
      'data-src': src,
      loading: 'lazy',
      decoding: 'async',
      ...(width && { width }),
      ...(height && { height })
    };
  };

  return { optimizeImage };
};

// Hook for Core Web Vitals optimization
export const useCoreWebVitals = () => {
  const [vitals, setVitals] = useState({});

  useEffect(() => {
    // Track Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        switch (entry.entryType) {
          case 'largest-contentful-paint':
            setVitals(prev => ({
              ...prev,
              lcp: Math.round(entry.startTime)
            }));
            break;
          case 'first-input':
            setVitals(prev => ({
              ...prev,
              fid: Math.round(entry.processingStart - entry.startTime)
            }));
            break;
          case 'layout-shift':
            if (!entry.hadRecentInput) {
              setVitals(prev => ({
                ...prev,
                cls: (prev.cls || 0) + entry.value
              }));
            }
            break;
        }
      });
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

    return () => observer.disconnect();
  }, []);

  const getVitalScore = (metric, value) => {
    const thresholds = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 }
    };

    if (!thresholds[metric] || value === undefined) return 'unknown';
    
    if (value <= thresholds[metric].good) return 'good';
    if (value <= thresholds[metric].poor) return 'needs-improvement';
    return 'poor';
  };

  return {
    vitals,
    scores: {
      lcp: getVitalScore('lcp', vitals.lcp),
      fid: getVitalScore('fid', vitals.fid),
      cls: getVitalScore('cls', vitals.cls)
    }
  };
};