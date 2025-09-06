import React, { useState, useEffect } from 'react';

const GeoDetector = ({ children }) => {
  const [geoData, setGeoData] = useState({
    country: 'US',
    currency: 'USD',
    timezone: 'America/New_York',
    language: 'en'
  });
  
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    detectGeoLocation();
  }, []);

  const detectGeoLocation = async () => {
    try {
      // Try to detect from browser locale first
      const browserLocale = navigator.language || navigator.languages[0];
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Basic geo detection from timezone and locale
      let detectedCountry = 'US';
      let detectedCurrency = 'USD';
      
      if (browserLocale.includes('gb') || timezone.includes('London')) {
        detectedCountry = 'GB';
        detectedCurrency = 'GBP';
      } else if (browserLocale.includes('ca') || timezone.includes('Toronto')) {
        detectedCountry = 'CA';
        detectedCurrency = 'CAD';
      } else if (timezone.includes('Europe')) {
        detectedCountry = 'EU';
        detectedCurrency = 'EUR';
      } else if (timezone.includes('Australia')) {
        detectedCountry = 'AU';
        detectedCurrency = 'AUD';
      }

      // Try to get more precise location if possible
      try {
        const response = await fetch('https://ipapi.co/json/', {
          timeout: 3000,
          headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.country_code) {
            detectedCountry = data.country_code;
            detectedCurrency = getCurrencyForCountry(data.country_code);
          }
        }
      } catch (error) {
        console.log('IP geolocation failed, using browser detection');
      }

      setGeoData({
        country: detectedCountry,
        currency: detectedCurrency,
        timezone: timezone,
        language: browserLocale.split('-')[0]
      });

      // Check if service is supported in this region
      setIsSupported(isSupportedRegion(detectedCountry));

    } catch (error) {
      console.error('Geo detection failed:', error);
    }
  };

  const getCurrencyForCountry = (countryCode) => {
    const currencyMap = {
      'US': 'USD',
      'GB': 'GBP', 
      'CA': 'CAD',
      'AU': 'AUD',
      'EU': 'EUR',
      'DE': 'EUR',
      'FR': 'EUR',
      'ES': 'EUR',
      'IT': 'EUR',
      'NL': 'EUR',
      'JP': 'JPY',
      'IN': 'INR',
      'BR': 'BRL',
      'MX': 'MXN',
      'SE': 'SEK',
      'NO': 'NOK',
      'DK': 'DKK',
      'CH': 'CHF'
    };
    return currencyMap[countryCode] || 'USD';
  };

  const isSupportedRegion = (countryCode) => {
    // List of supported regions - expand as needed
    const supportedCountries = [
      'US', 'CA', 'GB', 'AU', 'NZ', 'IE', 'DE', 'FR', 'ES', 'IT', 
      'NL', 'SE', 'NO', 'DK', 'FI', 'AT', 'BE', 'CH', 'PT', 'LU'
    ];
    return supportedCountries.includes(countryCode);
  };

  const formatPrice = (price, currency = geoData.currency) => {
    try {
      return new Intl.NumberFormat(navigator.language, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
      }).format(price);
    } catch (error) {
      return `$${price}`;
    }
  };

  const formatDate = (date) => {
    try {
      return new Intl.DateTimeFormat(navigator.language, {
        timeZone: geoData.timezone,
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(date));
    } catch (error) {
      return new Date(date).toLocaleDateString();
    }
  };

  const getLocalizedContent = () => {
    const content = {
      'US': {
        pricingNote: "Prices in USD. No hidden fees.",
        supportHours: "Support available 9 AM - 9 PM EST",
        dateFormat: "MM/DD/YYYY"
      },
      'GB': {
        pricingNote: "Prices in GBP. VAT included where applicable.",
        supportHours: "Support available 2 PM - 2 AM GMT",
        dateFormat: "DD/MM/YYYY"
      },
      'EU': {
        pricingNote: "Prices in EUR. VAT included.",
        supportHours: "Support available 3 PM - 3 AM CET",
        dateFormat: "DD/MM/YYYY"
      },
      'CA': {
        pricingNote: "Prices in CAD. Tax included where applicable.",
        supportHours: "Support available 9 AM - 9 PM EST",
        dateFormat: "DD/MM/YYYY"
      },
      'AU': {
        pricingNote: "Prices in AUD. GST included.",
        supportHours: "Support available 9 AM - 9 PM AEST",
        dateFormat: "DD/MM/YYYY"
      }
    };

    return content[geoData.country] || content['US'];
  };

  // Provide geo context to children
  const geoContext = {
    ...geoData,
    isSupported,
    formatPrice,
    formatDate,
    localizedContent: getLocalizedContent()
  };

  return React.cloneElement(children, { geoContext });
};

export default GeoDetector;