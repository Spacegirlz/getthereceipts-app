// Analytics and SEO tracking utilities
export class AnalyticsTracker {
  constructor() {
    this.isProduction = import.meta.env.PROD;
    this.userId = null;
    this.sessionId = this.generateSessionId();
    this.pageViewStartTime = Date.now();
  }

  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Initialize analytics services
  init() {
    if (!this.isProduction) {
      console.log('Analytics disabled in development mode');
      return;
    }

    // Only initialize services if environment variables are properly configured
    // This prevents host validation failures from unconfigured services
    try {
      // Google Analytics 4
      if (import.meta.env.VITE_GA4_MEASUREMENT_ID && this.isValidDomain()) {
        this.initGA4();
      }
      
      // Microsoft Clarity
      if (import.meta.env.VITE_CLARITY_ID && this.isValidDomain()) {
        this.initClarity();
      }
      
      // Facebook Pixel
      if (import.meta.env.VITE_FB_PIXEL_ID && this.isValidDomain()) {
        this.initFacebookPixel();
      }
    } catch (error) {
      console.warn('Analytics initialization failed:', error);
    }
  }

  // Check if current domain is valid for analytics and if services are properly configured
  isValidDomain() {
    const hostname = window.location.hostname;
    const isValidHost = hostname === 'localhost' || 
           hostname === '127.0.0.1' ||
           hostname.includes('getthereceipts.com') ||
           hostname.includes('vercel.app');
           
    // Also check if we have proper environment variables configured
    const hasGA4 = !!import.meta.env.VITE_GA4_MEASUREMENT_ID;
    const hasClarity = !!import.meta.env.VITE_CLARITY_ID;
    const hasFBPixel = !!import.meta.env.VITE_FB_PIXEL_ID;
    
    // Only initialize if we have at least one service properly configured
    return isValidHost && (hasGA4 || hasClarity || hasFBPixel);
  }

  initGA4() {
    try {
      const GA_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;
      if (!GA_MEASUREMENT_ID) return;

      // Load GA4
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script1.onerror = () => console.warn('Failed to load Google Analytics');
      document.head.appendChild(script1);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href
      });
    } catch (error) {
      console.warn('Google Analytics initialization failed:', error);
    }
  }

  initClarity() {
    try {
      const CLARITY_ID = import.meta.env.VITE_CLARITY_ID;
      if (!CLARITY_ID) return;

      const script = document.createElement('script');
      script.innerHTML = `
        (function(c,l,a,r,i,t,y){
          try {
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            t.onerror=function(){console.warn('Failed to load Microsoft Clarity')};
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          } catch(e) {
            console.warn('Microsoft Clarity initialization failed:', e);
          }
        })(window, document, "clarity", "script", "${CLARITY_ID}");
      `;
      document.head.appendChild(script);
    } catch (error) {
      console.warn('Microsoft Clarity setup failed:', error);
    }
  }

  initFacebookPixel() {
    try {
      const FB_PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID;
      if (!FB_PIXEL_ID) return;

      const script = document.createElement('script');
      script.innerHTML = `
        try {
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;t.onerror=function(){console.warn('Failed to load Facebook Pixel')};
          s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${FB_PIXEL_ID}');
          fbq('track', 'PageView');
        } catch(e) {
          console.warn('Facebook Pixel initialization failed:', e);
        }
      `;
      document.head.appendChild(script);
    } catch (error) {
      console.warn('Facebook Pixel setup failed:', error);
    }
  }

  // Track page views
  trackPageView(path, title) {
    if (window.gtag) {
      window.gtag('config', import.meta.env.VITE_GA4_MEASUREMENT_ID, {
        page_path: path,
        page_title: title
      });
    }

    // Track core web vitals
    this.trackCoreWebVitals();

    if (!this.isProduction) {
      console.log('Page view tracked:', { path, title });
    }
  }

  // Track user interactions
  trackEvent(eventName, parameters = {}) {
    const eventData = {
      event_name: eventName,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      ...parameters
    };

    if (window.gtag) {
      window.gtag('event', eventName, parameters);
    }

    if (window.fbq) {
      window.fbq('track', eventName, parameters);
    }

    if (!this.isProduction) {
      console.log('Event tracked:', eventData);
    }
  }

  // SEO-specific tracking
  trackSEOEvent(action, details = {}) {
    this.trackEvent('seo_interaction', {
      seo_action: action,
      page_path: window.location.pathname,
      referrer: document.referrer,
      ...details
    });
  }

  // Track receipt generation for conversion
  trackReceiptGenerated(result) {
    this.trackEvent('receipt_generated', {
      archetype: result.archetype,
      red_flags: result.redFlags,
      user_type: result.isPremium ? 'premium' : 'free',
      currency: 'USD',
      value: result.isPremium ? 6.99 : 0
    });

    // Track conversion for FB/Google Ads
    if (window.fbq) {
      window.fbq('track', 'Lead');
    }
  }

  // Track subscription conversions
  trackSubscription(planName, price) {
    this.trackEvent('purchase', {
      transaction_id: this.generateSessionId(),
      currency: 'USD',
      value: price,
      item_name: planName,
      item_category: 'subscription'
    });

    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        value: price,
        currency: 'USD'
      });
    }
  }

  // Track Core Web Vitals for SEO
  trackCoreWebVitals() {
    if ('web-vital' in window) return;

    // Mark as loaded to prevent duplicate tracking
    window['web-vital'] = true;

    // Track performance metrics
    if (window.PerformanceObserver) {
      // Largest Contentful Paint (LCP)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.trackEvent('web_vital', {
          metric_name: 'LCP',
          metric_value: Math.round(lastEntry.startTime),
          page_path: window.location.pathname
        });
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      // First Input Delay (FID)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.trackEvent('web_vital', {
            metric_name: 'FID',
            metric_value: Math.round(entry.processingStart - entry.startTime),
            page_path: window.location.pathname
          });
        });
      }).observe({ type: 'first-input', buffered: true });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.trackEvent('web_vital', {
          metric_name: 'CLS',
          metric_value: Math.round(clsValue * 1000) / 1000,
          page_path: window.location.pathname
        });
      }).observe({ type: 'layout-shift', buffered: true });
    }
  }

  // Track search rankings (for internal monitoring)
  trackSearchRanking(keyword, position, searchEngine = 'google') {
    this.trackEvent('search_ranking', {
      keyword,
      position,
      search_engine: searchEngine,
      page_path: window.location.pathname
    });
  }

  // Set user properties
  setUserId(userId) {
    this.userId = userId;
    if (window.gtag) {
      window.gtag('config', import.meta.env.VITE_GA4_MEASUREMENT_ID, {
        user_id: userId
      });
    }
  }

  // Track user engagement time
  trackEngagementTime() {
    const engagementTime = Date.now() - this.pageViewStartTime;
    this.trackEvent('engagement_time', {
      engagement_time_msec: engagementTime,
      page_path: window.location.pathname
    });
  }
}

// Global analytics instance
export const analytics = new AnalyticsTracker();

// Convenience functions
export const trackEvent = (eventName, parameters) => analytics.trackEvent(eventName, parameters);
export const trackPageView = (path, title) => analytics.trackPageView(path, title);
export const trackSEOEvent = (action, details) => analytics.trackSEOEvent(action, details);
export const trackReceiptGenerated = (result) => analytics.trackReceiptGenerated(result);
export const trackSubscription = (planName, price) => analytics.trackSubscription(planName, price);

// Initialize on import
if (typeof window !== 'undefined') {
  analytics.init();
}